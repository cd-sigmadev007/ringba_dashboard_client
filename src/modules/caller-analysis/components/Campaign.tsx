import React from 'react'
import { Tooltip } from '@/components/common'
import { getCampaignLogos } from '../utils/campaignLogos'

interface CampaignProps {
    campaign: string
}

export const Campaign: React.FC<CampaignProps> = ({ campaign }) => {
    // Safety check for undefined/null campaign
    if (!campaign || typeof campaign !== 'string') {
        return null
    }

    // Get campaign logos using the new mapping utility
    const logos = getCampaignLogos(campaign)

    // If no known logo, show a simple pill with the campaign text and a default initial circle
    if (logos.length === 0) {
        const initial = campaign.toUpperCase().charAt(0)
        return (
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-semibold text-gray-800 dark:text-gray-100">
                    {initial}
                </div>
                <span
                    className="text-sm truncate max-w-[160px]"
                    title={campaign}
                >
                    {campaign}
                </span>
            </div>
        )
    }

    return (
        <div className="flex items-center" style={{ gap: '-3px' }}>
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
