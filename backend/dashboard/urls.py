from django.urls import path

from .views import DashboardStatsView, LowStockProductsView, RecentOrdersView, StoreSettingsView

urlpatterns = [
    path("stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("low-stock/", LowStockProductsView.as_view(), name="dashboard-low-stock"),
    path("recent-orders/", RecentOrdersView.as_view(), name="dashboard-recent-orders"),
    path("admin/settings/", StoreSettingsView.as_view(), name="admin-store-settings"),
]
