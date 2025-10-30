import React from 'react'
import { useIsMobile } from '@/lib'
import { Modal } from '@/components/ui'
import type { CallData } from '../types'
import { TranscriptContent } from './TranscriptContent'
import type { TranscriptEntry } from '@/data/caller-tabs-data'

export interface CallTranscriptModalProps {
    callerData: CallData
    isOpen: boolean
    onClose: () => void
}

export const CallTranscriptModal: React.FC<CallTranscriptModalProps> = ({
    callerData,
    isOpen,
    onClose
}) => {
    const isMobile = useIsMobile()

    if (!isOpen || !callerData) {
        return null
    }

    // Parse transcript into speaker-based entries (A/B)
    const parseTranscript = (raw?: string): TranscriptEntry[] => {
        if (!raw || typeof raw !== 'string') return []

        // Normalize separators like "A -", "A:", "B -", "B:"
        let normalized = raw
            .replace(/\r/g, '')
            .replace(/\n+/g, '\n')
            .replace(/\s*A\s*[-:]\s*/g, '\nA: ')
            .replace(/\s*B\s*[-:]\s*/g, '\nB: ')

        // Split on new lines and keep only non-empty lines
        const lines = normalized.split('\n').map(l => l.trim()).filter(Boolean)
        const entries: TranscriptEntry[] = []

        for (const line of lines) {
            const m = /^(A|B)\s*:\s*(.*)$/.exec(line)
            if (m) {
                const speaker = m[1] as 'A' | 'B'
                const text = m[2].trim()
                if (text) entries.push({ timestamp: '', speaker, text })
            } else {
                // No explicit speaker marker; append to last speaker or default to A
                if (entries.length > 0) {
                    entries[entries.length - 1].text += (entries[entries.length - 1].text ? ' ' : '') + line
                } else {
                    entries.push({ timestamp: '', speaker: 'A', text: line })
                }
            }
        }

        return entries
    }

    const transcriptEntries: TranscriptEntry[] = parseTranscript(callerData.transcript)

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
                <TranscriptContent border={false} transcriptData={transcriptEntries} />
            </div>
        </Modal>
    )
}

export default CallTranscriptModal
