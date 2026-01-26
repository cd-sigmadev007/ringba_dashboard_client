import { useMemo, useState } from 'react'
import { useGetCallers } from '../graphql/hooks'
import {
    convertFilterStateToGraphQLFilter,
    convertGraphQLCallerToCallData,
} from '../utils/graphqlUtils'
import { CallerOrderField, OrderDirection } from '../graphql/types'
import type { FilterState } from '../types'
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

    // Convert GraphQL data to CallData format
    const data = useMemo(() => {
        if (!callerConnection) return []
        return callerConnection.data.map((caller) =>
            convertGraphQLCallerToCallData(caller)
        )
    }, [callerConnection])

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
