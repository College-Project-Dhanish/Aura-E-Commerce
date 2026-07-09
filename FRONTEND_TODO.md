# Frontend TODO (Customer + Admin)
This document lists the things to be built/validated in the **frontend React apps** against the backend REST APIs currently available/expected.

---

## 0) API Contract Assumptions (must be confirmed)
- **Base URL**: `VITE_API_BASE_URL` (env)
- **JWT Transport**:
  - Use `Authorization: Bearer <access_token>` for protected endpoints
  - Store access token in Redux (or memory) + refresh token if required by your auth flow

---

## 1) Customer Web Endpoints (Validate + Build)

### 1.1 Auth
**POST** `/api/auth/register/` *(if exists)*  
- Validate:
  - required fields
  - email uniqueness errors
  - password validation

**POST** `/api/auth/login/` ✅ (confirmed working)
- Validate:
  - valid creds => `access` + `refresh`
  - invalid creds => 400/401 with error detail

**POST** `/api/auth/refresh/` *(if exists)*
- Validate:
  - expired access => refresh returns new access

**POST** `/api/auth/logout/` *(if exists)*
- Validate:
  - proper token revocation (if supported)

**GET** `/api/auth/profile/` *(profile endpoint, if exists)*  
- Validate:
  - requires auth
  - returns `first_name`, `last_name`, `email`, `phone`, `profile_image`, etc.

**POST** `/api/auth/change-password/` *(if exists)*
- Validate:
  - current password correct => 200
  - mismatch => 400

**Forgot/Reset password**
- Validate:
  - forgot returns token response (email sending may be mocked)
  - reset applies only with valid token

Frontend pages/components:
- `LoginPage`, `RegisterPage`
- `ProfilePage`
- `ChangePasswordPage`
- `ForgotPasswordPage`, `ResetPasswordPage`

---

### 1.2 Products & Catalog Browsing
**GET** `/api/catalog/products/` ✅ (confirmed returns list, search/filter/sort expected)
- Query params to support in UI and validate:
  - `page`, `page_size`
  - `search` (if implemented)
  - `category` / `collection` filters (if implemented)
  - `color`, `size`, `price_min`, `price_max` (if implemented)
  - sorting: `ordering` or specific sort params (if implemented)
- Validation:
  - pagination returns correct `count/results`
  - empty result returns `results: []`

**GET** `/api/catalog/products/{slug}/` *(product detail by slug)*
- Validate:
  - slug existing => product payload with images/variants/colors/sizes
  - slug missing => 404

**GET** `/api/catalog/categories/` *(if exists)*
**GET** `/api/catalog/collections/` *(if exists)*
- Validate:
  - 200, correct list, slug-based selection

Frontend:
- `HomePage` (featured/best/new/ latest placeholders until backend fully supports)
- `ProductsPage` (grid + filters + sorting + pagination)
- `CollectionsPage`
- `ProductDetailsPage` (image gallery + color/size selectors + stock status)

---

### 1.3 Wishlist
**POST** `/api/wishlist/` *(if exists)*
**GET** `/api/wishlist/` *(if exists)*
**DELETE** `/api/wishlist/{item_id}/` *(if exists)*
- Validation:
  - requires auth
  - add/remove idempotent behavior

Frontend:
- `WishlistPage`
- `WishlistButton` on product cards/details

---

### 1.4 Cart (Guest + Logged-in)
**GET** `/api/orders/cart/` ✅ (confirmed)
- Validate:
  - returns `items[]` and `cart_session` cookie behavior
  - guest => `user:false`

**POST** `/api/orders/cart/` ✅ (confirmed)
- Request body (based on current backend serializer):
  - `variant_id` (int)
  - `quantity` (min 1)
- Validate:
  - invalid variant_id => 400 `variant_id: ["Invalid variant_id."]`
  - out-of-stock variant => 400 with message
  - stock boundary: quantity should be allowed up to `variant.stock`

**POST** `/api/orders/cart/remove/{item_id}/` *(if path differs, follow `orders/urls.py`)*
- Validate:
  - item not found => 404

**POST** `/api/orders/cart/quantity/{item_id}/` *(if path differs)*
- Validate:
  - quantity <1 => 400
  - updates line totals in UI

Frontend:
- `CartPage`:
  - show line totals + qty stepper + remove button
  - “Quick add to cart” from product card

---

### 1.5 Checkout + Orders
**POST** `/api/orders/checkout/` ✅ (confirmed basic flow + auth gating; nesting required)
- Auth rule:
  - logged out => **401** with detail from backend
