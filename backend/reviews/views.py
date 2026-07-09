from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Review
from .serializers import ReviewAdminActionSerializer, ReviewCreateSerializer, ReviewSerializer


class IsStaffUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class ReviewListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        product_name = request.query_params.get("product_name")
        variant_sku = request.query_params.get("variant_sku")
        approved_only = request.query_params.get("approved_only", "1") == "1"

        qs = Review.objects.select_related("user")

        if approved_only:
            qs = qs.filter(status=Review.Status.APPROVED)
        if product_name:
            qs = qs.filter(product_name__iexact=product_name)
        if variant_sku:
            qs = qs.filter(variant_sku=variant_sku)

        # Lightweight pagination via limit/offset to avoid extra dependencies.
        limit = request.query_params.get("limit")
        if limit is not None:
            try:
                limit_int = int(limit)
            except ValueError:
                limit_int = 12
            qs = qs[: max(1, limit_int)]

        data = ReviewSerializer(qs, many=True).data
        return Response({"items": data, "count": len(data)})

    def post(self, request):
        serializer = ReviewCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        review = serializer.save()
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)


class MyReviewsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Review.objects.filter(user=request.user).order_by("-created_at")
        data = ReviewSerializer(qs, many=True).data
        return Response({"items": data, "count": len(data)})


class ReviewAdminPendingListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStaffUser]

    def get(self, request):
        qs = Review.objects.filter(status=Review.Status.PENDING).order_by("-created_at")
        data = ReviewSerializer(qs, many=True).data
        return Response({"items": data, "count": len(data)})


class ReviewAdminActionView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStaffUser]

    def patch(self, request, review_id: int, action: str):
        review = Review.objects.filter(id=review_id).first()
        if not review:
            return Response({"detail": "Review not found."}, status=status.HTTP_404_NOT_FOUND)

        action_comment = request.data.get("action_comment", "").strip()
        action_serializer = ReviewAdminActionSerializer(data={"action_comment": action_comment})
        action_serializer.is_valid(raise_exception=True)

        if action == "approve":
            review.status = Review.Status.APPROVED
        elif action == "reject":
            review.status = Review.Status.REJECTED
        else:
            return Response({"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        review.admin_comment = action_comment
        review.save(update_fields=["status", "admin_comment", "updated_at"])

        return Response(ReviewSerializer(review).data, status=status.HTTP_200_OK)

    def delete(self, request, review_id: int):
        review = Review.objects.filter(id=review_id).first()
        if not review:
            return Response({"detail": "Review not found."}, status=status.HTTP_404_NOT_FOUND)
        review.delete()
        return Response({"detail": "Deleted."}, status=status.HTTP_200_OK)
