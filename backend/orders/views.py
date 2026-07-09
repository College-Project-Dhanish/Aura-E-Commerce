import secrets
from decimal import Decimal

from django.db import transaction
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import ProductVariant

from promotions.models import Coupon

from .models import CartItem, Order, OrderItem
from .serializers import (
    AddCartItemSerializer,
    CartItemSerializer,
    CheckoutAddressSerializer,
    OrderListSerializer,
    OrderSerializer,
    PlaceOrderSerializer,
    UpdateCartItemQuantitySerializer,
)


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        items = (
            CartItem.objects.filter(user=request.user)
            .select_related("variant__product", "variant__color", "variant__size")
            .order_by("-updated_at")
        )
        serializer = CartItemSerializer(items, many=True)
        return Response({"items": serializer.data, "user": True})

    @transaction.atomic
    def post(self, request):
        serializer = AddCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        variant: ProductVariant = serializer.validated_data["variant_id"]
        quantity = serializer.validated_data["quantity"]

        cart_items = CartItem.objects.select_for_update().filter(user=request.user, variant=variant)
        
        if cart_items.exists():
            cart_item = cart_items.first()
            cart_item.quantity += quantity
            cart_item.save()
            
            # Clean up any duplicates that might have been created under different session keys
            if cart_items.count() > 1:
                CartItem.objects.filter(user=request.user, variant=variant).exclude(id=cart_item.id).delete()
        else:
            cart_item = CartItem.objects.create(
                user=request.user,
                variant=variant,
                quantity=quantity,
                cart_session=str(request.user.id)
            )

        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)


class CartItemRemoveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, item_id: int):
        item = CartItem.objects.filter(id=item_id, user=request.user).first()
        if not item:
            return Response({"detail": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        item.delete()
        return Response({"detail": "Removed."}, status=status.HTTP_200_OK)


class CartItemQuantityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, item_id: int):
        serializer = UpdateCartItemQuantitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        item = CartItem.objects.filter(id=item_id, user=request.user).first()
        if not item:
            return Response({"detail": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        item.quantity = serializer.validated_data["quantity"]
        item.save()

        return Response(CartItemSerializer(item).data, status=status.HTTP_200_OK)


class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        cart_items = (
            CartItem.objects.filter(user=request.user)
            .select_related("variant__product", "variant__color", "variant__size")
        )
        if not cart_items.exists():
            return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PlaceOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        address_payload = serializer.validated_data["address"]
        phone = address_payload["phone"]

        coupon_code = serializer.validated_data.get("coupon_code", "").strip()

        subtotal = Decimal("0.00")
        shipping_total = serializer.validated_data.get("shipping_total", Decimal("0.00"))
        tax_total = serializer.validated_data.get("tax_total", Decimal("0.00"))
        discount_total = Decimal("0.00")

        coupon = None
        if coupon_code:
            coupon = Coupon.objects.get(code__iexact=coupon_code)
            if not coupon.is_valid():
                return Response({"detail": "Coupon is not valid."}, status=status.HTTP_400_BAD_REQUEST)

        order_items: list[OrderItem] = []
        for ci in cart_items:
            variant = ci.variant
            product = variant.product

            base_price = variant.price_override if variant.price_override is not None else product.price
            base_discount = (
                variant.discount_price_override
                if variant.discount_price_override is not None
                else product.discount_price
            )
            effective_unit = base_discount if base_discount is not None else base_price

            if ci.quantity > variant.stock:
                return Response(
                    {"detail": f"Insufficient stock for sku={variant.sku}."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            line_total = effective_unit * Decimal(ci.quantity)
            subtotal += line_total

            order_items.append(
                OrderItem(
                    product_name=product.name,
                    variant_sku=variant.sku,
                    color_name=variant.color.name,
                    size_name=variant.size.name,
                    unit_price=base_price,
                    unit_discount_price=base_discount,
                    quantity=ci.quantity,
                    line_total=line_total,
                )
            )

        if coupon:
            if coupon.discount_type == Coupon.DiscountType.PERCENTAGE:
                discount_total = (subtotal * (coupon.value / Decimal("100"))).quantize(Decimal("0.01"))
            else:
                discount_total = coupon.value

            if discount_total < 0:
                discount_total = Decimal("0.00")
            if discount_total > subtotal:
                discount_total = subtotal

        total = subtotal + shipping_total + tax_total - discount_total
        if total < 0:
            total = Decimal("0.00")

        order_number = secrets.token_hex(6).upper()
        order = Order.objects.create(
            user=request.user,
            order_number=order_number,
            status=Order.Status.PENDING,
            email=request.user.email,
            phone=phone,
            ship_first_name=address_payload["first_name"],
            ship_last_name=address_payload["last_name"],
            ship_line1=address_payload["line1"],
            ship_line2=address_payload.get("line2", ""),
            ship_city=address_payload["city"],
            ship_state=address_payload["state"],
            ship_postal_code=address_payload["postal_code"],
            ship_country=address_payload["country"],
            subtotal=subtotal,
            shipping_total=shipping_total,
            tax_total=tax_total,
            discount_total=discount_total,
            total=total,
        )

        for oi in order_items:
            oi.order = order
            oi.save()

        # decrement stock
        for ci, oi in zip(cart_items, order_items):
            variant = ci.variant
            variant.stock = max(0, variant.stock - ci.quantity)
            variant.save()

        cart_items.delete()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).all()
        serializer = OrderListSerializer(orders, many=True)
        return Response({"orders": serializer.data})


class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_number: str):
        order = Order.objects.filter(user=request.user, order_number=order_number).first()
        if not order:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(OrderSerializer(order).data)

class OrderAdminListView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderListSerializer(orders, many=True)
        return Response({"results": serializer.data})

class OrderAdminDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request, order_number: str):
        order = Order.objects.filter(order_number=order_number).first()
        if not order:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(OrderSerializer(order).data)

    def put(self, request, order_number: str):
        order = Order.objects.filter(order_number=order_number).first()
        if not order:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        
        new_status = request.data.get("status")
        if new_status in [s[0] for s in Order.Status.choices]:
            order.status = new_status
            order.save()
            return Response(OrderSerializer(order).data)
        return Response({"detail": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)

