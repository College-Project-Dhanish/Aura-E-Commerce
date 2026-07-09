from django.conf import settings
from django.db import models

from catalog.models import ProductVariant


class Address(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="addresses")

    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    phone = models.CharField(max_length=30)

    line1 = models.CharField(max_length=255)
    line2 = models.CharField(max_length=255, blank=True, default="")
    city = models.CharField(max_length=120)
    state = models.CharField(max_length=120)
    postal_code = models.CharField(max_length=30)
    country = models.CharField(max_length=2)

    is_default = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_default", "-updated_at"]


def cart_session_key(instance: "CartItem") -> str:
    # Used for readability + consistent uniqueness strategies if needed later.
    return instance.cart_session


class CartItem(models.Model):
    """
    Guest cart is stored using Django session key (string).
    Logged-in cart uses user foreign key as well.
    """
    cart_session = models.CharField(max_length=128, db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cart_items",
        null=True,
        blank=True,
    )

    variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT, related_name="cart_items")
    quantity = models.PositiveIntegerField(default=1)

    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [("cart_session", "variant")]
        indexes = [
            models.Index(fields=["cart_session", "variant"]),
        ]


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "Pending"
        CONFIRMED = "Confirmed"
        PACKED = "Packed"
        SHIPPED = "Shipped"
        DELIVERED = "Delivered"
        CANCELLED = "Cancelled"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")

    order_number = models.CharField(max_length=64, unique=True, db_index=True)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    email = models.EmailField()
    phone = models.CharField(max_length=30)

    # Shipping address snapshot fields
    ship_first_name = models.CharField(max_length=120)
    ship_last_name = models.CharField(max_length=120)
    ship_line1 = models.CharField(max_length=255)
    ship_line2 = models.CharField(max_length=255, blank=True, default="")
    ship_city = models.CharField(max_length=120)
    ship_state = models.CharField(max_length=120)
    ship_postal_code = models.CharField(max_length=30)
    ship_country = models.CharField(max_length=2)

    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    shipping_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    discount_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")

    product_name = models.CharField(max_length=255)
    variant_sku = models.CharField(max_length=64)

    color_name = models.CharField(max_length=120, blank=True, default="")
    size_name = models.CharField(max_length=80, blank=True, default="")

    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    unit_discount_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    quantity = models.PositiveIntegerField(default=1)
    line_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        indexes = [
            models.Index(fields=["order"]),
        ]
