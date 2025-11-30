/**
 * CampaignsModal Component
 * Modal to display all assigned campaigns
 */

import React from 'react'
import clsx from 'clsx'
import type { CampaignDto } from '../services/campaignApi'
import { Modal } from '@/components/ui/Modal'
import { useIsMobile } from '@/lib'

interface CampaignsModalProps {
    open: boolean
    onClose: () => void
    campaigns: Array<CampaignDto>
    isDark: boolean
    toAbsoluteLogoUrl: (url?: string | null) => string
}

export const CampaignsModal: React.FC<CampaignsModalProps> = ({
    open,
    onClose,
    campaigns,
    isDark,
    toAbsoluteLogoUrl,
}) => {
    const isMobile = useIsMobile()

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Assigned Campaigns"
            position={isMobile ? 'bottom' : 'center'}
            size={isMobile ? 'full' : 'xl'}
            className={isMobile ? 'max-w-full max-h-[40vh]' : 'max-w-4xl'}
            animation={isMobile ? 'slide' : 'fade'}
            border={true}
        >
            <div className="space-y-4">
                {campaigns.length === 0 ? (
                    <p
                        className={clsx(
                            'text-sm text-center py-8',
                            isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                        )}
                    >
                        No campaigns assigned
                    </p>
                ) : (
                    <div className="flex flex-wrap gap-3 p-4">
                        {campaigns.map((campaign) => (
                            <div
                                key={campaign.id}
                                className={clsx(
                                    'flex items-center gap-[8px] px-[10px] py-[8px] rounded-[50px]',
                                    isDark ? 'bg-[#1B456F]' : 'bg-[#E1E5E9]'
                                )}
                            >
                                {campaign.logo_url && (
                                    <img
                                        src={toAbsoluteLogoUrl(
                                            campaign.logo_url
                                        )}
                                        alt={campaign.name}
                                        className="w-6 h-6 rounded-[30px] object-cover"
                                    />
                                )}
                                <span
                                    className={clsx(
                                        'text-[14px] font-medium',
                                        isDark
                                            ? 'text-[#F5F8FA]'
                                            : 'text-[#3F4254]'
                                    )}
                                >
                                    {campaign.name}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    )
}
