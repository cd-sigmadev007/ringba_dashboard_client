import { create } from 'zustand'
import { campaignApi } from '../services/campaignApi'
import type { CampaignDto } from '../services/campaignApi'

interface CampaignState {
    campaigns: Array<CampaignDto>
    loading: boolean
    error?: string
    fetchCampaigns: () => Promise<void>
    createCampaign: (
        data: { name: string; campaign_id?: string },
        logoFile?: File
    ) => Promise<CampaignDto | null>
    updateCampaign: (
        id: string,
        data: { name?: string; campaign_id?: string | null },
        logoFile?: File
    ) => Promise<CampaignDto | null>
    deleteCampaign: (id: string) => Promise<boolean>
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
    campaigns: [],
    loading: false,
    error: undefined,
    async fetchCampaigns() {
        try {
            set({ loading: true, error: undefined })
            const list = await campaignApi.fetchCampaigns()
            set({ campaigns: list, loading: false })
        } catch (e: any) {
            set({
                error: e?.message || 'Failed to fetch campaigns',
                loading: false,
            })
        }
    },
    async createCampaign(data, logoFile) {
        try {
            set({ loading: true, error: undefined })
            const created = await campaignApi.createCampaign(data, logoFile)
            set({ campaigns: [created, ...get().campaigns], loading: false })
            return created
        } catch (e: any) {
            set({
                error: e?.message || 'Failed to create campaign',
                loading: false,
            })
            return null
        }
    },
    async updateCampaign(id, data, logoFile) {
        try {
            set({ loading: true, error: undefined })
            const updated = await campaignApi.updateCampaign(id, data, logoFile)
            set({
                campaigns: get().campaigns.map((c) =>
                    c.id === id ? updated : c
                ),
                loading: false,
            })
            return updated
        } catch (e: any) {
            set({
                error: e?.message || 'Failed to update campaign',
                loading: false,
            })
            return null
        }
    },
    async deleteCampaign(id) {
        try {
            set({ loading: true, error: undefined })
            await campaignApi.deleteCampaign(id)
            set({
                campaigns: get().campaigns.filter((c) => c.id !== id),
                loading: false,
            })
            return true
        } catch (e: any) {
            set({
                error: e?.message || 'Failed to delete campaign',
                loading: false,
            })
            return false
        }
    },
}))
