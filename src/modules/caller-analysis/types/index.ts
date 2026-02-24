/**
 * Types for Caller Analysis module
 */

export * from './priority.types'

export interface CallData {
    id: string
    ringbaRowId?: string
    callerId: string
    /** Phone number (for history API); may equal callerId */
    phoneNumber?: string
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
    street_number?: string | null
    street_name?: string | null
    street_type?: string | null
    city?: string | null
    state?: string | null
    g_zip?: string | null
    billed?: string | null
    latestPayout?: string | null
    ringbaCost?: number | null
    adCost?: number | null
    call_timestamp?: string | Date | null
    /** Same as call_timestamp (for dynamic column id callTimestamp) */
    callTimestamp?: string | null
    /** Call length in seconds (for dynamic column) */
    callLengthInSeconds?: number | null
    targetName?: string | null
    publisherName?: string | null
    ai_processed?: boolean
    summary?: string | null
    publisher?: string | null
    attributes?: Record<string, any> // Dynamic-only fields (column-backed fields are top-level)
}

export interface FilterState {
    dateRange: { from?: Date; to?: Date }
    campaignFilter: Array<string>
    statusFilter: Array<string>
    durationFilter: string
    durationRange: { min?: number; max?: number }
    searchQuery: string
}
