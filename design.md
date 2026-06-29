# ShopForge — Design System & UI Specification

Cloned design language from Daraz.pk. Every token below is derived directly from screenshot analysis. Use this file as the single source of truth when building frontend components.

---

## 1. Design Philosophy

**Orange-on-white commerce.** High-contrast, utilitarian, value-forward. The primary accent drives trust ("official") and urgency ("sale"). The rest of the page is deliberately neutral so prices and CTAs scream. Every component serves scannability: product grids, discount badges, and price hierarchies must be readable in under 300ms.

---

## 2. Color Tokens

### Brand Colors
| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#F57224` | Navbar bg, primary buttons, prices, badges, accents |
| `--color-primary-dark` | `#D45A0F` | Primary button hover state |
| `--color-primary-light` | `#FFF3EC` | Light tint backgrounds, selected states |
| `--color-action-blue` | `#0F3460` | "Buy Now" button, links in product detail |
| `--color-action-blue-hover` | `#1B5DA0` | Action blue hover |

### Neutrals
| Token | Hex | Usage |
|---|---|---|
| `--color-white` | `#FFFFFF` | Cards, inputs, page backgrounds |
| `--color-bg-page` | `#F5F5F5` | Page root background between sections |
| `--color-bg-section` | `#FFFFFF` | Section/card backgrounds |
| `--color-border` | `#E8E8E8` | Dividers, card borders, input borders |
| `--color-border-dark` | `#CCCCCC` | Stronger dividers |

### Text
| Token | Hex | Usage |
|---|---|---|
| `--color-text-primary` | `#222222` | Product names, headings, main body copy |
| `--color-text-secondary` | `#757575` | Descriptions, meta labels, timestamps |
| `--color-text-muted` | `#AAAAAA` | Placeholder text, disabled states |
| `--color-text-link` | `#0F3460` | Hyperlinks, breadcrumbs |
| `--color-text-white` | `#FFFFFF` | Text on orange/dark backgrounds |

### Semantic
| Token | Hex | Usage |
|---|---|---|
| `--color-price` | `#F57224` | Current/sale price |
| `--color-price-original` | `#AAAAAA` | Strikethrough original price |
| `--color-discount` | `#F57224` | Discount percentage label |
| `--color-star` | `#FFBB00` | Star ratings |
| `--color-success` | `#00B775` | Order confirmed, in-stock indicators |
| `--color-error` | `#D0021B` | Validation errors, out-of-stock |
| `--color-warning` | `#F5A623` | Low stock warnings |

### Admin Only
| Token | Hex | Usage |
|---|---|---|
| `--color-admin-sidebar` | `#1A1A2E` | Admin sidebar background |
| `--color-admin-sidebar-active` | `#F57224` | Active sidebar item highlight |
| `--color-admin-header` | `#FFFFFF` | Admin top bar |
| `--color-stat-blue` | `#4A90D9` | Revenue stat card accent |
| `--color-stat-green` | `#27AE60` | Orders stat card accent |
| `--color-stat-purple` | `#8E44AD` | Products stat card accent |
| `--color-stat-orange` | `#F57224` | Customers stat card accent |

---

## 3. Typography

### Font Stack
```css
/* Primary — clean system sans, matches Daraz's Helvetica-first approach */
--font-body: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', sans-serif;

/* UI labels, prices, badges — tabular figures */
--font-ui: 'Helvetica Neue', Arial, sans-serif;

/* Monospace — order IDs, product SKUs */
--font-mono: 'Courier New', Courier, monospace;
```

### Type Scale
| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `--text-xs` | `11px` | 400 | 1.4 | Tiny labels, hints |
| `--text-sm` | `12px` | 400 | 1.5 | Card meta, secondary labels |
| `--text-base` | `13px` | 400 | 1.6 | Body text, descriptions |
| `--text-md` | `14px` | 400/500 | 1.6 | Product names, list items |
| `--text-lg` | `16px` | 500 | 1.5 | Sub-headings, section titles |
| `--text-xl` | `18px` | 600 | 1.4 | Section headers |
| `--text-2xl` | `20px` | 700 | 1.3 | Page titles |
| `--text-3xl` | `24px` | 700 | 1.2 | Price on detail page |
| `--text-4xl` | `28px` | 700 | 1.2 | Hero banners |

