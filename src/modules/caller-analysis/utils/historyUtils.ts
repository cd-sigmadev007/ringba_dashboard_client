/**
 * History Utilities
 * Utility functions for mapping API data to history entries
 */

import { parseLastCallDateAndTime } from './dateUtils'
import type { HistoryEntry } from '@/data/caller-tabs-data'
import type { FrontendCallerData } from '@/types/api'
import { formatDuration, parseNumeric } from '@/lib/utils/format'

/**
 * Maps API data to HistoryEntry array
 * Parses lastCall date/time, extracts revenue, determines converted status from payout, and extracts campaign ID
 * @param apiData - Array of FrontendCallerData from API
 * @returns Array of HistoryEntry objects
 */
export function mapApiDataToHistoryEntries(
    apiData: Array<FrontendCallerData>
): Array<HistoryEntry> {
    return apiData.map((h: FrontendCallerData) => {
        // Parse lastCall date and time
        const { date: dateStr, time: timeStr } = parseLastCallDateAndTime(
            h.lastCall
        )

        // Get revenue (from elocal); null when not yet available
        const raw = (h as any).revenue
        const revenue =
            raw != null && raw !== '' && Number.isFinite(Number(raw))
                ? Number(raw)
                : null

        // Parse latestPayout and determine converted status
        // User is shown as converted when payout > 0
        const payout = parseNumeric(h.latestPayout)
        const converted = payout > 0

        // Extract campaign ID from campaign string
        // Campaign can be a single ID or comma-separated IDs
        const campaignId = h.campaign
            ? h.campaign.split(',')[0].trim()
            : undefined

        return {
            date: dateStr,
            time: timeStr,
            duration: formatDuration(h.duration),
            converted,
            revenue,
            campaignId,
            campaignName: undefined, // Will be resolved by getCampaignLogo
            audioUrl: h.audioUrl,
            transcript: h.transcript,
        }
    })
}
