/**
 * Campaign ID Mapping Utility
 * Maps campaign filter values to backend campaign IDs
 */

/**
 * Campaign ID mapping configuration
 * Maps frontend campaign filter values to backend campaign IDs
 */
const CAMPAIGN_ID_MAP: Record<string, string> = {
    // Medicare
    'M': '111',
    'Medicare': '111',
    'Medicare Only': '111',
    'MEDICARE': '111',
    
    // Pest Control
    'P': '000',
    'Pest Control': '000',
    'Pest Control Only': '000',
    'PEST CONTROL': '000',
    
    // Appliance Repair - keep existing ID
    '22630528277': '22630528277',
    'Appliance Repair': '22630528277',
    'Appliance Repair Only': '22630528277',
    'APPLIANCE REPAIR': '22630528277',
}

/**
 * Converts campaign filter values to backend campaign IDs
 * @param campaignFilters - Array of campaign filter values (e.g., ['M', 'P', '22630528277'])
 * @returns Array of backend campaign IDs (e.g., ['111', '000', '22630528277'])
 */
export function convertCampaignFiltersToIds(
    campaignFilters: Array<string>
): Array<string> {
    if (!campaignFilters || campaignFilters.length === 0) {
        return []
    }

    const ids = new Set<string>()

    for (const filter of campaignFilters) {
        // Try exact match first
        if (CAMPAIGN_ID_MAP[filter]) {
            ids.add(CAMPAIGN_ID_MAP[filter])
            continue
        }

        // Try case-insensitive match
        const upper = filter.toUpperCase()
        if (CAMPAIGN_ID_MAP[upper]) {
            ids.add(CAMPAIGN_ID_MAP[upper])
            continue
        }

        // Try case-insensitive partial match
        const lower = filter.toLowerCase()
        for (const [key, id] of Object.entries(CAMPAIGN_ID_MAP)) {
            if (key.toLowerCase() === lower || filter.toLowerCase().includes(key.toLowerCase())) {
                ids.add(id)
                break
            }
        }
    }

    return Array.from(ids)
}

/**
 * Gets the campaign ID for a given campaign filter value
 * @param campaignFilter - Campaign filter value (e.g., 'M', 'P', '22630528277')
 * @returns Backend campaign ID or the original value if no mapping found
 */
export function getCampaignId(campaignFilter: string): string {
    // Try exact match first
    if (CAMPAIGN_ID_MAP[campaignFilter]) {
        return CAMPAIGN_ID_MAP[campaignFilter]
    }

    // Try case-insensitive match
    const upper = campaignFilter.toUpperCase()
    if (CAMPAIGN_ID_MAP[upper]) {
        return CAMPAIGN_ID_MAP[upper]
    }

    // Try case-insensitive partial match
    const lower = campaignFilter.toLowerCase()
    for (const [key, id] of Object.entries(CAMPAIGN_ID_MAP)) {
        if (key.toLowerCase() === lower || campaignFilter.toLowerCase().includes(key.toLowerCase())) {
            return id
        }
    }

    // Return original value if no mapping found
    return campaignFilter
}

