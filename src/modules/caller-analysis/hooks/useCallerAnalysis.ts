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

    const [data, setData] = useState<Array<CallData>>([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalRecords, setTotalRecords] = useState(0)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

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

                // Calculate LTR for each callerId (sum of all latestPayout for same callerId)
                const callerIdLtrMap = new Map<string, number>()

                // Helper function to parse latestPayout (handles currency strings, numbers, etc.)
                const parseLatestPayout = (
                    value: string | number | null | undefined
                ): number => {
                    if (value === null || value === undefined) return 0
                    if (typeof value === 'number')
                        return isNaN(value) ? 0 : value
                    if (typeof value === 'string') {
                        // Remove currency symbols, commas, and whitespace
                        const cleaned = value.replace(/[$,\s]/g, '')
                        const parsed = parseFloat(cleaned)
                        return isNaN(parsed) ? 0 : parsed
                    }
                    return 0
                }

                // First pass: sum all latestPayout values for each callerId
                response.data.forEach((call: CallData) => {
                    const callerId = call.callerId
                    const latestPayout = parseLatestPayout(call.latestPayout)

                    // Debug log for each call to see what we're parsing
                    if (
                        call.latestPayout &&
                        typeof call.latestPayout === 'string' &&
                        call.latestPayout.includes('30')
                    ) {
                        console.log('Found $30 latestPayout:', {
                            callerId,
                            rawLatestPayout: call.latestPayout,
                            parsedLatestPayout: latestPayout,
                            currentLTR: call.lifetimeRevenue,
                            ringbaCost: call.ringbaCost,
                        })
                    }

                    if (latestPayout > 0) {
                        const currentSum = callerIdLtrMap.get(callerId) || 0
                        const newSum = currentSum + latestPayout
                        callerIdLtrMap.set(callerId, newSum)

                        // Debug log for suspicious values
                        if (latestPayout > 10 && newSum < 1) {
                            console.warn('LTR calculation issue:', {
                                callerId,
                                latestPayout,
                                currentSum,
                                newSum,
                                rawValue: call.latestPayout,
                            })
                        }
                    }
                })

                // Debug: log the LTR map for verification
                console.log(
                    'LTR Map (first 10 entries):',
                    Array.from(callerIdLtrMap.entries()).slice(0, 10)
                )

                // Second pass: update lifetimeRevenue for each call with the aggregated LTR
                const processedData = response.data.map((call: CallData) => ({
                    ...call,
                    lifetimeRevenue: callerIdLtrMap.get(call.callerId) || 0,
                }))

                setData(processedData)
                setTotalRecords(response.pagination.total)
                setLastUpdated(new Date())
            } catch (error) {
                console.error('❌ Failed to fetch data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [filters])

    // Helper function to parse lastCall date string to Date object
    const parseLastCallDate = (lastCall: string): Date | null => {
        try {
            // Parse the date string format: "Aug 05, 06:00:00 AM ET"
            const dateMatch = lastCall.match(
                /(\w+)\s+(\d+),\s+(\d{2}):(\d{2}):(\d{2})\s+(AM|PM)\s+ET/
            )
            if (!dateMatch) return null

            const [, month, day, hour, minute, second, ampm] = dateMatch
            const monthIndex = new Date(
                Date.parse(month + ' 1, 2000')
            ).getMonth()
            const year = new Date().getFullYear() // Use current year as fallback

            let hour24 = parseInt(hour)
            if (ampm === 'PM' && hour24 !== 12) hour24 += 12
            if (ampm === 'AM' && hour24 === 12) hour24 = 0

            return new Date(
                year,
                monthIndex,
                parseInt(day),
                hour24,
                parseInt(minute),
                parseInt(second)
            )
        } catch (error) {
            console.error('Error parsing date:', lastCall, error)
            return null
        }
    }

    // Filter data based on current filters
    const filteredData = useMemo(() => {
        console.log('🔍 Filtering data:', {
            dataLength: data.length,
            filters: filters,
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

            // Status filter
            if (!matchesStatusFilter(d.status, filters.statusFilter)) {
                return false
            }

            // Date range filter
            if (filters.dateRange.from || filters.dateRange.to) {
                const callDate = parseLastCallDate(d.lastCall)
                if (callDate) {
                    if (
                        filters.dateRange.from &&
                        callDate < filters.dateRange.from
                    ) {
                        return false
                    }
                    if (
                        filters.dateRange.to &&
                        callDate > filters.dateRange.to
                    ) {
                        return false
                    }
                }
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
            filtered: filtered.length,
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
    const refetch = async () => {
        setIsLoading(true)
        try {
            const response = await callerAnalysisApi.getAllCallers({
                filters,
                page: 1,
                limit: 1000,
            })

            // Calculate LTR for each callerId (sum of all latestPayout for same callerId)
            const callerIdLtrMap = new Map<string, number>()

            // Helper function to parse latestPayout (handles currency strings, numbers, etc.)
            const parseLatestPayout = (
                value: string | number | null | undefined
            ): number => {
                if (value === null || value === undefined) return 0
                if (typeof value === 'number')
                    return isNaN(value) ? 0 : value
                if (typeof value === 'string') {
                    // Remove currency symbols, commas, and whitespace
                    const cleaned = value.replace(/[$,\s]/g, '')
                    const parsed = parseFloat(cleaned)
                    return isNaN(parsed) ? 0 : parsed
                }
                return 0
            }

            // First pass: sum all latestPayout values for each callerId
            response.data.forEach((call: CallData) => {
                const callerId = call.callerId
                const latestPayout = parseLatestPayout(call.latestPayout)
                if (callerId && latestPayout > 0) {
                    const currentLTR = callerIdLtrMap.get(callerId) || 0
                    callerIdLtrMap.set(callerId, currentLTR + latestPayout)
                }
            })

            // Second pass: update lifetimeRevenue for each call with the aggregated LTR
            const processedData = response.data.map((call: CallData) => ({
                ...call,
                lifetimeRevenue: callerIdLtrMap.get(call.callerId) || 0,
            }))

            setData(processedData)
            setTotalRecords(response.pagination.total)
            setLastUpdated(new Date())
        } catch (error) {
            console.error('❌ Failed to refetch data:', error)
        } finally {
            setIsLoading(false)
        }
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
        lastUpdated,
    }
}
