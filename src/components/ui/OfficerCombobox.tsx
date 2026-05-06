import { useState, useRef, useEffect } from 'react'
import { Search, X, ChevronDown, Check } from 'lucide-react'

interface Officer {
  id: string
  full_name: string
}

interface OfficerComboboxProps {
  officers: Officer[]
  value: string
  onChange: (officerId: string) => void
  placeholder?: string
}

export default function OfficerCombobox({ officers, value, onChange, placeholder = "-- Select Officer --" }: OfficerComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOfficer = officers.find(o => o.id === value)

  const filteredOfficers = officers.filter(o => 
    o.full_name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (id: string) => {
    onChange(id)
    setIsOpen(false)
    setSearch('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setSearch('')
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-left hover:bg-white/10"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedOfficer ? (
            <>
              <Search size={14} className="text-yellow-500 shrink-0" />
              <span className="text-white font-medium truncate">{selectedOfficer.full_name}</span>
            </>
          ) : (
            <span className="text-slate-500 truncate">{placeholder}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          {selectedOfficer && (
            <button
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors"
              title="Clear selection"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search Input */}
          <div className="p-2 border-b border-white/5">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-slate-400" />
              <input
                type="text"
                className="w-full pl-9 pr-8 py-2 bg-white/5 border border-transparent focus:border-yellow-500/50 focus:bg-white/10 rounded-lg text-sm text-white placeholder-slate-500 outline-none transition-all"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
            {filteredOfficers.length === 0 ? (
              <p className="p-4 text-center text-sm text-slate-500">No officers found.</p>
            ) : (
              filteredOfficers.map((officer) => {
                const isSelected = officer.id === value
                return (
                  <button
                    key={officer.id}
                    onClick={() => handleSelect(officer.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                      isSelected
                        ? 'bg-yellow-500/10 text-yellow-500 font-bold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-4">{officer.full_name}</span>
                    {isSelected && <Check size={14} className="shrink-0" />}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