### Price Typography
```css
.price-current {
  font-size: 18px;     /* 24px on detail page */
  font-weight: 700;
  color: var(--color-price);
  font-variant-numeric: tabular-nums;
}

.price-original {
  font-size: 12px;
  font-weight: 400;
  color: var(--color-price-original);
  text-decoration: line-through;
  font-variant-numeric: tabular-nums;
}

.price-discount {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-discount);
}
```

---

## 4. Spacing Scale

All spacing in multiples of 4px.

| Token | Value | Usage |
|---|---|---|
| `--space-1` | `4px` | Tight inner padding |
| `--space-2` | `8px` | Icon gaps, inline spacing |
| `--space-3` | `12px` | Card padding (tight) |
| `--space-4` | `16px` | Card padding (standard), input padding |
| `--space-5` | `20px` | Section inner padding |
| `--space-6` | `24px` | Section vertical rhythm |
| `--space-8` | `32px` | Between major sections |
| `--space-10` | `40px` | Section top/bottom padding |
| `--space-12` | `48px` | Large section gaps |

---

## 5. Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `2px` | Badges, discount tags |
| `--radius-md` | `4px` | Buttons, inputs, cards |
| `--radius-lg` | `8px` | Modals, drawers |
| `--radius-xl` | `12px` | Large panels |
| `--radius-full` | `9999px` | Pills, circular avatars |

---

## 6. Shadows

```css
--shadow-card:    0 1px 4px rgba(0, 0, 0, 0.08);
--shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.12);
--shadow-dropdown: 0 4px 16px rgba(0, 0, 0, 0.15);
--shadow-modal:   0 8px 32px rgba(0, 0, 0, 0.20);
--shadow-navbar:  0 2px 8px rgba(0, 0, 0, 0.10);
```

---

## 7. Layout System

### Page Container
```css
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
```

### Grid Breakpoints
| Breakpoint | Width | Columns |
|---|---|---|
| Mobile | `< 640px` | 1 |
| Tablet | `640px – 1023px` | 2–3 |
| Desktop | `≥ 1024px` | 4–6 |

### Product Grid
```
Mobile:  grid-cols-2  gap-2
Tablet:  grid-cols-3  gap-3
Desktop: grid-cols-4  gap-3
Large:   grid-cols-5  gap-3   (on catalog pages)
```

### Category Grid
```
Mobile:  grid-cols-4  gap-2
Tablet:  grid-cols-6  gap-2
Desktop: grid-cols-8  gap-4
```

---

## 8. Components

---

### 8.1 Top Utility Bar

**Structure:**
```
[Logo] | Save More On App · Sell On Daraz · Help & Support | [Login] [Sign Up] [زبان]
```

**Specs:**
- Background: `#1A1A1A` (near-black)
- Text: `#FFFFFF`, `font-size: 12px`
- Height: `36px`
- Links spaced with `·` separator
- Login/Sign Up: white text, no border, hover underline

---

### 8.2 Main Navbar

**Structure:**
```
[Daraz Logo (white)]   [Search Bar ——————————————] [🔍]   [🛒 Cart]
```

**Specs:**
- Background: `#F57224` (primary orange)
- Height: `64px` (desktop), `56px` (mobile)
- Logo: white SVG, `height: 32px`
- Sticky on scroll with `box-shadow: var(--shadow-navbar)`

**Search Bar:**
- Background: `#FFFFFF`
- Border-radius: `var(--radius-md)` (4px)
- Width: `clamp(280px, 50%, 640px)`
- Height: `40px`
- Padding: `0 16px`
- Font: `14px`, color `#222222`
- Search button: white bg, orange search icon `#F57224`, right-aligned, `border-left: 1px solid #E8E8E8`
- Placeholder: `color: #AAAAAA`

**Cart Icon:**
- White shopping bag icon, `24px`
- Badge: red circle `#D0021B`, `14px`, `font-size: 10px`, white number

---

### 8.3 Category Nav Bar

**Structure:**
```
[Categories ▼]  [Category 1] [Category 2] [Category 3] ...
```

