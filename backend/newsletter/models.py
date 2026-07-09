from django.db import models


class NewsletterSubscriber(models.Model):
    class Status(models.TextChoices):
        SUBSCRIBED = "SUBSCRIBED"
        UNSUBSCRIBED = "UNSUBSCRIBED"

    email = models.EmailField(unique=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SUBSCRIBED)

    first_name = models.CharField(max_length=120, blank=True, default="")
    last_name = models.CharField(max_length=120, blank=True, default="")

    subscribed_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    unsubscribed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return self.email
