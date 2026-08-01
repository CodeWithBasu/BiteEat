'use client'

import React, { useState } from 'react'
import { CafeTable, TableStatus, Order, CafeSettings } from '@/lib/types'
import { Users, Clock, ShoppingBag, CheckCircle, AlertCircle, Sparkles, Filter } from 'lucide-react'

interface TableManagementProps {
  tables: CafeTable[]
  orders: Order[]
  setTableStatus: (tableId: string, status: TableStatus) => void
  onStartOrderForTable: (tableNumber: string) => void
  onOpenReceipt: (order: Order) => void
  settings: CafeSettings
}

export function TableManagement({
  tables,
  orders,
  setTableStatus,
  onStartOrderForTable,
  onOpenReceipt,
  settings
}: TableManagementProps) {
  const [selectedSection, setSelectedSection] = useState<string>('All')

  const sections = ['All', 'Main Floor', 'Patio', 'Mezzanine', 'VIP Lounge']

  const filteredTables = selectedSection === 'All'
    ? tables
    : tables.filter((t) => t.section === selectedSection)

  const availableCount = tables.filter((t) => t.status === 'available').length
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length
  const billingCount = tables.filter((t) => t.status === 'billing').length
  const reservedCount = tables.filter((t) => t.status === 'reserved').length
  const occupancyRate = Math.round(((occupiedCount + billingCount) / tables.length) * 100)

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return { label: 'Available', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' }
      case 'occupied':
        return { label: 'Occupied', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30' }
      case 'billing':
        return { label: 'Billing / Printing', bg: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
      case 'reserved':
        return { label: 'Reserved', bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-[#181412] p-4 rounded-2xl border border-stone-800 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-stone-400">Total Tables</span>
          <div className="text-2xl font-black text-stone-100">{tables.length}</div>
        </div>

        <div className="bg-[#181412] p-4 rounded-2xl border border-stone-800 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-emerald-400">Available</span>
          <div className="text-2xl font-black text-emerald-400">{availableCount}</div>
        </div>

        <div className="bg-[#181412] p-4 rounded-2xl border border-stone-800 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-amber-400">Occupied</span>
          <div className="text-2xl font-black text-amber-400">{occupiedCount}</div>
        </div>

        <div className="bg-[#181412] p-4 rounded-2xl border border-stone-800 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-purple-400">Billing</span>
          <div className="text-2xl font-black text-purple-400">{billingCount}</div>
        </div>

        <div className="bg-[#181412] p-4 rounded-2xl border border-stone-800 flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold uppercase text-stone-400">Occupancy Rate</span>
          <div className="text-2xl font-black text-amber-500 font-mono">{occupancyRate}%</div>
        </div>
      </div>

      {/* Section Filter Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#181412] p-3 rounded-2xl border border-stone-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-500" />
          <h2 className="font-extrabold text-sm text-stone-100">Floor Layout Sections</h2>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {sections.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSection === sec
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Table Floor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTables.map((table) => {
          const badge = getStatusBadge(table.status)
          const activeOrder = orders.find(
            (o) => o.id === table.currentOrderId || (o.tableNumber === table.number && o.status !== 'completed' && o.status !== 'cancelled')
          )

          return (
            <div
              key={table.id}
              className={`bg-[#181412] rounded-2xl border p-4 space-y-4 transition-all duration-200 shadow-lg ${
                table.status === 'occupied'
                  ? 'border-amber-500/40 shadow-amber-500/5'
                  : table.status === 'billing'
                  ? 'border-purple-500/40 shadow-purple-500/5'
                  : 'border-stone-800/80 hover:border-stone-700'
              }`}
            >
              {/* Card Top: Number & Status Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-stone-100">{table.number}</h3>
                    <span className="text-[10px] text-stone-500 font-bold bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                      {table.section}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-stone-400 font-semibold mt-1">
                    <Users className="w-3.5 h-3.5 text-amber-500" />
                    <span>{table.seats} Seats</span>
                  </div>
                </div>

                <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-lg border ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>

              {/* Middle Active Order Brief */}
              {activeOrder ? (
                <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-stone-400 font-medium">
                    <span>Order {activeOrder.orderNumber}</span>
                    <span className="font-mono font-bold text-amber-400">
                      {settings.currencySymbol}{activeOrder.total}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-stone-300 font-bold">
                    <span>{activeOrder.customerName}</span>
                    <span className="text-emerald-400 capitalize">{activeOrder.status}</span>
                  </div>
                  {table.seatedTime && (
                    <div className="flex items-center gap-1 text-[10px] text-stone-500 pt-1 border-t border-stone-800">
                      <Clock className="w-3 h-3 text-amber-500" /> Seated: {table.seatedTime}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center border border-dashed border-stone-800 rounded-xl text-stone-600 text-xs font-semibold">
                  Table Ready for Guests
                </div>
              )}

              {/* Card Actions */}
              <div className="pt-2 border-t border-stone-800/80 flex flex-col gap-2">
                {table.status === 'available' ? (
                  <button
                    onClick={() => onStartOrderForTable(table.number)}
                    className="w-full py-2.5 rounded-xl text-xs font-black bg-amber-500 text-stone-950 hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>New Order for {table.number}</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    {activeOrder && (
                      <button
                        onClick={() => onOpenReceipt(activeOrder)}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800"
                      >
                        Receipt
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setTableStatus(table.id, table.status === 'occupied' ? 'billing' : 'available')
                      }
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        table.status === 'occupied'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      }`}
                    >
                      {table.status === 'occupied' ? 'Mark Billing' : 'Free Table'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
