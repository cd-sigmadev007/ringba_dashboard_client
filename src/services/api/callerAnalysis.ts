import { apiClient } from './index'
import type { PaginatedApiResponse } from './index'
import type { CallData, FilterState } from '@/modules/caller-analysis/types'
import type { FrontendCallerData } from '@/types/api'
import { callerApiService } from '@/modules/caller-analysis/services/api'
import { convertCampaignFiltersToIds } from '@/modules/caller-analysis/utils/campaignIds'

// API Endpoints
export const CALLER_ANALYSIS_ENDPOINTS = {
    GET_ALL: '/api/callers',
    GET_BY_ID: '/api/callers/:id',
    GET_BY_PHONE: '/api/callers/phone/:phone',
    GET_HISTORY: '/api/callers/phone/:phone/history',
    GET_SCHEMA: '/api/callers/schema',
    GET_TAGS: '/api/callers/tags',
    HEALTH_CHECK: '/health',
} as const

// Request Types
export interface GetCallersRequest {
    filters?: FilterState
    page?: number
    limit?: number
}

export interface GetCallerByIdRequest {
    id: string
}

export interface GetCallerByPhoneRequest {
    phone: string
}

// Response Types - API returns FrontendCallerData, we convert to CallData
export interface CallerApiResponse
    extends PaginatedApiResponse<FrontendCallerData> {}
export interface ConvertedCallerApiResponse
    extends PaginatedApiResponse<CallData> {}

export interface CallerSchemaResponse {
    columns: Array<{
        name: string
        type: string
        nullable: boolean
        description?: string
    }>
    tableName: string
    totalRecords: number
}

// Caller Analysis API Service
export class CallerAnalysisApiService {
    /**
     * Get all callers with pagination and filtering
     */
    static async getAllCallers(
        request: GetCallersRequest = {}
    ): Promise<ConvertedCallerApiResponse> {
        const { filters, page = 1, limit = 100 } = request

        // Build query parameters
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        })

        // Add filters to query params
        if (filters) {
            if (filters.searchQuery) {
                params.append('search', filters.searchQuery)
            }

            if (filters.campaignFilter.length > 0) {
                // Convert campaign filter values to backend campaign IDs
                const campaignIds = convertCampaignFiltersToIds(
                    filters.campaignFilter
                )
                if (campaignIds.length > 0) {
                    params.append('campaign', campaignIds.join(','))
                }
            }

            if (filters.statusFilter.length > 0) {
                params.append('status', filters.statusFilter.join(','))
            }

            if (filters.dateRange.from) {
                params.append('dateFrom', filters.dateRange.from.toISOString())
            }

            if (filters.dateRange.to) {
                params.append('dateTo', filters.dateRange.to.toISOString())
            }

            if (filters.durationRange.min !== undefined) {
                params.append(
                    'durationMin',
                    filters.durationRange.min.toString()
                )
            }

            if (filters.durationRange.max !== undefined) {
                params.append(
                    'durationMax',
                    filters.durationRange.max.toString()
                )
            }
        }

        const url = `${CALLER_ANALYSIS_ENDPOINTS.GET_ALL}?${params.toString()}`

        const response = await apiClient.get<CallerApiResponse>(url)

        // Convert API response to CallData format
        const convertedData = response.data.map(
            callerApiService.convertApiResponseToCallData
        )

        return {
            ...response,
            data: convertedData,
        }
    }

    /**
     * Get caller by ID
     */
    static async getCallerById(
        request: GetCallerByIdRequest
    ): Promise<CallData> {
        const url = CALLER_ANALYSIS_ENDPOINTS.GET_BY_ID.replace(
            ':id',
            request.id
        )
        const response = await apiClient.get<{ data: FrontendCallerData }>(url)
        return callerApiService.convertApiResponseToCallData(response.data)
    }

    /**
     * Get caller by phone number
     */
    static async getCallerByPhone(
        request: GetCallerByPhoneRequest
    ): Promise<CallData> {
        const url = CALLER_ANALYSIS_ENDPOINTS.GET_BY_PHONE.replace(
            ':phone',
            encodeURIComponent(request.phone)
        )
        const response = await apiClient.get<{ data: FrontendCallerData }>(url)
        return callerApiService.convertApiResponseToCallData(response.data)
    }

    /**
     * Get caller history by phone number (uses authenticated apiClient)
     */
    static async getHistoryByPhone(
        phone: string
    ): Promise<{ success: boolean; data: Array<FrontendCallerData> }> {
        const url = CALLER_ANALYSIS_ENDPOINTS.GET_HISTORY.replace(
            ':phone',
            encodeURIComponent(phone)
        )
        return apiClient.get<{
            success: boolean
            data: Array<FrontendCallerData>
        }>(url)
    }

    /**
     * Get database schema information
     */
    static async getTableSchema(): Promise<CallerSchemaResponse> {
        const response = await apiClient.get<{ data: CallerSchemaResponse }>(
            CALLER_ANALYSIS_ENDPOINTS.GET_SCHEMA
        )
        return response.data
    }

    /**
     * Health check for the API
     */
    static async healthCheck(): Promise<{ status: string; timestamp: string }> {
        return apiClient.healthCheck()
    }

    /**
     * Get all available tags from the database
     */
    static async getTags(): Promise<
        Array<{ tag_name: string; priority: string }>
    > {
        try {
            // apiClient.get returns response.data directly
            const response = await apiClient.get<{
                success: boolean
                data: Array<{ tag_name: string; priority: string }>
            }>(CALLER_ANALYSIS_ENDPOINTS.GET_TAGS)
            // Response format is { success: true, data: [...], message: "..." }
            return response.data
        } catch (error) {
            console.error('Failed to fetch tags:', error)
            throw error
        }
    }
}

// Export the service instance
export const callerAnalysisApi = CallerAnalysisApiService
