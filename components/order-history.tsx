'use client'

import React, { useState } from 'react'
import { Order, CafeSettings } from '@/lib/types'
import { Search, Receipt, Printer, Clock, CheckCircle2, User, Phone, DollarSign } from 'lucide-react'

interface OrderHistoryProps {
  orders: Order[]
  onOpenReceipt: (order: Order) => void
  settings: CafeSettings
}

export function OrderHistory({
  orders,
  onOpenReceipt,
  settings
}: OrderHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.tableNumber && o.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'paid'
        ? o.paymentStatus === 'paid'
        : filterStatus === 'unpaid'
        ? o.paymentStatus === 'unpaid'
        : o.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#181412] p-4 rounded-2xl border border-stone-800">
        <div>
          <h2 className="text-lg font-black text-stone-100 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-500" />
            <span>Order History & Thermal Receipts</span>
          </h2>
          <p className="text-xs text-stone-400">Search past orders, audit transactions & reprint receipts</p>
        </div>

        <div className="text-xs font-semibold text-stone-400">
          Total Logged: <span className="font-bold text-amber-400">{orders.length} orders</span>
        </div>
      </div>

      {/* Control Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#181412] p-3 rounded-2xl border border-stone-800">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, guest name, table..."
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['all', 'paid', 'unpaid', 'preparing', 'ready', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                filterStatus === st
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : 'bg-stone-900 text-stone-400 border border-stone-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#181412] rounded-2xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#14110F] text-stone-400 font-bold uppercase border-b border-stone-800">
              <tr>
                <th className="p-3.5">Order Ref</th>
                <th className="p-3.5">Type & Table</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Items Summary</th>
                <th className="p-3.5">Grand Total</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-medium">
              {filteredOrders.map((ord) => {
                const dateStr = new Date(ord.createdAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })

                return (
                  <tr key={ord.id} className="hover:bg-stone-900/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-extrabold text-stone-100">{ord.orderNumber}</div>
                      <div className="text-[10px] text-stone-500 font-mono">{dateStr}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-stone-900 text-stone-300 border border-stone-800">
                        {ord.type} {ord.tableNumber ? `(${ord.tableNumber})` : ''}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-stone-200">
                      {ord.customerName || 'Walk-in'}
                    </td>
                    <td className="p-3.5 text-stone-400 max-w-xs truncate">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="p-3.5 font-mono font-black text-amber-400 text-sm">
                      {settings.currencySymbol}{ord.total}
                    </td>
                    <td className="p-3.5">
                      {ord.paymentStatus === 'paid' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {ord.paymentMethod?.toUpperCase() || 'PAID'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                          UNPAID
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="capitalize font-bold text-stone-300">{ord.status}</span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onOpenReceipt(ord)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-all"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Receipt</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
