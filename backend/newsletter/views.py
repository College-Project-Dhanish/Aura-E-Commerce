import csv
import io

from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import NewsletterSubscriber
from .serializers import SubscribeSerializer, SubscriberSerializer, UnsubscribeSerializer


class IsStaffUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class NewsletterSubscribeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SubscribeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscriber = serializer.save()
        return Response(SubscriberSerializer(subscriber).data, status=status.HTTP_200_OK)


class NewsletterUnsubscribeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UnsubscribeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscriber = serializer.save()
        return Response(SubscriberSerializer(subscriber).data, status=status.HTTP_200_OK)


class NewsletterSubscriberListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStaffUser]

    def get(self, request):
        qs = NewsletterSubscriber.objects.all().order_by("-subscribed_at")

        email = request.query_params.get("email")
        if email:
            qs = qs.filter(email__iexact=email.strip().lower())

        limit = request.query_params.get("limit")
        if limit is not None:
            try:
                limit_int = int(limit)
            except ValueError:
                limit_int = 50
            qs = qs[: max(1, limit_int)]

        data = SubscriberSerializer(qs, many=True).data
        return Response({"items": data, "count": len(data)})


class NewsletterSubscriberExportCSVView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStaffUser]

    def get(self, request):
        qs = NewsletterSubscriber.objects.all().order_by("email")

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(
            ["email", "status", "first_name", "last_name", "subscribed_at", "unsubscribed_at", "updated_at"]
        )

        for s in qs:
            writer.writerow(
                [
                    s.email,
                    s.status,
                    s.first_name,
                    s.last_name,
                    s.subscribed_at.isoformat() if s.subscribed_at else "",
                    s.unsubscribed_at.isoformat() if s.unsubscribed_at else "",
                    s.updated_at.isoformat() if s.updated_at else "",
                ]
            )

        response = HttpResponse(output.getvalue(), content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="newsletter_subscribers.csv"'
        return response
