'use client'

import React, { useState } from 'react'
import { Order, PaymentMethod } from '@/lib/types'
import { X, CreditCard, Banknote, QrCode, CheckCircle2, Printer, ArrowRight } from 'lucide-react'

interface CheckoutModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onCompletePayment: (orderId: string, method: PaymentMethod, cashTendered?: number) => void
  onOpenReceipt: (order: Order) => void
  currencySymbol: string
}

export function CheckoutModal({
  order,
  isOpen,
  onClose,
  onCompletePayment,
  onOpenReceipt,
  currencySymbol
}: CheckoutModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('cash')
  const [cashTendered, setCashTendered] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null)

  if (!isOpen || !order) return null

  const total = order.total
  const numCash = parseFloat(cashTendered) || 0
  const change = Math.max(0, numCash - total)

  const quickAmounts = [total, Math.ceil(total / 100) * 100, Math.ceil(total / 500) * 500, 1000, 2000].filter(
    (val, idx, self) => val >= total && self.indexOf(val) === idx
  )

  const handlePay = () => {
    if (method === 'cash' && numCash < total) {
      alert(`Amount tendered must be at least ${currencySymbol}${total}`)
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      onCompletePayment(order.id, method, numCash)
      const updated: Order = {
        ...order,
        paymentStatus: 'paid',
        paymentMethod: method,
        cashReceived: method === 'cash' ? numCash : undefined,
        cashChange: method === 'cash' ? change : undefined
      }
      setCompletedOrder(updated)
      setIsProcessing(false)
      setIsSuccess(true)
    }, 1000)
  }

  const handleFinish = () => {
    setIsSuccess(false)
    setCompletedOrder(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1C1815] border border-stone-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="p-4 bg-[#14110F] border-b border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                  Checkout & Settlement
                </span>
                <h3 className="text-lg font-black text-stone-100">{order.orderNumber}</h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-900 text-stone-400 hover:text-white flex items-center justify-center border border-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5">
              {/* Order summary banner */}
              <div className="bg-stone-900/90 p-4 rounded-xl border border-stone-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-stone-400 font-medium">Customer / Table</div>
                  <div className="text-sm font-bold text-stone-200">
                    {order.customerName} {order.tableNumber ? `(${order.tableNumber})` : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-stone-400 font-medium">Grand Total</div>
                  <div className="text-2xl font-black text-amber-400">
                    {currencySymbol}{total}
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setMethod('cash')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      method === 'cash'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <Banknote className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">Cash</span>
                  </button>

                  <button
                    onClick={() => setMethod('card')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      method === 'card'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">Card</span>
                  </button>

                  <button
                    onClick={() => setMethod('upi')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      method === 'upi'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <QrCode className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">UPI QR</span>
                  </button>
                </div>
              </div>

              {/* Method Details */}
              {method === 'cash' && (
                <div className="space-y-3 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-300">Amount Tendered</label>
                    <span className="text-xs text-stone-400 font-mono">
                      Min: {currencySymbol}{total}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    placeholder={`e.g. ${total}`}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-lg font-mono font-bold text-amber-400 placeholder-stone-700 focus:outline-none focus:border-amber-500"
                  />

                  {/* Quick cash pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setCashTendered(amt.toString())}
                        className="px-2.5 py-1 text-xs font-mono font-bold bg-stone-800 text-stone-300 hover:bg-amber-500 hover:text-stone-950 rounded-lg transition-colors"
                      >
                        {currencySymbol}{amt}
                      </button>
                    ))}
                  </div>

                  {/* Change calculated */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-sm">
                    <span className="font-bold text-stone-400">Change Due to Customer</span>
                    <span className="font-black font-mono text-emerald-400 text-base">
                      {currencySymbol}{change}
                    </span>
                  </div>
                </div>
              )}

              {method === 'upi' && (
                <div className="flex flex-col items-center justify-center p-4 bg-stone-900/80 rounded-xl border border-stone-800 text-center space-y-3">
                  <div className="p-3 bg-white rounded-xl shadow-lg">
                    {/* Simulated QR Code SVG */}
                    <svg className="w-36 h-36" viewBox="0 0 100 100">
                      <path d="M0,0 h30 v30 h-30 z M40,0 h20 v10 h-20 z M70,0 h30 v30 h-30 z M0,40 h10 v20 h-10 z M30,40 h40 v20 h-40 z M80,40 h20 v20 h-20 z M0,70 h30 v30 h-30 z M40,70 h30 v10 h-30 z M80,70 h20 v30 h-20 z" fill="#1C1815" />
                      <rect x="5" y="5" width="20" height="20" fill="#F59E0B" />
                      <rect x="75" y="5" width="20" height="20" fill="#F59E0B" />
                      <rect x="5" y="75" width="20" height="20" fill="#F59E0B" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-200">Scan QR Code to Pay</div>
                    <div className="text-[11px] text-stone-400">GPay • PhonePe • Paytm • BHIM</div>
                  </div>
                </div>
              )}

              {method === 'card' && (
                <div className="p-4 bg-stone-900/80 rounded-xl border border-stone-800 text-center space-y-2">
                  <CreditCard className="w-10 h-10 text-amber-500 mx-auto animate-bounce" />
                  <div className="text-xs font-bold text-stone-200">Tap / Insert Card on POS Terminal</div>
                  <div className="text-[11px] text-stone-400">Visa, Mastercard, RuPay & Amex accepted</div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#14110F] border-t border-stone-800 flex items-center gap-3">
              <button
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl text-xs font-bold text-stone-400 bg-stone-900 border border-stone-800 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-2/3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-500 text-stone-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Confirm Payment ({currencySymbol}{total})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Payment Success View */
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-black text-stone-100">Payment Successful!</h3>
              <p className="text-xs text-stone-400 mt-1">Order {completedOrder?.orderNumber} is confirmed & sent to Kitchen KDS</p>
            </div>

            {completedOrder?.paymentMethod === 'cash' && completedOrder.cashChange !== undefined && (
              <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
                <div className="text-xs text-stone-400">Change Returned</div>
                <div className="text-xl font-mono font-black text-emerald-400">
                  {currencySymbol}{completedOrder.cashChange}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  if (completedOrder) onOpenReceipt(completedOrder)
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-extrabold bg-amber-500 text-stone-950 hover:bg-amber-400"
              >
                <Printer className="w-4 h-4" />
                <span>Print Thermal Receipt</span>
              </button>
              <button
                onClick={handleFinish}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
              >
                Next Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
