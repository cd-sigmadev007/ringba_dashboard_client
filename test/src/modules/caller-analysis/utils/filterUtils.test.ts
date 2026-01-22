import { describe, it, expect } from 'vitest'
import {
    parseDuration,
    matchesCampaignFilter,
    matchesStatusFilter,
    matchesDurationFilter,
    matchesDurationRange,
    matchesSearchQuery,
} from '@/modules/caller-analysis/utils/filterUtils'
import type { DurationRange } from '@/components'

describe('filterUtils', () => {
    describe('parseDuration', () => {
        it('should return number as-is when input is a number', () => {
            expect(parseDuration(120)).toBe(120)
            expect(parseDuration(0)).toBe(0)
            expect(parseDuration(3600)).toBe(3600)
        })

        it('should parse "Xm Ys" format correctly', () => {
            expect(parseDuration('2m 30s')).toBe(150) // 2*60 + 30
            expect(parseDuration('1m 0s')).toBe(60)
            expect(parseDuration('0m 45s')).toBe(45)
            expect(parseDuration('5m 15s')).toBe(315)
        })

        it('should parse seconds string format', () => {
            expect(parseDuration('120')).toBe(120)
            expect(parseDuration('0')).toBe(0)
            expect(parseDuration('3600.5')).toBe(3600.5)
        })

        it('should return 0 for empty or invalid strings', () => {
            expect(parseDuration('')).toBe(0)
            expect(parseDuration('invalid')).toBe(0)
            expect(parseDuration('abc')).toBe(0)
        })
    })

    describe('matchesCampaignFilter', () => {
        it('should return true when filters array is empty', () => {
            expect(matchesCampaignFilter('Campaign A', [])).toBe(true)
        })

        it('should match single filter', () => {
            expect(matchesCampaignFilter('Campaign A', ['Campaign A'])).toBe(true)
            expect(matchesCampaignFilter('Campaign A', ['Campaign'])).toBe(true)
            expect(matchesCampaignFilter('Campaign A', ['A'])).toBe(true)
            expect(matchesCampaignFilter('Campaign A', ['B'])).toBe(false)
        })

        it('should match any filter when multiple filters provided', () => {
            expect(matchesCampaignFilter('Campaign A', ['Campaign A', 'Campaign B'])).toBe(true)
            expect(matchesCampaignFilter('Campaign B', ['Campaign A', 'Campaign B'])).toBe(true)
            expect(matchesCampaignFilter('Campaign C', ['Campaign A', 'Campaign B'])).toBe(false)
        })

        it('should handle filter combinations with commas', () => {
            // For comma-separated filters, the code splits by comma, trims, and checks if campaign contains ALL parts
            // "Campaign A Campaign B" contains both "Campaign A" and "Campaign B" (after trim)
            expect(matchesCampaignFilter('Campaign A Campaign B', ['Campaign A, Campaign B'])).toBe(true)
            // "Campaign A" doesn't contain "Campaign B", so it should be false
            expect(matchesCampaignFilter('Campaign A', ['Campaign A, Campaign B'])).toBe(false)
            // "Campaign A B C" contains both "A" and "B" (after trim)
            expect(matchesCampaignFilter('Campaign A B C', ['A, B'])).toBe(true)
            // "Campaign A B" doesn't contain "Campaign A" as a substring (it's "Campaign" + "A" + "B")
            // So it won't match "Campaign A, Campaign B" filter
            expect(matchesCampaignFilter('Campaign A B', ['Campaign A, Campaign B'])).toBe(false)
        })

        it('should trim filter strings', () => {
            expect(matchesCampaignFilter('Campaign A', [' Campaign A '])).toBe(true)
            expect(matchesCampaignFilter('Campaign A', ['  Campaign  '])).toBe(true)
        })
    })

    describe('matchesStatusFilter', () => {
        it('should return true when filters array is empty', () => {
            expect(matchesStatusFilter(['converted'], [])).toBe(true)
        })

        it('should match when status array includes filter', () => {
            expect(matchesStatusFilter(['converted'], ['converted'])).toBe(true)
            expect(matchesStatusFilter(['converted', 'pending'], ['converted'])).toBe(true)
            expect(matchesStatusFilter(['converted'], ['pending'])).toBe(false)
        })

        it('should match any filter when multiple filters provided', () => {
            expect(matchesStatusFilter(['converted'], ['converted', 'pending'])).toBe(true)
            expect(matchesStatusFilter(['pending'], ['converted', 'pending'])).toBe(true)
            expect(matchesStatusFilter(['failed'], ['converted', 'pending'])).toBe(false)
        })
    })

    describe('matchesDurationFilter', () => {
        it('should return true for "all" filter', () => {
            expect(matchesDurationFilter('120', 'all')).toBe(true)
            expect(matchesDurationFilter('0', 'all')).toBe(true)
        })

        it('should match "short" duration (< 60 seconds)', () => {
            expect(matchesDurationFilter('30', 'short')).toBe(true)
            expect(matchesDurationFilter('59', 'short')).toBe(true)
            expect(matchesDurationFilter('60', 'short')).toBe(false)
            expect(matchesDurationFilter('2m 30s', 'short')).toBe(false)
        })

        it('should match "medium" duration (60-179 seconds)', () => {
            expect(matchesDurationFilter('60', 'medium')).toBe(true)
            expect(matchesDurationFilter('120', 'medium')).toBe(true)
            expect(matchesDurationFilter('179', 'medium')).toBe(true)
            expect(matchesDurationFilter('59', 'medium')).toBe(false)
            expect(matchesDurationFilter('180', 'medium')).toBe(false)
        })

        it('should match "long" duration (180-299 seconds)', () => {
            expect(matchesDurationFilter('180', 'long')).toBe(true)
            expect(matchesDurationFilter('240', 'long')).toBe(true)
            expect(matchesDurationFilter('299', 'long')).toBe(true)
            expect(matchesDurationFilter('179', 'long')).toBe(false)
            expect(matchesDurationFilter('300', 'long')).toBe(false)
        })

        it('should match "very-long" duration (>= 300 seconds)', () => {
            expect(matchesDurationFilter('300', 'very-long')).toBe(true)
            expect(matchesDurationFilter('600', 'very-long')).toBe(true)
            expect(matchesDurationFilter('299', 'very-long')).toBe(false)
        })

        it('should return true for unknown filter values', () => {
            expect(matchesDurationFilter('120', 'unknown')).toBe(true)
        })
    })

    describe('matchesDurationRange', () => {
        it('should return true when range has no min or max', () => {
            const range: DurationRange = {}
            expect(matchesDurationRange('120', range)).toBe(true)
        })

        it('should match when duration is within min and max', () => {
            const range: DurationRange = { min: 60, max: 180 }
            expect(matchesDurationRange('120', range)).toBe(true)
            expect(matchesDurationRange('60', range)).toBe(true)
            expect(matchesDurationRange('180', range)).toBe(true)
        })

        it('should reject when duration is below min', () => {
            const range: DurationRange = { min: 60 }
            expect(matchesDurationRange('59', range)).toBe(false)
            expect(matchesDurationRange('30', range)).toBe(false)
            expect(matchesDurationRange('60', range)).toBe(true)
        })

        it('should reject when duration is above max', () => {
            const range: DurationRange = { max: 180 }
            expect(matchesDurationRange('181', range)).toBe(false)
            expect(matchesDurationRange('300', range)).toBe(false)
            expect(matchesDurationRange('180', range)).toBe(true)
        })

        it('should handle "Xm Ys" format', () => {
            const range: DurationRange = { min: 60, max: 180 }
            // 1m 30s = 90 seconds, which is within 60-180
            expect(matchesDurationRange('1m 30s', range)).toBe(true)
            // 2m 30s = 150 seconds, which is within 60-180
            expect(matchesDurationRange('2m 30s', range)).toBe(true)
            // 3m 0s = 180 seconds, which is at max (inclusive)
            expect(matchesDurationRange('3m 0s', range)).toBe(true)
            // 4m 0s = 240 seconds, which is above max
            expect(matchesDurationRange('4m 0s', range)).toBe(false)
        })
    })

    describe('matchesSearchQuery', () => {
        it('should return true when search query is empty', () => {
            expect(matchesSearchQuery('+1234567890', '')).toBe(true)
            expect(matchesSearchQuery('+1234567890', '   ')).toBe(true)
        })

        it('should match phone numbers with digits only', () => {
            expect(matchesSearchQuery('+1234567890', '1234567890')).toBe(true)
            expect(matchesSearchQuery('+1234567890', '234')).toBe(true)
            expect(matchesSearchQuery('+1234567890', '890')).toBe(true)
        })

        it('should handle phone numbers with formatting', () => {
            expect(matchesSearchQuery('+1 (234) 567-890', '1234567890')).toBe(true)
            expect(matchesSearchQuery('+1-234-567-890', '234')).toBe(true)
        })

        it('should handle search query with formatting', () => {
            expect(matchesSearchQuery('+1234567890', '(234)')).toBe(true)
            expect(matchesSearchQuery('+1234567890', '234-567')).toBe(true)
        })

        it('should return false when query does not match', () => {
            expect(matchesSearchQuery('+1234567890', '999')).toBe(false)
            expect(matchesSearchQuery('+1234567890', '000')).toBe(false)
        })

        it('should return true when query has no digits', () => {
            expect(matchesSearchQuery('+1234567890', 'abc')).toBe(true)
            expect(matchesSearchQuery('+1234567890', '!@#')).toBe(true)
        })
    })
})
