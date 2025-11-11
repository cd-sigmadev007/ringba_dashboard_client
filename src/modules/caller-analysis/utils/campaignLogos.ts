/**
 * Campaign Logo Mapping Utility
 * Maps campaign IDs and names to their corresponding logo images
 */

import applianceImg from '../../../assets/png/appliance.png'
import medicareImg from '../../../assets/png/medicare.png'
import pestImg from '../../../assets/png/pest.png'

export interface CampaignLogo {
    image: string
    name: string
}

/**
 * Campaign logo mapping configuration
 * Maps campaign IDs to their corresponding logo images
 */
const CAMPAIGN_LOGO_MAP: Record<string, CampaignLogo> = {
    // Appliance Repair
    'CA56446512fe4e4926a05e76574a7d6963': {
        image: applianceImg,
        name: 'Appliance Repair',
    },

    // Medicare
    '111': {
        image: medicareImg,
        name: 'Medicare',
    },

    // Pest Control
    '000': {
        image: pestImg,
        name: 'Pest Control',
    },
}

/**
 * Gets the campaign logo for a given campaign ID
 * @param campaignId - Campaign ID (e.g., '111', '000', 'CA56446512fe4e4926a05e76574a7d6963')
 * @returns CampaignLogo object with image and name, or null if not found
 */
export function getCampaignLogo(
    campaignId: string | null | undefined
): CampaignLogo | null {
    if (!campaignId || typeof campaignId !== 'string') {
        return null
    }

    // Direct ID lookup
    return CAMPAIGN_LOGO_MAP[campaignId]
}

/**
 * Gets all campaign logos that match a campaign string
 * Handles single IDs, comma-separated IDs, space-separated IDs, and campaign names
 * @param campaign - Campaign ID, comma/space-separated IDs, or campaign name
 * @returns Array of CampaignLogo objects
 */
export function getCampaignLogos(
    campaign: string | null | undefined
): Array<CampaignLogo> {
    if (!campaign || typeof campaign !== 'string') {
        return []
    }

    const logos: Array<CampaignLogo> = []
    const trimmedCampaign = campaign.trim()

    // First, try exact match for single campaign ID
    if (trimmedCampaign in CAMPAIGN_LOGO_MAP) {
        return [CAMPAIGN_LOGO_MAP[trimmedCampaign]]
    }

    // Split by common separators (comma, space, pipe) and check each part
    const parts = trimmedCampaign.split(/[,\s|]+/).map(part => part.trim()).filter(part => part.length > 0)
    
    // Check each part for exact ID matches
    for (const part of parts) {
        if (part in CAMPAIGN_LOGO_MAP) {
            const logo = CAMPAIGN_LOGO_MAP[part]
            if (!logos.find((l) => l.name === logo.name)) {
                logos.push(logo)
            }
        }
    }

    // If no exact matches found in parts, check if campaign string contains any IDs
    // This handles cases where IDs might be embedded in text
    if (logos.length === 0) {
        for (const [campaignId, logo] of Object.entries(CAMPAIGN_LOGO_MAP)) {
            // Use regex to match ID as whole value (not part of larger number)
            // Match ID at start/end of string, or surrounded by non-digit characters
            const idPattern = campaignId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            const idRegex = new RegExp(`(^|[^0-9])${idPattern}([^0-9]|$)`, 'i')
            
            if (
                idRegex.test(trimmedCampaign) &&
                !logos.find((l) => l.name === logo.name)
            ) {
                logos.push(logo)
            }
        }
    }

    return logos
}
