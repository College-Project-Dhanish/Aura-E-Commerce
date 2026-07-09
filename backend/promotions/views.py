from decimal import Decimal

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Coupon
from .serializers import ValidateCouponSerializer, CouponSerializer


class CouponValidateView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        """
        Validates coupon and returns discount for a given cart subtotal.
        Request payload:
        {
          "code": "SAVE10",
          "subtotal": 500.00
        }
        """
        serializer = ValidateCouponSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        coupon: Coupon = serializer.validated_data["code"]

        subtotal = Decimal(str(request.data.get("subtotal", "0")))
        discount = Decimal("0.00")

        if subtotal <= 0:
            return Response({"code": coupon.code, "discount": "0.00", "subtotal": str(subtotal)})

        if coupon.discount_type == Coupon.DiscountType.PERCENTAGE:
            discount = (subtotal * (coupon.value / Decimal("100"))).quantize(Decimal("0.01"))
        else:
            discount = coupon.value

        if discount < 0:
            discount = Decimal("0.00")
        if discount > subtotal:
            discount = subtotal

        return Response(
            {
                "code": coupon.code,
                "discount_type": coupon.discount_type,
                "value": str(coupon.value),
                "subtotal": str(subtotal),
                "discount": str(discount),
            },
            status=status.HTTP_200_OK,
        )

class CouponAdminListView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        coupons = Coupon.objects.all()
        serializer = CouponSerializer(coupons, many=True)
        return Response({"results": serializer.data})

    def post(self, request):
        serializer = CouponSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CouponAdminDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get_object(self, pk):
        try:
            return Coupon.objects.get(pk=pk)
        except Coupon.DoesNotExist:
            return None

    def get(self, request, pk):
        coupon = self.get_object(pk)
        if not coupon:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(CouponSerializer(coupon).data)

    def put(self, request, pk):
        coupon = self.get_object(pk)
        if not coupon:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CouponSerializer(coupon, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        coupon = self.get_object(pk)
        if not coupon:
            return Response(status=status.HTTP_404_NOT_FOUND)
        coupon.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
