import { useQuery, useQueryClient } from '@tanstack/react-query'
import { callerApiService } from '../services/api'
import type { CallData, FilterState } from '../types'
import type { CallerQueryParams, FrontendCallerData } from '../../../types/api'

export const useCallerAnalysisApi = () => {
    const queryClient = useQueryClient()

    // Query key factory
    const getCallersQueryKey = (params: CallerQueryParams = {}) => [
        'callers',
        params,
    ]

    // Get all callers with filtering and pagination
    const useGetAllCallers = (
        filters: FilterState,
        page: number = 1,
        limit: number = 10
    ) => {
        const queryParams =
            callerApiService.convertFilterStateToQueryParams(filters)
        queryParams.page = page
        queryParams.limit = limit

        return useQuery({
            queryKey: getCallersQueryKey(queryParams),
            queryFn: () => callerApiService.getAllCallers(queryParams),
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
        })
    }

    // Get caller by ID
    const useGetCallerById = (id: string) => {
        return useQuery({
            queryKey: ['caller', id],
            queryFn: () => callerApiService.getCallerById(id),
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
        })
    }

    // Get caller by phone number
    const useGetCallerByPhone = (phoneNumber: string) => {
        return useQuery({
            queryKey: ['caller', 'phone', phoneNumber],
            queryFn: () => callerApiService.getCallerByPhone(phoneNumber),
            enabled: !!phoneNumber,
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
        })
    }

    // Get caller history by phone number
    const useGetCallerHistoryByPhone = (phoneNumber: string) => {
        return useQuery({
            queryKey: ['caller', 'phone', 'history', phoneNumber],
            queryFn: () => callerApiService.getHistoryByPhone(phoneNumber),
            enabled: !!phoneNumber,
            staleTime: 1 * 60 * 1000,
            gcTime: 5 * 60 * 1000,
        })
    }

    // Get table schema
    const useGetTableSchema = () => {
        return useQuery({
            queryKey: ['callers', 'schema'],
            queryFn: () => callerApiService.getTableSchema(),
            staleTime: 30 * 60 * 1000, // 30 minutes
            gcTime: 60 * 60 * 1000, // 1 hour
        })
    }

    // Health check
    const useHealthCheck = () => {
        return useQuery({
            queryKey: ['callers', 'health'],
            queryFn: () => callerApiService.healthCheck(),
            staleTime: 1 * 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            refetchInterval: 30 * 1000, // Refetch every 30 seconds
        })
    }

    // Invalidate and refetch callers data
    const invalidateCallers = () => {
        queryClient.invalidateQueries({ queryKey: ['callers'] })
    }

    // Prefetch callers data
    const prefetchCallers = (params: CallerQueryParams) => {
        queryClient.prefetchQuery({
            queryKey: getCallersQueryKey(params),
            queryFn: () => callerApiService.getAllCallers(params),
            staleTime: 5 * 60 * 1000,
        })
    }

    // Convert API data to frontend format
    const convertApiDataToCallData = (
        apiData: Array<FrontendCallerData>
    ): Array<CallData> => {
        return apiData.map(callerApiService.convertApiResponseToCallData)
    }

    return {
        // Queries
        useGetAllCallers,
        useGetCallerById,
        useGetCallerByPhone,
        useGetCallerHistoryByPhone,
        useGetTableSchema,
        useHealthCheck,

        // Utilities
        invalidateCallers,
        prefetchCallers,
        convertApiDataToCallData,

        // Query key factory
        getCallersQueryKey,
    }
}
