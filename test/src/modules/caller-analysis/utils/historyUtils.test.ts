import { describe, it, expect, vi } from 'vitest'
import { mapApiDataToHistoryEntries } from '@/modules/caller-analysis/utils/historyUtils'
import type { FrontendCallerData } from '@/types/api'

// Mock dependencies
vi.mock('@/modules/caller-analysis/utils/dateUtils', () => ({
    parseLastCallDateAndTime: vi.fn((lastCall) => ({
        date: lastCall ? 'Nov 07, 2025' : 'Unknown Date',
        time: lastCall ? '08:08:30 PM ET' : '',
    })),
}))

vi.mock('@/lib/utils/format', () => ({
    formatDuration: vi.fn((duration) => duration || '0s'),
    parseNumeric: vi.fn((value) => {
        const num = Number(value)
        return Number.isFinite(num) ? num : 0
    }),
}))

describe('historyUtils', () => {
    describe('mapApiDataToHistoryEntries', () => {
        it('should map API data to history entries', () => {
            const apiData: FrontendCallerData[] = [
                {
                    lastCall: 'Nov 07, 2025, 08:08:30 PM ET',
                    duration: '2m 30s',
                    revenue: 100,
                    latestPayout: 50,
                    campaign: 'campaign-1',
                    audioUrl: 'http://example.com/audio.mp3',
                    transcript: '00:00 A - Hello',
                } as FrontendCallerData,
            ]

            const result = mapApiDataToHistoryEntries(apiData)

            expect(result).toHaveLength(1)
            expect(result[0]).toMatchObject({
                date: 'Nov 07, 2025',
                time: '08:08:30 PM ET',
                duration: '2m 30s',
                converted: true,
                revenue: 100,
                campaignId: 'campaign-1',
                audioUrl: 'http://example.com/audio.mp3',
                transcript: '00:00 A - Hello',
            })
        })

        it('should determine converted status from payout', () => {
            const apiData: FrontendCallerData[] = [
                {
                    latestPayout: 50,
                } as FrontendCallerData,
                {
                    latestPayout: 0,
                } as FrontendCallerData,
                {
                    latestPayout: -10,
                } as FrontendCallerData,
            ]

            const result = mapApiDataToHistoryEntries(apiData)

            expect(result[0].converted).toBe(true)
            expect(result[1].converted).toBe(false)
            expect(result[2].converted).toBe(false)
        })

        it('should extract first campaign ID from comma-separated campaigns', () => {
            const apiData: FrontendCallerData[] = [
                {
                    campaign: 'campaign-1, campaign-2, campaign-3',
                } as FrontendCallerData,
            ]

            const result = mapApiDataToHistoryEntries(apiData)

            expect(result[0].campaignId).toBe('campaign-1')
        })

        it('should handle missing campaign', () => {
            const apiData: FrontendCallerData[] = [
                {
                    campaign: undefined,
                } as FrontendCallerData,
            ]

            const result = mapApiDataToHistoryEntries(apiData)

            expect(result[0].campaignId).toBeUndefined()
        })

        it('should handle invalid revenue values', () => {
            const apiData: FrontendCallerData[] = [
                {
                    revenue: 'invalid',
                } as any,
                {
                    revenue: null,
                } as any,
            ]

            const result = mapApiDataToHistoryEntries(apiData)

            expect(result[0].revenue).toBe(0)
            expect(result[1].revenue).toBe(0)
        })

        it('should handle empty array', () => {
            const result = mapApiDataToHistoryEntries([])
            expect(result).toEqual([])
        })
    })
})
