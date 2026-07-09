# Customer Web App — Future Changes / Backlog

## 1) Missing Pages & Routes (Customer-facing features)
- [ ] Add **Register** page (`/register`)
- [ ] Replace `/account` placeholder with a real **Profile** page
- [ ] Add **Cart** page (`/cart`) with cart item list + quantity + remove actions
- [ ] Add **Checkout** page (`/checkout`) to trigger checkout and redirect to orders
- [ ] Add **Orders** page (`/orders`) to show authenticated user orders
- [ ] Add **NotFound** handling (basic 404 page)

## 2) API Integration Coverage
- [ ] Implement client-side services (or extend existing page-level calls) for:
  - [ ] `/auth/register/`, `/auth/profile/`, `/auth/logout/`
  - [ ] `/orders/cart/` (fetch cart)
  - [ ] `/orders/cart/items/:item_id/remove/` (remove from cart)
  - [ ] `/orders/cart/items/:item_id/quantity/` (update quantity)
  - [ ] `/orders/checkout/` (checkout action)
  - [ ] `/orders/me/orders/` (my orders list)
  - [ ] `/reviews/` and `/reviews/my/` (product reviews + my reviews if supported)
- [ ] Confirm request bodies for each endpoint (especially checkout/review create) match backend serializers.

## 3) Filtering (Query Params)
- [x] Implement **query-param-based filtering** on products list:
  - [x] Update `/` to read query params from `location.search`
  - [x] Convert UI filter selections (search/category/color/size/etc.) into query params
  - [x] Update product fetch to call: `GET /catalog/products/?<params>`
- [x] Add filter UI components (minimalistic) with:
  - [x] search input
  - [x] dropdowns / checkboxes for supported filter fields
  - [x] “Clear filters”
- [ ] Ensure pagination (if backend supports it) uses query params too.

## 4) Product Details Enhancements
- [ ] Improve `ProductDetailsPage` beyond JSON dump:
  - [ ] Render product fields cleanly (name, price, images if available)
  - [ ] Add **Add to Cart** / **Buy Now** actions (if endpoints exist for it; otherwise use cart item quantity endpoint)
  - [x] Add **Reviews section**:
    - [x] Load reviews for the product (confirm backend support; otherwise fall back to listing my reviews or global reviews)

## 5) Auth UX Improvements
- [ ] Add auth-aware UI:
  - [ ] Show login/register links for unauthenticated users
  - [ ] Show Profile/Cart/Orders links for authenticated users
- [ ] Guard authenticated routes:
  - [ ] `/cart`, `/checkout`, `/profile` (or `/account`), `/orders`
- [ ] Add logout button that also navigates back to `/`

## 6) Minimalistic Production-Ready UI / Layout
- [ ] Introduce shared layout + navigation:
  - [ ] `Navbar` with links to main pages
  - [ ] `Footer`
  - [ ] consistent `Container`, `Card`, `Button`, `Input` styles
- [ ] Standardize loading/error states across pages:
  - [ ] skeleton/loading placeholders
  - [ ] friendly error message components

## 7) State & Reusability Improvements
- [ ] Add small reusable UI components:
  - [ ] `LoadingSpinner`, `ErrorAlert`
  - [ ] `FilterBar`
  - [ ] `ProductListItem`, `ReviewList`, `ReviewForm`
- [ ] Optionally refactor to service-based architecture:
  - [ ] `customer/src/services/accounts.js`
  - [ ] `customer/src/services/catalog.js`
  - [ ] `customer/src/services/orders.js`
  - [ ] `customer/src/services/reviews.js`

## 8) Testing / Verification (Smoke + Functional)
- [ ] Smoke test for:
  - [ ] `/` products list + filter query params
  - [ ] `/products/:slug` details + reviews section
  - [ ] `/login` + redirect behavior
  - [ ] `/register` happy path (if backend supports)
- [ ] Auth tests:
  - [ ] visiting `/cart` without login redirects to `/login`
  - [ ] cookie refresh flow works on 401 and retries original request
- [ ] Cart & checkout tests:
  - [ ] add/remove/update quantity
  - [ ] checkout triggers successfully and order page loads
- [ ] Reviews tests:
  - [ ] create review succeeds (if backend supports)
  - [ ] reviews list loads correctly

## 9) Backend Alignment (Final Checks)
- [ ] Confirm shapes and fields returned by backend for:
  - [ ] catalog products list (array vs `{results: []}`)
  - [ ] catalog product detail (object vs `{results: []}`)
  - [ ] reviews list/create
  - [ ] cart/checkout payload and response
- [ ] Ensure axios interceptor refresh uses the correct endpoints + response fields:
  - [ ] access cookie value field name (`res.data.access`) is correct

---
*This backlog turns the current minimal scaffold into a fully functional, minimal storefront that can be expanded into a production-ready application.*
