'use client'

import React, { useState } from 'react'
import { MenuItem, Category, CafeSettings } from '@/lib/types'
import { Plus, Search, Edit3, Trash2, CheckCircle2, XCircle, SlidersHorizontal, Image as ImageIcon } from 'lucide-react'

interface MenuManagementProps {
  categories: Category[]
  menuItems: MenuItem[]
  toggleMenuItemStock: (id: string) => void
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void
  settings: CafeSettings
}

export function MenuManagement({
  categories,
  menuItems,
  toggleMenuItemStock,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  settings
}: MenuManagementProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: categories[0]?.id || 'cat-coffee',
    image: '',
    prepTimeMinutes: '5',
    inStock: true
  })

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const openAddModal = () => {
    setFormData({
      name: '',
      description: '',
      price: '180',
      categoryId: categories[0]?.id || 'cat-coffee',
      image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
      prepTimeMinutes: '5',
      inStock: true
    })
    setEditingItem(null)
    setIsAddOpen(true)
  }

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      categoryId: item.categoryId,
      image: item.image,
      prepTimeMinutes: item.prepTimeMinutes.toString(),
      inStock: item.inStock
    })
    setIsAddOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price) return

    const itemPayload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      categoryId: formData.categoryId,
      image: formData.image || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
      prepTimeMinutes: parseInt(formData.prepTimeMinutes) || 5,
      inStock: formData.inStock
    }

    if (editingItem) {
      updateMenuItem(editingItem.id, itemPayload)
    } else {
      addMenuItem(itemPayload)
    }

    setIsAddOpen(false)
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#181412] p-4 rounded-2xl border border-stone-800">
        <div>
          <h2 className="text-lg font-black text-stone-100">Cafe Menu Catalog</h2>
          <p className="text-xs text-stone-400">Manage menu items, prices, categories, and stock availability</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#181412] p-3 rounded-2xl border border-stone-800">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog items..."
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-stone-950 font-black'
                : 'bg-stone-900 text-stone-400 border border-stone-800'
            }`}
          >
            All ({menuItems.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : 'bg-stone-900 text-stone-400 border border-stone-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const categoryName = categories.find((c) => c.id === item.categoryId)?.name || 'General'
          return (
            <div
              key={item.id}
              className="bg-[#181412] rounded-2xl border border-stone-800 p-4 space-y-3 flex items-start gap-3"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover border border-stone-800 shrink-0"
              />

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-extrabold text-sm text-stone-100 line-clamp-1">{item.name}</h3>
                  <span className="font-mono font-black text-amber-400 text-sm shrink-0 ml-2">
                    {settings.currencySymbol}{item.price}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px]">
                  <span className="bg-stone-900 text-stone-400 px-2 py-0.5 rounded border border-stone-800 font-semibold">
                    {categoryName}
                  </span>
                  <span className="text-stone-500 font-mono">{item.prepTimeMinutes} min prep</span>
                </div>

                <p className="text-[11px] text-stone-400 line-clamp-1">{item.description}</p>

                {/* Stock Toggle & Actions */}
                <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
                  <button
                    onClick={() => toggleMenuItemStock(item.id)}
                    className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg border transition-all ${
                      item.inStock
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}
                  >
                    {item.inStock ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Out of Stock
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${item.name}?`)) deleteMenuItem(item.id)
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add / Edit Item Dialog */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1C1815] border border-stone-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-stone-100">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-400">Item Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 mt-1 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-400">Price ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold mt-1 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-400">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 mt-1 focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-400">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 mt-1 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-stone-400">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 mt-1 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 bg-stone-900 border border-stone-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-stone-950 bg-amber-500 hover:bg-amber-400 font-extrabold"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
