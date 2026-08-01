import { useState, useEffect } from 'react'
import {
  Category,
  MenuItem,
  CafeTable,
  Order,
  InventoryItem,
  StaffMember,
  CafeSettings,
  OrderItem,
  OrderStatus,
  OrderType,
  PaymentMethod
} from './types'
import {
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_TABLES,
  INITIAL_ORDERS,
  INITIAL_INVENTORY,
  INITIAL_STAFF,
  DEFAULT_SETTINGS
} from './mock-data'

const STORAGE_KEYS = {
  CATEGORIES: 'biteeat_categories',
  MENU: 'biteeat_menu',
  TABLES: 'biteeat_tables',
  ORDERS: 'biteeat_orders',
  INVENTORY: 'biteeat_inventory',
  STAFF: 'biteeat_staff',
  SETTINGS: 'biteeat_settings'
}

function loadInitial<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

function saveStorage<T>(key: string, data: T) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(data))
    window.dispatchEvent(new Event('biteeat_storage_update'))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

export type POSModule = 'pos' | 'tables' | 'kitchen' | 'menu' | 'inventory' | 'analytics' | 'orders' | 'settings'

export function usePOSStore() {
  const [categories, setCategories] = useState<Category[]>(() => loadInitial(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES))
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => loadInitial(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS))
  const [tables, setTables] = useState<CafeTable[]>(() => loadInitial(STORAGE_KEYS.TABLES, INITIAL_TABLES))
  const [orders, setOrders] = useState<Order[]>(() => loadInitial(STORAGE_KEYS.ORDERS, INITIAL_ORDERS))
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadInitial(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY))
  const [staff] = useState<StaffMember[]>(() => loadInitial(STORAGE_KEYS.STAFF, INITIAL_STAFF))
  const [settings, setSettings] = useState<CafeSettings>(() => loadInitial(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS))
  const [currentStaff] = useState<StaffMember>(staff[0] || INITIAL_STAFF[0])

  const [activeModule, setActiveModule] = useState<POSModule>('pos')

  // Cart State
  const [cart, setCart] = useState<OrderItem[]>([])
  const [cartOrderType, setCartOrderType] = useState<OrderType>('dine-in')
  const [cartTableNumber, setCartTableNumber] = useState<string>('T-01')
  const [cartCustomerName, setCartCustomerName] = useState<string>('')
  const [cartCustomerPhone, setCartCustomerPhone] = useState<string>('')
  const [cartDiscount, setCartDiscount] = useState<number>(0)

  // Sync state with storage events across tabs or component instances
  useEffect(() => {
    const handleSync = () => {
      setCategories(loadInitial(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES))
      setMenuItems(loadInitial(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS))
      setTables(loadInitial(STORAGE_KEYS.TABLES, INITIAL_TABLES))
      setOrders(loadInitial(STORAGE_KEYS.ORDERS, INITIAL_ORDERS))
      setInventory(loadInitial(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY))
      setSettings(loadInitial(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS))
    }

    window.addEventListener('biteeat_storage_update', handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      window.removeEventListener('biteeat_storage_update', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  // Cart Actions
  const addToCart = (item: MenuItem, modifiers: OrderItem['modifiers'] = [], notes = '') => {
    setCart((prev) => {
      const modifierKey = JSON.stringify(modifiers)
      const existingIndex = prev.findIndex(
        (ci) => ci.menuItemId === item.id && JSON.stringify(ci.modifiers || []) === modifierKey && (ci.notes || '') === notes
      )

      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex].quantity += 1
        return updated
      } else {
        const modifierExtra = (modifiers || []).reduce((acc, m) => acc + m.price, 0)
        const newItem: OrderItem = {
          id: `cart-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          menuItemId: item.id,
          name: item.name,
          price: item.price + modifierExtra,
          quantity: 1,
          modifiers,
          notes,
          status: 'pending'
        }
        return [...prev, newItem]
      }
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as OrderItem[]
    )
  }

  const clearCart = () => {
    setCart([])
    setCartCustomerName('')
    setCartCustomerPhone('')
    setCartDiscount(0)
  }

  // Order Actions
  const createOrder = (paymentMethod?: PaymentMethod, isPaid = false, cashAmount = 0): Order => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const tax = Math.round(subtotal * (settings.taxRatePercent / 100))
    const total = Math.max(0, subtotal + tax - cartDiscount)

    const orderNum = `#BE-${Math.floor(100 + Math.random() * 900)}`
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      type: cartOrderType,
      tableNumber: cartOrderType === 'dine-in' ? cartTableNumber : undefined,
      customerName: cartCustomerName || (cartOrderType === 'dine-in' ? `Guest (${cartTableNumber})` : 'Walk-in Customer'),
      customerPhone: cartCustomerPhone,
      items: cart,
      subtotal,
      tax,
      discount: cartDiscount,
      total,
      status: isPaid ? 'preparing' : 'pending',
      paymentStatus: isPaid ? 'paid' : 'unpaid',
      paymentMethod,
      cashReceived: paymentMethod === 'cash' ? cashAmount : undefined,
      cashChange: paymentMethod === 'cash' ? Math.max(0, cashAmount - total) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedOrders = [newOrder, ...orders]
    setOrders(updatedOrders)
    saveStorage(STORAGE_KEYS.ORDERS, updatedOrders)

    // Update table status if dine-in
    if (cartOrderType === 'dine-in' && cartTableNumber) {
      updateTableStatusByNumber(cartTableNumber, 'occupied', newOrder.id)
    }

    clearCart()
    return newOrder
  }

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updatedOrders = orders.map((ord) => {
      if (ord.id === orderId) {
        const isCompleted = status === 'completed'
        return {
          ...ord,
          status,
          updatedAt: new Date().toISOString(),
          completedAt: isCompleted ? new Date().toISOString() : ord.completedAt
        }
      }
      return ord
    })

    setOrders(updatedOrders)
    saveStorage(STORAGE_KEYS.ORDERS, updatedOrders)

    // If order completed or cancelled, free up table
    const targetOrder = orders.find((o) => o.id === orderId)
    if (targetOrder && targetOrder.tableNumber && (status === 'completed' || status === 'cancelled')) {
      updateTableStatusByNumber(targetOrder.tableNumber, 'available', undefined)
    }
  }

  const updateOrderItemStatus = (orderId: string, itemId: string, itemStatus: OrderStatus) => {
    const updatedOrders = orders.map((ord) => {
      if (ord.id === orderId) {
        const updatedItems = ord.items.map((item) => (item.id === itemId ? { ...item, status: itemStatus } : item))
        return { ...ord, items: updatedItems, updatedAt: new Date().toISOString() }
      }
      return ord
    })
    setOrders(updatedOrders)
    saveStorage(STORAGE_KEYS.ORDERS, updatedOrders)
  }

  const payOrder = (orderId: string, method: PaymentMethod, cashAmount = 0) => {
    const updatedOrders = orders.map((ord) => {
      if (ord.id === orderId) {
        const cashChange = method === 'cash' ? Math.max(0, cashAmount - ord.total) : undefined
        return {
          ...ord,
          paymentStatus: 'paid' as const,
          paymentMethod: method,
          cashReceived: method === 'cash' ? cashAmount : undefined,
          cashChange,
          updatedAt: new Date().toISOString()
        }
      }
      return ord
    })
    setOrders(updatedOrders)
    saveStorage(STORAGE_KEYS.ORDERS, updatedOrders)

    const targetOrder = orders.find((o) => o.id === orderId)
    if (targetOrder && targetOrder.tableNumber) {
      updateTableStatusByNumber(targetOrder.tableNumber, 'billing', targetOrder.id)
    }
  }

  // Table Actions
  const updateTableStatusByNumber = (tableNumber: string, status: CafeTable['status'], orderId?: string) => {
    const updatedTables = tables.map((tbl) => {
      if (tbl.number === tableNumber) {
        return {
          ...tbl,
          status,
          currentOrderId: orderId,
          seatedTime: status === 'occupied' ? 'Just now' : undefined
        }
      }
      return tbl
    })
    setTables(updatedTables)
    saveStorage(STORAGE_KEYS.TABLES, updatedTables)
  }

  const setTableStatus = (tableId: string, status: CafeTable['status']) => {
    const updatedTables = tables.map((tbl) => (tbl.id === tableId ? { ...tbl, status } : tbl))
    setTables(updatedTables)
    saveStorage(STORAGE_KEYS.TABLES, updatedTables)
  }

  // Menu Actions
  const toggleMenuItemStock = (itemId: string) => {
    const updated = menuItems.map((item) => (item.id === itemId ? { ...item, inStock: !item.inStock } : item))
    setMenuItems(updated)
    saveStorage(STORAGE_KEYS.MENU, updated)
  }

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = { ...item, id: `item-${Date.now()}` }
    const updated = [...menuItems, newItem]
    setMenuItems(updated)
    saveStorage(STORAGE_KEYS.MENU, updated)
  }

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    const updated = menuItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    setMenuItems(updated)
    saveStorage(STORAGE_KEYS.MENU, updated)
  }

  const deleteMenuItem = (id: string) => {
    const updated = menuItems.filter((item) => item.id !== id)
    setMenuItems(updated)
    saveStorage(STORAGE_KEYS.MENU, updated)
  }

  // Inventory Actions
  const adjustInventoryStock = (id: string, delta: number) => {
    const updated = inventory.map((inv) => {
      if (inv.id === id) {
        const newStock = Math.max(0, inv.currentStock + delta)
        return { ...inv, currentStock: newStock, lastRestocked: new Date().toISOString().split('T')[0] }
      }
      return inv
    })
    setInventory(updated)
    saveStorage(STORAGE_KEYS.INVENTORY, updated)
  }

  // Settings Action
  const updateSettings = (newSettings: Partial<CafeSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    saveStorage(STORAGE_KEYS.SETTINGS, updated)
  }

  return {
    categories,
    menuItems,
    tables,
    orders,
    inventory,
    staff,
    settings,
    currentStaff,
    activeModule,
    setActiveModule,

    // Cart
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

    // Orders
    createOrder,
    updateOrderStatus,
    updateOrderItemStatus,
    payOrder,

    // Tables
    setTableStatus,

    // Menu
    toggleMenuItemStock,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,

    // Inventory
    adjustInventoryStock,

    // Settings
    updateSettings
  }
}
