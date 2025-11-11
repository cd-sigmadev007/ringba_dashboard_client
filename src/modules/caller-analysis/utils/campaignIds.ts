/**
 * Campaign ID Mapping Utility
 * Maps campaign filter IDs to backend campaign IDs
 */

/**
 * Campaign ID mapping configuration
 * Maps legacy campaign filter IDs to backend campaign IDs
 * Backend IDs: '111' (Medicare), '000' (Pest Control), '22630528277' (Appliance Repair)
 */
const CAMPAIGN_ID_MAP: Record<string, string> = {
    // Legacy mappings (for backward compatibility)
    M: '111',
    P: '000',
}

/**
 * Backend campaign IDs - these pass through directly
 */
const BACKEND_CAMPAIGN_IDS = new Set(['111', '000', '22630528277'])

/**
 * Converts campaign filter IDs to backend campaign IDs
 * @param campaignFilters - Array of campaign filter IDs (e.g., ['111', '000', '22630528277'])
 * @returns Array of backend campaign IDs (e.g., ['111', '000', '22630528277'])
 */
export function convertCampaignFiltersToIds(
    campaignFilters: Array<string>
): Array<string> {
    if (campaignFilters.length === 0) {
        return []
    }

    const ids = new Set<string>()

    for (const filter of campaignFilters) {
        // If already a backend ID, use it directly
        if (BACKEND_CAMPAIGN_IDS.has(filter)) {
            ids.add(filter)
        } else {
            // Otherwise, map legacy ID to backend ID
            const backendId = CAMPAIGN_ID_MAP[filter] || filter
            ids.add(backendId)
        }
    }

    return Array.from(ids)
}

/**
 * Gets the campaign ID for a given campaign filter ID
 * @param campaignFilter - Campaign filter ID (e.g., 'M', 'P', '22630528277')
 * @returns Backend campaign ID or the original value if no mapping found
 */
export function getCampaignId(campaignFilter: string): string {
    return CAMPAIGN_ID_MAP[campaignFilter] || campaignFilter
}
