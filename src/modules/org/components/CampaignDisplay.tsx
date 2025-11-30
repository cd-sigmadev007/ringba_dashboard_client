/**
 * CampaignDisplay Component
 * Displays campaign pills with +N indicator for overflow
 */

import React from 'react'
import clsx from 'clsx'
import type { CampaignDto } from '../services/campaignApi'
import { Tooltip } from '@/components/common'
import { cn } from '@/lib'

interface CampaignDisplayProps {
    campaigns: Array<CampaignDto>
    loading: boolean
    isDark: boolean
    onViewAll: () => void
    toAbsoluteLogoUrl: (url?: string | null) => string
    valueClass?: string
}

export const CampaignDisplay: React.FC<CampaignDisplayProps> = ({
    campaigns,
    loading,
    isDark,
    onViewAll,
    toAbsoluteLogoUrl,
    valueClass,
}) => {
    if (loading) {
        return <p className={valueClass}>Loading...</p>
    }

    if (campaigns.length === 0) {
        return (
            <p
                className={clsx(
                    'text-sm',
                    isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                )}
            >
                No campaigns assigned
            </p>
        )
    }

    return (
        <div
            className="flex items-center gap-2 flex-wrap"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Show first campaign */}
            {campaigns[0] && (
                <div
                    className={clsx(
                        'flex items-center gap-[5px] px-[7px] py-[5px] rounded-[50px]',
                        isDark ? 'bg-[#1B456F]' : 'bg-[#E1E5E9]'
                    )}
                >
                    {campaigns[0].logo_url && (
                        <img
                            src={toAbsoluteLogoUrl(campaigns[0].logo_url)}
                            alt={campaigns[0].name}
                            className="w-5 h-5 rounded-[30px] object-cover"
                        />
                    )}
                    <span
                        className={clsx(
                            'text-[14px] font-medium',
                            isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                        )}
                    >
                        {campaigns[0].name}
                    </span>
                </div>
            )}
            {/* Show +N for remaining campaigns */}
            {campaigns.length > 1 && (
                <Tooltip tooltipText={`View all ${campaigns.length} campaigns`}>
                    <span
                        className={cn(
                            'px-[7px] py-[7px] rounded-full flex items-center justify-center text-xs text-white bg-[#0254A5] cursor-pointer hover:bg-[#1B456F] transition-colors'
                        )}
                        onClick={(e) => {
                            e.stopPropagation()
                            onViewAll()
                        }}
                    >
                        +{campaigns.length - 1}
                    </span>
                </Tooltip>
            )}
        </div>
    )
}
