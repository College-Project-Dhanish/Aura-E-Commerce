from django.urls import include, path

urlpatterns = [
    path('auth/', include('accounts.urls')),
    path('catalog/', include('catalog.urls')),
    path('orders/', include('orders.urls')),
    path('promotions/', include('promotions.urls')),

    path('dashboard/', include('dashboard.urls')),
    path('reviews/', include('reviews.urls')),
    path('newsletter/', include('newsletter.urls')),
]

