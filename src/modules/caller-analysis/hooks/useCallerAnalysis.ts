import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrBefore'
import isSameOrBefore from 'dayjs/plugin/isSameOrAfter'

import { callerApiService } from '../services/api'
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

    // Pagination batch tracking
    const BATCH_SIZE = 1000
    const [loadedBatches, setLoadedBatches] = useState<Set<number>>(
        new Set([1])
    )
    const [isLoadingBatch, setIsLoadingBatch] = useState(false)

    // Fetch a specific batch of data
    const fetchBatch = async (batchNumber: number) => {
        try {
            console.log(`🔄 Fetching batch ${batchNumber}...`)
            const response = await callerAnalysisApi.getAllCallers({
                filters,
                page: batchNumber,
                limit: BATCH_SIZE,
            })
            console.log(`✅ Batch ${batchNumber} fetched:`, response)

            // Convert API response to CallData format (this includes latestPayout)
            const convertedData: Array<CallData> = response.data.map(
                (apiData) =>
                    callerApiService.convertApiResponseToCallData(apiData)
            )

            return { convertedData, pagination: response.pagination }
        } catch (error) {
            console.error(`❌ Failed to fetch batch ${batchNumber}:`, error)
            throw error
        }
    }

    // Helper function to process and aggregate LTR data
    const processCallData = (
        convertedData: Array<CallData>
    ): Array<CallData> => {
        // Calculate LTR for each callerId (sum of all latestPayout for same callerId)
        const callerIdLtrMap = new Map<string, number>()

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
        return convertedData.map((call: CallData) => ({
            ...call,
            lifetimeRevenue: callerIdLtrMap.get(call.callerId) || 0,
        }))
    }

    // Load next batch when user reaches last page
    const loadNextBatch = async () => {
        if (isLoadingBatch) return

        const nextBatchNumber = Math.max(...Array.from(loadedBatches)) + 1
        const totalBatches = Math.ceil(totalRecords / BATCH_SIZE)

        // Check if there are more batches to load
        if (nextBatchNumber > totalBatches) {
            console.log('📄 No more batches to load')
            return
        }

        setIsLoadingBatch(true)
        try {
            const { convertedData, pagination } =
                await fetchBatch(nextBatchNumber)
            const processedData = processCallData(convertedData)

            // Merge with existing data
            setData((prevData) => {
                const merged = [...prevData, ...processedData]
                console.log(
                    `✅ Batch ${nextBatchNumber} loaded: ${processedData.length} records, total: ${merged.length}`
                )
                return merged
            })
            setLoadedBatches((prev) => new Set([...prev, nextBatchNumber]))
            setTotalRecords(pagination.total)
            // Note: Don't reset pagination - let the table maintain current page
            // The new data will be added, increasing total rows, but we stay on the same page number
        } catch (error) {
            console.error(`❌ Failed to load batch ${nextBatchNumber}:`, error)
        } finally {
            setIsLoadingBatch(false)
        }
    }

    // Fetch initial data for client-side pagination
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            setLoadedBatches(new Set([1])) // Reset batches when filters change
            try {
                const { convertedData, pagination } = await fetchBatch(1)
                const processedData = processCallData(convertedData)

                setData(processedData)
                setTotalRecords(pagination.total)
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
    // Handles formats: "Nov 07, 2025, 4:19:00 PM ET" or "Nov 07, 4:19:00 PM ET"
    const parseLastCallDate = (lastCall: string): Date | null => {
        try {
            // Try parsing with year first: "Nov 07, 2025, 4:19:00 PM ET"
            let dateMatch = lastCall.match(
                /(\w+)\s+(\d+),\s+(\d{4}),\s+(\d{1,2}):(\d{2}):(\d{2})\s+(AM|PM)\s+ET/
            )

            let year: number
            let month: string
            let day: string
            let hour: string
            let minute: string
            let second: string
            let ampm: string

            if (dateMatch) {
                // Format with year
                const [
                    ,
                    monthStr,
                    dayStr,
                    yearStr,
                    hourStr,
                    minuteStr,
                    secondStr,
                    ampmStr,
                ] = dateMatch
                month = monthStr
                day = dayStr
                year = parseInt(yearStr)
                hour = hourStr
                minute = minuteStr
                second = secondStr
                ampm = ampmStr
            } else {
                // Try parsing without year: "Aug 05, 06:00:00 AM ET"
                dateMatch = lastCall.match(
                    /(\w+)\s+(\d+),\s+(\d{2}):(\d{2}):(\d{2})\s+(AM|PM)\s+ET/
                )
                if (!dateMatch) return null

                const [
                    ,
                    monthStr,
                    dayStr,
                    hourStr,
                    minuteStr,
                    secondStr,
                    ampmStr,
                ] = dateMatch
                month = monthStr
                day = dayStr
                hour = hourStr
                minute = minuteStr
                second = secondStr
                ampm = ampmStr
                year = new Date().getFullYear() // Use current year as fallback
            }

            const monthIndex = new Date(
                Date.parse(month + ' 1, 2000')
            ).getMonth()

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
        // Note: Search filtering is primarily done on the backend for performance
        // This client-side filter is a fallback for already-fetched data
        const filtered = data.filter((d: CallData) => {
            // Search filter (caller ID only - partial matching done on backend)
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
        setLoadedBatches(new Set([1])) // Reset batches on refetch
        try {
            const { convertedData, pagination } = await fetchBatch(1)
            const processedData = processCallData(convertedData)

            setData(processedData)
            setTotalRecords(pagination.total)
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
        isLoadingBatch,
        refetch,
        lastUpdated,
        loadNextBatch,
        loadedBatches,
        BATCH_SIZE,
    }
}
