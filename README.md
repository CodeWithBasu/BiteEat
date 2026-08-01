# BiteEat - Full-Stack Cafe POS & Restaurant Management System ☕🍔

**BiteEat** is a modern, full-stack Point of Sale (POS) and restaurant management application built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**. It is specifically crafted for cafes, coffee shops, and quick-service restaurants to manage live cashier ordering, table floor plans, real-time kitchen displays (KDS), inventory stock, analytics, and thermal receipt printing.

---

## 🌟 Key Features

### 🛒 1. Cashier POS Terminal
- **Interactive Food & Beverage Menu**: Filter by category (Coffee, Teas & Matcha, Artisan Bakery, Paninis & Bowls, Cold Drinks, Desserts) with instant live search.
- **Item Customization & Modifiers**: Customize milk choices (Whole, Oat, Almond), sweetness level, extra espresso shots, and special kitchen instructions before adding to cart.
- **Order Cart & Settle**: Live subtotal, customizable GST/VAT tax, discount pills, and order type selection (**Dine-in**, **Takeaway**, **Delivery**).
- **Multi-Payment Settlement**: Support for **Cash** (with automated change calculator), **Card**, and **UPI QR Code** payment simulation.
- **Thermal Receipt Printing**: 80mm thermal receipt format with direct `window.print()` support.

### 🪑 2. Table & Floor Plan Management
- **Visual Floor Layout**: Real-time status cards for tables across sections (**Main Floor**, **Patio**, **Mezzanine**, **VIP Lounge**).
- **Live Status Badges**: `Available`, `Occupied`, `Billing / Printing`, and `Reserved`.
- **Occupied Elapsed Counters**: Tracks seated durations for active tables.
- **One-tap Order Placement**: Start a new dine-in order directly from any available table.

### 🍳 3. Kitchen Display System (KDS)
- **Live Ticket Queue**: Displays incoming kitchen tickets sorted by urgency.
- **Elapsed Timer Urgency**: Color-coded time alerts (Green < 5m, Yellow 5-10m, Red Pulsing > 10m).
- **Status Pipeline**: `Pending` $\rightarrow$ `Preparing / Cooking` $\rightarrow$ `Ready to Serve` $\rightarrow$ `Completed`.
- **Kitchen Notes Highlight**: Displays allergy alerts and special preparation instructions prominently.

### 📋 4. Menu & Category Catalog
- **Catalog Management**: Add, edit, or remove food & beverage items with custom pricing, categories, and prep times.
- **Instant Stock Toggle**: Enable or disable item availability (`In Stock` / `Out of Stock`) with a single click during rush hours.

### 📦 5. Inventory & Ingredient Tracking
- **Raw Material Stock Levels**: Track coffee beans, milk liters, matcha powder, sourdough bread, and avocados.
- **Low Stock Alerts**: Automatic warning tags when stock drops below threshold.
- **Stock Adjustment**: Increase or decrease stock levels on the fly with estimated inventory valuation.

### 📊 6. Analytics & Performance Dashboard
- **Revenue Metrics**: Real-time Gross Revenue, Total Orders, Average Order Value (AOV), and Top Payment Channel.
- **Hourly Sales Volume**: Interactive Bar Chart tracking peak hours.
- **Top 5 Best Sellers**: Breakdown of top revenue-generating menu items.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI primitives
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: Reactive Local Storage Store with cross-tab event synchronization

---

## 🚀 Getting Started

### 1. Installation
```bash
pnpm install
# or
npm install
```

### 2. Run Development Server
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to launch **BiteEat POS**.

---

## 🔒 Atomic Commit Workflow
This repository follows strict atomic file commits. Every single change made to a file is individually committed and pushed to `origin main`.