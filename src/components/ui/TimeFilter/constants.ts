/**
 * TimeFilter Constants
 * Constants used by the TimeFilter component
 */

// Use EST timezone for date operations to match backend
export const EST_TIMEZONE = 'America/New_York'

/**
 * Date range presets for quick selection
 */
export const presets = [
    { label: 'Today', type: 'today' },
    { label: 'Yesterday', type: 'yesterday' },
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 60 days', days: 60 },
    { label: 'Custom', type: 'custom' },
] as const

