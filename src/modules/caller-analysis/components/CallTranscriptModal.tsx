import React from 'react'
import { TranscriptContent } from './TranscriptContent'
import type { CallData } from '../types'
import type { TranscriptEntry } from '@/data/caller-tabs-data'
import { useIsMobile } from '@/lib'
import { Modal } from '@/components/ui'

export interface CallTranscriptModalProps {
    callerData: CallData
    isOpen: boolean
    onClose: () => void
}

export const CallTranscriptModal: React.FC<CallTranscriptModalProps> = ({
    callerData,
    isOpen,
    onClose,
}) => {
    const isMobile = useIsMobile()

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

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Call Transcript"
            position={isMobile ? 'bottom' : 'center'}
            size={isMobile ? 'full' : 'lg'}
            className={isMobile ? 'max-w-full max-h-[75vh]' : 'max-w-4xl'}
            animation={isMobile ? 'slide' : 'fade'}
            border={true}
        >
            <div className="space-y-6">
                <TranscriptContent
                    border={false}
                    transcriptData={transcriptEntries}
                />
            </div>
        </Modal>
    )
}

export default CallTranscriptModal