**Specs:**
- Background: `#FFFFFF`
- Height: `40px`
- Border-bottom: `1px solid #E8E8E8`
- Font: `13px`, color `#333333`
- Hover: color `#F57224`, underline
- Active: color `#F57224`, `font-weight: 600`
- "Categories" dropdown: `background: #F57224`, `color: #FFFFFF`, padding `8px 12px`

---

### 8.4 Product Card

**Layout (vertical):**
```
┌─────────────────────┐
│                     │
│    Product Image    │  ← aspect-ratio: 1 / 1, object-fit: contain, bg: #F5F5F5
│                     │
│  [Official] [Daraz] │  ← badges top-left, absolute positioned
├─────────────────────┤
│ Product Name        │  ← 2 lines max, overflow: ellipsis, font-size: 13px
│                     │
│ Rs. 1,698           │  ← price, orange, bold
│ Rs. 2,499  -32%     │  ← original + discount, same line, small
│ ★★★★☆ (456)        │  ← stars + count
└─────────────────────┘
```

**Specs:**
- Background: `#FFFFFF`
- Border: `1px solid #E8E8E8`
- Border-radius: `var(--radius-md)` (4px)
- Shadow: `var(--shadow-card)`
- Hover shadow: `var(--shadow-card-hover)`
- Hover transform: `translateY(-2px)`
- Transition: `200ms ease`
- Image area: `padding: 8px`, `background: #F5F5F5`
- Info area: `padding: 8px 10px 10px`

**Name:**
- `font-size: 13px`, `color: #222222`
- `display: -webkit-box; -webkit-line-clamp: 2; overflow: hidden`
- `min-height: 36px`
- `margin-bottom: 6px`

**Pricing block:**
```
Rs. 1,698     ← font-size: 14px, font-weight: 700, color: #F57224
Rs. 2,499 -32%  ← font-size: 11px, color: #AAAAAA (strikethrough) + #F57224 (discount)
```

**Star Rating:**
- Stars: `font-size: 11px`, `color: #FFBB00`
- Count: `(456)` → `font-size: 11px`, `color: #AAAAAA`

**Badges (absolute, top-left of image):**
- "Official" badge: white bg, blue border, `font-size: 10px`, `padding: 2px 4px`
- Platform badge: orange bg, white text

---

### 8.5 Flash Sale Section

**Header:**
```
[🔥 Flash Sale]  [On Sale Now ▸]                      [SHOP ALL PRODUCTS →]
```

- Section bg: `#FFFFFF`
- "Flash Sale" text: `font-size: 20px`, `font-weight: 700`, `color: #F57224`
- "On Sale Now" tab: `color: #F57224`, `border-bottom: 2px solid #F57224`, `font-size: 13px`
- "Shop All Products" button: `border: 1px solid #F57224`, `color: #F57224`, no fill, hover: fill orange
- Horizontal scroll on mobile, 6-column grid on desktop

**Countdown Timer (if applicable):**
- Segments: `background: #1A1A1A`, `color: #FFFFFF`, `border-radius: 2px`
- Font: monospace, `font-size: 16px`, `font-weight: 700`
- Separators: `:` in `#F57224`

---

### 8.6 Category Card (Grid Tile)

**Layout:**
```
┌──────────┐
│  [Image] │  ← 80×80px, object-fit: contain
│ Cat Name │  ← font-size: 12px, text-align: center, color: #333333
└──────────┘
```

**Specs:**
- Background: `#FFFFFF`
- Border: `1px solid #E8E8E8`
- Border-radius: `4px`
- Padding: `12px 8px`
- Hover: `box-shadow: 0 2px 8px rgba(0,0,0,0.12)`
- Image: max `72px × 72px`, centered
- Text: `font-size: 12px`, `line-height: 1.4`, `color: #333333`, center-aligned

---

### 8.7 Buttons

#### Primary Button (Add to Cart / Primary Action)
```css
.btn-primary {
  background: #F57224;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background 150ms;
}
.btn-primary:hover { background: #D45A0F; }
.btn-primary:active { background: #B84D0E; transform: scale(0.98); }
.btn-primary:disabled { background: #E8E8E8; color: #AAAAAA; cursor: not-allowed; }
```

#### Action Blue Button (Buy Now)
```css
.btn-action-blue {
  background: #0F3460;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
}
.btn-action-blue:hover { background: #1B5DA0; }
```

