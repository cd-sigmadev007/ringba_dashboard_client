/**
 * DatePickerCalendar Component
 * Renders the react-day-picker calendar component
 */

import React from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import dayjs from 'dayjs'
import type { DateRange, SelectRangeEventHandler } from 'react-day-picker'
import { ChevronLeft, ChevronRight } from '../../../assets/svg'
import { cn } from '@/lib'
import { EST_TIMEZONE } from './constants'

interface DatePickerCalendarProps {
    selected: DateRange | undefined
    onSelect: SelectRangeEventHandler
}

const IconRight = () => <ChevronRight />
const IconLeft = () => <ChevronLeft />

export const DatePickerCalendar: React.FC<DatePickerCalendarProps> = ({
    selected,
    onSelect,
}) => {
    return (
        <div className={cn('p-0')}>
            <DayPicker
                mode="range"
                timeZone={EST_TIMEZONE}
                selected={selected}
                onSelect={onSelect}
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
    )
}

