/**
 * Date Utilities
 * Utility functions for parsing and formatting dates
 */

import dayjs from 'dayjs'

/**
 * Parses lastCall date string and returns formatted date and time
 * Handles formats like "Oct 30, 10:21:06 PM ET" or "Nov 07, 2025, 08:08:30 PM ET"
 * @param lastCall - Date string in various formats
 * @returns Object with date and time strings, or default values if parsing fails
 */
export function parseLastCallDateAndTime(lastCall: string | null | undefined): {
    date: string
    time: string
} {
    let dateStr = 'Unknown Date'
    let timeStr = ''
    let parsedDate: dayjs.Dayjs | null = null

    if (!lastCall) {
        return { date: dateStr, time: timeStr }
    }

    try {
        // Try parsing formats like "Oct 30, 10:21:06 PM ET" or "Nov 07, 2025, 08:08:30 PM ET"
        // Remove " ET" suffix and parse
        const cleanLastCall = lastCall.replace(/\s+ET$/, '').trim()

        // Check if the string contains a 4-digit year (YYYY)
        const hasYear = /\b(19|20)\d{2}\b/.test(cleanLastCall)
        const currentYear = new Date().getFullYear()

        // If no year is present, add current year before parsing
        let dateToParse = cleanLastCall
        if (!hasYear) {
            // Insert year after the date part (e.g., "Nov 15, 10:21:06 PM" -> "Nov 15, 2025, 10:21:06 PM")
            const parts = cleanLastCall.split(',')
            if (parts.length >= 2) {
                const datePart = parts[0].trim() // "Nov 15"
                const rest = parts.slice(1).join(',').trim() // "10:21:06 PM"
                dateToParse = `${datePart}, ${currentYear}, ${rest}`
            }
        }

        // Try parsing with dayjs (handles various formats)
        parsedDate = dayjs(
            dateToParse,
            [
                'MMM DD, YYYY, hh:mm:ss A',
                'MMM DD, hh:mm:ss A',
                'MMM DD, YYYY, h:mm:ss A',
                'MMM DD, h:mm:ss A',
                'MMM D, YYYY, hh:mm:ss A',
                'MMM D, hh:mm:ss A',
                'MMM D, YYYY, h:mm:ss A',
                'MMM D, h:mm:ss A',
            ],
            true
        )

        if (parsedDate.isValid()) {
            // Format date as "Nov 07, 2025"
            dateStr = parsedDate.format('MMM DD, YYYY')
            // Format time as "08:08:30 PM ET"
            timeStr = parsedDate.format('hh:mm:ss A') + ' ET'
        } else {
            // Fallback: try to extract date and time manually
            const parts = cleanLastCall.split(',')
            if (parts.length >= 2) {
                const datePart = parts[0].trim() // "Oct 30" or "Nov 07"
                const timePart = parts[parts.length - 1].trim() // "10:21:06 PM"

                // Try to parse date part with current year (reuse variable from upper scope)
                const dateWithYear = `${datePart}, ${currentYear}`
                parsedDate = dayjs(dateWithYear, 'MMM DD, YYYY', true)

                if (parsedDate.isValid()) {
                    dateStr = parsedDate.format('MMM DD, YYYY')
                    timeStr = timePart + ' ET'
                } else {
                    // Last resort: use original string
                    dateStr = lastCall
                    timeStr = ''
                }
            } else {
                dateStr = lastCall
                timeStr = ''
            }
        }
    } catch (error) {
        console.error('Error parsing lastCall:', lastCall, error)
        dateStr = lastCall || 'Unknown Date'
        timeStr = ''
    }

    return { date: dateStr, time: timeStr }
}
