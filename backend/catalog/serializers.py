from rest_framework import serializers

from .models import (
    Category,
    Collection,
    Product,
    ProductImage,
    Color,
    Size,
    ProductVariant,
    VariantImage,
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ["id", "name", "slug"]


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ["id", "name", "slug", "image", "is_active"]


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ["id", "name", "slug", "is_active"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "sort_order", "product"]


class VariantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VariantImage
        fields = ["id", "image", "sort_order", "variant"]


class ProductVariantSerializer(serializers.ModelSerializer):
    product = serializers.CharField(source="product.name", read_only=True)
    color = ColorSerializer(read_only=True)
    size = SizeSerializer(read_only=True)
    images = VariantImageSerializer(many=True, read_only=True)

    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "sku",
            "stock",
            "price_override",
            "discount_price_override",
            "product",
            "color",
            "size",
            "images",
        ]


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    category = CategorySerializer(read_only=True)
    collection = CollectionSerializer(read_only=True)

    effective_price = serializers.SerializerMethodField()
    effective_discount_price = serializers.SerializerMethodField()
    is_in_stock = serializers.SerializerMethodField()
    
    resolved_images = serializers.SerializerMethodField()
    available_colors = serializers.SerializerMethodField()
    available_sizes = serializers.SerializerMethodField()
    selected_variant = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "category",
            "collection",
            "price",
            "discount_price",
            "sku",
            "stock",
            "featured",
            "best_seller",
            "new_arrival",
            "published",
            "thumbnail",
            "created_at",
            "updated_at",
            "images",
            "variants",
            "effective_price",
            "effective_discount_price",
            "is_in_stock",
            "resolved_images",
            "available_colors",
            "available_sizes",
            "selected_variant",
        ]

    def _get_resolved_variant(self, obj):
        request = self.context.get("request")
        if not request:
            return obj.variants.first()
            
        color_slug = request.query_params.get("color")
        size_slug = request.query_params.get("size")
        
        variants = obj.variants.all()
        if not variants:
            return None
            
        if color_slug and size_slug:
            match = [v for v in variants if v.color.slug == color_slug and v.size.slug == size_slug]
            if match: return match[0]
        elif color_slug:
            match = [v for v in variants if v.color.slug == color_slug]
            if match: return match[0]
        elif size_slug:
            match = [v for v in variants if v.size.slug == size_slug]
            if match: return match[0]
            
        return variants[0]

    def get_selected_variant(self, obj):
        variant = self._get_resolved_variant(obj)
        if not variant:
            return None
        return {
            "id": variant.id,
            "color_slug": variant.color.slug,
            "size_slug": variant.size.slug,
            "stock": variant.stock,
            "sku": variant.sku,
            "price": variant.price_override if variant.price_override is not None else obj.price,
            "discount_price": variant.discount_price_override if variant.discount_price_override is not None else obj.discount_price,
        }

    def get_resolved_images(self, obj):
        variant = self._get_resolved_variant(obj)
        request = self.context.get("request")
        if variant and variant.images.exists():
            return [
                {
                    "id": img.id, 
                    "image": request.build_absolute_uri(img.image.url) if request else img.image.url, 
                    "sort_order": img.sort_order
                } for img in variant.images.all()
            ]
        return [
            {
                "id": img.id, 
                "image": request.build_absolute_uri(img.image.url) if request else img.image.url, 
                "sort_order": img.sort_order
            } for img in obj.images.all()
        ]

    def get_available_colors(self, obj):
        request = self.context.get("request")
        colors = {}
        for v in obj.variants.all():
            if v.color.id not in colors:
                colors[v.color.id] = {
                    "id": v.color.id,
                    "name": v.color.name,
                    "slug": v.color.slug,
                    "image": request.build_absolute_uri(v.color.image.url) if (request and v.color.image) else (v.color.image.url if v.color.image else None)
                }
        return list(colors.values())

    def get_available_sizes(self, obj):
        sizes = {}
        for v in obj.variants.all():
            if v.size.id not in sizes:
                sizes[v.size.id] = {
                    "id": v.size.id,
                    "name": v.size.name,
                    "slug": v.size.slug,
                }
        return list(sizes.values())

    def get_effective_price(self, obj: Product):
        return obj.price

    def get_effective_discount_price(self, obj: Product):
        return obj.discount_price

    def get_is_in_stock(self, obj: Product):
        return obj.stock > 0


class CategoryWriteSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class CollectionWriteSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = Collection
        fields = ["id", "name", "slug"]


class ColorWriteSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = Color
        fields = ["id", "name", "slug", "image", "is_active"]


class SizeWriteSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = Size
        fields = ["id", "name", "slug", "is_active"]


class ProductImageWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "product", "image", "sort_order"]


class VariantImageWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = VariantImage
        fields = ["id", "variant", "image", "sort_order"]


class ProductVariantWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "product",
            "color",
            "size",
            "sku",
            "stock",
            "price_override",
            "discount_price_override",
        ]

    def validate(self, attrs):
        product = attrs.get('product')
        color = attrs.get('color')
        size = attrs.get('size')
        
        if self.instance:
            product = product or self.instance.product
            color = color or self.instance.color
            size = size or self.instance.size
            
        if product and not product.published:
            raise serializers.ValidationError("Product must be active/published.")
        if color and not color.is_active:
            raise serializers.ValidationError("Color must be active.")
        if size and not size.is_active:
            raise serializers.ValidationError("Size must be active.")
            
        qs = ProductVariant.objects.filter(product=product, color=color, size=size)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
            
        if qs.exists():
            raise serializers.ValidationError("Variant already exists.")
            
        return attrs


class ProductWriteSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "collection",
            "name",
            "slug",
            "description",
            "price",
            "discount_price",
            "sku",
            "stock",
            "featured",
            "best_seller",
            "new_arrival",
            "published",
            "thumbnail",
        ]

    def get_is_in_stock(self, obj: Product):
        return obj.stock > 0


class ProductListSerializer(serializers.ModelSerializer):
    category_slug = serializers.CharField(source="category.slug", read_only=True)
    collection_slug = serializers.CharField(source="collection.slug", read_only=True)

    effective_price = serializers.SerializerMethodField()
    effective_discount_price = serializers.SerializerMethodField()

    variants = ProductVariantSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "category_slug",
            "collection_slug",
            "price",
            "discount_price",
            "thumbnail",
            "images",
            "featured",
            "best_seller",
            "new_arrival",
            "published",
            "effective_price",
            "effective_discount_price",
            "variants",
        ]

    def get_effective_price(self, obj: Product):
        return obj.price

    def get_effective_discount_price(self, obj: Product):
        return obj.discount_price
