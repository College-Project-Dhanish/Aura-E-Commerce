# Admin Panel Layout (Minimalistic)

## Goals
- Minimal, professional UI
- Nested left sidebar for easy classification
- Very light styling; no unnecessary animations
- Responsive (sidebar collapses on smaller screens)
- Dark-mode ready (uses neutral colors + Tailwind `dark:` variants)

## Page Layout Structure
- **Left Sidebar** (fixed/scrollable)
- **Top Navbar** (fixed height, right-aligned user actions)
- **Content Area** (scrolls independently)

### Desktop Grid
- Sidebar: ~280px
- Navbar: 64px height
- Content: fills remaining space

### Mobile
- Sidebar becomes a slide-over or collapsible drawer
- Navbar stays visible on top

---

## Nested Sidebar Menu (Recommended Sections)

### 1) Dashboard
- Overview
  - `Total Products`
  - `Total Orders`
  - `Total Customers`
  - `Revenue`
  - `Recent Orders`
  - `Low Stock Products`

### 2) Catalog
- Categories
  - View Categories
  - Add Category
- Collections
  - View Collections
  - Add Collection
- Products
  - View Products
  - Add Product
- Variants
  - Manage Colors/Sizes (as separate lists if needed)
  - View Product Variants
- Product Images
  - Upload/Arrange Images (by product)

### 3) Orders
- Orders
  - View Orders
  - Order Details (items + status)
- Order Status
  - Pending / Confirmed / Packed / Shipped / Delivered / Cancelled
  - Quick status update screen

### 4) Customers
- Customers List
- Customer Details
- Order History (per customer)

### 5) Promotions
- Coupons
  - View Coupons
  - Create Coupon
  - Edit Coupon
- (Optional) Collection/Product Discounts
  - only if present in backend

### 6) Reviews
- Pending Reviews
  - Approve / Reject
- Approved Reviews
  - View & delete (if allowed)
- Rejected Reviews
  - View history

### 7) Newsletter
- Subscribers
  - View Subscribers
  - Export CSV
- Subscription Controls
  - (optional) quick unsubscribe

### 8) Settings
- Store Settings
  - Store Name
  - Store Email
  - Phone
  - Address
  - Logo
  - Hero Banner

---

## Sidebar UX Rules (Keep It Minimal)
- Use clear section headings (small, muted text)
- Each clickable item:
  - Left icon (simple stroke)
  - Text label
  - Active state highlight
- Nested items:
  - Collapsible group (expand/collapse)
  - Only one expanded section at a time (optional but recommended)
- No dropdown overlays—just inline nested indentation
- No animations beyond subtle instant state change (no transitions required)

---

## Styling Guidance (Tailwind)
- Background: `bg-white dark:bg-neutral-900`
- Borders: `border-neutral-200 dark:border-neutral-800`
- Text:
  - Default: `text-neutral-700 dark:text-neutral-200`
  - Muted: `text-neutral-500 dark:text-neutral-400`
- Active item:
  - `bg-neutral-100 dark:bg-neutral-800`
  - `text-neutral-900 dark:text-neutral-50`
- Hover:
  - `hover:bg-neutral-100 dark:hover:bg-neutral-800`
- Sidebar indentation for nested items:
  - `pl-6` for level 2

---

## Content Routing Recommendation (React Router)
Routes should map 1:1 to sidebar items:
- `/admin/dashboard`
- `/admin/catalog/categories`
- `/admin/catalog/collections`
- `/admin/catalog/products`
- `/admin/catalog/variants`
- `/admin/catalog/images`
- `/admin/orders`
- `/admin/orders/:orderNumber`
- `/admin/customers`
- `/admin/customers/:customerId`
- `/admin/promotions/coupons`
- `/admin/reviews/pending`
- `/admin/newsletter/subscribers`
- `/admin/settings/store`

---

## Admin UI Minimal Components (Reusable)
- `SidebarGroup` (collapsible parent)
- `SidebarItem` (leaf item)
- `TopNavbar` (brand + user controls)
- `AdminPageHeader` (title + breadcrumbs optional)
- `AdminTable` (consistent table styling for lists)

---

## Accessibility Checklist
- Sidebar navigation uses semantic `<nav>`
- Buttons/links have visible focus styles
- Active route is announced via `aria-current="page"` (leaf links)
- Collapsible groups have `aria-expanded` and `aria-controls`
