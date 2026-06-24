'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Plus, Check } from 'lucide-react'

interface SearchableComboboxProps {
  name: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  required?: boolean
  label?: string
}

export default function SearchableCombobox({
  name,
  value,
  onChange,
  options,
  placeholder = 'Search or type to add new...',
  required = false,
}: SearchableComboboxProps) {
  const [query, setQuery] = useState(value || '')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync internal query when external value changes (e.g. on profile load)
  useEffect(() => {
    setQuery(value || '')
  }, [value])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        // If user blurred with a custom value, commit it
        if (query.trim() && query !== value) {
          onChange(query.trim())
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [query, value, onChange])

  const filtered = query.trim() === ''
    ? options
    : options.filter(o => o.toLowerCase().includes(query.toLowerCase()))

  const isNewValue = query.trim() !== '' && !options.some(
    o => o.toLowerCase() === query.trim().toLowerCase()
  )

  const handleSelect = useCallback((option: string) => {
    setQuery(option)
    onChange(option)
    setIsOpen(false)
  }, [onChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    onChange(e.target.value) // live update so form validation works
    setIsOpen(true)
  }

  const handleAddNew = () => {
    const trimmed = query.trim()
    if (trimmed) {
      onChange(trimmed)
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input to carry the name/value for form submission */}
      <input type="hidden" name={name} value={value} required={required} />

      {/* Visible search input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-10 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white placeholder-slate-500 outline-none"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => { setIsOpen(prev => !prev); inputRef.current?.focus() }}
          className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-yellow-500 transition-colors"
          tabIndex={-1}
          aria-label="Toggle dropdown"
        >
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          <ul className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
            {/* "Add new" option at the top when typed value is not in list */}
            {isNewValue && (
              <li>
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-yellow-400 hover:bg-yellow-500/10 transition-colors text-left border-b border-white/5"
                >
                  <Plus size={14} className="shrink-0" />
                  <span>Add &ldquo;<strong>{query.trim()}</strong>&rdquo; as new MDA</span>
                </button>
              </li>
            )}

            {/* Filtered options */}
            {filtered.length > 0 ? (
              filtered.map(option => (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors text-left ${
                      value === option
                        ? 'bg-yellow-500/15 text-yellow-400'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {option}
                    {value === option && <Check size={14} className="shrink-0 text-yellow-400" />}
                  </button>
                </li>
              ))
            ) : (
              !isNewValue && (
                <li className="px-4 py-3 text-sm text-slate-500 italic">No matches found</li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
