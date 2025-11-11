import React, { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import clsx from 'clsx'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { twMerge } from 'tailwind-merge'
import { useClickOutside } from '../../lib/hooks/useClickOutside'
import { useThemeStore } from '../../store/themeStore'
import { Calendar, ChevronLeft, ChevronRight } from '../../assets/svg'
import { Input } from './Input'
import Button from './Button'
import { Modal } from './Modal'
import type { DateRange, SelectRangeEventHandler } from 'react-day-picker'
import { cn, useIsMobile } from '@/lib'

// Extend dayjs with timezone support
dayjs.extend(utc)
dayjs.extend(timezone)

// Use EST timezone for date operations to match backend
const EST_TIMEZONE = 'America/New_York'

export interface TimeFilterProps {
    /** Callback fired when the range changes */
    onChange?: (range: { from?: Date; to?: Date }) => void
    className?: string
}

const presets = [
    { label: 'Today', type: 'today' },
    { label: 'Yesterday', type: 'yesterday' },
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 60 days', days: 60 },
    { label: 'Custom', type: 'custom' },
]

const IconRight = () => <ChevronRight />
const IconLeft = () => <ChevronLeft />

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

    const getDisplayValue = () => {
        if (!range?.from) return ''

        // Format dates in EST timezone to match backend
        // Convert Date objects to EST timezone for display
        const fromDate = dayjs(range.from).tz(EST_TIMEZONE)
        const toDate = range.to ? dayjs(range.to).tz(EST_TIMEZONE) : null

        // If to is not set, show only from date
        if (!toDate) {
            return fromDate.format('MMM DD, YYYY')
        }

        // Check if from and to are on the same day (in EST timezone)
        const isSameDay = fromDate.isSame(toDate, 'day')

        if (isSameDay) {
            // Same day: show single date
            return fromDate.format('MMM DD, YYYY')
        } else {
            // Different days: show range
            return `${fromDate.format('MMM DD, YYYY')} - ${toDate.format('MMM DD, YYYY')}`
        }
    }

    const applyPreset = (preset: {
        label: string
        days?: number
        type?: string
    }) => {
        const { label, days, type } = preset
        let from: Date
        let to: Date

        // Get current date/time in EST timezone to match backend
        const nowInEST = dayjs().tz(EST_TIMEZONE)

        if (type === 'today') {
            // Today: from start of today to end of today (in EST)
            from = nowInEST.startOf('day').toDate()
            to = nowInEST.endOf('day').toDate()
        } else if (type === 'yesterday') {
            // Yesterday: from start of yesterday to end of yesterday (in EST)
            const yesterdayInEST = nowInEST.subtract(1, 'day')
            from = yesterdayInEST.startOf('day').toDate()
            to = yesterdayInEST.endOf('day').toDate()
        } else if (days !== undefined && days > 0) {
            // Last N days: from N days ago start (in EST) to today end (in EST)
            from = nowInEST.subtract(days, 'day').startOf('day').toDate()
            to = nowInEST.endOf('day').toDate()
        } else {
            // Custom or fallback - use today in EST
            from = nowInEST.startOf('day').toDate()
            to = nowInEST.endOf('day').toDate()
        }

        setRange({ from, to })
        setActivePreset(label)
        // Immediately apply the change for preset selections
        onChange?.({ from, to })
    }

    const handleSelect: SelectRangeEventHandler = (rng) => {
        setRange(rng)
        setActivePreset('Custom')
    }

    const pickerContent = (
        <>
            <div className="flex flex-col md:flex-row gap-[15px] text-body-xs">
                {/* Presets */}
                <ul className="flex flex-col gap-[5px] basis-[150px] flex-[2_0_0]">
                    {presets.map((p) => (
                        <li key={p.label}>
                            <Button
                                variant={'ghost'}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    applyPreset(p)
                                }}
                                className={cn(
                                    '!py-[7px] !px-[10px] border-none w-full text-start hover:bg-[#132F4C]',
                                    activePreset === p.label
                                        ? 'bg-[#132F4C]'
                                        : ''
                                )}
                            >
                                {p.label}
                            </Button>
                        </li>
                    ))}
                </ul>

                {/* Calendar */}
                <div className={cn('p-0')}>
                    <DayPicker
                        mode="range"
                        selected={range}
                        onSelect={handleSelect}
                        className="rdp no-focus"
                        components={{
                            Chevron: ({ orientation }) =>
                                orientation === 'left' ? (
                                    <IconLeft />
                                ) : (
                                    <IconRight />
                                ),
                        }}
                        captionLayout="dropdown-years"
                        startMonth={dayjs().subtract(25, 'year').toDate()}
                        endMonth={dayjs().toDate()}
                    />
                </div>
            </div>
            <div className="horizontal-line my-4" />
            <div
                className={cn(
                    'flex justify-between gap-2',
                    isMobile && 'flex w-full justify-between gap-2'
                )}
            >
                <Button
                    className={isMobile ? 'w-full' : ''}
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation()
                        setRange(undefined)
                        setActivePreset(null)
                        onChange?.({ from: undefined, to: undefined })
                        setOpen(false)
                    }}
                >
                    Clear
                </Button>
                <Button
                    className={isMobile ? 'w-full' : ''}
                    variant="primary"
                    onClick={(e) => {
                        e.stopPropagation()
                        if (range?.from && range.to) {
                            onChange?.({ from: range.from, to: range.to })
                        }
                        setOpen(false)
                    }}
                >
                    Done
                </Button>
            </div>
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
                    value={getDisplayValue()}
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
