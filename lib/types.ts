export type OrderType = 'dine-in' | 'takeaway' | 'delivery'

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'split'

export type TableStatus = 'available' | 'occupied' | 'billing' | 'reserved'

export interface ModifierOption {
  id: string
  name: string
  price: number
}

export interface ModifierGroup {
  id: string
  name: string
  required?: boolean
  multiSelect?: boolean
  options: ModifierOption[]
}

export interface SelectedModifier {
  groupId: string
  groupName: string
  optionId: string
  optionName: string
  price: number
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  image: string
  inStock: boolean
  prepTimeMinutes: number
  popular?: boolean
  tags?: string[]
  modifierGroups?: ModifierGroup[]
}

export interface Category {
  id: string
  name: string
  icon: string
  itemCount?: number
}

export interface OrderItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
  modifiers?: SelectedModifier[]
  notes?: string
  status?: OrderStatus
}

export interface Order {
  id: string
  orderNumber: string
  type: OrderType
  tableNumber?: string
  customerName?: string
  customerPhone?: string
  items: OrderItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod
  cashReceived?: number
  cashChange?: number
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface CafeTable {
  id: string
  number: string
  seats: number
  status: TableStatus
  currentOrderId?: string
  seatedTime?: string
  guestCount?: number
  section: 'Main Floor' | 'Patio' | 'Mezzanine' | 'VIP Lounge'
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  unit: string
  minThreshold: number
  costPerUnit: number
  lastRestocked: string
}

export interface StaffMember {
  id: string
  name: string
  role: 'admin' | 'manager' | 'cashier' | 'kitchen' | 'waiter'
  pin: string
  avatar: string
  shiftStatus: 'active' | 'off-duty'
}

export interface CafeSettings {
  name: string
  tagline: string
  address: string
  phone: string
  email: string
  gstin: string
  taxRatePercent: number
  currencySymbol: string
  wifiPassword?: string
  receiptFooter: string
}
