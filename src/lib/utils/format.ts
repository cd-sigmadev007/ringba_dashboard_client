/**
 * Formatting utilities for common data transformations
 */

/**
 * Formats a wallet address for display
 * @param address - The wallet address
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 4)
 * @returns Formatted address string
 */
export function formatAddress(
    address: string,
    startChars: number = 6,
    endChars: number = 4
): string {
    if (!address) return ''
    if (address.length <= startChars + endChars) return address

    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

/**
 * Formats a number with proper decimal places
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 2)
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted number string
 */
export function formatNumber(
    value: number,
    decimals: number = 2,
    locale: string = 'en-US'
): string {
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value)
}

/**
 * Formats a currency value
 * @param value - Amount to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
    value: number,
    currency: string = 'USD',
    locale: string = 'en-US'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(value)
}

/**
 * Formats a date for display
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    },
    locale: string = 'en-US'
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat(locale, options).format(dateObj)
}

/**
 * Formats a relative time (e.g., "2 hours ago")
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
    date: Date | string,
    locale: string = 'en-US'
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

    if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, 'second')
    } else if (diffInSeconds < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
    } else if (diffInSeconds < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
    } else if (diffInSeconds < 2592000) {
        return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
    } else if (diffInSeconds < 31536000) {
        return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month')
    } else {
        return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year')
    }
}

/**
 * Capitalizes the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Converts a string to title case
 * @param str - String to convert
 * @returns Title case string
 */
export function toTitleCase(str: string): string {
    return str
        .split(' ')
        .map((word) => capitalize(word))
        .join(' ')
}

/**
 * Truncates text to a specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to append (default: '...')
 * @returns Truncated text
 */
export function truncateText(
    text: string,
    maxLength: number,
    suffix: string = '...'
): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - suffix.length) + suffix
}
