/**
 * Types for Caller Analysis module
 */

export * from './priority.types'

export interface CallData {
    id: string
    callerId: string
    lastCall: string
    duration: string
    lifetimeRevenue: number
    campaign: string
    action: string
    status: Array<string>
    audioUrl?: string
    transcript?: string
    revenue?: number | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    type?: string | null
    address?: string | null
    streetNumber?: string | null
    streetName?: string | null
    streetType?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    billed?: string | null
    latestPayout?: string | null
    ringbaCost?: number | null
    adCost?: number | null
    is_adjusted?: boolean
    adjustment_amount?: number | null
    call_timestamp?: string | Date | null
    targetName?: string | null
}

export interface FilterState {
    dateRange: { from?: Date; to?: Date }
    campaignFilter: Array<string>
    statusFilter: Array<string>
    durationFilter: string
    durationRange: { min?: number; max?: number }
    searchQuery: string
}
