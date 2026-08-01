'use client'

import React, { useState } from 'react'
import { usePOSStore } from '@/lib/pos-store'
import { Navigation } from '@/components/navigation'
import { POSTerminal } from '@/components/pos-terminal'
import { TableManagement } from '@/components/table-management'
import { KitchenDisplay } from '@/components/kitchen-display'
import { MenuManagement } from '@/components/menu-management'
import { InventoryManagement } from '@/components/inventory-management'
import { AnalyticsDashboard } from '@/components/analytics-dashboard'
import { OrderHistory } from '@/components/order-history'
import { ReceiptModal } from '@/components/receipt-modal'
import { Order } from '@/lib/types'
import { Settings as SettingsIcon, Coffee, Building2, Phone, Mail, Percent, Receipt, ShieldCheck } from 'lucide-react'

export default function Home() {
  const store = usePOSStore()

  // Thermal Receipt Modal State
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null)

  const activeKitchenCount = store.orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  ).length

  const handleStartOrderForTable = (tableNumber: string) => {
    store.setCartOrderType('dine-in')
    store.setCartTableNumber(tableNumber)
    store.setActiveModule('pos')
  }

  return (
    <div className="min-h-screen bg-[#12100E] text-stone-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top POS Navigation Shell */}
      <Navigation
        activeModule={store.activeModule}
        setActiveModule={store.setActiveModule}
        activeKitchenCount={activeKitchenCount}
        currentStaff={store.currentStaff}
        cafeName={store.settings.name}
      />

      {/* Main Active Module Container */}
      <main className="min-h-[calc(100vh-61px)]">
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
            onStartOrderForTable={handleStartOrderForTable}
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

        {store.activeModule === 'settings' && (
          <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
            <div className="bg-[#181412] p-5 rounded-2xl border border-stone-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
                <SettingsIcon className="w-5 h-5 text-amber-500" />
                <div>
                  <h2 className="text-base font-black text-stone-100">Cafe Profile & POS Settings</h2>
                  <p className="text-xs text-stone-400">Configure receipt info, tax rates & store profile</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-stone-400">Cafe Name</label>
                  <input
                    type="text"
                    value={store.settings.name}
                    onChange={(e) => store.updateSettings({ name: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 mt-1 focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-400">Tagline</label>
                  <input
                    type="text"
                    value={store.settings.tagline}
                    onChange={(e) => store.updateSettings({ tagline: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 mt-1 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="font-bold text-stone-400">Address (Printed on receipts)</label>
                  <input
                    type="text"
                    value={store.settings.address}
                    onChange={(e) => store.updateSettings({ address: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 mt-1 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-400">Phone</label>
                  <input
                    type="text"
                    value={store.settings.phone}
                    onChange={(e) => store.updateSettings({ phone: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 mt-1 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-400">GSTIN Tax Registration</label>
                  <input
                    type="text"
                    value={store.settings.gstin}
                    onChange={(e) => store.updateSettings({ gstin: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 mt-1 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-400">GST Tax Rate (%)</label>
                  <input
                    type="number"
                    value={store.settings.taxRatePercent}
                    onChange={(e) => store.updateSettings({ taxRatePercent: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-amber-400 mt-1 focus:outline-none focus:border-amber-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-400">Currency Symbol</label>
                  <input
                    type="text"
                    value={store.settings.currencySymbol}
                    onChange={(e) => store.updateSettings({ currencySymbol: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-amber-400 mt-1 focus:outline-none focus:border-amber-500 font-mono font-bold"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="font-bold text-stone-400">Receipt Footer Message</label>
                  <input
                    type="text"
                    value={store.settings.receiptFooter}
                    onChange={(e) => store.updateSettings({ receiptFooter: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 mt-1 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Receipt Dialog */}
      <ReceiptModal
        order={activeReceiptOrder}
        isOpen={!!activeReceiptOrder}
        onClose={() => setActiveReceiptOrder(null)}
        settings={store.settings}
      />
    </div>
  )
}
