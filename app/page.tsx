'use client'

import React, { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { FlavorCarousel } from '@/components/flavor-carousel'
import { BentoGrid } from '@/components/bento-grid'
import { ActivationsSection } from '@/components/activations-section'
import { SocialSection } from '@/components/social-section'
import { Footer } from '@/components/footer'

import { usePOSStore } from '@/lib/pos-store'
import { Navigation as POSNav } from '@/components/navigation' // POS Navigation
import { POSTerminal } from '@/components/pos-terminal'
import { TableManagement } from '@/components/table-management'
import { KitchenDisplay } from '@/components/kitchen-display'
import { MenuManagement } from '@/components/menu-management'
import { InventoryManagement } from '@/components/inventory-management'
import { AnalyticsDashboard } from '@/components/analytics-dashboard'
import { OrderHistory } from '@/components/order-history'
import { ReceiptModal } from '@/components/receipt-modal'
import { Order } from '@/lib/types'
import { ArrowLeft, Coffee } from 'lucide-react'

export default function Home() {
  const [viewMode, setViewMode] = useState<'landing' | 'pos'>('landing')
  const store = usePOSStore()
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null)

  const activeKitchenCount = store.orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  ).length

  if (viewMode === 'pos') {
    return (
      <div className="min-h-screen bg-[#12100E] text-stone-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
        {/* Top Header with Back to Landing Page toggle */}
        <div className="bg-amber-500 text-stone-950 px-4 py-1.5 text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Coffee className="w-4 h-4" /> BiteEat Fullstack POS System Active
          </span>
          <button
            onClick={() => setViewMode('landing')}
            className="flex items-center gap-1 bg-stone-950 text-amber-400 px-3 py-1 rounded-full text-[11px] font-extrabold hover:bg-stone-900 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Main Landing Page
          </button>
        </div>

        <POSNav
          activeModule={store.activeModule}
          setActiveModule={store.setActiveModule}
          activeKitchenCount={activeKitchenCount}
          currentStaff={store.currentStaff}
          cafeName={store.settings.name}
        />

        <main className="min-h-[calc(100vh-85px)]">
          {store.activeModule === 'pos' && (
            <POSTerminal
              categories={store.categories}
              menuItems={store.menuItems}
              tables={store.tables}
              cart={store.cart}
              cartOrderType={store.cartOrderType}
              setCartOrderType={store.setCartOrderType}
              cartTableNumber={store.cartTableNumber}
              setCartTableNumber={store.setCartTableNumber}
              cartCustomerName={store.cartCustomerName}
              setCartCustomerName={store.setCartCustomerName}
              cartCustomerPhone={store.cartCustomerPhone}
              setCartCustomerPhone={store.setCartCustomerPhone}
              cartDiscount={store.cartDiscount}
              setCartDiscount={store.setCartDiscount}
              addToCart={store.addToCart}
              removeFromCart={store.removeFromCart}
              updateCartQuantity={store.updateCartQuantity}
              clearCart={store.clearCart}
              createOrder={store.createOrder}
              payOrder={store.payOrder}
              onOpenReceipt={(order) => setActiveReceiptOrder(order)}
              settings={store.settings}
            />
          )}

          {store.activeModule === 'tables' && (
            <TableManagement
              tables={store.tables}
              orders={store.orders}
              setTableStatus={store.setTableStatus}
              onStartOrderForTable={(tbl) => {
                store.setCartOrderType('dine-in')
                store.setCartTableNumber(tbl)
                store.setActiveModule('pos')
              }}
              onOpenReceipt={(order) => setActiveReceiptOrder(order)}
              settings={store.settings}
            />
          )}

          {store.activeModule === 'kitchen' && (
            <KitchenDisplay
              orders={store.orders}
              updateOrderStatus={store.updateOrderStatus}
              updateOrderItemStatus={store.updateOrderItemStatus}
            />
          )}

          {store.activeModule === 'menu' && (
            <MenuManagement
              categories={store.categories}
              menuItems={store.menuItems}
              toggleMenuItemStock={store.toggleMenuItemStock}
              addMenuItem={store.addMenuItem}
              updateMenuItem={store.updateMenuItem}
              deleteMenuItem={store.deleteMenuItem}
              settings={store.settings}
            />
          )}

          {store.activeModule === 'inventory' && (
            <InventoryManagement
              inventory={store.inventory}
              adjustInventoryStock={store.adjustInventoryStock}
              settings={store.settings}
            />
          )}

          {store.activeModule === 'analytics' && (
            <AnalyticsDashboard
              orders={store.orders}
              menuItems={store.menuItems}
              settings={store.settings}
            />
          )}

          {store.activeModule === 'orders' && (
            <OrderHistory
              orders={store.orders}
              onOpenReceipt={(order) => setActiveReceiptOrder(order)}
              settings={store.settings}
            />
          )}
        </main>

        <ReceiptModal
          order={activeReceiptOrder}
          isOpen={!!activeReceiptOrder}
          onClose={() => setActiveReceiptOrder(null)}
          settings={store.settings}
        />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation onOpenPOS={() => setViewMode('pos')} />
      <HeroSection />
      <FlavorCarousel />
      <BentoGrid />
      <ActivationsSection />
      <SocialSection />
      <Footer />
    </main>
  )
}
