from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Collection, Color, Product, ProductImage, ProductVariant, Size, VariantImage
from .serializers import (
    CategorySerializer,
    CategoryWriteSerializer,
    CollectionSerializer,
    CollectionWriteSerializer,
    ColorSerializer,
    ColorWriteSerializer,
    ProductImageSerializer,
    ProductImageWriteSerializer,
    ProductListSerializer,
    ProductSerializer,
    ProductVariantSerializer,
    ProductVariantWriteSerializer,
    ProductWriteSerializer,
    SizeSerializer,
    SizeWriteSerializer,
    VariantImageSerializer,
    VariantImageWriteSerializer,
)


class IsAdminStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all().order_by("name")


class CollectionListView(generics.ListAPIView):
    serializer_class = CollectionSerializer
    queryset = Collection.objects.all().order_by("name")


class ColorListView(generics.ListAPIView):
    serializer_class = ColorSerializer
    queryset = Color.objects.all().order_by("name")


class SizeListView(generics.ListAPIView):
    serializer_class = SizeSerializer
    queryset = Size.objects.all().order_by("name")


class ProductListView(APIView):
    pagination_class = PageNumberPagination
    """
    Listing supports:
    - search: ?search=
    - filters:
      ?category=slug
      ?collection=slug
      ?color=slug (via variants)
      ?size=slug (via variants)
      ?price_min=number&price_max=number
      ?featured=true|false
      ?best_seller=true|false
      ?new_arrival=true|false
    - sorting:
      ?sort=featured|best_seller|new_arrival|newest|price_asc|price_desc
      (default: newest)
    - pagination via DRF PAGE_SIZE and page query params.
    """

    def get_bool(self, value: str | None):
        if value is None:
            return None
        value = value.strip().lower()
        if value in {"true", "1", "yes"}:
            return True
        if value in {"false", "0", "no"}:
            return False
        return None

    def get(self, request):
        qs = Product.objects.filter(published=True).select_related("category", "collection")

        params = request.query_params

        search = params.get("search")
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(slug__icontains=search))

        category_slug = params.get("category")
        if category_slug:
            qs = qs.filter(category__slug=category_slug)

        collection_slug = params.get("collection")
        if collection_slug:
            qs = qs.filter(collection__slug=collection_slug)

        color_slug = params.get("color")
        if color_slug:
            qs = qs.filter(variants__color__slug=color_slug).distinct()

        size_slug = params.get("size")
        if size_slug:
            qs = qs.filter(variants__size__slug=size_slug).distinct()

        featured = self.get_bool(params.get("featured"))
        if featured is not None:
            qs = qs.filter(featured=featured)

        best_seller = self.get_bool(params.get("best_seller"))
        if best_seller is not None:
            qs = qs.filter(best_seller=best_seller)

        new_arrival = self.get_bool(params.get("new_arrival"))
        if new_arrival is not None:
            qs = qs.filter(new_arrival=new_arrival)

        price_min = params.get("price_min")
        price_max = params.get("price_max")
        if price_min is not None:
            qs = qs.filter(price__gte=price_min)
        if price_max is not None:
            qs = qs.filter(price__lte=price_max)

        sort = params.get("sort", "newest").strip().lower()
        if sort == "featured":
            qs = qs.order_by("-featured", "-created_at")
        elif sort == "best_seller":
            qs = qs.order_by("-best_seller", "-created_at")
        elif sort == "new_arrival":
            qs = qs.order_by("-new_arrival", "-created_at")
        elif sort == "price_asc":
            qs = qs.order_by("price", "-created_at")
        elif sort == "price_desc":
            qs = qs.order_by("-price", "-created_at")
        else:  # newest
            qs = qs.order_by("-created_at")

        paginator = self.pagination_class()
        if "page_size" in request.query_params:
            try:
                paginator.page_size = int(request.query_params.get("page_size"))
            except (TypeError, ValueError):
                pass

        page_queryset = paginator.paginate_queryset(qs, request, view=self)
        serializer = ProductListSerializer(page_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    lookup_field = "slug"
    queryset = Product.objects.filter(published=True).select_related("category", "collection")


class ProductDetailBySlugView(ProductDetailView):
    pass


class ProductDetailLegacyView(ProductDetailView):
    pass


class _AdminCrudBase(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminStaff]

    def get_queryset(self):
        raise NotImplementedError

    def get_list_serializer(self):
        raise NotImplementedError

    def get_write_serializer(self):
        raise NotImplementedError

    def get_object(self, obj_id):
        obj = self.get_queryset().filter(id=obj_id).first()
        if not obj:
            return None
        return obj

    def get(self, request, obj_id: int | None = None):
        if obj_id is None:
            qs = self.get_queryset().order_by("id")
            serializer = self.get_list_serializer()(qs, many=True, context={"request": request})
            return Response(serializer.data)

        obj = self.get_object(obj_id)
        if not obj:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_list_serializer()(obj, context={"request": request})
        return Response(serializer.data)

    def post(self, request):
        serializer = self.get_write_serializer()(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        return Response(self.get_list_serializer()(obj, context={"request": request}).data, status=status.HTTP_201_CREATED)

    def put(self, request, obj_id: int):
        obj = self.get_object(obj_id)
        if not obj:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_write_serializer()(obj, data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        return Response(self.get_list_serializer()(obj, context={"request": request}).data, status=status.HTTP_200_OK)

    def patch(self, request, obj_id: int):
        return self.put(request, obj_id=obj_id)

    def delete(self, request, obj_id: int):
        obj = self.get_object(obj_id)
        if not obj:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CategoryAdminCrudView(_AdminCrudBase):
    def get_queryset(self):
        return Category.objects.all()

    def get_list_serializer(self):
        return CategorySerializer

    def get_write_serializer(self):
        return CategoryWriteSerializer


class CollectionAdminCrudView(_AdminCrudBase):
    def get_queryset(self):
        return Collection.objects.all()

    def get_list_serializer(self):
        return CollectionSerializer

    def get_write_serializer(self):
        return CollectionWriteSerializer


class ColorAdminCrudView(_AdminCrudBase):
    def get_queryset(self):
        return Color.objects.all()

    def get_list_serializer(self):
        return ColorSerializer

    def get_write_serializer(self):
        return ColorWriteSerializer


class SizeAdminCrudView(_AdminCrudBase):
    def get_queryset(self):
        return Size.objects.all()

    def get_list_serializer(self):
        return SizeSerializer

    def get_write_serializer(self):
        return SizeWriteSerializer


class ProductAdminCrudView(_AdminCrudBase):
    def get_queryset(self):
        return Product.objects.all().select_related("category", "collection")

    def get_list_serializer(self):
        return ProductSerializer

    def get_write_serializer(self):
        return ProductWriteSerializer


class ProductVariantAdminCrudView(_AdminCrudBase):
    def get_queryset(self):
        return ProductVariant.objects.all().select_related("product", "color", "size")

    def get_list_serializer(self):
        return ProductVariantSerializer

    def get_write_serializer(self):
        return ProductVariantWriteSerializer


class ProductImageAdminCrudView(_AdminCrudBase):
    def get_queryset(self):
        return ProductImage.objects.all().select_related("product")

    def get_list_serializer(self):
        return ProductImageSerializer

    def get_write_serializer(self):
        return ProductImageWriteSerializer


class VariantImageAdminCrudView(_AdminCrudBase):
    def get_queryset(self):
        return VariantImage.objects.all().select_related("variant")

    def get_list_serializer(self):
        return VariantImageSerializer

    def get_write_serializer(self):
        return VariantImageWriteSerializer
