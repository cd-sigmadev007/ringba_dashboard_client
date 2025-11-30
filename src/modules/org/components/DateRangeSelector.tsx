/**
 * DateRangeSelector Component
 * Date range picker with calendar icon
 */

import React from 'react'
import clsx from 'clsx'
import type { DateRange, SelectRangeEventHandler } from 'react-day-picker'
import type { Preset } from '@/components/ui/TimeFilter/types'
import { Calendar } from '@/assets/svg'
import { DatePickerCalendar } from '@/components/ui/TimeFilter/DatePickerCalendar'
import { PresetButtons } from '@/components/ui/TimeFilter/PresetButtons'
import { ActionButtons } from '@/components/ui/TimeFilter/ActionButtons'
import { formatDateRange } from '@/components/ui/TimeFilter/utils'

interface DateRangeSelectorProps {
    dateRange: DateRange | undefined
    isFullAccess: boolean
    isDark: boolean
    showDatePicker: boolean
    activePreset: string | null
    tempDateRange: DateRange | undefined
    datePickerRef: React.RefObject<HTMLDivElement | null>
    onOpenDatePicker: () => void
    onPresetClick: (preset: Preset) => void
    onDateSelect: SelectRangeEventHandler
    onClearDateRange: () => void
    onDoneDateRange: () => void
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
    dateRange,
    isFullAccess,
    isDark,
    showDatePicker,
    activePreset,
    tempDateRange,
    datePickerRef,
    onOpenDatePicker,
    onPresetClick,
    onDateSelect,
    onClearDateRange,
    onDoneDateRange,
}) => {
    if (isFullAccess) return null

    return (
        <div ref={datePickerRef} className="relative flex items-center gap-2">
            <div
                className={clsx(
                    'flex-1 px-3 py-2 rounded border text-sm',
                    isDark
                        ? 'border-[#1B456F] bg-transparent text-[#F5F8FA]'
                        : 'border-[#E1E5E9] bg-white text-[#3F4254]'
                )}
            >
                {dateRange && dateRange.from && dateRange.to
                    ? formatDateRange(dateRange)
                    : 'No date range selected'}
            </div>
            <button
                type="button"
                onClick={onOpenDatePicker}
                className={clsx(
                    'p-2 rounded border transition-colors',
                    isDark
                        ? 'border-[#1B456F] hover:bg-[#1B456F] text-[#F5F8FA]'
                        : 'border-[#E1E5E9] hover:bg-[#E1E5E9] text-[#3F4254]'
                )}
                title="Select date range"
            >
                <Calendar className="w-4 h-4" />
            </button>
            {showDatePicker && (
                <div
                    className={clsx(
                        'absolute top-full right-0 z-50 mt-2 rounded-[7px] max-w-[450px] p-[20px] w-max border flex flex-col gap-[15px] backdrop-blur-[25px] shadow-[0_10px_35px_rgba(0,0,0,0.30)]',
                        isDark
                            ? 'border-[#002B57] bg-[#071B2FE6] text-neutrals-50'
                            : 'border-gray-200 bg-white text-neutrals-800'
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col md:flex-row gap-[15px] text-body-xs">
                        <PresetButtons
                            activePreset={activePreset}
                            onPresetClick={onPresetClick}
                        />
                        <DatePickerCalendar
                            selected={tempDateRange}
                            onSelect={onDateSelect}
                        />
                    </div>
                    <div className="horizontal-line my-4" />
                    <ActionButtons
                        onClear={onClearDateRange}
                        onDone={onDoneDateRange}
                    />
                </div>
            )}
        </div>
    )
}
