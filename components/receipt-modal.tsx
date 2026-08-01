'use client'

import React from 'react'
import { Order, CafeSettings } from '@/lib/types'
import { X, Printer, Coffee } from 'lucide-react'

interface ReceiptModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  settings: CafeSettings
}

export function ReceiptModal({
  order,
  isOpen,
  onClose,
  settings
}: ReceiptModalProps) {
  if (!isOpen || !order) return null

  const handlePrint = () => {
    window.print()
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
  const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1C1815] border border-stone-800 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-3 bg-[#14110F] border-b border-stone-800 flex items-center justify-between print:hidden">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Printer className="w-4 h-4" /> Thermal Receipt Preview
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-900 text-stone-400 hover:text-white flex items-center justify-center border border-stone-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 bg-white text-stone-900 font-mono text-xs overflow-y-auto flex-1 select-none print:p-0 print:m-0 print:w-full">
          {/* Cafe Logo & Header */}
          <div className="text-center pb-4 border-b border-dashed border-stone-400 space-y-1">
            <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto mb-1">
              <Coffee className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black tracking-tight uppercase">{settings.name}</h2>
            <p className="text-[10px] font-sans font-semibold text-stone-600">{settings.tagline}</p>
            <p className="text-[10px] text-stone-600 leading-tight px-4">{settings.address}</p>
            <p className="text-[10px] text-stone-600">Ph: {settings.phone}</p>
            <p className="text-[10px] font-bold text-stone-800 mt-1">GSTIN: {settings.gstin}</p>
          </div>

          {/* Meta Info */}
          <div className="py-3 border-b border-dashed border-stone-400 space-y-1 text-[11px]">
            <div className="flex justify-between font-bold">
              <span>ORDER: {order.orderNumber}</span>
              <span className="uppercase">{order.type}</span>
            </div>
            {order.tableNumber && (
              <div className="flex justify-between font-bold text-amber-900">
                <span>TABLE: {order.tableNumber}</span>
                <span>Dine-in</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Date: {formattedDate}</span>
              <span>{formattedTime}</span>
            </div>
            {order.customerName && (
              <div className="text-stone-700 font-sans font-medium pt-0.5">
                Cust: {order.customerName}
              </div>
            )}
          </div>

          {/* Items Header */}
          <div className="py-2 border-b border-stone-300 font-bold text-[10px] grid grid-cols-12 gap-1 uppercase">
            <span className="col-span-2">Qty</span>
            <span className="col-span-7">Item Description</span>
            <span className="col-span-3 text-right">Amt</span>
          </div>

          {/* Items List */}
          <div className="py-2 border-b border-dashed border-stone-400 space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="text-[11px]">
                <div className="grid grid-cols-12 gap-1 font-bold">
                  <span className="col-span-2">{item.quantity}x</span>
                  <span className="col-span-7">{item.name}</span>
                  <span className="col-span-3 text-right">
                    {settings.currencySymbol}{item.price * item.quantity}
                  </span>
                </div>
                {item.modifiers && item.modifiers.length > 0 && (
                  <div className="pl-6 text-[9.5px] text-stone-600 font-sans">
                    {item.modifiers.map((m) => m.optionName).join(', ')}
                  </div>
                )}
                {item.notes && (
                  <div className="pl-6 text-[9.5px] text-amber-800 font-sans italic">
                    Note: {item.notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Calculation Breakdown */}
          <div className="py-3 border-b border-dashed border-stone-400 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{settings.currencySymbol}{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST Tax ({settings.taxRatePercent}%)</span>
              <span>{settings.currencySymbol}{order.tax}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span>-{settings.currencySymbol}{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-sm pt-1 border-t border-stone-900 text-stone-950">
              <span>TOTAL</span>
              <span>{settings.currencySymbol}{order.total}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="py-2 border-b border-dashed border-stone-400 text-[10.5px] space-y-0.5">
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="font-bold uppercase">{order.paymentMethod || 'Paid'}</span>
            </div>
            {order.cashReceived !== undefined && (
              <>
                <div className="flex justify-between text-stone-600">
                  <span>Cash Received:</span>
                  <span>{settings.currencySymbol}{order.cashReceived}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900">
                  <span>Change Given:</span>
                  <span>{settings.currencySymbol}{order.cashChange}</span>
                </div>
              </>
            )}
          </div>

          {/* Footer & WiFi info */}
          <div className="pt-4 text-center text-[10px] text-stone-600 space-y-1 font-sans">
            {settings.wifiPassword && (
              <p className="font-semibold text-stone-800">
                📶 Free WiFi Pass: <span className="font-mono">{settings.wifiPassword}</span>
              </p>
            )}
            <p className="italic font-medium">{settings.receiptFooter}</p>
            <p className="text-[9px] text-stone-400 pt-1 font-mono">BiteEat POS v1.0 • Powering Cafes</p>
          </div>
        </div>

        {/* Modal Bottom Print Button */}
        <div className="p-3 bg-[#14110F] border-t border-stone-800 flex items-center justify-between print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-stone-400 bg-stone-900 border border-stone-800 hover:text-white"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  )
}