#### Outline Button (Secondary)
```css
.btn-outline {
  background: transparent;
  color: #F57224;
  border: 1px solid #F57224;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
}
.btn-outline:hover { background: #FFF3EC; }
```

#### Ghost Button (Tertiary)
```css
.btn-ghost {
  background: transparent;
  color: #757575;
  border: 1px solid #E8E8E8;
  font-size: 13px;
  padding: 8px 16px;
  border-radius: 4px;
}
.btn-ghost:hover { border-color: #CCCCCC; color: #333333; }
```

#### Icon Button (Quantity +/-)
```css
.btn-icon {
  width: 28px;
  height: 28px;
  border: 1px solid #E8E8E8;
  border-radius: 4px;
  background: #FFFFFF;
  color: #333333;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-icon:hover { border-color: #F57224; color: #F57224; }
```

---

### 8.8 Form Inputs

```css
.input {
  height: 40px;
  padding: 0 12px;
  border: 1px solid #E8E8E8;
  border-radius: 4px;
  font-size: 14px;
  color: #222222;
  background: #FFFFFF;
  width: 100%;
  transition: border-color 150ms;
}
.input:focus {
  outline: none;
  border-color: #F57224;
  box-shadow: 0 0 0 3px rgba(245, 114, 36, 0.12);
}
.input::placeholder { color: #AAAAAA; }
.input.error { border-color: #D0021B; }
```

**Select Dropdown:**
- Same as input, with chevron icon right-aligned
- Custom select via wrapper div + absolute-positioned chevron

**Error message:**
- `font-size: 12px`, `color: #D0021B`, `margin-top: 4px`

---

### 8.9 Badges & Tags

```css
/* Discount tag — inline on product cards */
.badge-discount {
  font-size: 11px;
  font-weight: 500;
  color: #F57224;
}

/* Status badge — order status */
.badge-pending    { background: #FFF3E0; color: #E65100; }
.badge-processing { background: #E3F2FD; color: #1565C0; }
.badge-shipped    { background: #F3E5F5; color: #6A1B9A; }
.badge-delivered  { background: #E8F5E9; color: #2E7D32; }
.badge-cancelled  { background: #FFEBEE; color: #C62828; }

/* Common badge base */
.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 9999px;
  display: inline-block;
  white-space: nowrap;
}
```

---

### 8.10 Product Detail Page Layout

```
┌─ Breadcrumb ──────────────────────────────────────────────────────────┐
│  Home > Category > Sub-category > Product Name                        │
└───────────────────────────────────────────────────────────────────────┘

┌─ Left (50%) ─────────────┐  ┌─ Center (30%) ──────────────────────┐  ┌─ Right (20%) ──────┐
│  ┌──────────────────┐    │  │  Product Title (2–3 lines)          │  │  Delivery Options  │
│  │                  │    │  │  ★★★★☆ Ratings 456                 │  │  ─────────────      │
│  │   Main Image     │    │  │                                     │  │  📍 Location        │
│  │                  │    │  │  Rs. 1,698                          │  │  Standard: Rs. 180 │
│  └──────────────────┘    │  │  Rs. 2,499  -32%                    │  │  Collection: Rs. 55│
│  [▸] [img][img][img] [▸] │  │                                     │  │  ─────────────      │
│  (thumbnails, 4 visible) │  │  Variant Selector (chips)           │  │  Cash on Delivery  │
└──────────────────────────┘  │                                     │  │  ─────────────      │
                               │  Qty: [–] [1] [+]  (500 left)      │  │  Return: 14 days   │
                               │                                     │  │  Warranty: N/A     │
                               │  [Buy Now ████████] [Add to Cart ██]│  │  ─────────────      │
                               │                                     │  │  Sold by: Seller   │
                               └─────────────────────────────────────┘  │  89% positive      │
                                                                         └────────────────────┘
```

**Breadcrumb:**
- `font-size: 12px`
- Each crumb: `color: #0F3460` (link), last crumb `color: #757575`
- Separator: `>` or `/`, `color: #AAAAAA`

**Main Image:**
- Max `460px × 460px`, `object-fit: contain`
- Background: `#FFFFFF`
- Border: `1px solid #E8E8E8`
- Zoom on hover (CSS `transform: scale(1.5)` on image with `overflow: hidden`)

