import React from 'react'
import { TranscriptContent } from '../TranscriptContent'
import { mockTranscriptData } from '@/data/caller-tabs-data'
import type { TranscriptEntry } from '@/data/caller-tabs-data'

export interface TranscriptTabContentProps {
    transcriptData?: TranscriptEntry[]
    className?: string
}

export const TranscriptTabContent: React.FC<TranscriptTabContentProps> = ({
    transcriptData = mockTranscriptData,
    className
}) => {
    return (
        <div className={className}>
            <TranscriptContent 
                transcriptData={transcriptData} 
                border={false} 
            />
        </div>
    )
}

export default TranscriptTabContent
