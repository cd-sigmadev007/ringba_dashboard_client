import { useQuery } from '@tanstack/react-query'
import {
    GET_AVAILABLE_FIELDS_QUERY,
    GET_CALLERS_QUERY,
    GET_CALLER_BY_ID_QUERY,
    GET_CALLER_BY_PHONE_QUERY,
    GET_FIELD_VALUES_QUERY,
    GET_CALL_ANALYSIS_V2_QUERY,
    GET_CALL_TAGS_FOR_CALL_QUERY,
} from './queries'
import type {
    Caller,
    CallerConnection,
    CallerFilter,
    CallerOrderBy,
    FieldDefinition,
    FieldValueConnection,
} from './types'
import { graphqlClient } from '@/lib/graphql/client'
import { useAuth } from '@/contexts/AuthContext'

// Hook to get all callers with GraphQL
export const useGetCallers = (
    filter?: CallerFilter,
    orderBy?: CallerOrderBy,
    page: number = 1,
    limit: number = 100
) => {
    const { user, loading: authLoading } = useAuth()
    const isAuthenticated = !!user && !authLoading

    return useQuery({
        queryKey: ['graphql', 'callers', filter, orderBy, page, limit],
        queryFn: async () => {
            console.log('[useGetCallers] Fetching callers:', {
                filter,
                orderBy,
                page,
                limit,
            })
            const data = await graphqlClient.request<{
                callers: CallerConnection
            }>(GET_CALLERS_QUERY, {
                filter,
                orderBy,
                page,
                limit,
            })
            console.log('[useGetCallers] Received data:', {
                dataLength: data.callers?.data?.length || 0,
                totalCount: data.callers?.totalCount || 0,
                currentPage: data.callers?.pageInfo?.currentPage || 0,
                totalPages: data.callers?.pageInfo?.totalPages || 0,
            })
            return data.callers
        },
        enabled: isAuthenticated, // Only run when authenticated
        staleTime: 0, // Always refetch when query key changes (including page changes)
        gcTime: 10 * 60 * 1000, // 10 minutes
    })
}

// Hook to get available fields
export const useGetAvailableFields = () => {
    const { user, loading: authLoading } = useAuth()
    const isAuthenticated = !!user && !authLoading

    return useQuery({
        queryKey: ['graphql', 'availableFields'],
        queryFn: async () => {
            try {
                const data = await graphqlClient.request<{
                    availableFields: Array<FieldDefinition>
                }>(GET_AVAILABLE_FIELDS_QUERY)
                console.log(
                    '[GraphQL] Available fields fetched:',
                    data.availableFields
                )
                return data.availableFields
            } catch (error) {
                console.error(
                    '[GraphQL] Error fetching available fields:',
                    error
                )
                throw error
            }
        },
        enabled: isAuthenticated, // Only run when authenticated
        staleTime: 30 * 60 * 1000, // 30 minutes (fields don't change often)
        gcTime: 60 * 60 * 1000, // 1 hour
        retry: 1, // Retry once on failure
    })
}

// Hook to get field values for a specific field
export const useGetFieldValues = (
    fieldName: string,
    filter?: CallerFilter,
    page: number = 1,
    limit: number = 100
) => {
    const { user, loading: authLoading } = useAuth()
    const isAuthenticated = !!user && !authLoading

    return useQuery({
        queryKey: ['graphql', 'fieldValues', fieldName, filter, page, limit],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                fieldValues: FieldValueConnection
            }>(GET_FIELD_VALUES_QUERY, {
                fieldName,
                filter,
                page,
                limit,
            })
            return data.fieldValues
        },
        enabled: !!fieldName && isAuthenticated, // Only run when fieldName provided and authenticated
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    })
}

// Hook to get caller by ID
export const useGetCallerById = (id: string) => {
    const { user, loading: authLoading } = useAuth()
    const isAuthenticated = !!user && !authLoading

    return useQuery({
        queryKey: ['graphql', 'caller', id],
        queryFn: async () => {
            const data = await graphqlClient.request<{ caller: Caller }>(
                GET_CALLER_BY_ID_QUERY,
                { id }
            )
            return data.caller
        },
        enabled: !!id && isAuthenticated, // Only run when id provided and authenticated
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
}

// Hook to get call analysis v2 for a call (lazy load when modal opens)
export const useCallAnalysisV2 = (
    ringbaRowId: string | undefined,
    enabled: boolean
) => {
    const { user, loading: authLoading } = useAuth()
    const isAuthenticated = !!user && !authLoading

    return useQuery({
        queryKey: ['graphql', 'callAnalysisV2', ringbaRowId],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                callAnalysisV2: any
            }>(GET_CALL_ANALYSIS_V2_QUERY, {
                ringbaRowId: ringbaRowId!,
            })
            return data.callAnalysisV2
        },
        enabled: !!ringbaRowId && enabled && isAuthenticated,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
}

// Hook to get call tags for a call (lazy load when modal opens)
export const useCallTagsForCall = (
    ringbaRowId: string | undefined,
    enabled: boolean
) => {
    const { user, loading: authLoading } = useAuth()
    const isAuthenticated = !!user && !authLoading

    return useQuery({
        queryKey: ['graphql', 'callTagsForCall', ringbaRowId],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                callTagsForCall: any[]
            }>(GET_CALL_TAGS_FOR_CALL_QUERY, {
                ringbaRowId: ringbaRowId!,
            })
            return data.callTagsForCall
        },
        enabled: !!ringbaRowId && enabled && isAuthenticated,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
}

// Hook to get caller by phone number
export const useGetCallerByPhone = (phoneNumber: string) => {
    const { user, loading: authLoading } = useAuth()
    const isAuthenticated = !!user && !authLoading

    return useQuery({
        queryKey: ['graphql', 'caller', 'phone', phoneNumber],
        queryFn: async () => {
            const data = await graphqlClient.request<{ callerByPhone: Caller }>(
                GET_CALLER_BY_PHONE_QUERY,
                { phoneNumber }
            )
            return data.callerByPhone
        },
        enabled: !!phoneNumber && isAuthenticated, // Only run when phoneNumber provided and authenticated
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
}
