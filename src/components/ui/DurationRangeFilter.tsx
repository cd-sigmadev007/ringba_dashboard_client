import React, { useEffect, useState } from 'react'
import { Input } from './Input'
import { useThemeStore } from '@/store/themeStore'
import { cn, useClickOutside } from '@/lib'
import { ChevronDownDark, ChevronDownLight } from '@/assets/svg'

export interface DurationRange {
    min?: number
    max?: number
}

interface DurationRangeFilterProps {
    value?: DurationRange
    onChange?: (range: DurationRange) => void
    className?: string
    filterType?: 'dropdown' | 'raw'
}

export const DurationRangeFilter: React.FC<DurationRangeFilterProps> = ({
    value = {},
    onChange,
    className,
    filterType = 'raw',
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [isOpen, setIsOpen] = useState(false)
    const [tempRange, setTempRange] = useState<DurationRange>(value)

    useEffect(() => {
        setTempRange(value)
    }, [value])

    const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false))

    const styles = {
        trigger: cn(
            'h-10 w-full flex items-center justify-between gap-2.5 px-4 py-[9px]',
            'rounded-[7px] text-xs cursor-pointer border transition-all',
            isDark ? 'bg-[#002B57] text-[#F5F8FA]' : 'bg-white text-[#3F4254]',
            isOpen ? 'border-[#007FFF]' : 'border-transparent',
            'hover:border-[#007FFF]'
        ),
        dropdown: cn(
            'absolute z-50 w-full mt-2 rounded-[7px] border p-[10px]',
            'backdrop-blur-[25px]',
            isDark
                ? 'bg-[#002B57] border-[#002B57] shadow-[0_10px_35px_rgba(0,0,0,0.30)]'
                : 'bg-white border-gray-200 shadow-[0_10px_35px_rgba(55,71,109,0.10)]'
        ),
        label: cn('text-xs mb-1', isDark ? 'text-[#F5F8FA]' : 'text-[#F5F8FA]'),
        inputWrapper: cn(
            'h-[41px] rounded-[7px] flex items-center justify-center',
            isDark ? 'bg-[#132f4c]' : 'bg-white'
        ),
        input: cn(
            'w-full h-full bg-transparent text-center text-xs outline-none placeholder-current',
            isDark ? 'text-[#7E829A]' : 'text-[#7E829A]'
        ),
        applyBtn: cn(
            'w-full h-[39px] rounded-[7px] text-xs font-medium',
            'bg-[#007FFF] text-[#F5F8FA] hover:bg-[#0066CC] transition-colors'
        ),
    }

    const updateRange = (key: 'min' | 'max', v: string) => {
        const val = v === '' ? undefined : parseInt(v, 10)
        setTempRange((prev) => ({ ...prev, [key]: val }))
    }

    const handleApply = () => {
        onChange?.(tempRange)
        setIsOpen(false)
    }

    const getDisplayText = () => {
        const { min, max } = value
        if (min !== undefined && max !== undefined) return `${min}s - ${max}s`
        if (min !== undefined) return `Min: ${min}s`
        if (max !== undefined) return `Max: ${max}s`
        return 'Duration'
    }

    const RangeInputs = (
        <div className="flex gap-4 mb-[10px]">
            <div className="flex-1">
                <label className={styles.label}>Min</label>
                <div className={styles.inputWrapper}>
                    <Input
                        inputSize="sm"
                        placeholder="0s"
                        value={tempRange.min ?? ''}
                        onChange={(e) => updateRange('min', e.target.value)}
                        className={styles.input}
                        min="0"
                    />
                </div>
            </div>

            <div className="flex-1">
                <label className={styles.label}>Max</label>
                <div className={styles.inputWrapper}>
                    <Input
                        type="number"
                        placeholder="3600s"
                        value={tempRange.max ?? ''}
                        onChange={(e) => updateRange('max', e.target.value)}
                        className={styles.input}
                        min="0"
                    />
                </div>
            </div>
        </div>
    )

    if (filterType === 'raw') {
        // In raw mode, only update tempRange (don't call onChange until Apply is clicked)
        return <div className={className}>{RangeInputs}</div>
    }

    return (
        <div ref={dropdownRef} className={cn('relative', className)}>
            <div className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
                <span>{getDisplayText()}</span>

                {isDark ? (
                    <ChevronDownDark
                        className={cn(
                            'w-3 h-3 transition-transform',
                            isOpen && 'rotate-180'
                        )}
                    />
                ) : (
                    <ChevronDownLight
                        className={cn(
                            'w-3 h-3 transition-transform',
                            isOpen && 'rotate-180'
                        )}
                    />
                )}
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    {RangeInputs}

                    <button onClick={handleApply} className={styles.applyBtn}>
                        Apply
                    </button>
                </div>
            )}
        </div>
    )
}
