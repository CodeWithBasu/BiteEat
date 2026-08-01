'use client'

import React, { useState, useEffect } from 'react'
import { MenuItem, SelectedModifier, ModifierOption } from '@/lib/types'
import { X, Plus, Check, MessageSquare } from 'lucide-react'

interface ModifierModalProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (item: MenuItem, selectedModifiers: SelectedModifier[], notes: string) => void
  currencySymbol: string
}

export function ModifierModal({
  item,
  isOpen,
  onClose,
  onConfirm,
  currencySymbol
}: ModifierModalProps) {
  const [selectedMods, setSelectedMods] = useState<Record<string, ModifierOption>>({})
  const [notes, setNotes] = useState<string>('')

  useEffect(() => {
    if (item && item.modifierGroups) {
      // Pre-select defaults (first option of each group)
      const defaults: Record<string, ModifierOption> = {}
      item.modifierGroups.forEach((group) => {
        if (group.options.length > 0) {
          defaults[group.id] = group.options[0]
        }
      })
      setSelectedMods(defaults)
      setNotes('')
    }
  }, [item])

  if (!isOpen || !item) return null

  const handleOptionSelect = (groupId: string, option: ModifierOption) => {
    setSelectedMods((prev) => ({
      ...prev,
      [groupId]: option
    }))
  }

  const calculateTotal = () => {
    let extra = 0
    Object.values(selectedMods).forEach((opt) => {
      extra += opt.price
    })
    return item.price + extra
  }

  const handleAdd = () => {
    const formattedMods: SelectedModifier[] = []
    if (item.modifierGroups) {
      item.modifierGroups.forEach((group) => {
        const selected = selectedMods[group.id]
        if (selected) {
          formattedMods.push({
            groupId: group.id,
            groupName: group.name,
            optionId: selected.id,
            optionName: selected.name,
            price: selected.price
          })
        }
      })
    }
    onConfirm(item, formattedMods, notes)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1C1815] border border-stone-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative h-44 overflow-hidden shrink-0">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1815] via-[#1C1815]/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900/80 text-stone-300 hover:text-white flex items-center justify-center border border-stone-700/50 backdrop-blur"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
              Customize Item
            </span>
            <h3 className="text-xl font-extrabold text-stone-100 mt-1">{item.name}</h3>
            <p className="text-xs text-stone-400 line-clamp-1">{item.description}</p>
          </div>
        </div>

        {/* Content Options */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1">
          {item.modifierGroups && item.modifierGroups.length > 0 ? (
            item.modifierGroups.map((group) => (
              <div key={group.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {group.name}
                  </h4>
                  <span className="text-[10px] text-stone-500 font-medium">Select one</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {group.options.map((option) => {
                    const isSelected = selectedMods[group.id]?.id === option.id
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(group.id, option)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-stone-100 shadow-sm'
                            : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold">{option.name}</div>
                          {option.price > 0 && (
                            <div className="text-[10px] text-amber-400 font-bold mt-0.5">
                              +{currencySymbol}{option.price}
                            </div>
                          )}
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            isSelected
                              ? 'bg-amber-500 border-amber-500 text-stone-950'
                              : 'border-stone-700 bg-stone-950'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-stone-400 italic">No customizable modifiers for this item.</p>
          )}

          {/* Kitchen Special Notes */}
          <div className="space-y-2 pt-2 border-t border-stone-800">
            <label className="flex items-center gap-1.5 text-xs font-bold text-stone-300">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Special Kitchen Instructions</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra hot, less ice, allergy alert..."
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#14110F] border-t border-stone-800 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400">Total Price</span>
            <div className="text-lg font-black text-amber-400">
              {currencySymbol}{calculateTotal()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-400 hover:text-white bg-stone-900 border border-stone-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-amber-500 text-stone-950 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add to Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
