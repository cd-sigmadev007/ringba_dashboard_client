/**
 * FieldSelector.tsx
 * Searchable field picker grouped by source table.
 * Uses a portal + position:fixed so the dropdown is never clipped by
 * overflow:hidden / overflow:auto parent containers.
 */
import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import clsx from 'clsx'
import { useThemeStore } from '@/store/themeStore'
import type { FieldDef } from '../types'
import { SOURCE_LABELS, SOURCE_COLORS } from '../types'

interface Props {
    fields: FieldDef[]
    value: string
    onChange: (key: string) => void
    placeholder?: string
    filterFn?: (f: FieldDef) => boolean
    disabled?: boolean
}

const SOURCE_BADGE_CLASSES: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    teal: 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
}

export const FieldSelector: React.FC<Props> = ({
    fields, value, onChange, placeholder = 'Select field…', filterFn, disabled,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})
    const buttonRef = useRef<HTMLButtonElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Calculate fixed position relative to the trigger button
    const updatePosition = useCallback(() => {
        if (!buttonRef.current) return
        const rect = buttonRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const dropdownHeight = 320 // max expected height
        const openUpward = spaceBelow < dropdownHeight && rect.top > dropdownHeight

        setDropdownStyle({
            position: 'fixed',
            left: rect.left,
            width: Math.max(rect.width, 280),
            zIndex: 9999,
            ...(openUpward
                ? { bottom: window.innerHeight - rect.top + 4 }
                : { top: rect.bottom + 4 }),
        })
    }, [])

    const handleOpen = () => {
        if (disabled) return
        updatePosition()
        setOpen((o) => !o)
        setTimeout(() => inputRef.current?.focus(), 50)
    }

    // Recompute on scroll / resize so it doesn't drift
    useEffect(() => {
        if (!open) return
        const handleScrollOrResize = () => updatePosition()
        window.addEventListener('scroll', handleScrollOrResize, true)
        window.addEventListener('resize', handleScrollOrResize)
        return () => {
            window.removeEventListener('scroll', handleScrollOrResize, true)
            window.removeEventListener('resize', handleScrollOrResize)
        }
    }, [open, updatePosition])

    // Close on outside click
    useEffect(() => {
        if (!open) return
        const handleClick = (e: MouseEvent) => {
            if (
                buttonRef.current?.contains(e.target as Node) ||
                dropdownRef.current?.contains(e.target as Node)
            ) return
            setOpen(false)
            setSearch('')
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [open])

    const filtered = useMemo(() => {
        let list = filterFn ? fields.filter(filterFn) : fields
        if (search.trim()) {
            const q = search.toLowerCase()
            list = list.filter((f) => f.label.toLowerCase().includes(q) || f.key.toLowerCase().includes(q))
        }
        return list
    }, [fields, filterFn, search])

    const grouped = useMemo(() => {
        const m: Record<string, FieldDef[]> = {}
        for (const f of filtered) {
            if (!m[f.source]) m[f.source] = []
            m[f.source].push(f)
        }
        return m
    }, [filtered])

    const selectedDef = fields.find((f) => f.key === value)

    const handleSelect = (key: string) => {
        onChange(key)
        setOpen(false)
        setSearch('')
    }

    const dropdown = open ? (
        <div
            ref={dropdownRef}
            style={dropdownStyle}
            className={clsx(
                'rounded-xl border shadow-2xl overflow-hidden',
                isDark ? 'bg-[#0D2137] border-[#1E3A5F]' : 'bg-white border-gray-200',
            )}
        >
            {/* Search */}
            <div className={clsx('p-2 border-b', isDark ? 'border-[#1E3A5F]' : 'border-gray-100')}>
                <input
                    ref={inputRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search fields…"
                    className={clsx(
                        'w-full rounded-lg px-3 py-1.5 text-sm outline-none border',
                        isDark
                            ? 'bg-[#0A1929] border-[#1E3A5F] text-[#F5F8FA] placeholder:text-[#4A6080]'
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400',
                    )}
                />
            </div>
            {/* List */}
            <div className="max-h-64 overflow-y-auto">
                {Object.entries(grouped).map(([source, sourceFields]) => (
                    <div key={source}>
                        <div className={clsx('px-3 py-1.5 text-xs font-semibold uppercase tracking-wider',
                            isDark ? 'text-[#4A6080]' : 'text-gray-400',
                        )}>
                            {SOURCE_LABELS[source as import('../types').FieldSource] ?? source}
                        </div>
                        {sourceFields.map((f) => (
                            <button
                                key={f.key}
                                type="button"
                                onClick={() => handleSelect(f.key)}
                                className={clsx(
                                    'flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors',
                                    value === f.key
                                        ? isDark ? 'bg-[#007FFF]/20 text-blue-300' : 'bg-blue-50 text-blue-700'
                                        : isDark ? 'hover:bg-[#1E3A5F]/60 text-[#B0C4DE]' : 'hover:bg-gray-50 text-gray-700',
                                )}
                            >
                                <span className={clsx('text-xs px-1 py-0.5 rounded font-medium',
                                    SOURCE_BADGE_CLASSES[SOURCE_COLORS[f.source]]
                                )}>
                                    {f.type}
                                </span>
                                {f.label}
                            </button>
                        ))}
                    </div>
                ))}
                {filtered.length === 0 && (
                    <p className={clsx('px-4 py-6 text-center text-sm', isDark ? 'text-[#4A6080]' : 'text-gray-400')}>
                        No fields match "{search}"
                    </p>
                )}
            </div>
        </div>
    ) : null

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                type="button"
                disabled={disabled}
                onClick={handleOpen}
                className={clsx(
                    'flex items-center justify-between gap-2 w-full rounded-lg px-3 py-2 text-sm border transition-colors',
                    isDark
                        ? 'bg-[#0A1929] border-[#1E3A5F] text-[#F5F8FA] hover:border-[#007FFF]/60'
                        : 'bg-white border-gray-200 text-[#3F4254] hover:border-blue-400',
                    disabled && 'opacity-50 cursor-not-allowed',
                )}
            >
                <span className="truncate">
                    {selectedDef ? (
                        <span className="flex items-center gap-2">
                            <span className={clsx('text-xs px-1.5 py-0.5 rounded font-medium',
                                SOURCE_BADGE_CLASSES[SOURCE_COLORS[selectedDef.source]]
                            )}>
                                {SOURCE_LABELS[selectedDef.source]}
                            </span>
                            {selectedDef.label}
                        </span>
                    ) : (
                        <span className="opacity-50">{placeholder}</span>
                    )}
                </span>
                <svg className={clsx('w-4 h-4 flex-shrink-0 transition-transform', open && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Portal: renders in document.body, escapes all overflow contexts */}
            {typeof document !== 'undefined' && dropdown
                ? ReactDOM.createPortal(dropdown, document.body)
                : null}
        </div>
    )
}
