// Priority enum for status classification
export enum Priority {
    LOW = 0,
    MEDIUM = 1,
    HIGH = 2,
    HIGHEST = 3,
}

// Priority label mapping
export const PRIORITY_LABELS: Record<Priority, string> = {
    [Priority.LOW]: 'Low',
    [Priority.MEDIUM]: 'Medium',
    [Priority.HIGH]: 'High',
    [Priority.HIGHEST]: 'Highest',
} as const

// Priority color mapping for Tailwind classes
export const PRIORITY_COLORS: Record<Priority, string> = {
    [Priority.HIGHEST]: 'bg-priority-highest text-white',
    [Priority.HIGH]: 'bg-priority-high text-white',
    [Priority.MEDIUM]: 'bg-priority-medium text-white',
    [Priority.LOW]: 'bg-priority-low text-white',
} as const

// Priority inline styles as fallback (using plain CSS properties)
export const PRIORITY_INLINE_STYLES: Record<
    Priority,
    Record<string, string>
> = {
    [Priority.HIGHEST]: { backgroundColor: '#994141', color: 'white' },
    [Priority.HIGH]: { backgroundColor: '#7C5228', color: 'white' },
    [Priority.MEDIUM]: { backgroundColor: '#B6A11C', color: 'white' },
    [Priority.LOW]: { backgroundColor: '#3B6934', color: 'white' },
} as const

// Status item interface
export interface StatusItem {
    id: string
    title: string
    priority: Priority
    description?: string
}

// Status to priority mapping
export const STATUS_PRIORITY_MAP: Record<string, Priority> = {
    'High-Quality Un-billed (Critical)': Priority.HIGHEST,
    'Chargeback Risk (Critical)': Priority.HIGHEST,
    'Wrong Appliance Category': Priority.HIGH,
    'Wrong Pest Control Category': Priority.HIGH,
    'Short Call (<90s)': Priority.HIGH,
    'Buyer Hung Up': Priority.HIGH,
    'Immediate Hangup (<10s)': Priority.HIGH,
    'No Coverage (ZIP)': Priority.HIGH,
    'Competitor Mentioned': Priority.MEDIUM,
    'Booking Intent': Priority.MEDIUM,
    'Warranty/Status Inquiry': Priority.MEDIUM,
    'Positive Sentiment': Priority.LOW,
    'Negative Sentiment': Priority.LOW,
    'Repeat Customer': Priority.LOW,
    'Technical Terms Used': Priority.LOW,
} as const

// Type for the status priority map keys
export type StatusType = keyof typeof STATUS_PRIORITY_MAP

// Utility type for priority sorting
export type PrioritySortable = {
    priority: Priority
    [key: string]: any
}
