import { Category, MenuItem, CafeTable, Order, InventoryItem, StaffMember, CafeSettings } from './types'

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-coffee', name: 'Espresso & Coffee', icon: 'Coffee', itemCount: 8 },
  { id: 'cat-tea', name: 'Teas & Matcha', icon: 'CupSoda', itemCount: 5 },
  { id: 'cat-bakery', name: 'Artisan Bakery', icon: 'Croissant', itemCount: 6 },
  { id: 'cat-savory', name: 'Paninis & Bowls', icon: 'Sandwich', itemCount: 6 },
  { id: 'cat-beverages', name: 'Cold Drinks', icon: 'GlassWater', itemCount: 5 },
  { id: 'cat-desserts', name: 'Desserts & Sweets', icon: 'IceCream', itemCount: 4 }
]

export const COMMON_MODIFIERS = {
  MILK: {
    id: 'mod-milk',
    name: 'Milk Choice',
    options: [
      { id: 'm1', name: 'Whole Milk', price: 0 },
      { id: 'm2', name: 'Oat Milk', price: 40 },
      { id: 'm3', name: 'Almond Milk', price: 40 },
      { id: 'm4', name: 'Skimmed Milk', price: 0 }
    ]
  },
  SWEETNESS: {
    id: 'mod-sweetness',
    name: 'Sweetness Level',
    options: [
      { id: 's1', name: '100% Standard', price: 0 },
      { id: 's2', name: '50% Less Sweet', price: 0 },
      { id: 's3', name: 'Sugar Free (Stevia)', price: 15 },
      { id: 's4', name: 'Extra Honey (+₹20)', price: 20 }
    ]
  },
  ESPRESSO_SHOTS: {
    id: 'mod-shots',
    name: 'Extra Espresso Shot',
    options: [
      { id: 'es1', name: 'Single Shot', price: 0 },
      { id: 'es2', name: 'Double Shot (Standard)', price: 0 },
      { id: 'es3', name: 'Triple Shot (+₹50)', price: 50 }
    ]
  }
}

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    name: 'Classic Espresso Single/Double',
    description: 'Rich dark roast blend with thick Golden Creme notes of roasted hazelnut.',
    price: 140,
    categoryId: 'cat-coffee',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    prepTimeMinutes: 3,
    popular: true,
    modifierGroups: [COMMON_MODIFIERS.ESPRESSO_SHOTS]
  },
  {
    id: 'item-2',
    name: 'Flat White Artisan',
    description: 'Velvety micro-foamed steamed milk poured over double shot espresso.',
    price: 210,
    categoryId: 'cat-coffee',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    prepTimeMinutes: 4,
    popular: true,
    modifierGroups: [COMMON_MODIFIERS.MILK, COMMON_MODIFIERS.SWEETNESS]
  },
  {
    id: 'item-3',
    name: 'Iced Spanish Latte',
    description: 'Signature espresso paired with condensed milk and chilled whole milk over ice.',
    price: 240,
    categoryId: 'cat-coffee',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    prepTimeMinutes: 5,
    popular: true,
    modifierGroups: [COMMON_MODIFIERS.MILK, COMMON_MODIFIERS.SWEETNESS]
  },
  {
    id: 'item-4',
    name: 'Ceremonial Matcha Latte',
    description: 'Organic Japanese ceremonial matcha whisked with creamy steamed milk.',
    price: 260,
    categoryId: 'cat-tea',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    prepTimeMinutes: 5,
    popular: true,
    modifierGroups: [COMMON_MODIFIERS.MILK, COMMON_MODIFIERS.SWEETNESS]
  },
  {
    id: 'item-5',
    name: 'Butter Croissant (Flaky Gold)',
    description: 'Freshly baked French butter croissant with flaky golden crust and tender interior.',
    price: 160,
    categoryId: 'cat-bakery',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    prepTimeMinutes: 2,
    popular: true
  },
  {
    id: 'item-6',
    name: 'Avocado Toast & Poached Egg',
    description: 'Sourdough slice topped with mashed hass avocado, cherry tomatoes, microgreens & chilli flakes.',
    price: 320,
    categoryId: 'cat-savory',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    prepTimeMinutes: 8,
    popular: true
  },
  {
    id: 'item-7',
    name: 'Smoked Chicken Pesto Panini',
    description: 'Grilled ciabatta loaded with smoked chicken breast, house basil pesto & mozzarella.',
    price: 380,
    categoryId: 'cat-savory',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    prepTimeMinutes: 10,
    popular: true
  },
  {
    id: 'item-8',
    name: 'Belgian Chocolate Brownie',
    description: 'Warm fudge chocolate brownie served with dark chocolate drizzle.',
    price: 190,
    categoryId: 'cat-desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    prepTimeMinutes: 3
  },
  {
    id: 'item-9',
    name: 'Fresh Passionfruit Cold Brew',
    description: '18-hour cold brewed arabica steeped with natural passionfruit nectar.',
    price: 230,
    categoryId: 'cat-beverages',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    prepTimeMinutes: 3
  }
]

