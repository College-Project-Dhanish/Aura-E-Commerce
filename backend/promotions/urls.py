from django.urls import path

from .views import CouponValidateView, CouponAdminListView, CouponAdminDetailView

urlpatterns = [
    path("coupons/validate/", CouponValidateView.as_view(), name="coupon-validate"),
    path("admin/coupons/", CouponAdminListView.as_view(), name="coupon-admin-list"),
    path("admin/coupons/<int:pk>/", CouponAdminDetailView.as_view(), name="coupon-admin-detail"),
]
