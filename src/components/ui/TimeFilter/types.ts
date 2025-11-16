/**
 * TimeFilter Types
 * Type definitions for the TimeFilter component
 */

import type { DateRange } from 'react-day-picker'

/**
 * Props for the TimeFilter component
 */
export interface TimeFilterProps {
    /** Callback fired when the range changes */
    onChange?: (range: { from?: Date; to?: Date }) => void
    className?: string
}

/**
 * Preset configuration type
 */
export type Preset = {
    label: string
    days?: number
    type?: string
}

/**
 * Re-export DateRange from react-day-picker for convenience
 */
export type { DateRange }
