import React from 'react'
import clsx from 'clsx'
import type { CallData } from '../types'
import { useThemeStore } from '@/store/themeStore'
import { useIsMobile } from '@/lib/hooks/useMediaQuery'
import { PriorityStatusSection } from './PriorityStatusSection'
import { Tabs } from '@/components/ui'
import type { TabItem } from '@/components/ui/Tabs'
import { TranscriptTabContent, HistoryTabContent, JSONTabContent } from './tabs'

export interface PersonalIdentificationProps {
    callerData: CallData
}

export const PersonalIdentification: React.FC<PersonalIdentificationProps> = ({
    callerData,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const isMobile = useIsMobile()

    // Mock data based on CSV structure
    const additionalData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        phoneNumber: callerData.callerId,
        type: 'Inbound',
        address: '-',
        billed: 'No',
        latestPayout: '-',
        totalCost: callerData.lifetimeRevenue,
        ringbaCost: Math.round(callerData.lifetimeRevenue * 0.76 * 100) / 100,
        adCost: Math.round(callerData.lifetimeRevenue * 0.24 * 100) / 100,
    }

    // Config array for personal info
    const personalInfo = [
        { label: 'First Name', value: additionalData.firstName },
        { label: 'Last Name', value: additionalData.lastName },
        { label: 'Email', value: additionalData.email },
        { label: 'Phone Number', value: additionalData.phoneNumber },
        { label: 'Type', value: additionalData.type },
        { label: 'Address', value: additionalData.address },
        { label: 'Billed', value: additionalData.billed },
        { label: 'Latest Payout', value: additionalData.latestPayout },
    ]

    const revenueInfo = [
        {
            label: 'TOTAL COST',
            value: `$${additionalData.totalCost.toFixed(2)}`,
        },
        {
            label: 'RINGBA COST',
            value: `$${additionalData.ringbaCost.toFixed(2)}`,
        },
        { label: 'AD COST', value: `$${additionalData.adCost.toFixed(2)}` },
    ]

    // Styles
    const labelClass = clsx(
        'text-sm w-full max-w-[150px] whitespace-nowrap',
        isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
    )
    const valueClass = clsx(
        'text-sm',
        isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    )
    
    // Theme-aware border and background classes
    const borderClass = clsx(
        'border',
        isDark ? 'border-[#1B456F]' : 'border-[#E1E5E9]'
    )
    
    const containerBgClass = clsx(
        isDark ? 'bg-transparent' : 'bg-[#FFFFFF]'
    )

    const tabs: TabItem[] = [
        {
            id: 'transcription',
            label: 'Call Transcription',
            content: <TranscriptTabContent />
        },
        {
            id: 'history',
            label: 'History',
            content: <HistoryTabContent />
        },
        {
            id: 'json',
            label: 'JSON',
            content: <JSONTabContent callerData={callerData} />
        }
    ]

    return (
        <div className="w-full overflow-y-auto custom-scroll">
            <h2
                className={clsx(
                    'text-md font-semibold mb-6',
                    isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                )}
            >
                Personal Identification
            </h2>

            {/* Personal Info + Revenue */}
            <div className={clsx('flex flex-col rounded-sm', containerBgClass, borderClass)}>
                {personalInfo.map((item, idx) => (
                    <div
                        key={idx}
                        className={clsx(
                            'flex p-3.5 items-start gap-x-[32px] border-b last:border-b-0',
                            isDark ? 'border-[#1B456F]' : 'border-[#E1E5E9]'
                        )}
                    >
                        <p className={labelClass}>{item.label}</p>
                        <p className={valueClass}>{item.value}</p>
                    </div>
                ))}

                {/* Lifetime Revenue Section inside */}
                <div className={clsx(
                    'flex p-3.5 items-start flex-row gap-x-[32px] border-b',
                    isDark ? 'border-[#1B456F]' : 'border-[#E1E5E9]',
                    isMobile ? 'flex-col gap-y-4' : 'flex-row'
                )}>
                    <p className={labelClass}>Lifetime Revenue</p>
                    <div className={clsx(
                        'flex',
                        isMobile ? 'flex-col gap-y-2 self-end' : 'flex-row gap-x-6'
                    )}>
                        {revenueInfo.map((count, i) => (
                            <div
                                key={i}
                                className={clsx(
                                    'flex flex-col',
                                    isMobile ? 'justify-between items-start w-full' : 'items-start gap-x-[24px]'
                                )}
                            >
                                <p
                                    className={clsx(
                                        'text-sm',
                                        isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]',
                                        isMobile ? 'text-xs' : ''
                                    )}
                                >
                                    {count.label}
                                </p>
                                <p className={clsx(
                                    'font-bold', 
                                    valueClass,
                                    isMobile ? 'text-sm' : ''
                                )}>
                                    {count.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Section */}
                <PriorityStatusSection
                    title="Highest Priority"
                    statuses={callerData.status.filter(
                        (status) =>
                            status === 'High-Quality Un-billed (Critical)' ||
                            status === 'Chargeback Risk (Critical)'
                    )}
                />

                <PriorityStatusSection
                    title="High Priority"
                    statuses={callerData.status.filter(
                        (status) =>
                            status === 'Wrong Appliance Category' ||
                            status === 'Wrong Pest Control Category' ||
                            status === 'Short Call (<90s)' ||
                            status === 'Buyer Hung Up' ||
                            status === 'Immediate Hangup (<10s)' ||
                            status === 'No Coverage (ZIP)'
                    )}
                />

                <PriorityStatusSection
                    title="Medium Priority"
                    statuses={callerData.status.filter(
                        (status) =>
                            status === 'Competitor Mentioned' ||
                            status === 'Booking Intent' ||
                            status === 'Warranty/Status Inquiry'
                    )}
                />

                <PriorityStatusSection
                    title="Low Priority"
                    statuses={callerData.status.filter(
                        (status) =>
                            status === 'Positive Sentiment' ||
                            status === 'Negative Sentiment' ||
                            status === 'Repeat Customer' ||
                            status === 'Technical Terms Used'
                    )}
                />
            </div>

            {/* Tabs Section */}
            <div className="mt-6">
                <Tabs
                    tabs={tabs}
                    defaultActiveTab="transcription"
                />
            </div>
        </div>
    )
}
