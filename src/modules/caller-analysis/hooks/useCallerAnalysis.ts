import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

import type { CallData, FilterState } from '../types'
import {
    callData,
    matchesCampaignFilter,
    matchesDurationFilter,
    matchesDurationRange,
    matchesSearchQuery,
    matchesStatusFilter,
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

    const [isLoading, setIsLoading] = useState(true)

    // Simulate initial data loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1500)

        return () => clearTimeout(timer)
    }, [])

    // Filter data based on current filters
    const filteredData = useMemo(() => {
        return callData.filter((d: CallData) => {
            // Search filter (caller ID)
            if (!matchesSearchQuery(d.callerId, filters.searchQuery)) {
                return false
            }

            // Date filter
            if (filters.dateRange.from && filters.dateRange.to) {
                const dateStr = d.lastCall.split(' ET')[0]
                const date = dayjs(dateStr, 'MMM DD, hh:mm:ss A')
                if (
                    !date.isSameOrAfter(dayjs(filters.dateRange.from)) ||
                    !date.isSameOrBefore(dayjs(filters.dateRange.to))
                ) {
                    return false
                }
            }

            // Campaign filter
            if (!matchesCampaignFilter(d.campaign, filters.campaignFilter)) {
                return false
            }

            // Status filter
            if (!matchesStatusFilter(d.status, filters.statusFilter)) {
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
    }, [filters])

    // Filter update functions
    const updateFilters = {
        dateRange: (dateRange: { from?: Date; to?: Date }) =>
            setFilters((prev) => ({ ...prev, dateRange })),

        campaign: (value: string | Array<string>) =>
            setFilters((prev) => ({
                ...prev,
                campaignFilter: Array.isArray(value) ? value : [value],
            })),

        status: (value: string | Array<string>) =>
            setFilters((prev) => ({
                ...prev,
                statusFilter: Array.isArray(value) ? value : [value],
            })),

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

    return {
        filters,
        filteredData,
        updateFilters,
        removeFilters,
        clearAllFilters,
        hasActiveFilters,
        totalRecords: callData.length,
        isLoading,
    }
}
