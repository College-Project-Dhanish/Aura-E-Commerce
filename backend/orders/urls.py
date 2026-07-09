from django.urls import path

from .views import CartItemQuantityView, CartItemRemoveView, CartView, CheckoutView, OrderDetailView, OrderListView

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/items/<int:item_id>/remove/", CartItemRemoveView.as_view(), name="cart-item-remove"),
    path("cart/items/<int:item_id>/quantity/", CartItemQuantityView.as_view(), name="cart-item-quantity"),
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("me/orders/", OrderListView.as_view(), name="orders-list"),
    path("me/orders/<str:order_number>/", OrderDetailView.as_view(), name="order-detail"),
]