export const INITIAL_TABLES: CafeTable[] = [
  { id: 'tbl-1', number: 'T-01', seats: 2, status: 'occupied', currentOrderId: 'ord-101', seatedTime: '12 mins ago', guestCount: 2, section: 'Main Floor' },
  { id: 'tbl-2', number: 'T-02', seats: 4, status: 'available', section: 'Main Floor' },
  { id: 'tbl-3', number: 'T-03', seats: 4, status: 'occupied', currentOrderId: 'ord-102', seatedTime: '24 mins ago', guestCount: 3, section: 'Main Floor' },
  { id: 'tbl-4', number: 'T-04', seats: 6, status: 'billing', currentOrderId: 'ord-103', seatedTime: '45 mins ago', guestCount: 5, section: 'Main Floor' },
  { id: 'tbl-5', number: 'T-05', seats: 2, status: 'available', section: 'Patio' },
  { id: 'tbl-6', number: 'T-06', seats: 4, status: 'reserved', seatedTime: 'Reserved for 7:30 PM', section: 'Patio' },
  { id: 'tbl-7', number: 'T-07', seats: 2, status: 'available', section: 'Mezzanine' },
  { id: 'tbl-8', number: 'T-08', seats: 8, status: 'available', section: 'VIP Lounge' }
]

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: '#BE-101',
    type: 'dine-in',
    tableNumber: 'T-01',
    customerName: 'Rahul Sharma',
    items: [
      {
        id: 'oi-1',
        menuItemId: 'item-2',
        name: 'Flat White Artisan',
        price: 210,
        quantity: 2,
        modifiers: [{ groupId: 'mod-milk', groupName: 'Milk Choice', optionId: 'm2', optionName: 'Oat Milk', price: 40 }],
        notes: 'Extra hot please',
        status: 'preparing'
      },
      {
        id: 'oi-2',
        menuItemId: 'item-5',
        name: 'Butter Croissant',
        price: 160,
        quantity: 1,
        status: 'ready'
      }
    ],
    subtotal: 620,
    tax: 31,
    discount: 0,
    total: 651,
    status: 'preparing',
    paymentStatus: 'unpaid',
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString()
  },
  {
    id: 'ord-102',
    orderNumber: '#BE-102',
    type: 'dine-in',
    tableNumber: 'T-03',
    customerName: 'Ananya Gupta',
    items: [
      {
        id: 'oi-3',
        menuItemId: 'item-6',
        name: 'Avocado Toast & Poached Egg',
        price: 320,
        quantity: 2,
        notes: 'Well done egg yolk',
        status: 'preparing'
      },
      {
        id: 'oi-4',
        menuItemId: 'item-3',
        name: 'Iced Spanish Latte',
        price: 240,
        quantity: 2,
        status: 'ready'
      }
    ],
    subtotal: 1120,
    tax: 56,
    discount: 50,
    total: 1126,
    status: 'preparing',
    paymentStatus: 'unpaid',
    createdAt: new Date(Date.now() - 24 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60000).toISOString()
  },
  {
    id: 'ord-103',
    orderNumber: '#BE-103',
    type: 'takeaway',
    customerName: 'Karan Mehra',
    customerPhone: '+91 98765 43210',
    items: [
      {
        id: 'oi-5',
        menuItemId: 'item-7',
        name: 'Smoked Chicken Pesto Panini',
        price: 380,
        quantity: 1,
        status: 'ready'
      },
      {
        id: 'oi-6',
        menuItemId: 'item-4',
        name: 'Ceremonial Matcha Latte',
        price: 260,
        quantity: 1,
        status: 'ready'
      }
    ],
    subtotal: 640,
    tax: 32,
    discount: 0,
    total: 672,
    status: 'ready',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 60000).toISOString()
  }
]

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'Arabica Espresso Coffee Beans', category: 'Coffee', currentStock: 18.5, unit: 'kg', minThreshold: 5.0, costPerUnit: 1200, lastRestocked: '2026-07-28' },
  { id: 'inv-2', name: 'Organic Whole Milk', category: 'Dairy', currentStock: 42.0, unit: 'Liters', minThreshold: 15.0, costPerUnit: 65, lastRestocked: '2026-08-01' },
  { id: 'inv-3', name: 'Oat Milk Barista Edition', category: 'Dairy', currentStock: 12.0, unit: 'Liters', minThreshold: 8.0, costPerUnit: 240, lastRestocked: '2026-07-30' },
  { id: 'inv-4', name: 'Uji Matcha Powder (Grade A)', category: 'Tea', currentStock: 2.2, unit: 'kg', minThreshold: 1.0, costPerUnit: 4500, lastRestocked: '2026-07-20' },
  { id: 'inv-5', name: 'French Butter Croissant Frozen Base', category: 'Bakery', currentStock: 65, unit: 'pieces', minThreshold: 20, costPerUnit: 55, lastRestocked: '2026-07-31' },
  { id: 'inv-6', name: 'Fresh Hass Avocados', category: 'Produce', currentStock: 14, unit: 'kg', minThreshold: 5.0, costPerUnit: 280, lastRestocked: '2026-08-01' }
]

export const INITIAL_STAFF: StaffMember[] = [
  { id: 'st-1', name: 'Basudev (Owner)', role: 'admin', pin: '1234', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', shiftStatus: 'active' },
  { id: 'st-2', name: 'Rohan (Head Barista)', role: 'cashier', pin: '2222', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', shiftStatus: 'active' },
  { id: 'st-3', name: 'Priya (Chef)', role: 'kitchen', pin: '3333', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', shiftStatus: 'active' }
]

export const DEFAULT_SETTINGS: CafeSettings = {
  name: 'BiteEat Cafe',
  tagline: 'Artisan Coffee & Gourmet Bites',
  address: 'Plot 42, Cyber Hub Sector 24, Gurugram, India',
  phone: '+91 98100 12345',
  email: 'hello@biteeatcafe.com',
  gstin: '07AAAAA0000A1Z5',
  taxRatePercent: 5.0,
  currencySymbol: '₹',
  wifiPassword: 'BiteEatCoffee2026',
  receiptFooter: 'Thank you for dining at BiteEat! Visit us again soon ❤️'
}