**Thumbnails:**
- `60px × 60px` squares
- Border: `1px solid #E8E8E8`
- Active border: `2px solid #F57224`
- Gap: `8px`

**Delivery Panel (right sidebar):**
- Background: `#FFFFFF`
- Border: `1px solid #E8E8E8`
- Border-radius: `4px`
- Padding: `16px`
- Section dividers: `border-top: 1px solid #F5F5F5`

---

### 8.11 Cart Page

**Layout:** Two-column (cart items left, order summary right)

**Cart Item Row:**
```
[Image 80px]  [Product Name (2-line)] [Variant]   [Qty –/+]   [Price]   [🗑]
```
- Row border: `border-bottom: 1px solid #F5F5F5`
- Padding: `16px 0`

**Order Summary Card:**
- Background: `#FFFFFF`
- Border: `1px solid #E8E8E8`
- Padding: `16px`
- "Subtotal" row, "Shipping" row, "Total" row
- Total: `font-size: 18px`, `font-weight: 700`, `color: #222222`
- Proceed to Checkout: full-width primary orange button

---

### 8.12 Checkout — 3-Step Stepper

**Step indicators:**
```
[1 Address ✓] ——— [2 Payment ●] ——— [3 Confirmation]
```
- Active step: `color: #F57224`, filled circle `background: #F57224`
- Completed step: `color: #F57224`, checkmark icon
- Inactive step: `color: #AAAAAA`, empty circle `border: 2px solid #AAAAAA`
- Connector line: `border-top: 2px solid`, active `#F57224`, inactive `#E8E8E8`

**Address form:** Standard inputs, labeled top, 2-column grid on desktop
**Payment step:** Card number / expiry / CVV inputs, test card hint shown
**Confirmation:** Green success icon, order number, estimated delivery

---

### 8.13 Order History

**List Item:**
```
┌─────────────────────────────────────────────────────┐
│ Order #SF-00123  │  29 Jun 2026  │  [Delivered ●]   │
│ ─────────────────────────────────────────────────── │
│ [img] Product Name × 2     Rs. 3,396                │
│ [img] Product Name × 1     Rs. 675                  │
│ ─────────────────────────────────────────────────── │
│ Total: Rs. 4,071                    [View Details →] │
└─────────────────────────────────────────────────────┘
```
- Border: `1px solid #E8E8E8`
- Border-radius: `4px`
- Background: `#FFFFFF`
- `margin-bottom: 12px`

---

## 9. Admin Dashboard

### 9.1 Layout Shell

```
┌─ Sidebar (240px, fixed) ─────┐  ┌─ Main Area ────────────────────────────────┐
│                              │  │  ┌─ Top Bar ────────────────────────────┐   │
│ [ShopForge Logo]             │  │  │  Page Title    [Search] [Avatar]      │   │
│ ──────────────────────       │  │  └──────────────────────────────────────┘   │
│ 📊 Dashboard                 │  │                                              │
│ 📦 Products                  │  │  [Content Area]                              │
│ 🛒 Orders                    │  │                                              │
│ 👤 Customers                 │  │                                              │
│                              │  │                                              │
│ ──────────────────────       │  │                                              │
│ ⚙ Settings                  │  │                                              │
│ 🚪 Logout                    │  │                                              │
└──────────────────────────────┘  └──────────────────────────────────────────────┘
```

**Sidebar:**
- Background: `#1A1A2E`
- Width: `240px` desktop, collapsible on mobile
- Logo area: `height: 64px`, `padding: 0 20px`, logo white
- Nav items: `height: 44px`, `padding: 0 20px`, `font-size: 13px`, `color: rgba(255,255,255,0.7)`
- Active item: `background: rgba(245,114,36,0.15)`, `color: #F57224`, `border-left: 3px solid #F57224`
- Hover: `background: rgba(255,255,255,0.06)`, `color: #FFFFFF`
- Section dividers: `border-top: 1px solid rgba(255,255,255,0.08)`

**Top Bar:**
- Background: `#FFFFFF`
- Height: `64px`
- Border-bottom: `1px solid #E8E8E8`
- Shadow: `var(--shadow-navbar)`
- Page title: `font-size: 20px`, `font-weight: 700`, `color: #222222`

---

### 9.2 Dashboard — KPI Stat Cards

