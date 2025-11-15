import { convertCampaignFiltersToIds } from '../utils/campaignIds'
import type { CallData, FilterState } from '../types'
import type {
    ApiResponse,
    FrontendCallerData,
    PaginatedResponse,
} from '../../../types/api'
import { formatDuration, parseNumeric } from '@/lib/utils'

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
const API_BASE_URL = baseUrl.endsWith('/api')
    ? baseUrl
    : baseUrl.replace(/\/$/, '') + '/api'

export interface CallerApiResponse {
    success: boolean
    data?: Array<FrontendCallerData>
    error?: string
    message?: string
    pagination?: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

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

class CallerApiService {
    private async makeRequest<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('API request failed:', error)
            throw error
        }
    }

    // Get all callers with filtering and pagination
    async getAllCallers(
        params: CallerQueryParams = {}
    ): Promise<PaginatedResponse<FrontendCallerData>> {
        const queryParams = new URLSearchParams()

        if (params.page) queryParams.append('page', params.page.toString())
        if (params.limit) queryParams.append('limit', params.limit.toString())
        if (params.search) queryParams.append('search', params.search)
        if (params.campaign)
            params.campaign.forEach((c) => queryParams.append('campaign', c))
        if (params.status)
            params.status.forEach((s) => queryParams.append('status', s))
        if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom)
        if (params.dateTo) queryParams.append('dateTo', params.dateTo)
        if (params.durationMin)
            queryParams.append('durationMin', params.durationMin.toString())
        if (params.durationMax)
            queryParams.append('durationMax', params.durationMax.toString())

        const endpoint = `/callers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        return this.makeRequest<PaginatedResponse<FrontendCallerData>>(endpoint)
    }

    // Get caller by ID
    async getCallerById(id: string): Promise<FrontendCallerData> {
        return this.makeRequest<FrontendCallerData>(`/callers/${id}`)
    }

    // Get caller by phone number
    async getCallerByPhone(phoneNumber: string): Promise<FrontendCallerData> {
        return this.makeRequest<FrontendCallerData>(
            `/callers/phone/${phoneNumber}`
        )
    }

    // Get caller history by phone number
    async getHistoryByPhone(
        phoneNumber: string
    ): Promise<{ success: boolean; data: Array<FrontendCallerData> }> {
        const encoded = encodeURIComponent(phoneNumber)
        return this.makeRequest<{
            success: boolean
            data: Array<FrontendCallerData>
        }>(`/callers/phone/${encoded}/history`)
    }

    // Get table schema
    async getTableSchema(): Promise<any> {
        const response =
            await this.makeRequest<ApiResponse<any>>('/callers/schema')
        return response.data!
    }

    // Health check
    async healthCheck(): Promise<{ status: string; timestamp: string }> {
        const response =
            await this.makeRequest<
                ApiResponse<{ status: string; timestamp: string }>
            >('/callers/health')
        return response.data!
    }

    // Convert frontend filter state to API query parameters
    convertFilterStateToQueryParams(filters: FilterState): CallerQueryParams {
        const params: CallerQueryParams = {}

        if (filters.searchQuery) {
            params.search = filters.searchQuery
        }

        if (filters.campaignFilter.length > 0) {
            // Convert campaign filter values to backend campaign IDs
            params.campaign = convertCampaignFiltersToIds(
                filters.campaignFilter
            )
        }

        if (filters.statusFilter.length > 0) {
            params.status = filters.statusFilter
        }

        if (filters.dateRange.from) {
            params.dateFrom = filters.dateRange.from.toISOString()
        }

        if (filters.dateRange.to) {
            params.dateTo = filters.dateRange.to.toISOString()
        }

        if (filters.durationRange.min !== undefined) {
            params.durationMin = filters.durationRange.min
        }

        if (filters.durationRange.max !== undefined) {
            params.durationMax = filters.durationRange.max
        }

        return params
    }

    // Convert API response to frontend CallData format
    convertApiResponseToCallData(apiData: FrontendCallerData): CallData {
        const ringbaCost = parseNumeric(apiData.ringbaCost)
        const adCost = parseNumeric(apiData.adCost)

        // Set lifetimeRevenue to 0 initially - it will be aggregated from latestPayout in the hook
        // The hook will sum all latestPayout values for the same callerId to calculate LTR
        const lifetimeRevenue = 0

        return {
            id: apiData.id,
            callerId: apiData.callerId,
            lastCall: apiData.lastCall,
            duration: formatDuration(apiData.duration),
            lifetimeRevenue, // Will be aggregated from latestPayout in useCallerAnalysis hook
            campaign: apiData.campaign,
            action: apiData.action,
            status: apiData.status,
            audioUrl: (apiData as any).audioUrl,
            transcript: (apiData as any).transcript,
            // Include all additional fields from API
            revenue: apiData.revenue || null,
            firstName: apiData.firstName || null,
            lastName: apiData.lastName || null,
            email: apiData.email || null,
            type: apiData.type || null,
            address: apiData.address || null,
            streetNumber: apiData.streetNumber || null,
            streetName: apiData.streetName || null,
            streetType: apiData.streetType || null,
            city: apiData.city || null,
            state: apiData.state || null,
            zip: apiData.zip || null,
            billed: apiData.billed || null,
            latestPayout: apiData.latestPayout || null, // IMPORTANT: Include latestPayout for aggregation
            ringbaCost,
            adCost,
            is_adjusted: apiData.is_adjusted ?? false,
            adjustment_amount: apiData.adjustment_amount ?? null,
            call_timestamp: apiData.call_timestamp ?? null,
            targetName: apiData.targetName ?? null,
            ai_processed: apiData.ai_processed ?? undefined,
            summary: apiData.summary ?? null,
        }
    }

    /**
     * Create an adjustment for a call
     * POST /api/callers/:id/adjustments
     */
    async createAdjustment(
        callId: string,
        adjustmentData: {
            adjustment_amount: number
            adjustment_reason?: string
            adjusted_by?: string
        }
    ): Promise<any> {
        return this.makeRequest<any>(`/callers/${callId}/adjustments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adjustmentData),
        })
    }

    /**
     * Get adjustments for a call
     * GET /api/callers/:id/adjustments
     */
    async getAdjustments(callId: string): Promise<Array<any>> {
        return this.makeRequest<Array<any>>(`/callers/${callId}/adjustments`)
    }
}

export const callerApiService = new CallerApiService()
export default callerApiService
