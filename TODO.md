# Alignment Work: Frontend React ↔ Backend Django REST

- [ ] Step 1: Read `backend/catalog/serializers.py` to determine how to get `ProductVariant.id` / variant identifiers for cart.
- [ ] Step 2: Read `frontend/src/pages/Checkout.tsx` to confirm auth gating and checkout request payload shape.
- [ ] Step 3: Update `frontend/src/services/api.ts`
  - [ ] Fix cart endpoint paths and response parsing to match `backend/orders/views.py`:
    - [ ] cart remove path: `/orders/cart/items/{item_id}/remove/`
    - [ ] cart quantity path: `/orders/cart/items/{item_id}/quantity/`
    - [ ] ensure add/remove/quantity refresh cart via `getCart()` (backend shapes differ)
  - [ ] Fix reviews endpoint query params + response parsing to match `backend/reviews/views.py`:
    - [ ] use `product_name` / `variant_sku` (not `slug`)
    - [ ] parse `{ items, count }`
- [ ] Step 4: Disable wishlist wiring (backend has no wishlist endpoints)
  - [ ] In `frontend/src/context/AppContext.tsx`, remove wishlist state + syncing, or force wishlist to `[]`
  - [ ] In `frontend/src/services/api.ts`, ensure no calls to `/wishlist/`
  - [ ] Ensure any wishlist UI toggle won’t break (toggleWishlist becomes no-op)
- [ ] Step 5: Update `frontend/src/pages/ProductDetails.tsx` to fetch reviews from backend if catalog product detail doesn’t include reviews.
- [ ] Step 6: Update `frontend/src/pages/Checkout.tsx` if needed to ensure it sends `address` object exactly matching `CheckoutAddressSerializer`.
- [ ] Step 7: Run frontend build / typecheck (and quick smoke test) to ensure everything compiles.
