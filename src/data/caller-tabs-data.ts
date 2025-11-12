// Mock data for caller tabs - in real app this would come from API

export interface TranscriptEntry {
    timestamp: string
    speaker: string
    text: string
}

export interface HistoryEntry {
    date: string // Date header (e.g., "Nov 07, 2025")
    time: string // Time in format "08:08:30 PM ET"
    duration: string // Duration in format "03m 15s"
    converted: boolean // true for "Converted", false for "Not Converted"
    revenue: number // Revenue amount
    campaignId?: string // Campaign ID for badge
    campaignName?: string // Campaign name for badge (fallback)
}

export interface CallerAnalysisData {
    sentiment: string
    keywords: Array<string>
    confidence: number
}

export const mockTranscriptData: Array<TranscriptEntry> = [
    {
        timestamp: '00:00',
        speaker: 'A',
        text: 'Please hold while we connect your call. Calls may be recorded. Thank you for calling acre plumbing and air. Your call may be recorded for quality assurance. Have you ever answered your door and not known the person on the other side for your peace of mind?',
    },
    {
        timestamp: '00:20',
        speaker: 'A',
        text: 'All of our technicians wear an identification badge. We subscribe to the technician seal of safety that assures you all staff members are drug free, well trained, and have had a criminal background check performed before employment with Acriair. Thank you for holding. Our representative will be with you momentarily. 1800 we are open a cre air.',
    },
    {
        timestamp: '00:46',
        speaker: 'B',
        text: "Need a repair, but don't want surprises when you get the bill. We know what you mean. Our straightforward pricing means you know the price before we start. We don't charge more, even if the job takes longer. Our technicians are fully trained and come to your home in a fully stocked.",
    },
]

export const mockHistoryData: Array<HistoryEntry> = [
    {
        date: 'Nov 07, 2025',
        time: '08:08:30 PM ET',
        duration: '03m 15s',
        converted: true,
        revenue: 503.99,
        campaignId: '000',
        campaignName: 'Pest Control',
    },
    {
        date: 'Nov 07, 2025',
        time: '08:08:30 PM ET',
        duration: '00m 02s',
        converted: false,
        revenue: 0,
        campaignId: '000',
        campaignName: 'Pest Control',
    },
    {
        date: 'Nov 05, 2025',
        time: '08:08:30 PM ET',
        duration: '00m 02s',
        converted: false,
        revenue: 0,
        campaignId: '000',
        campaignName: 'Pest Control',
    },
]

export const mockAnalysisData: CallerAnalysisData = {
    sentiment: 'positive',
    keywords: ['plumbing', 'air', 'repair', 'technician'],
    confidence: 0.87,
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
        campaign: callerData.campaign,
    },
    analysis: mockAnalysisData,
})
