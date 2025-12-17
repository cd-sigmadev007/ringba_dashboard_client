import React from 'react'
import clsx from 'clsx'
import { useCallerAnalysisApi } from '../hooks'
import { buildAddressFromCallData } from '../utils/addressUtils'
import { mapApiDataToHistoryEntries } from '../utils/historyUtils'
import { Priority, STATUS_PRIORITY_MAP } from '../types/priority.types'
import { PriorityStatusSection } from './PriorityStatusSection'
import { HistoryTabContent, JSONTabContent } from './tabs'
import type { CallData } from '../types'
import type { TabItem } from '@/components/ui/Tabs'
import type { HistoryEntry } from '@/data/caller-tabs-data'
import { useThemeStore } from '@/store/themeStore'
import { useIsMobile } from '@/lib/hooks/useMediaQuery'
import { Tabs } from '@/components/ui'

export interface PersonalIdentificationProps {
    callerData: CallData
}

export const PersonalIdentification: React.FC<PersonalIdentificationProps> = ({
    callerData,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const isMobile = useIsMobile()

    // Use real data from API, fallback to 0 if not available
    // Ensure numeric values are properly converted
    const ringbaCostValue =
        callerData.ringbaCost != null
            ? typeof callerData.ringbaCost === 'number'
                ? callerData.ringbaCost
                : Number(callerData.ringbaCost)
            : 0
    const adCostValue =
        callerData.adCost != null
            ? typeof callerData.adCost === 'number'
                ? callerData.adCost
                : Number(callerData.adCost)
            : 0

    // Total cost = ringbaCost + adCost (always, regardless of other values)
    const totalCostValue = ringbaCostValue + adCostValue

    const additionalData = {
        firstName: callerData.firstName || '-',
        lastName: callerData.lastName || '-',
        email: callerData.email || '-',
        phoneNumber: callerData.callerId,
        type: callerData.type || 'Inbound',
        address: buildAddressFromCallData(callerData),
        billed: callerData.billed || 'No',
        latestPayout: callerData.latestPayout || '-',
        totalCost: Number.isFinite(totalCostValue) ? totalCostValue : 0,
        ringbaCost: Number.isFinite(ringbaCostValue) ? ringbaCostValue : 0,
        adCost: Number.isFinite(adCostValue) ? adCostValue : 0,
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

    const containerBgClass = clsx(isDark ? 'bg-transparent' : 'bg-[#FFFFFF]')

    // Fetch history by phone number
    const { useGetCallerHistoryByPhone } = useCallerAnalysisApi()
    const { data: historyResp } = useGetCallerHistoryByPhone(
        callerData.callerId
    )

    // Map history API rows to HistoryEntry[] used by tab
    const historyData: Array<HistoryEntry> = mapApiDataToHistoryEntries(
        historyResp?.data || []
    )

    const tabs: Array<TabItem> = [
        {
            id: 'history',
            label: 'History',
            content: <HistoryTabContent historyData={historyData} />,
        },
        {
            id: 'json',
            label: 'JSON',
            content: <JSONTabContent callerData={callerData} />,
        },
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
            <div
                className={clsx(
                    'flex flex-col rounded-sm',
                    containerBgClass,
                    borderClass
                )}
            >
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
                <div
                    className={clsx(
                        'flex p-3.5 items-start flex-row gap-x-[32px]',
                        isDark ? 'border-[#1B456F]' : 'border-[#E1E5E9]',
                        isMobile ? 'flex-col gap-y-4' : 'flex-row'
                    )}
                >
                    <p className={labelClass}>Lifetime Revenue</p>
                    <div
                        className={clsx(
                            'flex',
                            isMobile
                                ? 'flex-col gap-y-2 self-end'
                                : 'flex-row gap-x-6'
                        )}
                    >
                        {revenueInfo.map((count, i) => (
                            <div
                                key={i}
                                className={clsx(
                                    'flex flex-col',
                                    isMobile
                                        ? 'justify-between items-start w-full'
                                        : 'items-start gap-x-[24px]'
                                )}
                            >
                                <p
                                    className={clsx(
                                        'text-sm',
                                        isDark
                                            ? 'text-[#A1A5B7]'
                                            : 'text-[#5E6278]',
                                        isMobile ? 'text-xs' : ''
                                    )}
                                >
                                    {count.label}
                                </p>
                                <p
                                    className={clsx(
                                        'font-bold',
                                        valueClass,
                                        isMobile ? 'text-sm' : ''
                                    )}
                                >
                                    {count.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Section - Use dynamic categorization like StatusModal */}
                {(() => {
                    // Categorize statuses by priority dynamically using STATUS_PRIORITY_MAP
                    // This ensures all tags from the database are shown, not just hardcoded ones
                    const categorizeByPriority = (statuses: Array<string>) => {
                        const highest: Array<string> = []
                        const high: Array<string> = []
                        const medium: Array<string> = []
                        const low: Array<string> = []

                        statuses.forEach((status) => {
                            const priority =
                                STATUS_PRIORITY_MAP[status] ?? Priority.LOW
                            switch (priority) {
                                case Priority.HIGHEST:
                                    highest.push(status)
                                    break
                                case Priority.HIGH:
                                    high.push(status)
                                    break
                                case Priority.MEDIUM:
                                    medium.push(status)
                                    break
                                case Priority.LOW:
                                    low.push(status)
                                    break
                                default:
                                    low.push(status) // Default to low if not found
                            }
                        })

                        return { highest, high, medium, low }
                    }

                    const {
                        highest: highestPriorityStatuses,
                        high: highPriorityStatuses,
                        medium: mediumPriorityStatuses,
                        low: lowPriorityStatuses,
                    } = categorizeByPriority(callerData.status)

                    return (
                        <>
                            <PriorityStatusSection
                                title="Highest Priority"
                                statuses={highestPriorityStatuses}
                            />

                            <PriorityStatusSection
                                title="High Priority"
                                statuses={highPriorityStatuses}
                            />

                            <PriorityStatusSection
                                title="Medium Priority"
                                statuses={mediumPriorityStatuses}
                            />

                            <PriorityStatusSection
                                title="Low Priority"
                                statuses={lowPriorityStatuses}
                            />
                        </>
                    )
                })()}
            </div>

            {/* Tabs Section */}
            <div className="mt-6">
                <Tabs tabs={tabs} defaultActiveTab="history" />
            </div>
        </div>
    )
}