- Request body (based on current `PlaceOrderSerializer` + your working tests):
  - `address: { first_name,last_name,phone,line1,line2?,city,state,postal_code,country }`
  - optional: `coupon_code`
  - optional: `shipping_total`, `tax_total`, `discount_total` (backend recomputes discount logic when coupon_code is provided)
- Validate:
  - wrong nesting (sending flat fields) => 400 `address: ["This field is required."]`
  - correct nesting => 201 order created
  - totals consistency:
    - baseline: `total = subtotal + shipping_total + tax_total - discount_total`
  - side effects:
    - cart cleared after success
    - stock decremented

**GET** `/api/orders/me/orders/` ✅ (confirmed)
- Validate:
  - requires auth
  - returns `orders[]` with `order_number/status/total`

Frontend:
- `CheckoutPage` (multi-step UI optional, but functional now):
  - Address form (React Hook Form)
  - Order review + “Place order”
- `OrdersPage` and `OrderDetailPage` (if detail endpoint exists)

---

### 1.6 Promotions / Coupons (Frontend hook)
**POST** `/api/promotions/coupons/validate/` *(exists in backend)*
- Request body expectation:
  - `{ "code": "...", "subtotal": number }` (per current promotions validate logic)
- Validate:
  - valid => includes computed discount and metadata
  - invalid => 400/validation error
  - discount clamped to [0, subtotal]

Frontend:
- `CouponInput` component on checkout page:
  - call validate endpoint when user applies coupon
  - store `coupon_code` for final checkout
  - show discount preview

---

## 2) Customer UI Validation Checklist
For each page, validate:
- All forms use React Hook Form with client-side required validation
- API errors map into user-friendly UI messages
- Auth errors:
  - 401 => show “Please login to checkout”
- Cart totals update:
  - after cart changes (qty/remove)
- Coupon:
  - preview display uses validate endpoint result (not only server response)
  - final order reflects applied coupon

---

## 3) Admin Panel (React app inside existing `admin/` folder)
Backend admin endpoints are not fully implemented in this repo yet, so admin UI should be created **functionally with placeholders** until backend CRUD endpoints exist.

### Admin auth
- Admin login uses same JWT auth mechanism as customer (validate access).

### Admin modules (routes/pages)
- Dashboard (read-only stats)
- Products CRUD
- Categories CRUD
- Collections CRUD
- Orders management (status update)
- Customers management
- Coupons CRUD
- Reviews moderation
- Newsletter subscribers + export
- Settings

For each admin module, once backend endpoints exist, validate:
- CRUD operations: list/create/update/delete
- Validation errors show correctly
- Pagination on list pages
- Auth/permission checks: only staff users can access

---

## 4) Testing Tasks (What we still must test)
### Customer API tests (remaining)
Run curl/Postman for:
1. Checkout with coupon_code:
   - valid coupon => discount_total computed from subtotal basis
   - invalid coupon => 400 with correct detail
2. Coupon validate endpoint:
   - confirm it matches checkout result logic
3. Checkout side effects:
   - cart cleared
   - stock decremented
4. Edge cases:
   - coupon discount > subtotal => discount clamps to subtotal

### Reviews (Customer) - Critical path
Run curl/Postman for:
1. `POST /api/reviews/`
   - happy path: user has a **DELIVERED** `OrderItem` where:
     - `OrderItem.variant_sku == submitted variant_sku`
     - `OrderItem.product_name == submitted product_name`
   - failure path: not verified purchase => **400/403** with validation detail
   - failure path: duplicate review for same `variant_sku` => **400**
2. `GET /api/reviews/`
   - default: returns only **APPROVED** reviews
   - filtering: verify query params (if supported by serializer/view)
3. `GET /api/reviews/my/`
   - returns current user reviews (including pending/rejected)

### Reviews (Admin) - Critical path
Admin endpoints require `is_staff=true`:
1. `GET /api/reviews/admin/pending/`
2. `PATCH /api/reviews/admin/{id}/approve/`
3. `PATCH /api/reviews/admin/{id}/reject/`
4. `DELETE /api/reviews/admin/{id}/`
Verify:
- approved reviews become visible via customer `GET /api/reviews/`
- rejected/deleted reviews no longer appear

### Newsletter - Critical path
1. `POST /api/newsletter/subscribe/`
   - email normalization (case-insensitive)
   - idempotent: multiple subscribe calls keep status SUBSCRIBED
2. `POST /api/newsletter/unsubscribe/`
   - idempotent: repeated unsubscribe does not error
3. Admin:
   - `GET /api/newsletter/subscribers/`
   - `GET /api/newsletter/subscribers/export/`
     - verify CSV response headers + row content

### Admin API tests (not started)
- Once admin endpoints exist: verify each module’s CRUD/list/status flows.

---
