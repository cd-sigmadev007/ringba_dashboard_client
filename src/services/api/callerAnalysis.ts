import { apiClient, type PaginatedApiResponse } from './index'
import type { CallData, FilterState } from '@/modules/caller-analysis/types'

// API Endpoints
export const CALLER_ANALYSIS_ENDPOINTS = {
  GET_ALL: '/api/callers',
  GET_BY_ID: '/api/callers/:id',
  GET_BY_PHONE: '/api/callers/phone/:phone',
  GET_SCHEMA: '/api/callers/schema',
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

// Response Types
export interface CallerApiResponse extends PaginatedApiResponse<CallData> {}

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
  ): Promise<CallerApiResponse> {
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
        params.append('campaign', filters.campaignFilter.join(','))
      }
      
      // Status filter disabled - using demo status data for now
      // if (filters.statusFilter.length > 0) {
      //   params.append('status', filters.statusFilter.join(','))
      // }
      
      if (filters.dateRange.from) {
        params.append('dateFrom', filters.dateRange.from.toISOString())
      }
      
      if (filters.dateRange.to) {
        params.append('dateTo', filters.dateRange.to.toISOString())
      }
      
      if (filters.durationRange.min !== undefined) {
        params.append('durationMin', filters.durationRange.min.toString())
      }
      
      if (filters.durationRange.max !== undefined) {
        params.append('durationMax', filters.durationRange.max.toString())
      }
    }

    const url = `${CALLER_ANALYSIS_ENDPOINTS.GET_ALL}?${params.toString()}`
    
    return apiClient.get<CallerApiResponse>(url)
  }

  /**
   * Get caller by ID
   */
  static async getCallerById(request: GetCallerByIdRequest): Promise<CallData> {
    const url = CALLER_ANALYSIS_ENDPOINTS.GET_BY_ID.replace(':id', request.id)
    const response = await apiClient.get<{ data: CallData }>(url)
    return response.data
  }

  /**
   * Get caller by phone number
   */
  static async getCallerByPhone(request: GetCallerByPhoneRequest): Promise<CallData> {
    const url = CALLER_ANALYSIS_ENDPOINTS.GET_BY_PHONE.replace(':phone', request.phone)
    const response = await apiClient.get<{ data: CallData }>(url)
    return response.data
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
}

// Export the service instance
export const callerAnalysisApi = CallerAnalysisApiService


