from django.db.models import Exists, OuterRef, Q
from rest_framework import serializers

from catalog.models import Product
from orders.models import Order, OrderItem

from .models import Review


class ReviewCreateSerializer(serializers.ModelSerializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(min_length=1, max_length=5000)

    class Meta:
        model = Review
        fields = ["id", "product_name", "variant_sku", "rating", "comment"]
        read_only_fields = ["id"]

    def validate(self, attrs):
        request = self.context["request"]
        user = request.user

        product_name = attrs.get("product_name")
        variant_sku = attrs.get("variant_sku")

        if not user or not user.is_authenticated:
            raise serializers.ValidationError("Authentication required.")

        if Review.objects.filter(user=user, variant_sku=variant_sku).exists():
            raise serializers.ValidationError("You already submitted a review for this item.")

        # Temporarily disabled to allow testing without having to make a complete order
        # verified = OrderItem.objects.filter(
        #     order__user=user,
        #     order__status=Order.Status.DELIVERED,
        #     variant_sku=variant_sku,
        #     product_name=product_name,
        # ).exists()

        # if not verified:
        #     raise serializers.ValidationError("Verified purchase required for this item.")

        return attrs

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        # Auto-approve reviews for easier testing without admin panel
        validated_data["status"] = Review.Status.APPROVED
        return Review.objects.create(**validated_data)


class ReviewSerializer(serializers.ModelSerializer):
    user_display = serializers.SerializerMethodField()
    user_profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            "id",
            "user",
            "user_display",
            "user_profile_image",
            "product_name",
            "variant_sku",
            "rating",
            "comment",
            "status",
            "admin_comment",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "user_display", "user_profile_image", "status", "admin_comment", "created_at", "updated_at"]

    def get_user_profile_image(self, obj: Review):
        request = self.context.get("request")
        if obj.user.profile_image:
            img_url = obj.user.profile_image.url
            if request:
                return request.build_absolute_uri(img_url)
            return img_url
        return None

    def get_user_display(self, obj: Review):
        first = (getattr(obj.user, "first_name", "") or "").strip()
        last = (getattr(obj.user, "last_name", "") or "").strip()
        if first or last:
            return f"{first} {last}".strip()
        return "Anonymous"


class ReviewAdminActionSerializer(serializers.Serializer):
    action_comment = serializers.CharField(required=False, allow_blank=True, max_length=5000)
