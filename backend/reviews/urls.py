from django.urls import path

from .views import (
    MyReviewsView,
    ReviewAdminActionView,
    ReviewAdminPendingListView,
    ReviewListCreateView,
)

urlpatterns = [
    path("", ReviewListCreateView.as_view(), name="reviews-list-create"),
    path("my/", MyReviewsView.as_view(), name="reviews-my"),
    path("admin/pending/", ReviewAdminPendingListView.as_view(), name="reviews-admin-pending"),
    path("admin/<int:review_id>/approve/", ReviewAdminActionView.as_view(), {"action": "approve"}, name="reviews-approve"),
    path("admin/<int:review_id>/reject/", ReviewAdminActionView.as_view(), {"action": "reject"}, name="reviews-reject"),
    path("admin/<int:review_id>/", ReviewAdminActionView.as_view(), name="reviews-admin-delete"),
]
