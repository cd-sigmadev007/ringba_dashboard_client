import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrBefore'
import isSameOrBefore from 'dayjs/plugin/isSameOrAfter'

import type { CallData, FilterState } from '../types'
import { callerAnalysisApi } from '@/services/api/callerAnalysis'
import {
    matchesCampaignFilter,
    matchesDurationFilter,
    matchesDurationRange,
    matchesSearchQuery,
} from '@/modules'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export const useCallerAnalysis = () => {
    const [filters, setFilters] = useState<FilterState>({
        dateRange: {},
        campaignFilter: [],
        statusFilter: [],
        durationFilter: 'all',
        durationRange: {},
        searchQuery: '',
    })

    const [data, setData] = useState<CallData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalRecords, setTotalRecords] = useState(0)

    // Fetch all data for client-side pagination
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                console.log('🔄 Fetching all callers data...')
                const response = await callerAnalysisApi.getAllCallers({
                    filters,
                    page: 1,
                    limit: 1000, // Fetch 1000 records for client-side pagination
                })
                console.log('✅ Data fetched:', response)
                setData(response.data)
                setTotalRecords(response.pagination.total)
            } catch (error) {
                console.error('❌ Failed to fetch data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [filters])

    // Filter data based on current filters
    const filteredData = useMemo(() => {
        console.log('🔍 Filtering data:', { 
            dataLength: data.length,
            filters: filters
        })
        
        if (!data.length) {
            console.log('📄 No data available')
            return []
        }
        
        // Apply client-side filtering
        const filtered = data.filter((d: CallData) => {
            // Search filter (caller ID)
            if (!matchesSearchQuery(d.callerId, filters.searchQuery)) {
                return false
            }

            // Campaign filter
            if (!matchesCampaignFilter(d.campaign, filters.campaignFilter)) {
                return false
            }

            // Duration filter (legacy)
            if (!matchesDurationFilter(d.duration, filters.durationFilter)) {
                return false
            }

            // Duration range filter
            if (!matchesDurationRange(d.duration, filters.durationRange)) {
                return false
            }

            return true
        })
        
        console.log('🔍 Filtered data:', { 
            original: data.length, 
            filtered: filtered.length 
        })
        
        return filtered
    }, [data, filters])

    // Filter update functions
    const updateFilters = {
        dateRange: (dateRange: { from?: Date; to?: Date }) => {
            setFilters((prev) => ({ ...prev, dateRange }))
        },

        campaign: (value: string | Array<string>) => {
            setFilters((prev) => ({
                ...prev,
                campaignFilter: Array.isArray(value) ? value : [value],
            }))
        },

        status: (value: string | Array<string>) => {
            setFilters((prev) => ({
                ...prev,
                statusFilter: Array.isArray(value) ? value : [value],
            }))
        },

        durationRange: (durationRange: { min?: number; max?: number }) =>
            setFilters((prev) => ({ ...prev, durationRange })),

        search: (searchQuery: string) =>
            setFilters((prev) => ({ ...prev, searchQuery })),
    }

    // Filter removal functions
    const removeFilters = {
        campaign: (filter: string) =>
            setFilters((prev) => ({
                ...prev,
                campaignFilter: prev.campaignFilter.filter((f) => f !== filter),
            })),

        status: (filter: string) =>
            setFilters((prev) => ({
                ...prev,
                statusFilter: prev.statusFilter.filter((f) => f !== filter),
            })),

        durationRange: () =>
            setFilters((prev) => ({ ...prev, durationRange: {} })),

        search: () => setFilters((prev) => ({ ...prev, searchQuery: '' })),

        dateRange: () => setFilters((prev) => ({ ...prev, dateRange: {} })),
    }

    // Clear all filters
    const clearAllFilters = () => {
        setFilters({
            dateRange: {},
            campaignFilter: [],
            statusFilter: [],
            durationFilter: 'all',
            durationRange: {},
            searchQuery: '',
        })
    }

    // Check if any filters are active
    const hasActiveFilters =
        filters.campaignFilter.length > 0 ||
        filters.statusFilter.length > 0 ||
        filters.durationFilter !== 'all' ||
        !!filters.dateRange.from ||
        !!filters.searchQuery ||
        filters.durationRange.min !== undefined ||
        filters.durationRange.max !== undefined

    // Refresh function
    const refetch = () => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await callerAnalysisApi.getAllCallers({
                    filters,
                    page: 1,
                    limit: 1000,
                })
                setData(response.data)
                setTotalRecords(response.pagination.total)
            } catch (error) {
                console.error('❌ Failed to refetch data:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }

    return {
        filters,
        filteredData,
        allFilteredData: filteredData,
        updateFilters,
        removeFilters,
        clearAllFilters,
        hasActiveFilters,
        totalRecords,
        isLoading,
        refetch,
    }
}
