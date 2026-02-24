/**
 * VizSelect.tsx
 * Portal-aware custom select for the visualizer module.
 * Matches the existing FilterSelect/FormSelect design tokens.
 * Renders the dropdown via ReactDOM.createPortal so it is never
 * clipped by an overflow:auto/hidden parent.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import clsx from 'clsx'
import { useThemeStore } from '@/store/themeStore'
import { ChevronDownDark, ChevronDownLight } from '@/assets/svg'

export interface VizSelectOption {
    label: string
    value: string
    disabled?: boolean
}

interface Props {
    options: Array<VizSelectOption>
    value: string
    onChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
    className?: string
}

export const VizSelect: React.FC<Props> = ({
    options,
    value,
    onChange,
    placeholder = 'Select…',
    disabled,
    className,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const [open, setOpen] = useState(false)
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})
    const triggerRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const selectedLabel =
        options.find((o) => o.value === value)?.label ?? placeholder

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return
        const rect = triggerRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const dropdownMaxH = 240
        const openUpward = spaceBelow < dropdownMaxH && rect.top > dropdownMaxH

        setDropdownStyle({
            position: 'fixed',
            left: rect.left,
            width: rect.width,
            zIndex: 9999,
            ...(openUpward
                ? { bottom: window.innerHeight - rect.top + 4 }
                : { top: rect.bottom + 4 }),
        })
    }, [])

    const handleToggle = () => {
        if (disabled) return
        updatePosition()
        setOpen((o) => !o)
    }

    // Reposition on scroll / resize
    useEffect(() => {
        if (!open) return
        const update = () => updatePosition()
        window.addEventListener('scroll', update, true)
        window.addEventListener('resize', update)
        return () => {
            window.removeEventListener('scroll', update, true)
            window.removeEventListener('resize', update)
        }
    }, [open, updatePosition])

    // Outside click → close
    useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            if (
                triggerRef.current?.contains(e.target as Node) ||
                dropdownRef.current?.contains(e.target as Node)
            )
                return
            setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])

    // Trigger styles matching FieldSelector exactly
    const triggerBg = isDark ? 'bg-[#0A1929]' : 'bg-white'
    const triggerText = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const triggerBorder = open
        ? 'border-[#007FFF]/80'
        : isDark
          ? 'border-[#1E3A5F] hover:border-[#007FFF]/60'
          : 'border-gray-200 hover:border-blue-400'

    // Dropdown styles
    const dropdownBg = isDark ? 'bg-[#0D2137]' : 'bg-white'
    const dropdownShadow = isDark
        ? 'shadow-[0_10px_35px_rgba(0,0,0,0.40)]'
        : 'shadow-[0_10px_35px_rgba(55,71,109,0.10)]'
    const optionText = isDark ? 'text-[#B0C4DE]' : 'text-[#3F4254]'
    const optionHover = isDark ? 'hover:bg-[#1E3A5F]/60' : 'hover:bg-[#F5F8FA]'
    const optionSelected = isDark
        ? 'bg-[#007FFF]/20 text-blue-300'
        : 'bg-[#E3F2FD] text-blue-700'

    const dropdown = open ? (
        <div
            ref={dropdownRef}
            style={dropdownStyle}
            className={clsx(
                'rounded-[7px] backdrop-blur-[25px] overflow-hidden',
                dropdownBg,
                dropdownShadow
            )}
        >
            <ul className="flex flex-col gap-y-1 max-h-60 overflow-y-auto custom-scroll text-xs p-2.5">
                {options.map((opt) => (
                    <li
                        key={opt.value}
                        onClick={() => {
                            if (opt.disabled) return
                            onChange(opt.value)
                            setOpen(false)
                        }}
                        className={clsx(
                            'flex items-center gap-x-2.5 p-2 rounded-[7px] cursor-pointer transition-colors',
                            opt.disabled
                                ? 'opacity-40 cursor-not-allowed'
                                : optionHover,
                            opt.value === value ? optionSelected : '',
                            optionText
                        )}
                    >
                        <span className="flex-1">{opt.label}</span>
                        {opt.value === value && (
                            <svg
                                className="w-3.5 h-3.5 text-blue-400 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    ) : null

    return (
        <div className={clsx('relative w-full font-medium', className)}>
            <div
                ref={triggerRef}
                onClick={handleToggle}
                className={clsx(
                    'h-10 cursor-pointer w-full flex gap-x-2.5 justify-between items-center py-[9px] text-xs px-[16px] rounded-[7px] border transition-all duration-200',
                    triggerBg,
                    triggerText,
                    triggerBorder,
                    disabled &&
                        'opacity-50 cursor-not-allowed pointer-events-none'
                )}
            >
                <span className="truncate">{selectedLabel}</span>
                {isDark ? (
                    <ChevronDownDark
                        className={clsx(
                            'transition-transform duration-200 flex-shrink-0',
                            open && 'rotate-180'
                        )}
                    />
                ) : (
                    <ChevronDownLight
                        className={clsx(
                            'transition-transform duration-200 flex-shrink-0',
                            open && 'rotate-180'
                        )}
                    />
                )}
            </div>

            {typeof document !== 'undefined' && dropdown
                ? ReactDOM.createPortal(dropdown, document.body)
                : null}
        </div>
    )
}
