import React, { useMemo } from 'react'
import { getCampaignLogo } from '../../utils/campaignLogos'
import type { HistoryEntry } from '@/data/caller-tabs-data'
import { useThemeStore } from '@/store/themeStore'
import { mockHistoryData } from '@/data/caller-tabs-data'
import {
    ConvertedIcon,
    NotConvertedIcon,
    VerticalLineSeparator,
} from '@/assets/svg'
import { cn } from '@/lib'

export interface HistoryTabContentProps {
    historyData?: Array<HistoryEntry>
    className?: string
}

interface GroupedHistoryEntry {
    date: string
    entries: Array<HistoryEntry>
}

export const HistoryTabContent: React.FC<HistoryTabContentProps> = ({
    historyData = mockHistoryData,
    className,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    // Group entries by date
    const groupedEntries = useMemo(() => {
        const groups = new Map<string, Array<HistoryEntry>>()

        historyData.forEach((entry) => {
            const date = entry.date
            if (!groups.has(date)) {
                groups.set(date, [])
            }
            groups.get(date)!.push(entry)
        })

        // Convert to array and sort by date (most recent first)
        const grouped: Array<GroupedHistoryEntry> = Array.from(
            groups.entries()
        ).map(([date, entries]) => ({
            date,
            entries,
        }))

        // Sort by date (most recent first) - simple string comparison for "Nov 07, 2025" format
        grouped.sort((a, b) => {
            // Parse dates and compare (fallback to string comparison if parsing fails)
            try {
                const dateA = new Date(a.date)
                const dateB = new Date(b.date)
                return dateB.getTime() - dateA.getTime()
            } catch {
                return b.date.localeCompare(a.date)
            }
        })

        return grouped
    }, [historyData])

    return (
        <div className={cn('flex flex-col gap-4 pt-[16px]', className)}>
            {groupedEntries.map((group) => (
                <div
                    key={group.date}
                    className={cn(
                        'border rounded-[7px] overflow-hidden',
                        isDark ? 'border-[#1B456F]' : 'border-[#E1E5E9]'
                    )}
                >
                    {/* Date Header */}
                    <div
                        className={cn(
                            'flex items-start gap-8 p-[14px] border-b',
                            isDark ? 'border-[#1B456F]' : 'border-[#E1E5E9]'
                        )}
                    >
                        <p
                            className={cn(
                                'font-medium text-[14px] whitespace-nowrap',
                                isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                            )}
                        >
                            {group.date}
                        </p>
                    </div>

                    {/* Entries */}
                    {group.entries.map((entry, entryIndex) => {
                        const isLastEntry =
                            entryIndex === group.entries.length - 1
                        const campaignLogo = getCampaignLogo(
                            entry.campaignId || entry.campaignName || ''
                        )

                        return (
                            <div
                                key={entryIndex}
                                className={cn(
                                    'flex gap-[14px] items-start p-[14px]',
                                    !isLastEntry && 'border-b',
                                    isDark
                                        ? 'border-[#1B456F]'
                                        : 'border-[#E1E5E9]'
                                )}
                            >
                                {/* Status Icon */}
                                <div className="shrink-0 size-[24px] flex items-center justify-center">
                                    {entry.converted ? (
                                        <ConvertedIcon className="size-[24px]" />
                                    ) : (
                                        <NotConvertedIcon className="size-[24px]" />
                                    )}
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 flex items-start justify-between min-w-0 gap-4">
                                    {/* Left Side: Status, Time, Duration */}
                                    <div className="flex flex-col gap-[5px] min-w-0">
                                        {/* Status Text */}
                                        <p
                                            className={cn(
                                                'font-medium text-[16px] whitespace-nowrap',
                                                isDark
                                                    ? 'text-[#F5F8FA]'
                                                    : 'text-[#3F4254]'
                                            )}
                                        >
                                            {entry.converted
                                                ? 'Converted'
                                                : 'Not Converted'}
                                        </p>

                                        {/* Time, Separator, Duration */}
                                        <div className="flex items-center gap-2">
                                            <p
                                                className={cn(
                                                    'font-medium text-[14px] whitespace-nowrap',
                                                    isDark
                                                        ? 'text-[#A1A5B7]'
                                                        : 'text-[#5E6278]'
                                                )}
                                            >
                                                {entry.time}
                                            </p>
                                            <VerticalLineSeparator className="shrink-0 size-[20px]" />
                                            <p
                                                className={cn(
                                                    'font-medium text-[14px] whitespace-nowrap',
                                                    isDark
                                                        ? 'text-[#A1A5B7]'
                                                        : 'text-[#5E6278]'
                                                )}
                                            >
                                                {entry.duration}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Side: Revenue, Campaign Badge */}
                                    <div className="flex flex-col gap-[5px] items-end shrink-0">
                                        {/* Revenue */}
                                        <p
                                            className={cn(
                                                'font-medium text-[16px] whitespace-nowrap',
                                                isDark
                                                    ? 'text-[#F5F8FA]'
                                                    : 'text-[#3F4254]'
                                            )}
                                        >
                                            ${entry.revenue.toFixed(2)}
                                        </p>

                                        {/* Campaign Badge */}
                                        {campaignLogo && (
                                            <div
                                                className={cn(
                                                    'flex gap-[5px] items-center px-[7px] py-[3px] rounded-[50px]',
                                                    isDark
                                                        ? 'bg-[#1B456F]'
                                                        : 'bg-[#E1E5E9]'
                                                )}
                                            >
                                                <img
                                                    src={campaignLogo.image}
                                                    alt={campaignLogo.name}
                                                    className="size-4 rounded-full object-cover"
                                                />
                                                <p
                                                    className={cn(
                                                        'font-medium text-[14px] whitespace-nowrap',
                                                        isDark
                                                            ? 'text-[#F5F8FA]'
                                                            : 'text-[#3F4254]'
                                                    )}
                                                >
                                                    {campaignLogo.name}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}

export default HistoryTabContent
