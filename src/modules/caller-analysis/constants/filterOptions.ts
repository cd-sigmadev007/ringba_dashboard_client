import type { SelectOption } from '@/components/ui/FilterSelect.tsx'
import { useCampaignStore } from '@/modules/org/store/campaignStore'

// Dynamic campaign options from store
export function useCampaignOptions(): Array<SelectOption> {
    const campaigns = useCampaignStore((s) => s.campaigns)
    return campaigns.map((c) => ({
        title: c.name,
        value: c.campaign_id || c.id,
    }))
}

// Status filter options
export const statusOptions: Array<SelectOption> = [
    {
        title: 'High-Quality Unbilled (Critical)',
        value: 'High-Quality Unbilled (Critical)',
    },
    {
        title: 'Chargeback Risk (Critical)',
        value: 'Chargeback Risk (Critical)',
    },
    { title: 'Wrong Appliance Category', value: 'Wrong Appliance Category' },
    {
        title: 'Wrong Pest Control Category',
        value: 'Wrong Pest Control Category',
    },
    { title: 'Short Call (<90s)', value: 'Short Call (<90s)' },
    { title: 'Buyer Hung Up', value: 'Buyer Hung Up' },
    { title: 'Immediate Hangup (<10s)', value: 'Immediate Hangup (<10s)' },
    { title: 'Competitor Mentioned', value: 'Competitor Mentioned' },
    { title: 'Booking Intent', value: 'Booking Intent' },
    { title: 'Warranty/Status Inquiry', value: 'Warranty/Status Inquiry' },
    { title: 'Positive Sentiment', value: 'Positive Sentiment' },
    { title: 'Negative Sentiment', value: 'Negative Sentiment' },
    { title: 'Repeat Customer', value: 'Repeat Customer' },
    { title: 'Technical Terms Used', value: 'Technical Terms Used' },
    { title: 'No Coverage (ZIP)', value: 'No Coverage (ZIP)' },
]
