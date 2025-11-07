import React from 'react'
import clsx from 'clsx'
import type { CallData } from '../types'
import { useThemeStore } from '@/store/themeStore'
import { useIsMobile } from '@/lib/hooks/useMediaQuery'
import { PriorityStatusSection } from './PriorityStatusSection'
import { Tabs } from '@/components/ui'
import type { TabItem } from '@/components/ui/Tabs'
import { TranscriptTabContent, HistoryTabContent, JSONTabContent } from './tabs'
import type { TranscriptEntry, HistoryEntry } from '@/data/caller-tabs-data'
import { useCallerAnalysisApi } from '../hooks'
import type { FrontendCallerData } from '@/types/api'

export interface PersonalIdentificationProps {
    callerData: CallData
}

export const PersonalIdentification: React.FC<PersonalIdentificationProps> = ({
    callerData,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const isMobile = useIsMobile()

    // Use real data from API, fallback to defaults if not available
    // Ensure numeric values are properly converted
    const ringbaCostValue = callerData.ringbaCost != null 
        ? (typeof callerData.ringbaCost === 'number' ? callerData.ringbaCost : Number(callerData.ringbaCost))
        : (Math.round(callerData.lifetimeRevenue * 0.76 * 100) / 100);
    const adCostValue = callerData.adCost != null
        ? (typeof callerData.adCost === 'number' ? callerData.adCost : Number(callerData.adCost))
        : (Math.round(callerData.lifetimeRevenue * 0.24 * 100) / 100);
    
    // Ensure totalCost is also a number
    const totalCostValue = typeof callerData.lifetimeRevenue === 'number' 
        ? callerData.lifetimeRevenue 
        : Number(callerData.lifetimeRevenue) || 0;
    
    // Build address from parts
    const buildAddress = (): string => {
        const parts: string[] = [];
        
        // Add street number
        if (callerData.streetNumber && callerData.streetNumber !== 'NA' && callerData.streetNumber.trim()) {
            parts.push(callerData.streetNumber.trim());
        }
        
        // Add street name
        if (callerData.streetName && callerData.streetName !== 'NA' && callerData.streetName.trim()) {
            parts.push(callerData.streetName.trim());
        }
        
        // Add street type
        if (callerData.streetType && callerData.streetType !== 'NA' && callerData.streetType.trim()) {
            parts.push(callerData.streetType.trim());
        }
        
        // Join street parts
        const street = parts.length > 0 ? parts.join(' ') : null;
        
        // Build full address
        const addressParts: string[] = [];
        if (street) addressParts.push(street);
        if (callerData.city && callerData.city !== 'NA' && callerData.city.trim()) {
            addressParts.push(callerData.city.trim());
        }
        if (callerData.state && callerData.state !== 'NA' && callerData.state.trim()) {
            addressParts.push(callerData.state.trim());
        }
        if (callerData.zip && callerData.zip !== 'NA' && callerData.zip.trim()) {
            addressParts.push(callerData.zip.trim());
        }
        
        return addressParts.length > 0 ? addressParts.join(', ') : (callerData.address || '-');
    };
    
    const additionalData = {
        firstName: callerData.firstName || '-',
        lastName: callerData.lastName || '-',
        email: callerData.email || '-',
        phoneNumber: callerData.callerId,
        type: callerData.type || 'Inbound',
        address: buildAddress(),
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
    
    const containerBgClass = clsx(
        isDark ? 'bg-transparent' : 'bg-[#FFFFFF]'
    )

    // Fetch history by phone number
    const { useGetCallerHistoryByPhone } = useCallerAnalysisApi()
    const { data: historyResp } = useGetCallerHistoryByPhone(callerData.callerId)

    // Parse transcript string to entries with timestamps
    const parseTranscript = (raw?: string): TranscriptEntry[] => {
        if (!raw || typeof raw !== 'string') return []

        // Format: "00:00 A - text,\n00:20 B - text,\n"
        // Split by newlines first, then parse each line
        const lines = raw
            .replace(/\r/g, '')
            .split('\n')
            .map(l => l.trim())
            .filter(Boolean)

        const entries: TranscriptEntry[] = []

        for (const line of lines) {
            // Match format: "00:00 A - text," or "00:00 A: text," or "A - text,"
            // Pattern: optional timestamp, speaker (A or B), separator (- or :), text
            const m = /^(\d{2}:\d{2})?\s*(A|B)\s*[-:]\s*(.*)$/.exec(line)
            if (m) {
                const timestamp = m[1] || '00:00'
                const speaker = m[2] as 'A' | 'B'
                // Remove trailing comma if present
                let text = m[3].trim().replace(/,$/, '').trim()
                if (text) {
                    entries.push({ timestamp, speaker, text })
                }
            } else {
                // No explicit speaker marker; append to last speaker or default to A
                if (entries.length > 0) {
                    const lastEntry = entries[entries.length - 1]
                    const additionalText = line.replace(/,$/, '').trim()
                    if (additionalText) {
                        lastEntry.text += (lastEntry.text ? ' ' : '') + additionalText
                    }
                } else {
                    const text = line.replace(/,$/, '').trim()
                    if (text) {
                        entries.push({ timestamp: '00:00', speaker: 'A', text })
                    }
                }
            }
        }

        return entries
    }

    const transcriptEntries: TranscriptEntry[] = parseTranscript(callerData.transcript)

    // Map history API rows to HistoryEntry[] used by tab
    const historyData: HistoryEntry[] = (historyResp?.data || []).map((h: FrontendCallerData) => {
        // lastCall is like 'Oct 30, 10:21:06 PM ET' -> keep as single date; split time if parsable
        const dateStr = h.lastCall
        const rev = Number((h as any).revenue)
        return {
            date: dateStr,
            time: '',
            duration: h.duration,
            status: 'Completed',
            revenue: Number.isFinite(rev) ? rev : 0,
        }
    })

    const tabs: TabItem[] = [
        {
            id: 'transcription',
            label: 'Call Transcription',
            content: <TranscriptTabContent transcriptData={transcriptEntries} />
        },
        {
            id: 'history',
            label: 'History',
            content: <HistoryTabContent historyData={historyData} />
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
