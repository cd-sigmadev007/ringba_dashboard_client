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
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    type?: string | null
    address?: string | null
    billed?: string | null
    latestPayout?: string | null
    ringbaCost?: number | null
    adCost?: number | null
}

export interface FilterState {
    dateRange: { from?: Date; to?: Date }
    campaignFilter: Array<string>
    statusFilter: Array<string>
    durationFilter: string
    durationRange: { min?: number; max?: number }
    searchQuery: string
}
