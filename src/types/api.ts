// API Response types matching the backend
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<Array<T>> {
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

// Frontend compatible types (mapping phNumber to callerId)
export interface FrontendCallerData {
    id: string
    callerId: string // maps from phNumber
    lastCall: string
    duration: string // formatted duration
    lifetimeRevenue: number
    campaign: string
    action: string
    status: Array<string>
    transcript?: string
    audioUrl?: string
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
    ai_processed?: boolean
    summary?: string | null
}

// Query parameters for filtering
export interface CallerQueryParams {
    page?: number
    limit?: number
    search?: string
    campaign?: Array<string>
    status?: Array<string>
    dateFrom?: string
    dateTo?: string
    durationMin?: number
    durationMax?: number
}
