/**
 * Duration Range Filter component with Min/Max inputs
 */

import React, { useEffect, useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { cn, useClickOutside } from '@/lib'
import { ChevronDownDark, ChevronDownLight } from '@/assets/svg'

export interface DurationRange {
    min?: number // in seconds
    max?: number // in seconds
}

interface DurationRangeFilterProps {
    /**
     * Current duration range
     */
    value?: DurationRange
    /**
     * Callback when duration range changes
     */
    onChange?: (range: DurationRange) => void
    /**
     * Custom className for the component
     */
    className?: string
}

/**
 * Duration Range Filter component
 * Allows users to set minimum and maximum duration values in seconds
 */
export const DurationRangeFilter: React.FC<DurationRangeFilterProps> = ({
    value = {},
    onChange,
    className,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [isOpen, setIsOpen] = useState(false)
    const [tempRange, setTempRange] = useState<DurationRange>(value)

    // Sync tempRange with value prop changes
    useEffect(() => {
        setTempRange(value)
    }, [value])

    // Click outside to close dropdown
    const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false))

    // Color definitions matching FilterSelect
    const triggerBg = isDark ? 'bg-[#001E3C]' : 'bg-white'
    const triggerText = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const triggerBorderOpen = isDark ? 'border-[#007FFF]' : 'border-[#007FFF]'
    const triggerBorderClosed = 'border-transparent'
    const triggerHover = isDark
        ? 'hover:border-[#007FFF]'
        : 'hover:border-[#007FFF]'

    const dropdownBg = isDark ? 'bg-[#002B57]' : 'bg-white'
    const dropdownBorder = isDark ? 'border-[#002B57]' : 'border-gray-200'
    const dropdownShadow = isDark
        ? 'shadow-[0_10px_35px_rgba(0,0,0,0.30)]'
        : 'shadow-[0_10px_35px_rgba(55,71,109,0.10)]'

    const inputBg = isDark ? 'bg-[#001E3C]' : 'bg-white'
    const inputText = isDark ? 'text-[#7E829A]' : 'text-[#7E829A]'
    const labelText = isDark ? 'text-[#F5F8FA]' : 'text-[#F5F8FA]'

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const minValue =
            e.target.value === '' ? undefined : parseInt(e.target.value, 10)
        setTempRange((prev) => ({ ...prev, min: minValue }))
    }

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maxValue =
            e.target.value === '' ? undefined : parseInt(e.target.value, 10)
        setTempRange((prev) => ({ ...prev, max: maxValue }))
    }

    const handleApply = () => {
        onChange?.(tempRange)
        setIsOpen(false)
    }

    const getDisplayText = () => {
        if (value.min !== undefined && value.max !== undefined) {
            return `${value.min}s - ${value.max}s`
        }
        if (value.min !== undefined) {
            return `Min: ${value.min}s`
        }
        if (value.max !== undefined) {
            return `Max: ${value.max}s`
        }
        return 'Duration'
    }

    return (
        <div ref={dropdownRef} className={cn('relative', className)}>
            {/* Trigger Button */}
            <div
                className={cn(
                    'h-10 cursor-pointer w-full flex gap-x-2.5 justify-between items-center py-[9px] text-xs px-[16px] rounded-[7px] border transition-all duration-200',
                    triggerBg,
                    triggerText,
                    isOpen ? triggerBorderOpen : triggerBorderClosed,
                    triggerHover
                )}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span>{getDisplayText()}</span>
                {isDark ? (
                    <ChevronDownDark
                        className={cn(
                            'w-3 h-3 transition-transform duration-200',
                            isOpen ? 'rotate-180' : ''
                        )}
                    />
                ) : (
                    <ChevronDownLight
                        className={cn(
                            'w-3 h-3 transition-transform duration-200',
                            isOpen ? 'rotate-180' : ''
                        )}
                    />
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className={cn(
                        'absolute z-50 rounded-[7px] p-[10px] w-full mt-2 backdrop-blur-[25px]',
                        dropdownBg,
                        dropdownBorder,
                        dropdownShadow,
                        'border'
                    )}
                >
                    {/* Min/Max Inputs */}
                    <div className="flex gap-4 mb-[10px]">
                        {/* Min Duration */}
                        <div className="flex-1">
                            <label
                                className={cn('text-xs block mb-1', labelText)}
                            >
                                Min
                            </label>
                            <div
                                className={cn(
                                    'h-[41px] rounded-[7px] flex items-center justify-center',
                                    inputBg
                                )}
                            >
                                <input
                                    type="number"
                                    placeholder="0s"
                                    value={tempRange.min ?? ''}
                                    onChange={handleMinChange}
                                    className={cn(
                                        'w-full h-full bg-transparent text-center text-xs outline-none placeholder-current',
                                        inputText
                                    )}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Max Duration */}
                        <div className="flex-1">
                            <label
                                className={cn('text-xs block mb-1', labelText)}
                            >
                                Max
                            </label>
                            <div
                                className={cn(
                                    'h-[41px] rounded-[7px] flex items-center justify-center',
                                    inputBg
                                )}
                            >
                                <input
                                    type="number"
                                    placeholder="3600s"
                                    value={tempRange.max ?? ''}
                                    onChange={handleMaxChange}
                                    className={cn(
                                        'w-full h-full bg-transparent text-center text-xs outline-none placeholder-current',
                                        inputText
                                    )}
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Apply Button */}
                    <button
                        onClick={handleApply}
                        className={cn(
                            'w-full h-[39px] rounded-[7px] bg-[#007FFF] text-[#F5F8FA] text-xs font-medium',
                            'hover:bg-[#0066CC] transition-colors duration-200'
                        )}
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    )
}
