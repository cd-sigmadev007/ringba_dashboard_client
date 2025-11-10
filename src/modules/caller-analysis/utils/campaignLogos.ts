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
 * Add new campaign IDs/names and their corresponding logos here
 */
const CAMPAIGN_LOGO_MAP: Record<string, CampaignLogo> = {
    // Campaign IDs
    '22630528277': {
        image: applianceImg,
        name: 'Appliance Repair',
    },

    // Campaign Names (case-insensitive matching)
    'appliance repair': {
        image: applianceImg,
        name: 'Appliance Repair',
    },

    // Legacy single-letter mappings (for backward compatibility)
    A: {
        image: applianceImg,
        name: 'Appliance Repair',
    },
    APPLIANCE: {
        image: applianceImg,
        name: 'Appliance Repair',
    },

    M: {
        image: medicareImg,
        name: 'Medicare',
    },
    MEDICARE: {
        image: medicareImg,
        name: 'Medicare',
    },

    P: {
        image: pestImg,
        name: 'Pest Control',
    },
    PEST: {
        image: pestImg,
        name: 'Pest Control',
    },
}

/**
 * Gets the campaign logo for a given campaign identifier
 * @param campaign - Campaign ID or name
 * @returns CampaignLogo object with image and name, or null if not found
 */
export function getCampaignLogo(
    campaign: string | null | undefined
): CampaignLogo | null {
    if (!campaign || typeof campaign !== 'string') {
        return null
    }

    // Try exact match first (case-sensitive)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (CAMPAIGN_LOGO_MAP[campaign]) {
        return CAMPAIGN_LOGO_MAP[campaign]
    }

    // Try case-insensitive match
    const upper = campaign.toUpperCase()
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (CAMPAIGN_LOGO_MAP[upper]) {
        return CAMPAIGN_LOGO_MAP[upper]
    }

    // Try case-insensitive partial match for campaign names
    const lower = campaign.toLowerCase()
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (CAMPAIGN_LOGO_MAP[lower]) {
        return CAMPAIGN_LOGO_MAP[lower]
    }

    // Check if campaign contains any known keywords
    for (const [key, logo] of Object.entries(CAMPAIGN_LOGO_MAP)) {
        if (upper.includes(key) || lower.includes(key.toLowerCase())) {
            return logo
        }
    }

    return null
}

/**
 * Gets all campaign logos that match a campaign string
 * Useful for campaigns that contain multiple identifiers (e.g., "M A P")
 * @param campaign - Campaign ID or name
 * @returns Array of CampaignLogo objects
 */
export function getCampaignLogos(
    campaign: string | null | undefined
): Array<CampaignLogo> {
    if (!campaign || typeof campaign !== 'string') {
        return []
    }

    const logos: Array<CampaignLogo> = []
    const upper = campaign.toUpperCase()

    // Check for multiple campaign identifiers
    for (const [key, logo] of Object.entries(CAMPAIGN_LOGO_MAP)) {
        if (upper.includes(key) && !logos.find((l) => l.name === logo.name)) {
            logos.push(logo)
        }
    }

    return logos
}
