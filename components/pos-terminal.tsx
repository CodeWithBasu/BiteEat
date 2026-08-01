'use client'

import React, { useState } from 'react'
import {
  MenuItem,
  Category,
  OrderItem,
  OrderType,
  SelectedModifier,
  CafeTable,
  CafeSettings
} from '@/lib/types'
import {
  Search,
  Plus,
  Minus,
  Trash2,
  SlidersHorizontal,
  Clock,
  User,
  Phone,
  Tag,
  CreditCard,
  ShoppingBag,
  Sparkles,
  Ban
} from 'lucide-react'
import { ModifierModal } from './modifier-modal'
import { CheckoutModal } from './checkout-modal'

interface POSTerminalProps {
  categories: Category[]
  menuItems: MenuItem[]
  tables: CafeTable[]
  cart: OrderItem[]
  cartOrderType: OrderType
  setCartOrderType: (type: OrderType) => void
  cartTableNumber: string
  setCartTableNumber: (tbl: string) => void
  cartCustomerName: string
  setCartCustomerName: (name: string) => void
  cartCustomerPhone: string
  setCartCustomerPhone: (phone: string) => void
  cartDiscount: number
  setCartDiscount: (disc: number) => void
  addToCart: (item: MenuItem, modifiers?: SelectedModifier[], notes?: string) => void
  removeFromCart: (id: string) => void
  updateCartQuantity: (id: string, delta: number) => void
  clearCart: () => void
  createOrder: (method?: any, isPaid?: boolean, cashAmount?: number) => any
  payOrder: (id: string, method: any, cashAmount?: number) => void
  onOpenReceipt: (order: any) => void
  settings: CafeSettings
}

