from django.db import transaction
from rest_framework import serializers

from .models import NewsletterSubscriber


class SubscribeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(required=False, allow_blank=True, max_length=120)
    last_name = serializers.CharField(required=False, allow_blank=True, max_length=120)

    def validate_email(self, value):
        return value.strip().lower()

    @transaction.atomic
    def save(self, **kwargs):
        email = self.validated_data["email"]
        first_name = self.validated_data.get("first_name", "").strip()
        last_name = self.validated_data.get("last_name", "").strip()

        subscriber, _ = NewsletterSubscriber.objects.update_or_create(
            email=email,
            defaults={
                "status": NewsletterSubscriber.Status.SUBSCRIBED,
                "first_name": first_name,
                "last_name": last_name,
                "unsubscribed_at": None,
            },
        )
        return subscriber


class UnsubscribeSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return value.strip().lower()

    @transaction.atomic
    def save(self, **kwargs):
        email = self.validated_data["email"]
        subscriber, _ = NewsletterSubscriber.objects.get_or_create(email=email, defaults={"status": NewsletterSubscriber.Status.SUBSCRIBED})

        subscriber.status = NewsletterSubscriber.Status.UNSUBSCRIBED
        from django.utils import timezone
        subscriber.unsubscribed_at = timezone.now()
        subscriber.save(update_fields=["status", "unsubscribed_at", "updated_at"])
        return subscriber


class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = [
            "id",
            "email",
            "status",
            "first_name",
            "last_name",
            "subscribed_at",
            "unsubscribed_at",
            "updated_at",
        ]
