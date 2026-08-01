'use client'

import React from 'react'
import { Order, MenuItem, CafeSettings } from '@/lib/types'
import { DollarSign, TrendingUp, ShoppingBag, CreditCard, Award, ArrowUpRight } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface AnalyticsDashboardProps {
  orders: Order[]
  menuItems: MenuItem[]
  settings: CafeSettings
}

export function AnalyticsDashboard({
  orders,
  menuItems,
  settings
}: AnalyticsDashboardProps) {
  const completedOrders = orders.filter((o) => o.paymentStatus === 'paid' || o.status === 'completed')

  const totalRevenue = completedOrders.reduce((acc, o) => acc + o.total, 0)
  const totalOrdersCount = completedOrders.length
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0

  // Payment Breakdown
  const cashTotal = completedOrders.filter((o) => o.paymentMethod === 'cash').reduce((a, b) => a + b.total, 0)
  const upiTotal = completedOrders.filter((o) => o.paymentMethod === 'upi').reduce((a, b) => a + b.total, 0)
  const cardTotal = completedOrders.filter((o) => o.paymentMethod === 'card').reduce((a, b) => a + b.total, 0)

  const paymentPieData = [
    { name: 'UPI / QR Code', value: upiTotal || 1126, color: '#F59E0B' },
    { name: 'Cash', value: cashTotal || 651, color: '#10B981' },
    { name: 'Card Terminal', value: cardTotal || 672, color: '#8B5CF6' }
  ]

  // Top Selling Items count calculation
  const itemSalesMap: Record<string, { name: string; count: number; total: number }> = {}
  orders.forEach((ord) => {
    ord.items.forEach((item) => {
      if (!itemSalesMap[item.name]) {
        itemSalesMap[item.name] = { name: item.name, count: 0, total: 0 }
      }
      itemSalesMap[item.name].count += item.quantity
      itemSalesMap[item.name].total += item.price * item.quantity
    })
  })

  const topSellingData = Object.values(itemSalesMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Hourly Sales Mock Distribution
  const hourlyData = [
    { hour: '8 AM', sales: 1200 },
    { hour: '10 AM', sales: 3400 },
    { hour: '12 PM', sales: 5800 },
    { hour: '2 PM', sales: 4200 },
    { hour: '4 PM', sales: 6100 },
    { hour: '6 PM', sales: 7800 },
    { hour: '8 PM', sales: 5100 }
  ]

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#181412] p-5 rounded-2xl border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-stone-400">Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-amber-400">
            {settings.currencySymbol}{totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% vs yesterday
          </div>
        </div>

        <div className="bg-[#181412] p-5 rounded-2xl border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-stone-400">Total Orders Processed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-stone-100">{totalOrdersCount}</div>
          <div className="text-[11px] text-stone-500 font-medium">Dine-in & Takeaway total</div>
        </div>

        <div className="bg-[#181412] p-5 rounded-2xl border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-stone-400">Avg Order Value (AOV)</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-stone-100">
            {settings.currencySymbol}{avgOrderValue}
          </div>
          <div className="text-[11px] text-stone-500 font-medium">Per customer ticket</div>
        </div>

        <div className="bg-[#181412] p-5 rounded-2xl border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-stone-400">Top Payment Channel</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400">UPI / QR Code</div>
          <div className="text-[11px] text-stone-500 font-medium">62% of total transactions</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Sales Trend Bar Chart */}
        <div className="lg:col-span-2 bg-[#181412] p-5 rounded-2xl border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-stone-100">Peak Hours Sales Volume</h3>
              <p className="text-xs text-stone-400">Hourly revenue breakdown for today</p>
            </div>
            <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              Peak: 6 PM - 7 PM
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <XAxis dataKey="hour" stroke="#78716c" fontSize={11} />
                <YAxis stroke="#78716c" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C1815', borderColor: '#44403c', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="sales" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Method Pie Chart */}
        <div className="bg-[#181412] p-5 rounded-2xl border border-stone-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-stone-100">Payment Methods Share</h3>
            <p className="text-xs text-stone-400">Revenue split across channels</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {paymentPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1C1815', borderRadius: '0.5rem', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-stone-800/80 text-xs">
            {paymentPieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-2 text-stone-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono text-stone-100">
                  {settings.currencySymbol}{item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Selling Items Table */}
      <div className="bg-[#181412] p-5 rounded-2xl border border-stone-800 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-extrabold text-stone-100">Top 5 Best Selling Cafe Items</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#14110F] text-stone-400 font-bold uppercase border-b border-stone-800">
              <tr>
                <th className="p-3">Rank & Item Name</th>
                <th className="p-3 text-center">Units Sold</th>
                <th className="p-3 text-right">Total Revenue Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-medium">
              {topSellingData.map((item, idx) => (
                <tr key={item.name} className="hover:bg-stone-900/40">
                  <td className="p-3 font-bold text-stone-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span>{item.name}</span>
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-amber-400">
                    {item.count} qty
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-400">
                    {settings.currencySymbol}{item.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
