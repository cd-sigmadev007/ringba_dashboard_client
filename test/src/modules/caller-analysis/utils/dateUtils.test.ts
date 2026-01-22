import { describe, expect, it } from 'vitest'
import { parseLastCallDateAndTime } from '@/modules/caller-analysis/utils/dateUtils'

describe('dateUtils', () => {
    describe('parseLastCallDateAndTime', () => {
        it('should return default values for null or undefined', () => {
            const result1 = parseLastCallDateAndTime(null)
            expect(result1.date).toBe('Unknown Date')
            expect(result1.time).toBe('')

            const result2 = parseLastCallDateAndTime(undefined)
            expect(result2.date).toBe('Unknown Date')
            expect(result2.time).toBe('')
        })

        it('should parse date with year format', () => {
            const result = parseLastCallDateAndTime(
                'Nov 07, 2025, 08:08:30 PM ET'
            )
            expect(result.date).toBe('Nov 07, 2025')
            expect(result.time).toBe('08:08:30 PM ET')
        })

        it('should parse date without year and add current year', () => {
            const currentYear = new Date().getFullYear()
            const result = parseLastCallDateAndTime('Oct 30, 10:21:06 PM ET')
            expect(result.date).toContain(currentYear.toString())
            expect(result.time).toBe('10:21:06 PM ET')
        })

        it('should handle various time formats', () => {
            const currentYear = new Date().getFullYear()
            const result1 = parseLastCallDateAndTime('Nov 15, 08:08:30 AM ET')
            expect(result1.date).toContain(currentYear.toString())
            expect(result1.time).toBe('08:08:30 AM ET')

            const result2 = parseLastCallDateAndTime('Dec 25, 11:59:59 PM ET')
            expect(result2.date).toContain(currentYear.toString())
            expect(result2.time).toBe('11:59:59 PM ET')
        })

        it('should handle single digit days', () => {
            const currentYear = new Date().getFullYear()
            const result = parseLastCallDateAndTime('Nov 7, 08:08:30 PM ET')
            expect(result.date).toContain(currentYear.toString())
            expect(result.time).toBe('08:08:30 PM ET')
        })

        it('should handle invalid date strings gracefully', () => {
            const result = parseLastCallDateAndTime('invalid date string')
            // Should return the original string or a fallback
            expect(result.date).toBeTruthy()
        })

        it('should remove ET suffix before parsing', () => {
            const currentYear = new Date().getFullYear()
            const result = parseLastCallDateAndTime('Nov 07, 08:08:30 PM ET')
            expect(result.date).toContain(currentYear.toString())
            expect(result.time).toBe('08:08:30 PM ET')
        })

        it('should handle edge case with only date part', () => {
            const result = parseLastCallDateAndTime('Nov 07')
            // Should handle gracefully
            expect(result.date).toBeTruthy()
        })
    })
})
