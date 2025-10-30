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

    // Map plain transcript string into a simple TranscriptEntry[]
    const transcriptEntries: TranscriptEntry[] = callerData.transcript
        ? [{ timestamp: '00:00', speaker: 'A', text: callerData.transcript }]
        : []

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
            <TranscriptContent transcriptData={transcriptEntries} />
        </Modal>
    )
}

export default CallTranscriptModal
