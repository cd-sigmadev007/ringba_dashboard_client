/**
 * History Utilities
 * Utility functions for mapping API data to history entries
 */

import { parseLastCallDateAndTime } from './dateUtils'
import type { HistoryEntry } from '@/data/caller-tabs-data'
import type { FrontendCallerData } from '@/types/api'
import { formatDuration } from '@/lib/utils/format'

/**
 * Maps API data to HistoryEntry array
 * Parses lastCall date/time, extracts revenue, generates converted status, and extracts campaign ID
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

        // Get revenue
        const rev = Number((h as any).revenue)
        const revenue = Number.isFinite(rev) ? rev : 0

        // Generate random converted status (true/false) based on revenue
        // If revenue > 0, more likely to be converted, but still random
        // This is temporary until backend provides converted status
        const converted =
            revenue > 0
                ? Math.random() > 0.2 // 80% chance if revenue > 0
                : Math.random() > 0.8 // 20% chance if revenue = 0

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
        }
    })
}
