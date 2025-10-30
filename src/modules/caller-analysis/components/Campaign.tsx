import React from 'react'
import medicareImg from '../../../assets/png/medicare.png'
import applianceImg from '../../../assets/png/appliance.png'
import pestImg from '../../../assets/png/pest.png'
import Tooltip from '@/components/common/Tooltip.tsx'

interface CampaignProps {
    campaign: string
}

export const Campaign: React.FC<CampaignProps> = ({ campaign }) => {
    // Safety check for undefined/null campaign
    if (!campaign || typeof campaign !== 'string') {
        return null
    }

    // Map campaign letters to images (legacy quick mapping)
    const campaignImages = [
        { key: 'MEDICARE', image: medicareImg, name: 'Medicare' },
        { key: 'APPLIANCE', image: applianceImg, name: 'Appliance Repair' },
        { key: 'PEST', image: pestImg, name: 'Pest Control' },
        { key: 'M', image: medicareImg, name: 'Medicare' },
        { key: 'A', image: applianceImg, name: 'Appliance Repair' },
        { key: 'P', image: pestImg, name: 'Pest Control' },
    ]

    const upper = campaign.toUpperCase()
    const matches = campaignImages.filter(item => upper.includes(item.key))

    // If no known logo, show a simple pill with the campaign text and a default initial circle
    if (matches.length === 0) {
        const initial = upper.charAt(0)
        return (
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-semibold text-gray-800 dark:text-gray-100">
                    {initial}
                </div>
                <span className="text-sm truncate max-w-[160px]" title={campaign}>{campaign}</span>
            </div>
        )
    }

    return (
        <div className="flex items-center" style={{ gap: '-3px' }}>
            {matches.map((item, index) => (
                <Tooltip key={`campaign-${index}`} tooltipText={item.name}>
                    <div
                        className="relative w-6 h-6 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ marginLeft: index > 0 ? '-3px' : '0', zIndex: matches.length - index }}
                        title={item.name}
                    >
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                </Tooltip>
            ))}
        </div>
    )
}