export function POSTerminal({
  categories,
  menuItems,
  tables,
  cart,
  cartOrderType,
  setCartOrderType,
  cartTableNumber,
  setCartTableNumber,
  cartCustomerName,
  setCartCustomerName,
  cartCustomerPhone,
  setCartCustomerPhone,
  cartDiscount,
  setCartDiscount,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  createOrder,
  payOrder,
  onOpenReceipt,
  settings
}: POSTerminalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Modals state
  const [activeItemForCustomization, setActiveItemForCustomization] = useState<MenuItem | null>(null)
  const [pendingCheckoutOrder, setPendingCheckoutOrder] = useState<any>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false)

  // Filtered menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * (settings.taxRatePercent / 100))
  const grandTotal = Math.max(0, subtotal + tax - cartDiscount)

  const handleItemClick = (item: MenuItem) => {
    if (!item.inStock) return
    if (item.modifierGroups && item.modifierGroups.length > 0) {
      setActiveItemForCustomization(item)
    } else {
      addToCart(item)
    }
  }

  const handleConfirmCustomization = (
    item: MenuItem,
    modifiers: SelectedModifier[],
    notes: string
  ) => {
    addToCart(item, modifiers, notes)
  }

  const handleOpenCheckout = () => {
    if (cart.length === 0) return
    // Create pending order first to settle in modal
    const order = createOrder(undefined, false)
    setPendingCheckoutOrder(order)
    setIsCheckoutOpen(true)
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-61px)] overflow-hidden bg-[#12100E]">
      {/* Left Main Section: Categories & Menu Grid */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-stone-800/80 overflow-hidden">
        {/* Top Control Bar: Search & Quick Filters */}
        <div className="p-3 bg-[#161311] border-b border-stone-800/80 flex items-center justify-between gap-3 shrink-0">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, croissants, sandwiches..."
              className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500 hover:text-stone-300"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs font-semibold text-stone-400 hidden sm:block">
            Showing <span className="font-bold text-amber-400">{filteredItems.length}</span> items
          </div>
        </div>

        {/* Categories Bar */}
        <div className="bg-[#161311]/80 px-3 py-2 border-b border-stone-800/60 overflow-x-auto flex items-center gap-1.5 shrink-0 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            All Items ({menuItems.length})
          </button>
          {categories.map((cat) => {
            const count = menuItems.filter((m) => m.categoryId === cat.id).length
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                    : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-stone-800'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-full font-extrabold ${
                    isSelected ? 'bg-stone-950 text-amber-400' : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Menu Items Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3.5 align-content-start">
          {filteredItems.map((item) => {
            const isCustomizable = item.modifierGroups && item.modifierGroups.length > 0
            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`group relative bg-[#181412] rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
                  !item.inStock
                    ? 'opacity-60 border-stone-800/50 cursor-not-allowed'
                    : 'border-stone-800/80 hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer active:scale-[0.98]'
                }`}
              >
                {/* Image & Badges */}
                <div className="relative h-28 w-full overflow-hidden bg-stone-950">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181412] via-transparent to-black/30" />

                  {/* Price Tag */}
                  <div className="absolute top-2 left-2 bg-stone-950/90 backdrop-blur text-amber-400 px-2 py-0.5 rounded-lg text-xs font-black border border-amber-500/30">
                    {settings.currencySymbol}{item.price}
                  </div>

                  {/* Customizable pill */}
                  {isCustomizable && item.inStock && (
                    <div className="absolute top-2 right-2 bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-amber-500/40 backdrop-blur flex items-center gap-1">
                      <SlidersHorizontal className="w-2.5 h-2.5" />
                      <span>Customize</span>
                    </div>
                  )}

                  {/* Out of stock overlay */}
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-red-400">
                      <Ban className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-extrabold text-xs text-stone-100 line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-stone-400 line-clamp-2 mt-0.5 font-medium leading-snug">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-800/60 font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      {item.prepTimeMinutes}m prep
                    </span>
                    {item.popular && (
                      <span className="text-amber-400 flex items-center gap-0.5 font-bold">
                        <Sparkles className="w-3 h-3" /> Best Seller
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right Column: Order Cart & Checkout Panel */}
      <div className="w-full lg:w-96 bg-[#151210] flex flex-col border-t lg:border-t-0 border-stone-800 shrink-0">
        {/* Cart Header */}
        <div className="p-3 bg-[#181412] border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-500" />
            <h2 className="font-extrabold text-xs text-stone-100 uppercase tracking-wider">
              Current Order Cart
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-black rounded-lg border border-amber-500/30">
              {cart.reduce((acc, i) => acc + i.quantity, 0)} Items
            </span>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-bold text-red-400 hover:text-red-300 px-2 py-1 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Order Details: Type & Table Selector */}
        <div className="p-3 bg-[#13100E] border-b border-stone-800 space-y-2.5">
          {/* Order Type Buttons */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-stone-900 rounded-xl border border-stone-800 text-xs font-bold">
            <button
              onClick={() => setCartOrderType('dine-in')}
              className={`py-1.5 rounded-lg transition-all ${
                cartOrderType === 'dine-in'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              🍽️ Dine-in
            </button>
            <button
              onClick={() => setCartOrderType('takeaway')}
              className={`py-1.5 rounded-lg transition-all ${
                cartOrderType === 'takeaway'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              🛍️ Takeaway
            </button>
            <button
              onClick={() => setCartOrderType('delivery')}
              className={`py-1.5 rounded-lg transition-all ${
                cartOrderType === 'delivery'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              🛵 Delivery
            </button>
          </div>

          {/* Dine-in Table Selector */}
          {cartOrderType === 'dine-in' && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-stone-400 shrink-0">Table:</label>
              <select
                value={cartTableNumber}
                onChange={(e) => setCartTableNumber(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-100 font-bold focus:outline-none focus:border-amber-500"
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.number}>
                    {t.number} ({t.section} • {t.seats} Seats) - {t.status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Customer Inputs */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="relative">
              <User className="w-3 h-3 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cartCustomerName}
                onChange={(e) => setCartCustomerName(e.target.value)}
                placeholder="Guest Name"
                className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-7 pr-2 py-1.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="relative">
              <Phone className="w-3 h-3 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cartCustomerPhone}
                onChange={(e) => setCartCustomerPhone(e.target.value)}
                placeholder="Phone (Optional)"
                className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-7 pr-2 py-1.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="p-3 overflow-y-auto flex-1 space-y-2">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-stone-900/90 border border-stone-800/80 rounded-xl p-2.5 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-stone-100 line-clamp-1">{item.name}</h4>
                    {item.modifiers && item.modifiers.length > 0 && (
                      <div className="text-[10px] text-stone-400 font-medium">
                        {item.modifiers.map((m) => m.optionName).join(', ')}
                      </div>
                    )}
                    {item.notes && (
                      <div className="text-[10px] text-amber-400 font-medium italic">
                        Note: {item.notes}
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-black text-amber-400 shrink-0">
                    {settings.currencySymbol}{item.price * item.quantity}
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center justify-between pt-1 border-t border-stone-800/60">
                  <div className="text-[11px] text-stone-400">
                    {settings.currencySymbol}{item.price} each
                  </div>
                  <div className="flex items-center gap-1.5 bg-stone-950 rounded-lg p-1 border border-stone-800">
                    <button
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="w-5 h-5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center text-xs font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold font-mono text-stone-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="w-5 h-5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center text-xs font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-5 h-5 rounded hover:bg-red-500/20 text-red-400 flex items-center justify-center text-xs ml-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-600 space-y-2">
              <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
              <p className="text-xs font-bold text-stone-500">Cart is empty</p>
              <p className="text-[11px]">Select items from the menu to build an order</p>
            </div>
          )}
        </div>

        {/* Bill Summary & Settlement Footer */}
        <div className="p-3 bg-[#13100E] border-t border-stone-800 space-y-2.5">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-stone-400 font-medium">
              <span>Subtotal</span>
              <span className="font-mono">{settings.currencySymbol}{subtotal}</span>
            </div>
            <div className="flex justify-between text-stone-400 font-medium">
              <span>GST ({settings.taxRatePercent}%)</span>
              <span className="font-mono">{settings.currencySymbol}{tax}</span>
            </div>

            {/* Discount row */}
            <div className="flex items-center justify-between text-stone-400 font-medium pt-1">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-500" /> Discount:
              </span>
              <div className="flex items-center gap-1">
                <span className="text-stone-500">{settings.currencySymbol}</span>
                <input
                  type="number"
                  value={cartDiscount || ''}
                  onChange={(e) => setCartDiscount(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-16 bg-stone-900 border border-stone-800 rounded px-1.5 py-0.5 text-xs text-right font-mono font-bold text-emerald-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between text-base font-black text-stone-100 pt-2 border-t border-stone-800">
              <span>Grand Total</span>
              <span className="font-mono text-amber-400">{settings.currencySymbol}{grandTotal}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleOpenCheckout}
              disabled={cart.length === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black bg-amber-500 text-stone-950 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 transition-all shadow-lg shadow-amber-500/20"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Checkout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Item Customization Modal */}
      <ModifierModal
        item={activeItemForCustomization}
        isOpen={!!activeItemForCustomization}
        onClose={() => setActiveItemForCustomization(null)}
        onConfirm={handleConfirmCustomization}
        currencySymbol={settings.currencySymbol}
      />

      {/* Checkout & Payment Modal */}
      <CheckoutModal
        order={pendingCheckoutOrder}
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false)
          setPendingCheckoutOrder(null)
        }}
        onCompletePayment={(orderId, method, cashTendered) => {
          payOrder(orderId, method, cashTendered)
        }}
        onOpenReceipt={onOpenReceipt}
        currencySymbol={settings.currencySymbol}
      />
    </div>
  )
}
