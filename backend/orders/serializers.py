from decimal import Decimal

from django.utils import timezone
from rest_framework import serializers

from catalog.models import ProductVariant

from .models import Address, CartItem, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="variant.product.name", read_only=True)
    product_slug = serializers.CharField(source="variant.product.slug", read_only=True)
    color = serializers.CharField(source="variant.color.name", read_only=True)
    size = serializers.CharField(source="variant.size.name", read_only=True)
    sku = serializers.CharField(source="variant.sku", read_only=True)

    unit_price = serializers.SerializerMethodField()
    unit_discount_price = serializers.SerializerMethodField()
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product_name",
            "product_slug",
            "sku",
            "color",
            "size",
            "variant",
            "quantity",
            "unit_price",
            "unit_discount_price",
            "line_total",
            "added_at",
            "updated_at",
        ]
        read_only_fields = ["added_at", "updated_at", "unit_price", "unit_discount_price", "line_total", "product_name", "product_slug"]

    def _effective_prices(self, variant: ProductVariant):
        base_price = variant.price_override if variant.price_override is not None else variant.product.price
        base_discount = (
            variant.discount_price_override if variant.discount_price_override is not None else variant.product.discount_price
        )
        discount = base_discount if base_discount is not None else None
        return base_price, discount

    def get_unit_price(self, obj: CartItem):
        price, _ = self._effective_prices(obj.variant)
        return price

    def get_unit_discount_price(self, obj: CartItem):
        _, discount = self._effective_prices(obj.variant)
        return discount

    def get_line_total(self, obj: CartItem):
        price, discount = self._effective_prices(obj.variant)
        effective = discount if discount is not None else price
        return effective * Decimal(obj.quantity)


class AddCartItemSerializer(serializers.Serializer):
    variant_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

    def validate_variant_id(self, value):
        try:
            return ProductVariant.objects.select_related("product").get(id=value)
        except ProductVariant.DoesNotExist:
            raise serializers.ValidationError("Invalid variant_id.")
    
    def validate(self, attrs):
        variant: ProductVariant = attrs["variant_id"]
        if variant.stock <= 0:
            raise serializers.ValidationError("Selected variant is out of stock.")
        return attrs


class UpdateCartItemQuantitySerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "first_name",
            "last_name",
            "phone",
            "line1",
            "line2",
            "city",
            "state",
            "postal_code",
            "country",
            "is_default",
        ]


class CheckoutAddressSerializer(serializers.Serializer):
    address_id = serializers.IntegerField(required=False, allow_null=True)
    first_name = serializers.CharField(max_length=120)
    last_name = serializers.CharField(max_length=120)
    phone = serializers.CharField(max_length=30)

    line1 = serializers.CharField(max_length=255)
    line2 = serializers.CharField(max_length=255, required=False, allow_blank=True, default="")
    city = serializers.CharField(max_length=120)
    state = serializers.CharField(max_length=120)
    postal_code = serializers.CharField(max_length=30)
    country = serializers.CharField(max_length=2)


class PlaceOrderSerializer(serializers.Serializer):
    address = CheckoutAddressSerializer()
    coupon_code = serializers.CharField(max_length=60, required=False, allow_blank=True, default="")
    shipping_total = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, default=Decimal("0.00"))
    tax_total = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, default=Decimal("0.00"))
    discount_total = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, default=Decimal("0.00"))


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_name",
            "variant_sku",
            "color_name",
            "size_name",
            "unit_price",
            "unit_discount_price",
            "quantity",
            "line_total",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "status",
            "email",
            "phone",
            "subtotal",
            "shipping_total",
            "tax_total",
            "discount_total",
            "total",
            "ship_first_name",
            "ship_last_name",
            "ship_line1",
            "ship_line2",
            "ship_city",
            "ship_state",
            "ship_postal_code",
            "ship_country",
            "created_at",
            "updated_at",
            "items",
        ]


class OrderListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "status",
            "total",
            "created_at",
        ]
