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
    
    // Map campaign letters to images
    const campaignImages = [
        { key: 'M', image: medicareImg, name: 'Medicare' },
        { key: 'A', image: applianceImg, name: 'Appliance Repair' },
        { key: 'P', image: pestImg, name: 'Pest Control' },
    ]

    // Filter images based on campaign string
    const activeCampaigns = campaignImages.filter((item) =>
        campaign.toUpperCase().includes(item.key)
    )

    if (activeCampaigns.length === 0) {
        return null
    }

    return (
        <div className="flex items-center" style={{ gap: '-3px' }}>
            {activeCampaigns.map((item, index) => (
                <Tooltip
                    key={`campaign-${index}`}
                    tooltipText={item.name}
                >
                    <div
                        className="relative w-6 h-6 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                            marginLeft: index > 0 ? '-3px' : '0',
                            zIndex: activeCampaigns.length - index,
                        }}
                        title={item.name} // Fallback tooltip
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </Tooltip>
            ))}
        </div>
    )
}
