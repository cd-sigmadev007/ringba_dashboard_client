import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { CampaignDto } from '@/modules/org/services/campaignApi'
import { useCampaignStore } from '@/modules/org/store/campaignStore'
import { campaignApi } from '@/modules/org/services/campaignApi'

// Mock campaignApi
vi.mock('@/modules/org/services/campaignApi', () => ({
    campaignApi: {
        fetchCampaigns: vi.fn(),
        createCampaign: vi.fn(),
        updateCampaign: vi.fn(),
        deleteCampaign: vi.fn(),
    },
}))

describe('campaignStore', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        useCampaignStore.setState({
            campaigns: [],
            loading: false,
            error: undefined,
        })
    })

    describe('fetchCampaigns', () => {
        it('should fetch and set campaigns', async () => {
            const mockCampaigns: Array<CampaignDto> = [
                { id: '1', name: 'Campaign 1', campaign_id: 'C1' },
                { id: '2', name: 'Campaign 2', campaign_id: 'C2' },
            ] as Array<CampaignDto>

            vi.mocked(campaignApi.fetchCampaigns).mockResolvedValueOnce(
                mockCampaigns
            )

            await useCampaignStore.getState().fetchCampaigns()

            expect(useCampaignStore.getState().campaigns).toEqual(mockCampaigns)
            expect(useCampaignStore.getState().loading).toBe(false)
        })

        it('should handle fetch errors', async () => {
            const error = new Error('Failed to fetch')
            vi.mocked(campaignApi.fetchCampaigns).mockRejectedValueOnce(error)

            await expect(
                useCampaignStore.getState().fetchCampaigns()
            ).rejects.toThrow()

            expect(useCampaignStore.getState().error).toBeTruthy()
            expect(useCampaignStore.getState().loading).toBe(false)
        })
    })

    describe('createCampaign', () => {
        it('should create and add campaign', async () => {
            const newCampaign: CampaignDto = {
                id: '3',
                name: 'New Campaign',
                campaign_id: 'C3',
            } as CampaignDto

            vi.mocked(campaignApi.createCampaign).mockResolvedValueOnce(
                newCampaign
            )

            const result = await useCampaignStore.getState().createCampaign({
                name: 'New Campaign',
            })

            expect(result).toEqual(newCampaign)
            expect(useCampaignStore.getState().campaigns).toContainEqual(
                newCampaign
            )
        })

        it('should handle create errors', async () => {
            vi.mocked(campaignApi.createCampaign).mockRejectedValueOnce(
                new Error('Failed to create')
            )

            const result = await useCampaignStore.getState().createCampaign({
                name: 'New Campaign',
            })

            expect(result).toBe(null)
            expect(useCampaignStore.getState().error).toBeTruthy()
        })
    })

    describe('updateCampaign', () => {
        it('should update existing campaign', async () => {
            const existingCampaign: CampaignDto = {
                id: '1',
                name: 'Old Name',
                campaign_id: 'C1',
            } as CampaignDto

            useCampaignStore.setState({ campaigns: [existingCampaign] })

            const updatedCampaign: CampaignDto = {
                id: '1',
                name: 'New Name',
                campaign_id: 'C1',
            } as CampaignDto

            vi.mocked(campaignApi.updateCampaign).mockResolvedValueOnce(
                updatedCampaign
            )

            const result = await useCampaignStore
                .getState()
                .updateCampaign('1', {
                    name: 'New Name',
                })

            expect(result).toEqual(updatedCampaign)
            expect(useCampaignStore.getState().campaigns[0].name).toBe(
                'New Name'
            )
        })

        it('should handle update errors', async () => {
            vi.mocked(campaignApi.updateCampaign).mockRejectedValueOnce(
                new Error('Failed to update')
            )

            const result = await useCampaignStore
                .getState()
                .updateCampaign('1', {
                    name: 'New Name',
                })

            expect(result).toBe(null)
            expect(useCampaignStore.getState().error).toBeTruthy()
        })
    })

    describe('deleteCampaign', () => {
        it('should delete campaign from store', async () => {
            const campaigns: Array<CampaignDto> = [
                { id: '1', name: 'Campaign 1' },
                { id: '2', name: 'Campaign 2' },
            ] as Array<CampaignDto>

            useCampaignStore.setState({ campaigns })

            vi.mocked(campaignApi.deleteCampaign).mockResolvedValueOnce(
                undefined
            )

            const result = await useCampaignStore.getState().deleteCampaign('1')

            expect(result).toBe(true)
            expect(useCampaignStore.getState().campaigns).toHaveLength(1)
            expect(useCampaignStore.getState().campaigns[0].id).toBe('2')
        })

        it('should handle delete errors', async () => {
            vi.mocked(campaignApi.deleteCampaign).mockRejectedValueOnce(
                new Error('Failed to delete')
            )

            const result = await useCampaignStore.getState().deleteCampaign('1')

            expect(result).toBe(false)
            expect(useCampaignStore.getState().error).toBeTruthy()
        })
    })
})
