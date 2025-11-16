import React from 'react'
import { getCampaignLogos } from '../utils/campaignLogos'
import { Tooltip } from '@/components/common'

interface CampaignProps {
    campaign: string
}

/**
 * Generate a consistent Google-style color based on a string
 * Google uses muted, professional colors with lower saturation
 * Same string will always generate the same color
 */
const generateColorFromString = (str: string): string => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Google-style colors: muted, professional palette
    // Use lower saturation (30-50%) and medium-lightness (50-60%)
    const hue = Math.abs(hash) % 360
    const saturation = 30 + (Math.abs(hash) % 21) // 30-50% (muted)
    const lightness = 50 + (Math.abs(hash) % 11) // 50-60% (medium)

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export const Campaign: React.FC<CampaignProps> = ({ campaign }) => {
    // Safety check for undefined/null campaign
    if (!campaign || typeof campaign !== 'string') {
        return null
    }

    // Get campaign logos using the new mapping utility
    const logos = getCampaignLogos(campaign)

    // If no known logo, show only a colorful initial circle (no text)
    if (logos.length === 0) {
        const initial = campaign.toUpperCase().charAt(0)
        const bgColor = generateColorFromString(campaign)

        return (
            <Tooltip tooltipText={campaign}>
                <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white mx-auto"
                    style={{ backgroundColor: bgColor }}
                >
                    {initial}
                </div>
            </Tooltip>
        )
    }

    return (
        <div
            className="flex items-center justify-center mx-auto"
            style={{ gap: '-3px', width: 'fit-content' }}
        >
            {logos.map((logo, index) => (
                <Tooltip key={`campaign-${index}`} tooltipText={logo.name}>
                    <div
                        className="relative w-6 h-6 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                            marginLeft: index > 0 ? '-3px' : '0',
                            zIndex: logos.length - index,
                        }}
                        title={logo.name}
                    >
                        <img
                            src={logo.image}
                            alt={logo.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </Tooltip>
            ))}
        </div>
    )
}
