import React from 'react'
import clsx from 'clsx'
import type { TranscriptEntry } from '@/data/caller-tabs-data'
import { useThemeStore } from '@/store/themeStore'
import { mockTranscriptData } from '@/data/caller-tabs-data'

export interface TranscriptContentProps {
    transcriptData?: Array<TranscriptEntry>
    className?: string
    border?: boolean
}

export const TranscriptContent: React.FC<TranscriptContentProps> = ({
    transcriptData = mockTranscriptData,
    className,
    border = true,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <div className={clsx('space-y-4', className)}>
            {/* Transcript Content */}
            <div
                className={clsx(
                    'rounded-[7px]',
                    border
                        ? isDark
                            ? 'border border-[#1B456F]'
                            : 'border border-[#E1E5E9]'
                        : 'border-none'
                )}
            >
                <div className="space-y-4 p-4">
                    {transcriptData.map((entry, index) => (
                        <div key={index} className="flex gap-4">
                            {/* Timestamp */}
                            <div className="w-16 flex-shrink-0 flex items-start justify-start">
                                <span
                                    className={clsx(
                                        'text-xs font-medium',
                                        isDark
                                            ? 'text-[#7C8B9A]'
                                            : 'text-[#7C8B9A]'
                                    )}
                                >
                                    {entry.timestamp || '00:00'}
                                </span>
                            </div>

                            {/* Speaker badge */}
                            <div className="w-8 flex-shrink-0 flex items-start justify-center">
                                <span
                                    className={clsx(
                                        'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold',
                                        isDark
                                            ? 'bg-[#2D596B] text-[#A1A5B7]'
                                            : 'bg-[#E1E5E9] text-[#5E6278]'
                                    )}
                                >
                                    {entry.speaker || 'A'}
                                </span>
                            </div>

                            {/* Text */}
                            <div className="flex-1">
                                <div className="flex items-start gap-2">
                                    <p
                                        className={clsx(
                                            'text-sm leading-relaxed',
                                            isDark
                                                ? 'text-[#F5F8FA]'
                                                : 'text-[#3F4254]'
                                        )}
                                    >
                                        {entry.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TranscriptContent