**4-column grid** (`grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`)

```
┌────────────────────────┐
│ ● Total Revenue        │  ← colored top border (4px)
│                        │
│ Rs. 1,24,500           │  ← large number, bold
│ +12.5% ↑ vs last month │  ← green/red delta
│                        │
│ [Icon]                 │  ← icon bottom-right, colored, 40px circle
└────────────────────────┘
```

**Specs:**
- Background: `#FFFFFF`
- Border: `1px solid #E8E8E8`
- Border-radius: `8px`
- Border-top: `4px solid <accent>` (blue/green/purple/orange per card)
- Padding: `20px`
- Shadow: `var(--shadow-card)`
- Title: `font-size: 12px`, `color: #757575`, `text-transform: uppercase`, `letter-spacing: 0.5px`
- Value: `font-size: 28px`, `font-weight: 700`, `color: #222222`, `margin: 8px 0 4px`
- Delta positive: `color: #27AE60`, `font-size: 12px`
- Delta negative: `color: #D0021B`, `font-size: 12px`
- Icon circle: `width: 40px`, `height: 40px`, `border-radius: 50%`, `opacity: 0.15` background

---

### 9.3 Dashboard — Revenue Chart

**Recharts `<AreaChart>`**

```
Section Header: "Daily Revenue"   [Last 7 Days ▼]
──────────────────────────────────────────────────
[Area Chart: smooth curve, gradient fill]
  - Line: stroke #F57224, strokeWidth 2
  - Gradient fill: #F57224 → transparent (top to bottom)
  - Grid: faint horizontal lines, color #F5F5F5
  - X-axis: date labels, font-size 11px, color #AAAAAA
  - Y-axis: Rs. values, font-size 11px, color #AAAAAA
  - Tooltip: white card with shadow, orange dot, price + date
```

**Container:**
- Background: `#FFFFFF`
- Border: `1px solid #E8E8E8`
- Border-radius: `8px`
- Padding: `20px`
- Chart height: `260px`

---

### 9.4 Dashboard — Order Status Donut Chart

**Recharts `<PieChart>` (donut variant)**

- Segments: pending `#F5A623`, processing `#4A90D9`, shipped `#8E44AD`, delivered `#27AE60`, cancelled `#E74C3C`
- Inner radius: `55%` (donut)
- Legend: right-aligned list with color dots + label + count
- Center label: total order count

---

### 9.5 Admin — Data Table (Products / Orders)

```
┌─ Table Controls ──────────────────────────────────────────┐
│  [+ Add Product]                        [🔍 Search...]    │
└───────────────────────────────────────────────────────────┘
┌─ Table ───────────────────────────────────────────────────┐
│  ☐  │  Image  │  Name ↕  │  Price ↕  │  Stock  │  Status │  Actions  │
│────────────────────────────────────────────────────────────│
│  ☐  │ [img]   │ Product… │ Rs. 1,698 │  45     │ Active  │  ✏ 🗑     │
└───────────────────────────────────────────────────────────┘
[Prev] [1] [2] [3] ... [10] [Next]
```

**Table Specs:**
- Header: `background: #F5F5F5`, `font-size: 12px`, `font-weight: 600`, `color: #757575`, `text-transform: uppercase`, `letter-spacing: 0.4px`
- Row: `background: #FFFFFF`, `border-bottom: 1px solid #F5F5F5`
- Row hover: `background: #FAFAFA`
- Row height: `56px`
- Cell padding: `0 16px`
- Sortable column: chevron icon beside header label

**Pagination:**
- Page numbers: `width: 32px`, `height: 32px`, circle, `border: 1px solid #E8E8E8`
- Active: `background: #F57224`, `color: #FFFFFF`, `border-color: #F57224`
- Prev/Next: text buttons, `color: #F57224`

---

### 9.6 Admin — Order Detail & Status Updater

**Status Timeline:**
```
● Pending (Jun 28) ──── ● Processing (Jun 29) ──── ○ Shipped ──── ○ Delivered
```
- Completed dot: `background: #F57224`, solid
- Future dot: `border: 2px solid #E8E8E8`, hollow
- Connector: `height: 2px`, completed `background: #F57224`, future `background: #E8E8E8`
- Label: `font-size: 11px`, completed `color: #F57224`, future `color: #AAAAAA`

