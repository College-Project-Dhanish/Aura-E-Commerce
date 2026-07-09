from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from catalog.models import (
    Category,
    Collection,
    Color,
    Product,
    ProductImage,
    ProductVariant,
    Size,
)


class Command(BaseCommand):
    help = "Seed minimal catalog data for local API testing (1 category, 1 collection, 1 product, 1 variant)."

    @transaction.atomic
    def handle(self, *args, **options):
        # Category
        category, _ = Category.objects.get_or_create(
            slug="tees",
            defaults={
                "name": "T-Shirts",
            },
        )

        # Collection
        collection, _ = Collection.objects.get_or_create(
            slug="summer",
            defaults={
                "name": "Summer Drop",
            },
        )

        # Color + Size
        color, _ = Color.objects.get_or_create(slug="black", defaults={"name": "Black"})
        size, _ = Size.objects.get_or_create(slug="m", defaults={"name": "M"})

        # Product
        product, _ = Product.objects.get_or_create(
            slug="basic-tee-black-m",
            defaults={
                "name": "Basic Tee (Black)",
                "description": "Seed product for API testing",
                "category": category,
                "collection": collection,
                "price": "250.00",
                "discount_price": None,
                "sku": "TEE-BLK-M",
                "thumbnail": None,
                "published": True,
                "featured": True,
                "best_seller": False,
                "new_arrival": True,
            },
        )

        # Create at least one ProductImage only if the model allows it and storage is configured.
        # Since this is a functional seed, we keep it non-blocking.
        try:
            ProductImage.objects.get_or_create(
                product=product,
                image=None,  # might fail depending on migrations/storage; ignore if so
                defaults={"sort_order": 0},
            )
        except Exception:
            pass

        # Variant
        variant, created = ProductVariant.objects.get_or_create(
            sku="TEE-BLK-M",
            defaults={
                "product": product,
                "color": color,
                "size": size,
                "price_override": None,
                "discount_price_override": None,
                "stock": 20,
            },
        )

        if created:
            self.stdout.write(self.style.SUCCESS("Seeded minimal catalog data successfully."))
        else:
            self.stdout.write(self.style.WARNING("Minimal catalog seed already exists (no changes)."))
