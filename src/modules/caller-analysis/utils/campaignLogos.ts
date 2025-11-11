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
    '22630528277': {
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
 * @param campaignId - Campaign ID (e.g., '111', '000', '22630528277')
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
 * Useful for campaigns that contain multiple identifiers
 * @param campaign - Campaign ID or string containing IDs
 * @returns Array of CampaignLogo objects
 */
export function getCampaignLogos(
    campaign: string | null | undefined
): Array<CampaignLogo> {
    if (!campaign || typeof campaign !== 'string') {
        return []
    }

    const logos: Array<CampaignLogo> = []

    // Check for known campaign IDs in the string
    for (const [campaignId, logo] of Object.entries(CAMPAIGN_LOGO_MAP)) {
        if (
            campaign.includes(campaignId) &&
            !logos.find((l) => l.name === logo.name)
        ) {
            logos.push(logo)
        }
    }

    return logos
}
