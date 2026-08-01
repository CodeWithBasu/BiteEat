'use client'

import React, { useState, useEffect } from 'react'
import {
  Coffee,
  ShoppingBag,
  Grid,
  ChefHat,
  UtensilsCrossed,
  Package,
  BarChart3,
  Receipt,
  Settings,
  Clock,
  UserCheck
} from 'lucide-react'
import { POSModule } from '@/lib/pos-store'
import { StaffMember } from '@/lib/types'

interface NavigationProps {
  activeModule: POSModule
  setActiveModule: (module: POSModule) => void
  activeOrderCount?: number
  activeKitchenCount?: number
  currentStaff: StaffMember
  cafeName: string
}

export function Navigation({
  activeModule,
  setActiveModule,
  activeKitchenCount = 0,
  currentStaff,
  cafeName
}: NavigationProps) {
  const [time, setTime] = useState<string>('')
  const [dateStr, setDateStr] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      )
      setDateStr(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const navItems = [
    { id: 'pos' as POSModule, label: 'POS Terminal', icon: ShoppingBag },
    { id: 'tables' as POSModule, label: 'Tables Floor', icon: Grid },
    {
      id: 'kitchen' as POSModule,
      label: 'Kitchen KDS',
      icon: ChefHat,
      badge: activeKitchenCount > 0 ? activeKitchenCount : undefined
    },
    { id: 'menu' as POSModule, label: 'Menu Catalog', icon: UtensilsCrossed },
    { id: 'inventory' as POSModule, label: 'Inventory', icon: Package },
    { id: 'analytics' as POSModule, label: 'Analytics', icon: BarChart3 },
    { id: 'orders' as POSModule, label: 'Order History', icon: Receipt },
    { id: 'settings' as POSModule, label: 'Settings', icon: Settings }
  ]

  return (
    <header className="sticky top-0 z-50 bg-[#161311]/95 backdrop-blur-md border-b border-amber-900/30 px-4 py-2.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-stone-950 font-bold">
            <Coffee className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-stone-100 tracking-tight leading-none">
                {cafeName}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                POS
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-medium">Smart Fullstack POS</p>
          </div>
        </div>

        {/* Center Module Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-stone-900/80 p-1 rounded-xl border border-stone-800/80">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeModule === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 text-[10px] font-black rounded-full ${
                      isActive ? 'bg-stone-950 text-amber-400' : 'bg-amber-500 text-stone-950 animate-pulse'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Right Info: Live Clock & Staff Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Clock */}
          <div className="hidden md:flex flex-col items-end border-r border-stone-800 pr-3">
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{time}</span>
            </div>
            <span className="text-[10px] text-stone-400 font-medium">{dateStr}</span>
          </div>

          {/* Active Staff */}
          <div className="flex items-center gap-2.5 bg-stone-900 px-2.5 py-1.5 rounded-xl border border-stone-800">
            <img
              src={currentStaff.avatar}
              alt={currentStaff.name}
              className="w-7 h-7 rounded-full object-cover border border-amber-500/40"
            />
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-stone-200">{currentStaff.name}</span>
                <UserCheck className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-amber-500 font-semibold">
                {currentStaff.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bar for module switching */}
      <div className="flex lg:hidden overflow-x-auto gap-1 mt-2.5 pt-2 border-t border-stone-800 pb-0.5 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeModule === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-900 text-stone-300 border border-stone-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.2 text-[9px] bg-red-500 text-white rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </header>
  )
}
