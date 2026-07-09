import re
import sys

filepath = 'd:\\SHAMI\\PROJECT TSHIRTS\\frontend\\src\\services\\api.ts'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    r"const API_BASE_URL = \(\(import\.meta as any\)\.env\?\.VITE_API_BASE_URL as string\) \|\| 'http://127\.0\.0\.1:8000/api/';": "import { ENDPOINTS, API_BASE_URL } from './endpoints';",
    r"`\$\{API_BASE_URL\}auth/refresh/`": "ENDPOINTS.AUTH.REFRESH",
    r"'/auth/login/'": "ENDPOINTS.AUTH.LOGIN",
    r"'/auth/register/'": "ENDPOINTS.AUTH.REGISTER",
    r"'/auth/profile/'": "ENDPOINTS.AUTH.PROFILE",
    r"'/auth/change-password/'": "ENDPOINTS.AUTH.CHANGE_PASSWORD",
    r"'/auth/forgot-password/'": "ENDPOINTS.AUTH.FORGOT_PASSWORD",
    r"'/auth/reset-password/'": "ENDPOINTS.AUTH.RESET_PASSWORD",
    r"'/auth/logout/'": "ENDPOINTS.AUTH.LOGOUT",
    
    r"'/catalog/products/'": "ENDPOINTS.CATALOG.PRODUCTS",
    r"`/catalog/products/\$\{slug\}/`": "ENDPOINTS.CATALOG.PRODUCT_DETAIL(slug)",
    r"'/catalog/categories/'": "ENDPOINTS.CATALOG.CATEGORIES",
    r"'/catalog/collections/'": "ENDPOINTS.CATALOG.COLLECTIONS",
    r"'/catalog/colors/'": "ENDPOINTS.CATALOG.COLORS",
    r"'/catalog/sizes/'": "ENDPOINTS.CATALOG.SIZES",
    
    r"'/orders/cart/'": "ENDPOINTS.ORDERS.CART",
    r"`/orders/cart/items/\$\{itemId\}/remove/`": "ENDPOINTS.ORDERS.CART_ITEM_REMOVE(itemId)",
    r"`/orders/cart/items/\$\{itemId\}/quantity/`": "ENDPOINTS.ORDERS.CART_ITEM_QUANTITY(itemId)",
    r"'/orders/checkout/'": "ENDPOINTS.ORDERS.CHECKOUT",
    r"'/orders/me/orders/'": "ENDPOINTS.ORDERS.MY_ORDERS",
    
    r"'/promotions/coupons/validate/'": "ENDPOINTS.PROMOTIONS.VALIDATE_COUPON",
    
    r"'/reviews/'": "ENDPOINTS.REVIEWS.LIST_CREATE",
    
    r"'/newsletter/subscribe/'": "ENDPOINTS.NEWSLETTER.SUBSCRIBE"
}

for pattern, repl in replacements.items():
    content = re.sub(pattern, repl, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement complete.")
