import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import type { Caller, CallerFilter, FilterOperator } from '../graphql/types'
import type { CallData, FilterState } from '../types'

// Extend dayjs with timezone support
dayjs.extend(utc)
dayjs.extend(timezone)

const EST_TIMEZONE = 'America/New_York'

/**
 * Convert FilterState to GraphQL CallerFilter
 */

/**
 * Convert GraphQL Caller to CallData format
 */
export const convertGraphQLCallerToCallData = (caller: Caller): CallData => {
    // Debug logging for attributes
    if (caller.attributes && Object.keys(caller.attributes).length > 0) {
        console.log(
            '[convertGraphQLCallerToCallData] Converting caller with attributes:',
            {
                id: caller.id,
                attributesKeys: Object.keys(caller.attributes),
                hasPublisher: 'publisher' in caller.attributes,
                hasPublisherName: 'publisherName' in caller.attributes,
                publisherValue: caller.attributes.publisher,
                publisherNameValue: caller.attributes.publisherName,
            }
        )
    }

    return {
        id: caller.id,
        callerId: caller.callerId,
        lastCall: caller.lastCall,
        duration: caller.duration,
        lifetimeRevenue: caller.lifetimeRevenue,
        campaign: caller.campaign,
        action: caller.action,
        status: caller.status || [],
        audioUrl: caller.audioUrl,
        transcript: caller.transcript,
        revenue: caller.revenue,
        firstName: caller.firstName,
        lastName: caller.lastName,
        email: caller.email,
        type: caller.type,
        address: caller.address,
        streetNumber: caller.streetNumber,
        streetName: caller.streetName,
        streetType: caller.streetType,
        city: caller.city,
        state: caller.state,
        zip: caller.zip,
        ringbaCost: caller.ringbaCost,
        adCost: caller.adCost,
        call_timestamp: caller.callTimestamp,
        targetName: caller.targetName,
        // Preserve attributes jsonb for dynamic fields access
        attributes: caller.attributes || {},
        // Also spread attributes for backward compatibility (if needed)
        ...(caller.attributes || {}),
    }
}

export const convertFilterStateToGraphQLFilter = (
    filterState: FilterState,
    dynamicFilters?: Array<{
        field: string
        value: any
        operator: FilterOperator
    }>
): CallerFilter => {
    const filter: CallerFilter = {}

    if (filterState.searchQuery) {
        filter.search = filterState.searchQuery
    }

    if (filterState.campaignFilter.length > 0) {
        filter.campaign = filterState.campaignFilter
    }

    if (filterState.statusFilter.length > 0) {
        filter.status = filterState.statusFilter
    }

    if (filterState.dateRange.from) {
        // The Date object from the picker represents a calendar date
        // We need to interpret it as EST start of day
        // Extract year/month/day and create EST date at start of day
        const date = dayjs(filterState.dateRange.from)
        const estDate = dayjs.tz(
            `${date.year()}-${String(date.month() + 1).padStart(2, '0')}-${String(date.date()).padStart(2, '0')} 00:00:00`,
            EST_TIMEZONE
        )
        filter.dateFrom = estDate.toISOString()
    }

    if (filterState.dateRange.to) {
        // The Date object from the picker represents a calendar date
        // We need to interpret it as EST end of day
        // Extract year/month/day and create EST date at end of day
        const date = dayjs(filterState.dateRange.to)
        const estDate = dayjs.tz(
            `${date.year()}-${String(date.month() + 1).padStart(2, '0')}-${String(date.date()).padStart(2, '0')} 23:59:59`,
            EST_TIMEZONE
        )
        filter.dateTo = estDate.toISOString()
    }

    if (filterState.durationRange.min !== undefined) {
        filter.durationMin = filterState.durationRange.min
    }

    if (filterState.durationRange.max !== undefined) {
        filter.durationMax = filterState.durationRange.max
    }

    // Add dynamic field filters
    if (dynamicFilters && dynamicFilters.length > 0) {
        filter.dynamicFields = dynamicFilters.map((df) => ({
            field: df.field,
            operator: df.operator,
            value: df.value,
        }))
    }

    return filter
}
