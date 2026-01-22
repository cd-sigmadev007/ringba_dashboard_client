import { describe, expect, it } from 'vitest'
import { parseTranscriptToEntries } from '@/modules/caller-analysis/utils/transcriptUtils'

describe('transcriptUtils', () => {
    describe('parseTranscriptToEntries', () => {
        it('should return empty array for null or undefined', () => {
            expect(parseTranscriptToEntries(null as any)).toEqual([])
            expect(parseTranscriptToEntries(undefined)).toEqual([])
        })

        it('should return empty array for non-string input', () => {
            expect(parseTranscriptToEntries(123 as any)).toEqual([])
            expect(parseTranscriptToEntries({} as any)).toEqual([])
        })

        it('should parse transcript with timestamps and speakers', () => {
            const transcript =
                '00:00 A - Hello,\n00:20 B - Hi there,\n00:40 A - How are you?'
            const result = parseTranscriptToEntries(transcript)

            expect(result).toHaveLength(3)
            expect(result[0]).toEqual({
                timestamp: '00:00',
                speaker: 'A',
                text: 'Hello',
            })
            expect(result[1]).toEqual({
                timestamp: '00:20',
                speaker: 'B',
                text: 'Hi there',
            })
            expect(result[2]).toEqual({
                timestamp: '00:40',
                speaker: 'A',
                text: 'How are you?',
            })
        })

        it('should handle colon separator', () => {
            const transcript = '00:00 A: Hello,\n00:20 B: Hi there'
            const result = parseTranscriptToEntries(transcript)

            expect(result).toHaveLength(2)
            expect(result[0].text).toBe('Hello')
            expect(result[1].text).toBe('Hi there')
        })

        it('should remove trailing commas', () => {
            const transcript = '00:00 A - Hello,\n00:20 B - Hi there,'
            const result = parseTranscriptToEntries(transcript)

            // The code removes trailing comma with .replace(/,$/, '')
            expect(result[0].text).toBe('Hello')
            expect(result[1].text).toBe('Hi there')
        })

        it('should handle lines without timestamps', () => {
            const transcript = 'A - Hello,\nB - Hi there'
            const result = parseTranscriptToEntries(transcript)

            expect(result).toHaveLength(2)
            expect(result[0].timestamp).toBe('00:00')
            expect(result[1].timestamp).toBe('00:00')
        })

        it('should append lines without speaker markers to last entry', () => {
            const transcript =
                '00:00 A - Hello,\nThis is continuation,\n00:20 B - Hi there'
            const result = parseTranscriptToEntries(transcript)

            expect(result).toHaveLength(2)
            expect(result[0].text).toBe('Hello This is continuation')
            expect(result[1].text).toBe('Hi there')
        })

        it('should handle first line without speaker marker', () => {
            const transcript =
                'This is a line without speaker,\n00:20 A - Hello'
            const result = parseTranscriptToEntries(transcript)

            expect(result).toHaveLength(2)
            expect(result[0]).toEqual({
                timestamp: '00:00',
                speaker: 'A',
                text: 'This is a line without speaker',
            })
        })

        it('should filter out empty lines', () => {
            const transcript = '00:00 A - Hello,\n\n00:20 B - Hi there,\n  \n'
            const result = parseTranscriptToEntries(transcript)

            expect(result).toHaveLength(2)
        })

        it('should handle Windows line endings', () => {
            const transcript = '00:00 A - Hello,\r\n00:20 B - Hi there'
            const result = parseTranscriptToEntries(transcript)

            expect(result).toHaveLength(2)
        })

        it('should trim whitespace from lines', () => {
            const transcript = '  00:00 A - Hello,  \n  00:20 B - Hi there  '
            const result = parseTranscriptToEntries(transcript)

            expect(result[0].text).toBe('Hello')
            expect(result[1].text).toBe('Hi there')
        })

        it('should handle empty string', () => {
            expect(parseTranscriptToEntries('')).toEqual([])
        })
    })
})
