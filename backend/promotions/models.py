from django.conf import settings
from django.db import models
from django.utils import timezone


class Coupon(models.Model):
    class DiscountType(models.TextChoices):
        PERCENTAGE = "percentage"
        FIXED = "fixed"

    code = models.CharField(max_length=60, unique=True, db_index=True)
    discount_type = models.CharField(max_length=20, choices=DiscountType.choices)

    # percentage: 0-100
    # fixed: currency amount
    value = models.DecimalField(max_digits=12, decimal_places=2)

    # overall validity
    is_active = models.BooleanField(default=True)
    starts_at = models.DateTimeField(blank=True, null=True)
    expires_at = models.DateTimeField(blank=True, null=True)

    usage_limit = models.PositiveIntegerField(blank=True, null=True)
    used_count = models.PositiveIntegerField(default=0)

    # optional: future expansion (collection/product discounts)
    # Not used in this minimal phase
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_coupons",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.code

    def is_valid(self) -> bool:
        now = timezone.now()
        if not self.is_active:
            return False
        if self.starts_at and now < self.starts_at:
            return False
        if self.expires_at and now > self.expires_at:
            return False
        if self.usage_limit is not None and self.used_count >= self.usage_limit:
            return False
        return True
