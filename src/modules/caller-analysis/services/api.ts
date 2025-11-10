import type { CallData, FilterState } from '../types'
import type {
    ApiResponse,
    FrontendCallerData,
    PaginatedResponse,
} from '../../../types/api'

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
            params.campaign = filters.campaignFilter
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
        // Parse duration from seconds string to formatted "Xm Ys" format
        const formatDuration = (duration: string | number | null | undefined): string => {
            // Handle null, undefined, or empty string
            if (duration === null || duration === undefined || duration === '') {
                console.warn('Duration is null/undefined/empty:', duration)
                return '00m 00s'
            }
            
            // If duration is already in "Xm Ys" format, return as is
            if (typeof duration === 'string' && duration.match(/^\d+m\s+\d+s$/)) {
                return duration
            }
            
            // Convert to number (handle string numbers)
            let seconds: number
            if (typeof duration === 'string') {
                // Try parsing as float first
                seconds = parseFloat(duration)
                // If that fails, try parsing as "Xm Ys" format
                if (isNaN(seconds)) {
                    const match = duration.match(/(\d+)m\s+(\d+)s/)
                    if (match) {
                        seconds = parseInt(match[1]) * 60 + parseInt(match[2])
                    } else {
                        console.warn('Unable to parse duration:', duration, 'type:', typeof duration)
                        return '00m 00s'
                    }
                }
            } else {
                seconds = duration
            }
            
            // Check if valid number and >= 0
            if (isNaN(seconds) || seconds < 0) {
                console.warn('Invalid duration value:', duration, 'parsed as:', seconds)
                return '00m 00s'
            }
            
            // Debug log to see what we're getting
            if (seconds < 10) {
                console.log('Duration value:', duration, 'parsed as seconds:', seconds, 'formatted as:', 
                    `${String(Math.floor(seconds / 60)).padStart(2, '0')}m ${String(Math.floor(seconds % 60)).padStart(2, '0')}s`)
            }
            
            // Format as "Xm Ys"
            const minutes = Math.floor(seconds / 60)
            const remainingSeconds = Math.floor(seconds % 60)
            return `${String(minutes).padStart(2, '0')}m ${String(remainingSeconds).padStart(2, '0')}s`
        }

        // Parse numeric value from string or number
        const parseNumeric = (
            value: string | number | null | undefined
        ): number => {
            if (value === null || value === undefined) return 0
            if (typeof value === 'number') return isNaN(value) ? 0 : value
            if (typeof value === 'string') {
                // Remove currency symbols, commas, and whitespace before parsing
                const cleaned = value.replace(/[$,\s]/g, '').trim()
                const parsed = parseFloat(cleaned)
                return isNaN(parsed) ? 0 : parsed
            }
            return 0
        }

        // Parse costs
        const ringbaCost = parseNumeric(apiData.ringbaCost)
        const adCost = parseNumeric(apiData.adCost)

        // LTR will be calculated later by aggregating all latestPayout for same callerId
        // For now, set it to 0 - it will be updated in useCallerAnalysis hook
        // Set lifetimeRevenue to 0 initially - it will be aggregated by callerId later
        const lifetimeRevenue = 0

        return {
            id: apiData.id,
            callerId: apiData.callerId,
            lastCall: apiData.lastCall,
            duration: formatDuration(apiData.duration),
            lifetimeRevenue,
            campaign: apiData.campaign,
            action: apiData.action,
            status: apiData.status,
            audioUrl: (apiData as any).audioUrl,
            transcript: (apiData as any).transcript,
            revenue: parseNumeric(apiData.revenue) > 0 ? parseNumeric(apiData.revenue) : null,
            ringbaCost,
            adCost,
            billed: (apiData as any).billed,
            // Store the raw latestPayout string for display, but we'll parse it when aggregating
            latestPayout: (apiData as any).latestPayout,
        }
    }
}

export const callerApiService = new CallerApiService()
export default callerApiService
