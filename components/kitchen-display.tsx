'use client'

import React, { useState, useEffect } from 'react'
import { Order, OrderStatus } from '@/lib/types'
import { ChefHat, Clock, CheckCircle2, AlertTriangle, ArrowRight, Volume2, VolumeX, Flame } from 'lucide-react'

interface KitchenDisplayProps {
  orders: Order[]
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  updateOrderItemStatus: (orderId: string, itemId: string, status: OrderStatus) => void
}

export function KitchenDisplay({
  orders,
  updateOrderStatus,
  updateOrderItemStatus
}: KitchenDisplayProps) {
  const [filter, setFilter] = useState<'active' | 'preparing' | 'ready'>('active')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [now, setNow] = useState(Date.now())

  // Refresh timer for live elapsed minutes
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 10000)
    return () => clearInterval(interval)
  }, [])

  // Kitchen orders are those not yet completed or cancelled
  const kitchenOrders = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  )

  const filteredOrders = kitchenOrders.filter((o) => {
    if (filter === 'preparing') return o.status === 'preparing' || o.status === 'pending'
    if (filter === 'ready') return o.status === 'ready'
    return true
  })

  const getElapsedMinutes = (dateStr: string) => {
    const created = new Date(dateStr).getTime()
    const diff = Math.max(0, Math.floor((now - created) / 60000))
    return diff
  }

  const getUrgencyClass = (elapsedMins: number) => {
    if (elapsedMins >= 10) {
      return 'border-red-500/80 bg-red-950/20 text-red-400 animate-urgent shadow-lg shadow-red-500/10'
    }
    if (elapsedMins >= 5) {
      return 'border-amber-500/60 bg-amber-950/20 text-amber-300'
    }
    return 'border-emerald-500/40 bg-stone-900/90 text-emerald-400'
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#181412] p-4 rounded-2xl border border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
            <ChefHat className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-stone-100 flex items-center gap-2">
              Kitchen Display System (KDS)
              <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full font-bold">
                {kitchenOrders.length} Tickets
              </span>
            </h2>
            <p className="text-xs text-stone-400">Live order prep queue & status timer</p>
          </div>
        </div>

        {/* Filter Pills & Audio Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'active'
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              All Active ({kitchenOrders.length})
            </button>
            <button
              onClick={() => setFilter('preparing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'preparing'
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Cooking Queue ({kitchenOrders.filter((o) => o.status !== 'ready').length})
            </button>
            <button
              onClick={() => setFilter('ready')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'ready'
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Ready to Serve ({kitchenOrders.filter((o) => o.status === 'ready').length})
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-stone-900 border-amber-500/40 text-amber-400'
                : 'bg-stone-900 border-stone-800 text-stone-600'
            }`}
            title="Toggle Kitchen Chime Alert"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Kitchen Ticket Cards Grid */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredOrders.map((order) => {
            const elapsed = getElapsedMinutes(order.createdAt)
            const urgencyClass = getUrgencyClass(elapsed)
            const isReady = order.status === 'ready'

            return (
              <div
                key={order.id}
                className={`bg-[#181412] rounded-2xl border p-4 space-y-4 flex flex-col justify-between transition-all duration-200 ${urgencyClass}`}
              >
                {/* Ticket Top Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-stone-100">{order.orderNumber}</h3>
                        <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                          {order.type}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-stone-300 mt-0.5">
                        {order.tableNumber ? `Table: ${order.tableNumber}` : order.customerName}
                      </div>
                    </div>

                    {/* Timer Badge */}
                    <div
                      className={`flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                        elapsed >= 10
                          ? 'bg-red-500 text-white border-red-400 font-black'
                          : elapsed >= 5
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{elapsed} min</span>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-800/80">
                    <span className="text-stone-400 font-semibold">Current State:</span>
                    <span
                      className={`font-black uppercase tracking-wider ${
                        isReady ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items Ticket Body */}
                <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 space-y-2.5 flex-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="text-xs space-y-0.5 border-b border-stone-900/60 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between font-bold text-stone-100">
                        <span className="text-amber-400 font-mono font-black">{item.quantity}x</span>
                        <span className="flex-1 ml-2">{item.name}</span>
                      </div>

                      {item.modifiers && item.modifiers.length > 0 && (
                        <div className="pl-6 text-[11px] text-stone-400 font-medium">
                          {item.modifiers.map((m) => m.optionName).join(' • ')}
                        </div>
                      )}

                      {item.notes && (
                        <div className="pl-6 text-[11px] text-amber-300 font-semibold bg-amber-500/10 p-1 rounded mt-1 border border-amber-500/20">
                          ⚠️ {item.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Ticket Bottom Actions */}
                <div className="pt-2">
                  {!isReady ? (
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="w-full py-2.5 rounded-xl text-xs font-black bg-amber-500 text-stone-950 hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Flame className="w-4 h-4" />
                          <span>Start Cooking</span>
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="w-full py-2.5 rounded-xl text-xs font-black bg-emerald-500 text-stone-950 hover:bg-emerald-400 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Order Ready</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="w-full py-2.5 rounded-xl text-xs font-black bg-stone-800 text-stone-200 hover:bg-stone-700 transition-all flex items-center justify-center gap-1.5 border border-stone-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Complete & Handover</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-[#181412] p-12 rounded-2xl border border-stone-800 text-center text-stone-500 space-y-3">
          <ChefHat className="w-16 h-16 mx-auto stroke-[1.5] text-stone-700" />
          <h3 className="text-lg font-extrabold text-stone-300">Kitchen Queue Clean!</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            All orders have been prepared and served. New cashier orders will appear here automatically.
          </p>
        </div>
      )}
    </div>
  )
}
