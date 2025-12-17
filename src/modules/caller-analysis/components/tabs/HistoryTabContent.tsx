import React, { useMemo, useState } from 'react'
import { getCampaignLogo } from '../../utils/campaignLogos'
import { TranscriptContent } from '../TranscriptContent'
import { parseTranscriptToEntries } from '../../utils/transcriptUtils'
import type { HistoryEntry } from '@/data/caller-tabs-data'
import { useThemeStore } from '@/store/themeStore'
import { mockHistoryData } from '@/data/caller-tabs-data'
import {
    ConvertedIcon,
    NotConvertedIcon,
    VerticalLineSeparator,
} from '@/assets/svg'
import { cn } from '@/lib'
import { WaveformAudioPlayer } from '@/components/ui/WaveformAudioPlayer'

export interface HistoryTabContentProps {
    historyData?: Array<HistoryEntry>
    className?: string
}

const ChevronIcon: React.FC<{ isDark: boolean }> = ({ isDark }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="w-6 h-6"
    >
        <path
            d="M16.8008 13.7998L12.0008 8.9998L7.20078 13.7998"
            stroke={isDark ? '#F5F8FA' : '#5E6278'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

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

    // Track which entries are expanded (using entry index + date as key)
    const [expandedEntries, setExpandedEntries] = useState<Set<string>>(
        new Set()
    )

    // Track playing state for each entry
    const [playingEntries, setPlayingEntries] = useState<Set<string>>(new Set())

    const toggleEntry = (entryKey: string) => {
        setExpandedEntries((prev) => {
            const next = new Set(prev)
            if (next.has(entryKey)) {
                next.delete(entryKey)
                // Stop playing when collapsing
                setPlayingEntries((playing) => {
                    const nextPlaying = new Set(playing)
                    nextPlaying.delete(entryKey)
                    return nextPlaying
                })
            } else {
                next.add(entryKey)
            }
            return next
        })
    }

    const handlePlayPause = (entryKey: string, playing: boolean) => {
        setPlayingEntries((prev) => {
            const next = new Set(prev)
            if (playing) {
                next.add(entryKey)
            } else {
                next.delete(entryKey)
            }
            return next
        })
    }

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

                        // Create unique key for this entry
                        const entryKey = `${group.date}-${entryIndex}`
                        const isExpanded = expandedEntries.has(entryKey)
                        const isPlaying = playingEntries.has(entryKey)

                        // Parse transcript if available
                        const transcriptEntries = entry.transcript
                            ? parseTranscriptToEntries(entry.transcript)
                            : []

                        return (
                            <div key={entryIndex}>
                                {/* Entry Header (always visible) */}
                                <div
                                    className={cn(
                                        'flex gap-[14px] items-start p-[16px] cursor-pointer',
                                        !isLastEntry &&
                                            !isExpanded &&
                                            'border-b',
                                        isDark
                                            ? 'border-[#1B456F]'
                                            : 'border-[#E1E5E9]'
                                    )}
                                    onClick={() => toggleEntry(entryKey)}
                                >
                                    {/* Status Icon */}
                                    <div className="shrink-0 size-[24px] mt-[4px] flex items-center justify-center">
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
                                            {/* Status Text with Campaign Badge */}
                                            <div className="flex gap-[10px] items-center justify-center">
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

                                                {/* Campaign Badge */}
                                                {campaignLogo && (
                                                    <div
                                                        className={cn(
                                                            'flex gap-[5px] items-center px-[7px] py-[5px] rounded-[50px]',
                                                            isDark
                                                                ? 'bg-[#1B456F]'
                                                                : 'bg-[#E1E5E9]'
                                                        )}
                                                    >
                                                        <img
                                                            src={
                                                                campaignLogo.image
                                                            }
                                                            alt={
                                                                campaignLogo.name
                                                            }
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

                                            {/* Time, Separator, Duration */}
                                            <div className="flex items-center gap-2 py-[5px]">
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

                                        {/* Right Side: Revenue */}
                                        <div className="flex flex-col gap-[5px] items-end shrink-0 text-right">
                                            <p
                                                className={cn(
                                                    'text-[12px] font-semibold uppercase whitespace-nowrap',
                                                    isDark
                                                        ? 'text-[#7E8299]'
                                                        : 'text-[#7E8299]'
                                                )}
                                            >
                                                Payout
                                            </p>
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
                                        </div>
                                    </div>

                                    {/* Chevron Icon */}
                                    <div className="flex items-center justify-center shrink-0">
                                        <div
                                            className={cn(
                                                'transition-transform duration-200',
                                                !isExpanded && 'rotate-180'
                                            )}
                                        >
                                            <ChevronIcon isDark={isDark} />
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content: Audio Player + Transcript */}
                                {isExpanded && entry.audioUrl && (
                                    <div
                                        className={cn(
                                            'flex flex-col',
                                            !isLastEntry && 'border-b',
                                            isDark
                                                ? 'border-[#1B456F]'
                                                : 'border-[#E1E5E9]'
                                        )}
                                    >
                                        {/* Audio Player */}
                                        <div
                                            className={cn(
                                                'border-t',
                                                isDark
                                                    ? 'border-[#1B456F]'
                                                    : 'border-[#E1E5E9]'
                                            )}
                                        >
                                            <WaveformAudioPlayer
                                                audioUrl={entry.audioUrl}
                                                isVisible={true}
                                                isPlaying={isPlaying}
                                                onPlayPause={(playing) =>
                                                    handlePlayPause(
                                                        entryKey,
                                                        playing
                                                    )
                                                }
                                                showBorder={false}
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Transcript */}
                                        {transcriptEntries.length > 0 && (
                                            <div
                                                className={cn(
                                                    'max-h-[427px] overflow-y-auto',
                                                    isDark
                                                        ? 'bg-[#0A1828]'
                                                        : 'bg-white'
                                                )}
                                            >
                                                <TranscriptContent
                                                    transcriptData={
                                                        transcriptEntries
                                                    }
                                                    border={false}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}

export default HistoryTabContent
