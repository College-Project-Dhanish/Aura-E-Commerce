from django.contrib import admin

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product_name", "variant_sku", "rating", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("user__email", "product_name", "variant_sku")
    ordering = ("-created_at",)

    readonly_fields = ("created_at", "updated_at")
