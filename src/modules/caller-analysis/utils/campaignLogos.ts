/**
 * Campaign Logo Mapping Utility
 * Maps campaign IDs and names to their corresponding logo images
 */

import { useCampaignStore } from '@/modules/org/store/campaignStore'

export interface CampaignLogo {
    image: string
    name: string
}

// Get API base URL for constructing full logo URLs
const getApiBaseUrl = (): string => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
    // Remove trailing /api if present since logo URLs already include /uploads
    // Also remove trailing slashes to prevent double slashes
    return baseUrl.replace(/\/api$/, '').replace(/\/+$/, '')
}

// Helper to convert relative logo URL to absolute URL
const getAbsoluteLogoUrl = (logoUrl: string | null | undefined): string => {
    if (!logoUrl) return ''
    // If already absolute URL, return as-is
    if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
        return logoUrl
    }
    // Prepend API base URL to relative path
    const apiBase = getApiBaseUrl()
    // Ensure logoUrl starts with /
    const path = logoUrl.startsWith('/') ? logoUrl : `/${logoUrl}`
    return `${apiBase}${path}`
}

// Dynamic lookup from campaign store instead of hardcoded map
function findCampaignById(id: string | null | undefined) {
    if (!id) return null
    const campaigns = useCampaignStore.getState().campaigns
    // match by campaign_id first, fallback to primary id
    return (
        campaigns.find(
            (c) =>
                (c.campaign_id && c.campaign_id === id) || (c.id && c.id === id)
        ) || null
    )
}

/**
 * Gets the campaign logo for a given campaign ID
 * @param campaignId - Campaign ID (e.g., '111', '000', 'CA56446512fe4e4926a05e76574a7d6963')
 * @returns CampaignLogo object with image and name, or null if not found
 */
export function getCampaignLogo(
    campaignId: string | null | undefined
): CampaignLogo | null {
    if (!campaignId || typeof campaignId !== 'string') return null
    const c = findCampaignById(campaignId)
    if (!c || !c.logo_url) return null
    return {
        image: getAbsoluteLogoUrl(c.logo_url),
        name: c.name,
    }
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
    const parts = trimmedCampaign
        .split(/[,\s|]+/)
        .map((part) => part.trim())
        .filter((part) => part.length > 0)

    for (const part of parts) {
        const c = findCampaignById(part)
        if (c && c.logo_url && !logos.find((l) => l.name === c.name)) {
            logos.push({
                image: getAbsoluteLogoUrl(c.logo_url),
                name: c.name,
            })
        }
    }

    return logos
}
