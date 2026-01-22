import { describe, it, expect } from 'vitest'
import {
    convertCampaignFiltersToIds,
    getCampaignId,
} from '@/modules/caller-analysis/utils/campaignIds'

describe('campaignIds', () => {
    describe('convertCampaignFiltersToIds', () => {
        it('should return empty array when filters array is empty', () => {
            expect(convertCampaignFiltersToIds([])).toEqual([])
        })

        it('should return IDs as-is when valid', () => {
            expect(convertCampaignFiltersToIds(['111', '000'])).toEqual(['111', '000'])
            expect(convertCampaignFiltersToIds(['CA56446512fe4e4926a05e76574a7d6963'])).toEqual([
                'CA56446512fe4e4926a05e76574a7d6963',
            ])
        })

        it('should filter out empty strings', () => {
            expect(convertCampaignFiltersToIds(['111', '', '000'])).toEqual(['111', '000'])
            expect(convertCampaignFiltersToIds(['', ''])).toEqual([])
        })

        it('should filter out whitespace-only strings', () => {
            // The code filters by checking id && id.trim().length > 0
            // So whitespace-only strings are filtered out
            expect(convertCampaignFiltersToIds(['111', '   ', '000'])).toEqual(['111', '000'])
            expect(convertCampaignFiltersToIds(['  ', '\t', '\n'])).toEqual([])
        })

        it('should keep IDs with whitespace (not trimmed)', () => {
            // The code doesn't trim, it just filters empty/whitespace-only
            // So IDs with whitespace are kept as-is
            expect(convertCampaignFiltersToIds(['  111  ', '  000  '])).toEqual(['  111  ', '  000  '])
        })
    })

    describe('getCampaignId', () => {
        it('should return the campaign filter as-is', () => {
            expect(getCampaignId('111')).toBe('111')
            expect(getCampaignId('000')).toBe('000')
            expect(getCampaignId('CA56446512fe4e4926a05e76574a7d6963')).toBe(
                'CA56446512fe4e4926a05e76574a7d6963'
            )
        })

        it('should handle any string value', () => {
            expect(getCampaignId('test')).toBe('test')
            expect(getCampaignId('')).toBe('')
        })
    })
})
