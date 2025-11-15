import type { DurationRange } from '@/components'

// Helper function to parse duration string to seconds
// Handles both "Xm Ys" format and seconds string/number
export const parseDuration = (duration: string | number): number => {
    if (typeof duration === 'number') {
        return duration
    }

    if (!duration) return 0

    // Try to parse as "Xm Ys" format first
    const match = duration.match(/(\d+)m\s+(\d+)s/)
    if (match) {
        return parseInt(match[1]) * 60 + parseInt(match[2])
    }

    // If not in "Xm Ys" format, try parsing as seconds string
    const seconds = parseFloat(duration)
    if (!isNaN(seconds)) {
        return seconds
    }

    return 0
}

// Campaign filter matching logic
export const matchesCampaignFilter = (
    campaign: string,
    filters: Array<string>
): boolean => {
    if (filters.length === 0) return true

    // For multiple filters, check if campaign matches any of the selected filters
    return filters.some((filter) => {
        // Handle special combinations
        if (filter.includes(',')) {
            const filterParts = filter.split(',').map((part) => part.trim())
            // For combinations, check if campaign contains all specified parts
            return filterParts.every((part) => campaign.includes(part))
        }

        // For single filters, check if campaign contains the part
        return campaign.includes(filter.trim())
    })
}

// Status filter matching logic
export const matchesStatusFilter = (
    status: Array<string>,
    filters: Array<string>
): boolean => {
    if (filters.length === 0) return true
    return filters.some((filter) => status.includes(filter))
}

// Duration filter matching logic (legacy)
export const matchesDurationFilter = (
    duration: string,
    filter: string
): boolean => {
    if (filter === 'all') return true

    const seconds = parseDuration(duration)

    switch (filter) {
        case 'short':
            return seconds < 60
        case 'medium':
            return seconds >= 60 && seconds < 180
        case 'long':
            return seconds >= 180 && seconds < 300
        case 'very-long':
            return seconds >= 300
        default:
            return true
    }
}

// Duration range filter matching logic
export const matchesDurationRange = (
    duration: string,
    range: DurationRange
): boolean => {
    if (!range.min && !range.max) return true

    const seconds = parseDuration(duration)

    if (range.min !== undefined && seconds < range.min) {
        return false
    }

    if (range.max !== undefined && seconds > range.max) {
        return false
    }

    return true
}

// Search query matching logic - caller ID only (partial matching handled by backend)
// This function is kept for client-side filtering fallback, but search should primarily be done via API
export const matchesSearchQuery = (
    callerId: string,
    searchQuery: string
): boolean => {
    if (!searchQuery.trim()) return true

    // Remove non-digit characters for phone number matching
    const cleanQuery = searchQuery.replace(/\D/g, '')
    if (cleanQuery.length === 0) return true

    const cleanCallerId = callerId.replace(/\D/g, '')

    // Partial match: check if caller ID contains the search query
    return cleanCallerId.includes(cleanQuery)
}
