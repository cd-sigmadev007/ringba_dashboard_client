import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import toast from 'react-hot-toast'
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
                    toast.success('Campaign updated successfully')
                    await fetchCampaigns()
                    navigate({ to: '/organization/campaigns' })
                    return true
                } else {
                    const errorMsg = 'Failed to update campaign'
                    setError(errorMsg)
                    toast.error(errorMsg)
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
                    toast.success('Campaign created successfully')
                    await fetchCampaigns()
                    navigate({ to: '/organization/campaigns' })
                    return true
                } else {
                    const errorMsg = 'Failed to create campaign'
                    setError(errorMsg)
                    toast.error(errorMsg)
                    return false
                }
            }
        } catch (e: any) {
            const errorMsg = e?.message || 'An error occurred'
            setError(errorMsg)
            toast.error(errorMsg)
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
