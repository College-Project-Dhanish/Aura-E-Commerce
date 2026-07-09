from rest_framework import serializers

from .models import (
    Category,
    Collection,
    Product,
    ProductImage,
    Color,
    Size,
    ProductVariant,
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
        fields = ["id", "name", "slug", "image"]


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ["id", "name", "slug"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "sort_order", "product"]


class ProductVariantSerializer(serializers.ModelSerializer):
    product = serializers.CharField(source="product.name", read_only=True)
    color = ColorSerializer(read_only=True)
    size = SizeSerializer(read_only=True)

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
        ]


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    category = CategorySerializer(read_only=True)
    collection = CollectionSerializer(read_only=True)

    effective_price = serializers.SerializerMethodField()
    effective_discount_price = serializers.SerializerMethodField()
    is_in_stock = serializers.SerializerMethodField()

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
        ]

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
        fields = ["id", "name", "slug", "image"]


class SizeWriteSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = Size
        fields = ["id", "name", "slug"]


class ProductImageWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "product", "image", "sort_order"]


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
