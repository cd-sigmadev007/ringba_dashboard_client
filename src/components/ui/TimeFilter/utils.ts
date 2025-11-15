/**
 * TimeFilter Utilities
 * Utility functions for date formatting and preset calculations
 */

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { EST_TIMEZONE } from './constants'
import type { DateRange, Preset } from './types'

// Extend dayjs with timezone support
dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Format date range for display in EST timezone
 * @param range - Date range from react-day-picker
 * @returns Formatted date string for display
 */
export function formatDateRange(range: DateRange | undefined): string {
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

/**
 * Calculate date range from preset selection
 * @param preset - Preset configuration
 * @returns Object with from and to dates in EST timezone
 */
export function calculatePresetDateRange(preset: Preset): {
    from: Date
    to: Date
} {
    // Get current date/time in EST timezone to match backend
    const nowInEST = dayjs().tz(EST_TIMEZONE)
    let from: Date
    let to: Date

    if (preset.type === 'today') {
        // Today: from start of today to end of today (in EST)
        from = nowInEST.startOf('day').toDate()
        to = nowInEST.endOf('day').toDate()
    } else if (preset.type === 'yesterday') {
        // Yesterday: from start of yesterday to end of yesterday (in EST)
        const yesterdayInEST = nowInEST.subtract(1, 'day')
        from = yesterdayInEST.startOf('day').toDate()
        to = yesterdayInEST.endOf('day').toDate()
    } else if (preset.days !== undefined && preset.days > 0) {
        // Last N days: from N days ago start (in EST) to today end (in EST)
        from = nowInEST.subtract(preset.days, 'day').startOf('day').toDate()
        to = nowInEST.endOf('day').toDate()
    } else {
        // Custom or fallback - use today in EST
        from = nowInEST.startOf('day').toDate()
        to = nowInEST.endOf('day').toDate()
    }

    return { from, to }
}
