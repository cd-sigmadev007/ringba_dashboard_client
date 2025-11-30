/**
 * useUserCampaigns Hook
 * Manages user campaign assignment and display
 */

import { useState } from 'react'
import toast from 'react-hot-toast'
import { usersApi } from '../services/usersApi'
import { campaignApi } from '../services/campaignApi'
import type { CampaignDto } from '../services/campaignApi'

interface UseUserCampaignsProps {
    userId: string | null
    onSuccess?: () => void
}

export function useUserCampaigns({ userId, onSuccess }: UseUserCampaignsProps) {
    // Campaign state
    const [userCampaigns, setUserCampaigns] = useState<Array<CampaignDto>>([])
    const [loadingCampaigns, setLoadingCampaigns] = useState(false)
    const [availableCampaigns, setAvailableCampaigns] = useState<
        Array<CampaignDto>
    >([])
    const [loadingAvailableCampaigns, setLoadingAvailableCampaigns] =
        useState(false)

    // Campaign assignment state
    const [selectedCampaignIds, setSelectedCampaignIds] = useState<
        Array<string>
    >([])
    const [assigningCampaigns, setAssigningCampaigns] = useState(false)
    const [removingCampaignId, setRemovingCampaignId] = useState<string | null>(
        null
    )
    const [isEditingCampaigns, setIsEditingCampaigns] = useState(false)
    const [showCampaignsModal, setShowCampaignsModal] = useState(false)

    // Load user campaigns
    const loadUserCampaigns = async () => {
        if (!userId) return
        setLoadingCampaigns(true)
        try {
            const campaigns = await usersApi.getUserCampaigns(userId)
            setUserCampaigns(campaigns)
        } catch (error: any) {
            console.error('Failed to load user campaigns:', error)
            setUserCampaigns([])
        } finally {
            setLoadingCampaigns(false)
        }
    }

    // Load available campaigns
    const loadAvailableCampaigns = async () => {
        if (!userId) return
        setLoadingAvailableCampaigns(true)
        try {
            // Super admin can see all campaigns, org admin sees org campaigns
            // The backend already filters based on user role
            const campaigns = await campaignApi.fetchCampaigns()
            setAvailableCampaigns(campaigns)
        } catch (error: any) {
            console.error('Failed to load available campaigns:', error)
            setAvailableCampaigns([])
        } finally {
            setLoadingAvailableCampaigns(false)
        }
    }

    // Assign campaigns
    const handleAssignCampaigns = async () => {
        if (!userId || selectedCampaignIds.length === 0) return
        setAssigningCampaigns(true)
        try {
            // Assign all selected campaigns
            await Promise.all(
                selectedCampaignIds.map((campaignId) =>
                    usersApi.assignCampaignToUser(userId, campaignId)
                )
            )
            toast.success(
                selectedCampaignIds.length === 1
                    ? 'Campaign assigned successfully'
                    : `${selectedCampaignIds.length} campaigns assigned successfully`
            )
            setSelectedCampaignIds([])
            await loadUserCampaigns()
            await loadAvailableCampaigns() // Refresh available campaigns
            onSuccess?.()
        } catch (error: any) {
            toast.error(error?.message || 'Failed to assign campaigns')
        } finally {
            setAssigningCampaigns(false)
        }
    }

    // Remove campaign
    const handleRemoveCampaign = async (campaignId: string) => {
        if (!userId) return
        setRemovingCampaignId(campaignId)
        try {
            await usersApi.removeCampaignFromUser(userId, campaignId)
            toast.success('Campaign removed successfully')
            await loadUserCampaigns()
            await loadAvailableCampaigns() // Refresh available campaigns
            onSuccess?.()
        } catch (error: any) {
            toast.error(error?.message || 'Failed to remove campaign')
        } finally {
            setRemovingCampaignId(null)
        }
    }

    // Campaign options (exclude already assigned)
    const campaignOptions = availableCampaigns
        .filter(
            (campaign) => !userCampaigns.some((uc) => uc.id === campaign.id)
        )
        .map((campaign) => ({
            title: campaign.name,
            value: campaign.id,
        }))

    return {
        // State
        userCampaigns,
        loadingCampaigns,
        availableCampaigns,
        loadingAvailableCampaigns,
        selectedCampaignIds,
        assigningCampaigns,
        removingCampaignId,
        isEditingCampaigns,
        showCampaignsModal,

        // Actions
        loadUserCampaigns,
        loadAvailableCampaigns,
        handleAssignCampaigns,
        handleRemoveCampaign,
        setSelectedCampaignIds,
        setIsEditingCampaigns,
        setShowCampaignsModal,

        // Computed
        campaignOptions,
    }
}
