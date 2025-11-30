import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import type { SelectOption } from '@/components/ui/FilterSelect.tsx'
import { useCampaignStore } from '@/modules/org/store/campaignStore'
import { apiClient } from '@/services/api'

// Dynamic campaign options from store
export function useCampaignOptions(): Array<SelectOption> {
    const campaigns = useCampaignStore((s) => s.campaigns)
    const fetchCampaigns = useCampaignStore((s) => s.fetchCampaigns)
    const { isAuthenticated, isLoading: authLoading } = useAuth0()

    // Automatically fetch campaigns when auth is ready and campaigns array is empty
    useEffect(() => {
        // Only fetch if:
        // 1. Auth is not loading
        // 2. User is authenticated
        // 3. ApiClient is initialized
        // 4. Campaigns array is empty
        if (!authLoading && isAuthenticated && campaigns.length === 0) {
            // Check if apiClient is initialized, if not wait a bit and retry
            if (apiClient.isAuthInitialized()) {
                fetchCampaigns().catch((error) => {
                    console.error(
                        'Failed to fetch campaigns in useCampaignOptions:',
                        error
                    )
                })
            } else {
                // Wait for apiClient to be initialized (max 2 seconds)
                const maxAttempts = 20
                let attempts = 0
                const checkAuth = setInterval(() => {
                    attempts++
                    if (
                        apiClient.isAuthInitialized() ||
                        attempts >= maxAttempts
                    ) {
                        clearInterval(checkAuth)
                        if (apiClient.isAuthInitialized()) {
                            fetchCampaigns().catch((error) => {
                                console.error(
                                    'Failed to fetch campaigns in useCampaignOptions:',
                                    error
                                )
                            })
                        }
                    }
                }, 100)
                return () => clearInterval(checkAuth)
            }
        }
    }, [authLoading, isAuthenticated, campaigns.length, fetchCampaigns])

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
