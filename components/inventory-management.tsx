'use client'

import React, { useState } from 'react'
import { InventoryItem, CafeSettings } from '@/lib/types'
import { Package, AlertTriangle, Plus, Minus, RefreshCw, Search } from 'lucide-react'

interface InventoryManagementProps {
  inventory: InventoryItem[]
  adjustInventoryStock: (id: string, delta: number) => void
  settings: CafeSettings
}

export function InventoryManagement({
  inventory,
  adjustInventoryStock,
  settings
}: InventoryManagementProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const lowStockCount = inventory.filter((item) => item.currentStock <= item.minThreshold).length
  const totalValue = inventory.reduce((acc, item) => acc + item.currentStock * item.costPerUnit, 0)

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#181412] p-4 rounded-2xl border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-stone-400">Total Stock Items</span>
            <div className="text-2xl font-black text-stone-100">{inventory.length}</div>
          </div>
          <Package className="w-8 h-8 text-amber-500" />
        </div>

        <div className="bg-[#181412] p-4 rounded-2xl border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-red-400">Low Stock Alerts</span>
            <div className="text-2xl font-black text-red-400">{lowStockCount}</div>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <div className="bg-[#181412] p-4 rounded-2xl border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-amber-400">Estimated Inventory Valuation</span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {settings.currencySymbol}{Math.round(totalValue).toLocaleString()}
            </div>
          </div>
          <RefreshCw className="w-8 h-8 text-amber-500" />
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#181412] p-3 rounded-2xl border border-stone-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search raw ingredients, milk, beans..."
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        <span className="text-xs text-stone-400 font-medium">
          Stock levels sync in real-time with POS orders
        </span>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#181412] rounded-2xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#14110F] text-stone-400 font-bold uppercase border-b border-stone-800">
              <tr>
                <th className="p-3.5">Ingredient / Material</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5">Min Alert Level</th>
                <th className="p-3.5">Unit Cost</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-medium">
              {filteredInventory.map((item) => {
                const isLow = item.currentStock <= item.minThreshold
                return (
                  <tr key={item.id} className="hover:bg-stone-900/40 transition-colors">
                    <td className="p-3.5 font-bold text-stone-100">{item.name}</td>
                    <td className="p-3.5 text-stone-400">{item.category}</td>
                    <td className="p-3.5 font-mono font-bold text-amber-400 text-sm">
                      {item.currentStock} {item.unit}
                    </td>
                    <td className="p-3.5 font-mono text-stone-400">
                      {item.minThreshold} {item.unit}
                    </td>
                    <td className="p-3.5 font-mono text-stone-300">
                      {settings.currencySymbol}{item.costPerUnit} / {item.unit}
                    </td>
                    <td className="p-3.5">
                      {isLow ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Sufficient
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800">
                        <button
                          onClick={() => adjustInventoryStock(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-12 text-center font-mono font-bold text-stone-200">
                          {item.currentStock}
                        </span>
                        <button
                          onClick={() => adjustInventoryStock(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
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
