import { apiClient } from '@/services/api'

export interface CampaignDto {
    id: string
    name: string
    org_id: string
    created_at: string
    created_by: string | null
    campaign_id?: string | null
    logo_url?: string | null
    description?: string | null
}

// Dev helper: read orgId from env or localStorage for no-auth access
const DEV_ORG_ID =
    (import.meta.env.VITE_DEV_ORG_ID as string | undefined) ||
    (typeof window !== 'undefined'
        ? localStorage.getItem('dev_org_id') || undefined
        : undefined)

export const campaignApi = {
    async fetchCampaigns(): Promise<Array<CampaignDto>> {
        try {
            const qs = DEV_ORG_ID
                ? `?orgId=${encodeURIComponent(DEV_ORG_ID)}`
                : ''
            const res = await apiClient.get<{
                success: boolean
                data: Array<CampaignDto>
            }>(`/org-admin/campaigns${qs}`)
            return res.data
        } catch (error: any) {
            console.error('campaignApi.fetchCampaigns error:', {
                message: error?.message,
                status: error?.status,
                details: error?.details,
            })
            throw error
        }
    },

    async createCampaign(
        input: { name: string; campaign_id?: string; description?: string },
        logoFile?: File
    ): Promise<CampaignDto> {
        const form = new FormData()
        form.append('name', input.name)
        if (input.campaign_id) form.append('campaign_id', input.campaign_id)
        if (input.description) form.append('description', input.description)
        if (logoFile) form.append('logo', logoFile)
        const qs = DEV_ORG_ID ? `?orgId=${encodeURIComponent(DEV_ORG_ID)}` : ''
        const res = await apiClient.post<{
            success: boolean
            data: CampaignDto
        }>(`/org-admin/campaigns${qs}`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return res.data
    },
    async updateCampaign(
        id: string,
        input: {
            name?: string
            campaign_id?: string | null
            description?: string | null
        },
        logoFile?: File
    ): Promise<CampaignDto> {
        const form = new FormData()
        if (input.name !== undefined) form.append('name', input.name)
        if (input.campaign_id !== undefined)
            form.append('campaign_id', input.campaign_id || '')
        if (input.description !== undefined)
            form.append('description', input.description || '')
        if (logoFile) form.append('logo', logoFile)
        const res = await apiClient.put<CampaignDto>(
            `/org-admin/campaigns/${id}`,
            form,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        )
        return res
    },
    async deleteCampaign(id: string): Promise<void> {
        await apiClient.delete(`/org-admin/campaigns/${id}`)
    },
}
