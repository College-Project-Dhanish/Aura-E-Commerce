from django.contrib import admin

from .models import NewsletterSubscriber


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "status", "subscribed_at", "unsubscribed_at", "updated_at")
    list_filter = ("status", "updated_at")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("-subscribed_at",)
    readonly_fields = ("subscribed_at", "updated_at")
