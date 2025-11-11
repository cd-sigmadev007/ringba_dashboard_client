/**
 * Campaign ID Mapping Utility
 * Converts campaign filter IDs to backend campaign IDs
 * All filter values are already backend IDs - no mapping needed
 */

/**
 * Converts campaign filter IDs to backend campaign IDs
 * Since we're using IDs directly, this just validates and returns them
 * @param campaignFilters - Array of campaign filter IDs (e.g., ['111', '000', 'CA56446512fe4e4926a05e76574a7d6963'])
 * @returns Array of backend campaign IDs
 */
export function convertCampaignFiltersToIds(
    campaignFilters: Array<string>
): Array<string> {
    if (campaignFilters.length === 0) {
        return []
    }

    // Return IDs as-is (they're already backend IDs)
    // Filter out empty or invalid IDs
    return campaignFilters.filter((id) => id && id.trim().length > 0)
}

/**
 * Gets the campaign ID for a given campaign filter ID
 * @param campaignFilter - Campaign filter ID
 * @returns The campaign ID as-is (no mapping needed)
 */
export function getCampaignId(campaignFilter: string): string {
    return campaignFilter
}