**Status Update Dropdown:**
- Select input, same style as form inputs
- Confirm button: primary orange
- Cancelled option shown only for eligible statuses

---

### 9.7 Admin — Product Form

**Layout:** Two-column form on desktop (left: main fields, right: image + pricing)

**Image Uploader:**
```
┌─── Drag & Drop Zone ─────────────────────────┐
│                                               │
│          📷  Drop image here                  │
│          or  [Browse Files]                   │
│                                               │
│  JPEG · PNG · WebP  ·  Max 5 MB              │
└───────────────────────────────────────────────┘
```
- Border: `2px dashed #E8E8E8`
- Border-radius: `8px`
- Background: `#FAFAFA`
- Hover border: `2px dashed #F57224`, background `#FFF3EC`
- Preview replaces zone on upload, with "Remove" button overlay

---

## 10. "Recommendations" Rail

```
Just For You ──────────────────────────────
← [Card][Card][Card][Card][Card][Card] →
```

**Specs:**
- Section title: `font-size: 20px`, `font-weight: 700`, `color: #222222`
- Horizontal scroll container with `overflow-x: auto`, `scroll-snap-type: x mandatory`
- Each card: `scroll-snap-align: start`, `min-width: 160px`
- Arrow nav buttons: `40px × 40px`, `border-radius: 50%`, white bg, shadow, hover orange

---

## 11. Footer

**3-row structure:**
1. **Top:** Logo + tagline + app download links (App Store / Google Play)
2. **Mid:** 4-column link grid (Shop, Sell, About, Follow Us with social icons)
3. **Bottom:** Copyright + payment method logos (Visa, Mastercard, JazzCash etc.)

**Specs:**
- Background: `#FFFFFF`
- Border-top: `1px solid #E8E8E8`
- Padding: `32px 0 16px`
- Section heading: `font-size: 13px`, `font-weight: 700`, `color: #222222`, `margin-bottom: 12px`
- Links: `font-size: 13px`, `color: #757575`, hover `color: #F57224`
- Bottom bar: `background: #F5F5F5`, `padding: 12px 0`, `font-size: 12px`, `color: #AAAAAA`

---

## 12. Dark Mode Adjustments

This is a storefront — dark mode is optional but should be considered:

| Light Token | Dark Override |
|---|---|
| `--color-bg-page` | `#111111` |
| `--color-bg-section` | `#1A1A1A` |
| `--color-border` | `#2A2A2A` |
| `--color-text-primary` | `#F0F0F0` |
| `--color-text-secondary` | `#AAAAAA` |
| `--color-admin-sidebar` | `#0D0D1A` |

Primary orange `#F57224` remains unchanged in dark mode — it's the brand color.

---

## 13. Motion & Transitions

```css
/* Standard micro-interaction */
transition: all 150ms ease;

/* Card hover */
transition: box-shadow 200ms ease, transform 200ms ease;

/* Drawer/modal enter */
animation: slideIn 250ms cubic-bezier(0.4, 0, 0.2, 1);

/* Page fade */
animation: fadeIn 200ms ease;

/* Skeleton shimmer */
background: linear-gradient(90deg, #F5F5F5 25%, #EBEBEB 50%, #F5F5F5 75%);
background-size: 200% 100%;
animation: shimmer 1.5s infinite;
```

All animations: `prefers-reduced-motion` override → `animation: none; transition: none;`

---

## 14. Implementation Notes for ShopForge

1. **CSS Custom Properties** — define all tokens in `globals.css` under `:root {}` so Tailwind can extend them
2. **Tailwind config** — extend `colors` with token aliases pointing to `var(--color-*)` values
3. **Price formatting** — always `formatPrice(pence)` from `lib/utils.ts`, never raw integers
4. **Image fallback** — every `<Image>` needs `onError` → `/images/placeholder.jpg`
5. **Skeleton loading** — use shimmer skeleton cards while product queries load (staleTime: 2min)
6. **Admin guard** — admin layout must redirect non-admin server-side (never client-side only)
7. **Mobile nav** — hamburger drawer with same `#1A1A2E` sidebar sliding in from left
8. **Cart badge** — read from TanStack Query cache, not Zustand, to stay in sync with server
