from django.urls import path

from .views import (
    NewsletterSubscribeView,
    NewsletterSubscriberExportCSVView,
    NewsletterSubscriberListView,
    NewsletterUnsubscribeView,
)

urlpatterns = [
    path("subscribe/", NewsletterSubscribeView.as_view(), name="newsletter-subscribe"),
    path("unsubscribe/", NewsletterUnsubscribeView.as_view(), name="newsletter-unsubscribe"),
    path("subscribers/", NewsletterSubscriberListView.as_view(), name="newsletter-subscribers"),
    path("subscribers/export/", NewsletterSubscriberExportCSVView.as_view(), name="newsletter-subscribers-export"),
]
