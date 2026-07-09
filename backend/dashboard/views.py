from decimal import Decimal

from django.conf import settings
from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Product, ProductVariant
from orders.models import Order


class IsAdminStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminStaff]

    def get(self, request):
        total_products = Product.objects.count()
        total_orders = Order.objects.count()
        total_customers = settings.AUTH_USER_MODEL
        # settings.AUTH_USER_MODEL is a label; count actual users via get_user_model
        from django.contrib.auth import get_user_model

        User = get_user_model()
        total_customers = User.objects.count()

        # Revenue: sum totals for Delivered orders
        revenue = (
            Order.objects.filter(status=Order.Status.DELIVERED)
            .aggregate(total=Sum("total"))
            .get("total")
            or Decimal("0")
        )

        return Response(
            {
                "total_products": total_products,
                "total_orders": total_orders,
                "total_customers": total_customers,
                "revenue": revenue,
            }
        )


class LowStockProductsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminStaff]

    def get(self, request):
        threshold_param = request.query_params.get("threshold", "5")
        try:
            threshold = int(threshold_param)
        except ValueError:
            threshold = 5

        low_stock = (
            ProductVariant.objects.filter(stock__lte=threshold)
            .select_related("product", "color", "size")
            .order_by("stock", "-product_id")
        )

        data = [
            {
                "variant_id": v.id,
                "product_id": v.product_id,
                "product_name": v.product.name,
                "sku": v.sku,
                "stock": v.stock,
                "color": v.color.name,
                "size": v.size.name,
            }
            for v in low_stock[:50]
        ]
        return Response({"items": data, "count": len(data)})


class RecentOrdersView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminStaff]

    def get(self, request):
        # recent = last 20 by created_at
        orders = (
            Order.objects.all()
            .select_related("user")
            .order_by("-created_at")[:20]
        )
        data = [
            {
                "id": o.id,
                "order_number": o.order_number,
                "status": o.status,
                "total": o.total,
                "created_at": o.created_at,
                "email": o.email,
            }
            for o in orders
        ]
        return Response({"items": data, "count": len(data)})
