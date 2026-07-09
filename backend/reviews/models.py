from django.conf import settings
from django.db import models


class Review(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING"
        APPROVED = "APPROVED"
        REJECTED = "REJECTED"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews")

    product_name = models.CharField(max_length=255)
    variant_sku = models.CharField(max_length=64, db_index=True)

    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    admin_comment = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "variant_sku"], name="unique_review_per_user_variant_sku"),
        ]
        indexes = [
            models.Index(fields=["product_name"]),
            models.Index(fields=["status", "created_at"]),
        ]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Review(user={self.user_id}, sku={self.variant_sku}, rating={self.rating})"
