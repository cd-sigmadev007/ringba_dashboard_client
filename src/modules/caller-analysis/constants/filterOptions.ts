import type { SelectOption } from '@/components/ui/FilterSelect.tsx'

// Campaign filter options - using campaign IDs directly
export const campaignOptions: Array<SelectOption> = [
    { title: 'Medicare', value: '111' },
    { title: 'Appliance Repair', value: 'CA56446512fe4e4926a05e76574a7d6963' },
    { title: 'Pest Control', value: '000' },
]

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
