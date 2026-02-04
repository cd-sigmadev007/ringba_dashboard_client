import { useEffect, useMemo, useState } from 'react'
import { useGetCallers } from '../graphql/hooks'
import {
    convertFilterStateToGraphQLFilter,
    convertGraphQLCallerToCallData,
} from '../utils/graphqlUtils'
import { CallerOrderField, OrderDirection } from '../graphql/types'
import type { CallData, FilterState } from '../types'
import type { CallerOrderBy, FilterOperator } from '../graphql/types'

export const useCallerAnalysisGraphQL = () => {
    const [filters, setFilters] = useState<FilterState>({
        dateRange: {},
        campaignFilter: [],
        statusFilter: [],
        durationFilter: 'all',
        durationRange: {},
        searchQuery: '',
    })

    const [dynamicFilters, setDynamicFilters] = useState<
        Array<{ field: string; value: any; operator: FilterOperator }>
    >([])

    const [orderBy, setOrderBy] = useState<CallerOrderBy>({
        field: CallerOrderField.CALL_TIMESTAMP,
        direction: OrderDirection.DESC,
    })

    const [page, setPage] = useState(1)
    const [pageSize] = useState(50)

    // Debug: Log page changes
    useEffect(() => {
        console.log('[useCallerAnalysisGraphQL] Page changed to:', page)
    }, [page])

    // Convert filters to GraphQL format
    const graphQLFilter = useMemo(
        () => convertFilterStateToGraphQLFilter(filters, dynamicFilters),
        [filters, dynamicFilters]
    )

    // Fetch data using GraphQL
    const {
        data: callerConnection,
        isLoading,
        error,
        refetch,
    } = useGetCallers(graphQLFilter, orderBy, page, pageSize)

    // Debug: Log query results
    useEffect(() => {
        console.log('[useCallerAnalysisGraphQL] Query result:', {
            page,
            pageSize,
            hasData: !!callerConnection,
            dataLength: callerConnection?.data?.length || 0,
            totalCount: callerConnection?.totalCount || 0,
            currentPage: callerConnection?.pageInfo?.currentPage || 0,
            totalPages: callerConnection?.pageInfo?.totalPages || 0,
            isLoading,
        })
    }, [callerConnection, page, pageSize, isLoading])

    // Convert GraphQL data to CallData format and aggregate LTR from latestPayout
    const data = useMemo(() => {
        if (!callerConnection) {
            console.log(
                '[useCallerAnalysisGraphQL] No callerConnection, returning empty array'
            )
            return []
        }
        if (!callerConnection.data) {
            console.log(
                '[useCallerAnalysisGraphQL] No callerConnection.data, returning empty array'
            )
            return []
        }

        // First, convert all callers to CallData format
        const convertedData = callerConnection.data.map((caller) =>
            convertGraphQLCallerToCallData(caller)
        )

        // Helper function to parse latestPayout (handles currency strings, numbers, etc.)
        const parseLatestPayout = (
            value: string | number | null | undefined
        ): number => {
            if (value === null || value === undefined) return 0
            if (typeof value === 'number') return isNaN(value) ? 0 : value
            if (typeof value === 'string') {
                // Remove currency symbols, commas, and whitespace
                const cleaned = value.replace(/[$,\s]/g, '')
                const parsed = parseFloat(cleaned)
                return isNaN(parsed) ? 0 : parsed
            }
            return 0
        }

        // Calculate LTR for each callerId (sum of all latestPayout for same callerId)
        const callerIdLtrMap = new Map<string, number>()

        // First pass: sum all latestPayout values for each callerId
        convertedData.forEach((call: CallData) => {
            const callerId = call.callerId
            const latestPayout = parseLatestPayout(call.latestPayout)

            if (latestPayout > 0) {
                const currentSum = callerIdLtrMap.get(callerId) || 0
                const newSum = currentSum + latestPayout
                callerIdLtrMap.set(callerId, newSum)
            }
        })

        // Second pass: update lifetimeRevenue for each call with the aggregated LTR
        const dataWithLtr = convertedData.map((call: CallData) => ({
            ...call,
            lifetimeRevenue: callerIdLtrMap.get(call.callerId) || 0,
        }))

        console.log('[useCallerAnalysisGraphQL] Converting data:', {
            page,
            dataLength: convertedData.length,
            uniqueCallerIds: callerIdLtrMap.size,
            firstCallerId: convertedData[0]?.callerId,
        })

        return dataWithLtr
    }, [callerConnection, page])

    const totalRecords = callerConnection?.totalCount || 0
    const hasNextPage = callerConnection?.pageInfo.hasNextPage || false
    const hasPreviousPage = callerConnection?.pageInfo.hasPreviousPage || false

    const updateFilters = (newFilters: Partial<FilterState>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }))
        setPage(1) // Reset page when filters change
    }

    const removeFilters = (filterType: keyof FilterState) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]:
                filterType === 'dateRange'
                    ? {}
                    : filterType === 'durationRange'
                      ? {}
                      : filterType === 'durationFilter'
                        ? 'all'
                        : [],
        }))
        setPage(1)
    }

    const clearAllFilters = () => {
        setFilters({
            dateRange: {},
            campaignFilter: [],
            statusFilter: [],
            durationFilter: 'all',
            durationRange: {},
            searchQuery: '',
        })
        setDynamicFilters([])
        setPage(1)
    }

    const hasActiveFilters = useMemo(() => {
        return (
            filters.searchQuery !== '' ||
            filters.campaignFilter.length > 0 ||
            filters.statusFilter.length > 0 ||
            filters.dateRange.from !== undefined ||
            filters.dateRange.to !== undefined ||
            filters.durationRange.min !== undefined ||
            filters.durationRange.max !== undefined ||
            dynamicFilters.length > 0
        )
    }, [filters, dynamicFilters])

    const loadNextPage = () => {
        const currentPage = callerConnection?.pageInfo.currentPage || page
        const totalPages = callerConnection?.pageInfo.totalPages || 0

        // Only load next page if:
        // 1. hasNextPage is true
        // 2. Not currently loading
        // 3. Current page is less than total pages (safety check)
        if (hasNextPage && !isLoading && currentPage < totalPages) {
            setPage((prev) => {
                const nextPage = prev + 1
                // Additional safety: don't go beyond totalPages
                const maxPage = totalPages || nextPage
                return Math.min(nextPage, maxPage)
            })
        }
    }

    const loadPreviousPage = () => {
        if (hasPreviousPage) {
            setPage((prev) => Math.max(1, prev - 1))
        }
    }

    const addDynamicFilter = (
        field: string,
        value: any,
        operator: FilterOperator
    ) => {
        setDynamicFilters((prev) => [...prev, { field, value, operator }])
        setPage(1)
    }

    const removeDynamicFilter = (index: number) => {
        setDynamicFilters((prev) => prev.filter((_, i) => i !== index))
        setPage(1)
    }

    const updateDynamicFilter = (
        index: number,
        value: any,
        operator: FilterOperator
    ) => {
        setDynamicFilters((prev) =>
            prev.map((f, i) => (i === index ? { ...f, value, operator } : f))
        )
        setPage(1)
    }

    return {
        // Data
        data,
        isLoading,
        error,
        totalRecords,
        hasNextPage,
        hasPreviousPage,

        // Filters
        filters,
        dynamicFilters,
        updateFilters,
        removeFilters,
        clearAllFilters,
        hasActiveFilters,
        addDynamicFilter,
        removeDynamicFilter,
        updateDynamicFilter,

        // Pagination
        loadNextPage,
        loadPreviousPage,
        page,
        setPage,
        currentPage: callerConnection?.pageInfo.currentPage || 1,
        totalPages: callerConnection?.pageInfo.totalPages || 0,

        // Ordering
        orderBy,
        setOrderBy,

        // Refetch
        refetch,
    }
}
