/**
 * TimeFilter Component
 * Main component for date range filtering with presets and calendar
 */

import React, { useState } from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useClickOutside } from '../../../lib/hooks/useClickOutside'
import { useThemeStore } from '../../../store/themeStore'
import { Calendar } from '../../../assets/svg'
import { Input } from '../Input'
import { Modal } from '../Modal'
import { calculatePresetDateRange, formatDateRange } from './utils'
import { PresetButtons } from './PresetButtons'
import { DatePickerCalendar } from './DatePickerCalendar'
import { ActionButtons } from './ActionButtons'
import type { Preset, TimeFilterProps } from './types'
import type { DateRange, SelectRangeEventHandler } from 'react-day-picker'
import { useIsMobile } from '@/lib'

const TimeFilter: React.FC<TimeFilterProps> = ({ onChange, className }) => {
    const { theme } = useThemeStore()
    const isMobile = useIsMobile()
    const isDark = theme === 'dark'
    const [open, setOpen] = useState(false)
    const [range, setRange] = useState<DateRange | undefined>()
    const [activePreset, setActivePreset] = useState<string | null>(null)

    // Click outside handler for desktop popover only
    const triggerRef = useClickOutside<HTMLDivElement>(() => {
        // Only close on click outside for desktop (when not using mobile modal)
        if (!isMobile) {
            setOpen(false)
        }
    })

    const handlePresetClick = (preset: Preset) => {
        const { from, to } = calculatePresetDateRange(preset)
        setRange({ from, to })
        setActivePreset(preset.label)
        // Immediately apply the change for preset selections
        onChange?.({ from, to })
    }

    const handleSelect: SelectRangeEventHandler = (rng) => {
        setRange(rng)
        setActivePreset('Custom')
    }

    const handleClear = () => {
        setRange(undefined)
        setActivePreset(null)
        onChange?.({ from: undefined, to: undefined })
        setOpen(false)
    }

    const handleDone = () => {
        if (range?.from && range.to) {
            onChange?.({ from: range.from, to: range.to })
        }
        setOpen(false)
    }

    const pickerContent = (
        <>
            <div className="flex flex-col md:flex-row gap-[15px] text-body-xs">
                {/* Presets */}
                <PresetButtons
                    activePreset={activePreset}
                    onPresetClick={handlePresetClick}
                />

                {/* Calendar */}
                <DatePickerCalendar selected={range} onSelect={handleSelect} />
            </div>
            <div className="horizontal-line my-4" />
            <ActionButtons onClear={handleClear} onDone={handleDone} />
        </>
    )

    return (
        <div ref={triggerRef} className={twMerge('relative', className)}>
            <div
                onClick={(e) => {
                    e.stopPropagation()
                    setOpen((prev) => !prev)
                }}
            >
                <Input
                    value={formatDateRange(range)}
                    placeholder="Aug 01, 2024 - Aug 31, 2024"
                    className="cursor-pointer"
                    rightIcon={<Calendar />}
                    readOnly
                />
            </div>

            {/* Desktop popover */}
            {!isMobile && open && (
                <div
                    className={clsx(
                        'absolute z-50 rounded-[7px] max-w-[450px] p-[20px] w-max border flex flex-col gap-[15px] backdrop-blur-[25px] shadow-[0_10px_35px_rgba(0,0,0,0.30)] mt-2',
                        isDark
                            ? 'border-[#002B57] bg-[#071B2FE6] text-neutrals-50'
                            : 'border-gray-200 bg-white text-neutrals-800'
                    )}
                    onClick={(e) => {
                        // Stop propagation to prevent the popover from closing when clicked
                        e.stopPropagation()
                    }}
                >
                    {pickerContent}
                </div>
            )}

            {/* Mobile modal */}
            {isMobile && (
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    title="Select Date Range"
                    size="full"
                    className="h-[60%] w-full flex flex-col"
                    position="bottom"
                    animation="slide"
                    border={false}
                    showCloseButton={true}
                >
                    <div className="flex-1">{pickerContent}</div>
                </Modal>
            )}
        </div>
    )
}

export default TimeFilter
