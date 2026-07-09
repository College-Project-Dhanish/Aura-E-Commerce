from rest_framework import serializers

from .models import Coupon


class ValidateCouponSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=60)

    def validate_code(self, value: str) -> Coupon:
        try:
            coupon = Coupon.objects.get(code__iexact=value.strip())
        except Coupon.DoesNotExist:
            raise serializers.ValidationError("Invalid coupon code.")

        if not coupon.is_valid():
            raise serializers.ValidationError("Coupon is not valid.")
        return coupon

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'
