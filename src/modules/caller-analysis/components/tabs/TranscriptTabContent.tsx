import React from 'react'
import clsx from 'clsx'
import { TranscriptContent } from '../TranscriptContent'
import type { TranscriptEntry } from '@/data/caller-tabs-data'
import { mockTranscriptData } from '@/data/caller-tabs-data'

export interface TranscriptTabContentProps {
    transcriptData?: Array<TranscriptEntry>
    className?: string
}

export const TranscriptTabContent: React.FC<TranscriptTabContentProps> = ({
    transcriptData = mockTranscriptData,
    className,
}) => {
    return (
        <div className={clsx('pt-4', className)}>
            <TranscriptContent transcriptData={transcriptData} border={false} />
        </div>
    )
}

export default TranscriptTabContent
