// Mock data for caller tabs - in real app this would come from API

export interface TranscriptEntry {
    timestamp: string
    speaker: string
    text: string
}

export interface HistoryEntry {
    date: string
    time: string
    duration: string
    status: 'Completed' | 'Incomplete'
    revenue: number
}

export interface CallerAnalysisData {
    sentiment: string
    keywords: string[]
    confidence: number
}

export const mockTranscriptData: TranscriptEntry[] = [
    {
        timestamp: '00:00',
        speaker: 'A',
        text: 'Please hold while we connect your call. Calls may be recorded. Thank you for calling acre plumbing and air. Your call may be recorded for quality assurance. Have you ever answered your door and not known the person on the other side for your peace of mind?'
    },
    {
        timestamp: '00:20',
        speaker: 'A',
        text: 'All of our technicians wear an identification badge. We subscribe to the technician seal of safety that assures you all staff members are drug free, well trained, and have had a criminal background check performed before employment with Acriair. Thank you for holding. Our representative will be with you momentarily. 1800 we are open a cre air.'
    },
    {
        timestamp: '00:46',
        speaker: 'B',
        text: 'Need a repair, but don\'t want surprises when you get the bill. We know what you mean. Our straightforward pricing means you know the price before we start. We don\'t charge more, even if the job takes longer. Our technicians are fully trained and come to your home in a fully stocked.'
    }
]

export const mockHistoryData: HistoryEntry[] = [
    {
        date: '2024-01-15',
        time: '10:30 AM',
        duration: '5:23',
        status: 'Completed',
        revenue: 125.00
    },
    {
        date: '2024-01-10',
        time: '2:45 PM',
        duration: '3:12',
        status: 'Completed',
        revenue: 85.50
    },
    {
        date: '2024-01-05',
        time: '11:20 AM',
        duration: '7:45',
        status: 'Incomplete',
        revenue: 0.00
    }
]

export const mockAnalysisData: CallerAnalysisData = {
    sentiment: 'positive',
    keywords: ['plumbing', 'air', 'repair', 'technician'],
    confidence: 0.87
}

export const generateMockJsonData = (callerData: any) => ({
    callId: callerData.callerId,
    timestamp: new Date().toISOString(),
    duration: callerData.duration,
    status: callerData.status,
    transcript: mockTranscriptData,
    metadata: {
        callerId: callerData.callerId,
        lastCall: callerData.lastCall,
        lifetimeRevenue: callerData.lifetimeRevenue,
        campaign: callerData.campaign
    },
    analysis: mockAnalysisData
})
