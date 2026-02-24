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
    // Backend sends revenue = latestPayout when revenue not set
    const revenue =
        caller.revenue != null
            ? typeof caller.revenue === 'number'
                ? caller.revenue
                : Number(caller.revenue)
            : caller.latestPayout != null
              ? typeof caller.latestPayout === 'string'
                  ? Number(caller.latestPayout)
                  : Number(caller.latestPayout)
              : null

    return {
        id: caller.id,
        ringbaRowId: caller.ringbaRowId ?? undefined,
        callerId: caller.callerId,
        phoneNumber: caller.phoneNumber ?? caller.callerId,
        lastCall: caller.lastCall,
        duration: caller.duration,
        lifetimeRevenue:
            caller.lifetimeRevenue != null ? Number(caller.lifetimeRevenue) : 0,
        campaign: caller.campaign,
        action: caller.action,
        status: caller.status || [],
        audioUrl: caller.audioUrl,
        transcript: caller.transcript,
        summary: caller.summary,
        revenue: Number.isFinite(revenue as number)
            ? (revenue as number)
            : null,
        firstName: caller.firstName,
        lastName: caller.lastName,
        email: caller.email,
        type: caller.type,
        address: caller.address,
        street_number: caller.street_number,
        street_name: caller.street_name,
        street_type: caller.street_type,
        city: caller.city,
        state: caller.state,
        g_zip: caller.g_zip,
        ringbaCost: caller.ringbaCost,
        adCost: caller.adCost,
        latestPayout: caller.latestPayout ?? null,
        call_timestamp: caller.callTimestamp,
        callTimestamp: caller.callTimestamp ?? null,
        callLengthInSeconds: caller.callLengthInSeconds ?? null,
        targetName: caller.targetName ?? null,
        publisherName: caller.publisherName ?? null,
        // Only dynamic (non-fixed) fields; fixed fields are top-level
        attributes: caller.attributes || {},
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
