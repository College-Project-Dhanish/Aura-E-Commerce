from django.urls import path

from .views import (
    CategoryAdminCrudView,
    CategoryListView,
    CollectionAdminCrudView,
    CollectionListView,
    ColorAdminCrudView,
    ColorListView,
    ProductAdminCrudView,
    ProductDetailBySlugView,
    ProductImageAdminCrudView,
    ProductListView,
    ProductVariantAdminCrudView,
    SizeAdminCrudView,
    SizeListView,
    VariantImageAdminCrudView,
)

urlpatterns = [
    # Customer read-only
    path("categories/", CategoryListView.as_view(), name="catalog-categories"),
    path("collections/", CollectionListView.as_view(), name="catalog-collections"),
    path("colors/", ColorListView.as_view(), name="catalog-colors"),
    path("sizes/", SizeListView.as_view(), name="catalog-sizes"),
    path("products/", ProductListView.as_view(), name="catalog-products"),
    path("products/<slug:slug>/", ProductDetailBySlugView.as_view(), name="catalog-product-detail"),
    # Admin CRUD
    path("admin/categories/", CategoryAdminCrudView.as_view(), name="catalog-admin-categories"),
    path("admin/categories/<int:obj_id>/", CategoryAdminCrudView.as_view(), name="catalog-admin-category-detail"),
    path("admin/collections/", CollectionAdminCrudView.as_view(), name="catalog-admin-collections"),
    path(
        "admin/collections/<int:obj_id>/",
        CollectionAdminCrudView.as_view(),
        name="catalog-admin-collection-detail",
    ),
    path("admin/colors/", ColorAdminCrudView.as_view(), name="catalog-admin-colors"),
    path("admin/colors/<int:obj_id>/", ColorAdminCrudView.as_view(), name="catalog-admin-color-detail"),
    path("admin/sizes/", SizeAdminCrudView.as_view(), name="catalog-admin-sizes"),
    path("admin/sizes/<int:obj_id>/", SizeAdminCrudView.as_view(), name="catalog-admin-size-detail"),
    path("admin/products/", ProductAdminCrudView.as_view(), name="catalog-admin-products"),
    path("admin/products/<int:obj_id>/", ProductAdminCrudView.as_view(), name="catalog-admin-product-detail"),
    path("admin/variants/", ProductVariantAdminCrudView.as_view(), name="catalog-admin-variants"),
    path(
        "admin/variants/<int:obj_id>/",
        ProductVariantAdminCrudView.as_view(),
        name="catalog-admin-variant-detail",
    ),
    path("admin/images/", ProductImageAdminCrudView.as_view(), name="catalog-admin-images"),
    path(
        "admin/images/<int:obj_id>/",
        ProductImageAdminCrudView.as_view(),
        name="catalog-admin-image-detail",
    ),
    path("admin/variant-images/", VariantImageAdminCrudView.as_view(), name="catalog-admin-variant-images"),
    path(
        "admin/variant-images/<int:obj_id>/",
        VariantImageAdminCrudView.as_view(),
        name="catalog-admin-variant-image-detail",
    ),
]
