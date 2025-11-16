import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCampaignStore } from '../store/campaignStore'

interface UseCampaignSubmitProps {
    isEditMode: boolean
    campaignId?: string
}

export function useCampaignSubmit({
    isEditMode,
    campaignId,
}: UseCampaignSubmitProps) {
    const navigate = useNavigate()
    const { createCampaign, updateCampaign, fetchCampaigns } =
        useCampaignStore()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)

    const handleSubmit = async (
        formData: {
            name: string
            campaignId: string
            description: string
        },
        file?: File
    ) => {
        setError(undefined)

        if (!formData.name.trim()) {
            setError('Campaign name is required')
            return false
        }

        setSubmitting(true)
        try {
            if (isEditMode && campaignId) {
                const updated = await updateCampaign(
                    campaignId,
                    {
                        name: formData.name,
                        campaign_id: formData.campaignId || null,
                        description: formData.description || null,
                    },
                    file
                )
                if (updated) {
                    await fetchCampaigns()
                    navigate({ to: '/organization/campaigns' })
                    return true
                } else {
                    setError('Failed to update campaign')
                    return false
                }
            } else {
                const created = await createCampaign(
                    {
                        name: formData.name,
                        campaign_id: formData.campaignId || undefined,
                        description: formData.description || undefined,
                    },
                    file
                )
                if (created) {
                    await fetchCampaigns()
                    navigate({ to: '/organization/campaigns' })
                    return true
                } else {
                    setError('Failed to create campaign')
                    return false
                }
            }
        } catch (e: any) {
            setError(e?.message || 'An error occurred')
            return false
        } finally {
            setSubmitting(false)
        }
    }

    return {
        handleSubmit,
        submitting,
        error,
        setError,
    }
}
