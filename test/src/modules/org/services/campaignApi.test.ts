import { describe, it, expect, vi, beforeEach } from 'vitest'
import { campaignApi } from '@/modules/org/services/campaignApi'
import { apiClient } from '@/services/api'

vi.mock('@/services/api', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}))

describe('campaignApi', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should fetch campaigns', async () => {
        const mockCampaigns = [{ id: '1', name: 'Campaign 1' }]
        vi.mocked(apiClient.get).mockResolvedValueOnce({
            data: mockCampaigns,
        } as any)

        const result = await campaignApi.fetchCampaigns()
        expect(apiClient.get).toHaveBeenCalled()
        expect(result).toEqual(mockCampaigns)
    })

    it('should create campaign with FormData', async () => {
        const campaignData = { name: 'New Campaign' }
        const logoFile = new File([''], 'logo.png')
        const mockCampaign = { id: '1', ...campaignData }

        vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockCampaign } as any)

        const result = await campaignApi.createCampaign(campaignData, logoFile)

        expect(apiClient.post).toHaveBeenCalledWith(
            expect.stringContaining('/api/org-admin/campaigns'),
            expect.any(FormData),
            expect.objectContaining({
                headers: { 'Content-Type': 'multipart/form-data' },
            })
        )
        expect(result).toEqual(mockCampaign)
    })

    it('should update campaign', async () => {
        const updateData = { name: 'Updated Campaign', campaign_id: null, description: null }
        const mockCampaign = { id: '1', ...updateData }

        vi.mocked(apiClient.put).mockResolvedValueOnce(mockCampaign as any)

        const result = await campaignApi.updateCampaign('1', updateData)

        expect(apiClient.put).toHaveBeenCalledWith(
            expect.stringContaining('/api/org-admin/campaigns/1'),
            expect.any(FormData),
            expect.objectContaining({
                headers: { 'Content-Type': 'multipart/form-data' },
            })
        )
        // updateCampaign returns res directly (which is the campaign data)
        expect(result).toEqual(mockCampaign)
    })

    it('should delete campaign', async () => {
        vi.mocked(apiClient.delete).mockResolvedValueOnce({} as any)

        await campaignApi.deleteCampaign('1')
        expect(apiClient.delete).toHaveBeenCalledWith(
            expect.stringContaining('/api/org-admin/campaigns/1')
        )
    })
})
