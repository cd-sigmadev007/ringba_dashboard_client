import React, { useState } from 'react'
import clsx from 'clsx'
import { TranscriptContent } from './TranscriptContent'
import { SummaryTabContent } from './tabs'
import type { CallData } from '../types'
import type { TabItem } from '@/components/ui/Tabs'
import type { TranscriptEntry } from '@/data/caller-tabs-data'
import { Modal, Tabs } from '@/components/ui'
import { useIsMobile } from '@/lib'
import { useThemeStore } from '@/store/themeStore'

export interface CallDetailsModalProps {
    callerData: CallData
    isOpen: boolean
    onClose: () => void
}

export const CallDetailsModal: React.FC<CallDetailsModalProps> = ({
    callerData,
    isOpen,
    onClose,
}) => {
    const isMobile = useIsMobile()
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    if (!isOpen) {
        return null
    }

    // Parse transcript into speaker-based entries (A/B) with timestamps
    const parseTranscript = (raw?: string): Array<TranscriptEntry> => {
        if (!raw || typeof raw !== 'string') return []

        // Format: "00:00 A - text,\n00:20 B - text,\n"
        // Split by newlines first, then parse each line
        const lines = raw
            .replace(/\r/g, '')
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean)

        const entries: Array<TranscriptEntry> = []

        for (const line of lines) {
            // Match format: "00:00 A - text," or "00:00 A: text," or "A - text,"
            // Pattern: optional timestamp, speaker (A or B), separator (- or :), text
            const m = /^(\d{2}:\d{2})?\s*(A|B)\s*[-:]\s*(.*)$/.exec(line)
            if (m) {
                const timestamp = m[1] || '00:00'
                const speaker = m[2] as 'A' | 'B'
                // Remove trailing comma if present
                const text = m[3].trim().replace(/,$/, '').trim()
                if (text) {
                    entries.push({ timestamp, speaker, text })
                }
            } else {
                // No explicit speaker marker; append to last speaker or default to A
                if (entries.length > 0) {
                    const lastEntry = entries[entries.length - 1]
                    const additionalText = line.replace(/,$/, '').trim()
                    if (additionalText) {
                        lastEntry.text +=
                            (lastEntry.text ? ' ' : '') + additionalText
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

    const transcriptEntries: Array<TranscriptEntry> = parseTranscript(
        callerData.transcript
    )

    const [activeTab, setActiveTab] = useState('summary')

    const tabs: Array<TabItem> = [
        {
            id: 'summary',
            label: 'Summary',
            content: <SummaryTabContent callerData={callerData} />,
        },
        {
            id: 'transcription',
            label: 'Transcription',
            content: (
                <TranscriptContent
                    border={false}
                    transcriptData={transcriptEntries}
                />
            ),
        },
    ]

    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            border={true}
            title={
                <Tabs
                    tabs={tabs}
                    defaultActiveTab="summary"
                    onChange={setActiveTab}
                    className="w-full mb-4"
                    tabsClassName=""
                    contentClassName="hidden"
                />
            }
            position={isMobile ? 'bottom' : 'center'}
            size={isMobile ? 'full' : 'lg'}
            className={clsx(
                isMobile ? 'max-w-full max-h-[75vh]' : 'min-w-[672px] h-[65vh]'
            )}
            animation={isMobile ? 'slide' : 'fade'}
            titleClassName="px-6 pt-6 pb-0"
            contentClassName="mx-6"
        >
            <div className="flex flex-col h-full min-h-0">
                {/* Fixed height content area with border to prevent size changes */}
                <div
                    className={clsx(
                        isDark
                            ? 'bg-transparent border-[#1B456F]'
                            : 'bg-[#FFFFFF] border-[#E1E5E9]'
                    )}
                >
                    {activeTabContent}
                </div>
            </div>
        </Modal>
    )
}

export default CallDetailsModal
