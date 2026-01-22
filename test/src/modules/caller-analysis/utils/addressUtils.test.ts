import { describe, expect, it } from 'vitest'
import type { CallData } from '@/modules/caller-analysis/types'
import { buildAddressFromCallData } from '@/modules/caller-analysis/utils/addressUtils'

describe('addressUtils', () => {
    describe('buildAddressFromCallData', () => {
        it('should build address from all parts', () => {
            const callerData: CallData = {
                streetNumber: '123',
                streetName: 'Main',
                streetType: 'St',
                city: 'New York',
                state: 'NY',
                zip: '10001',
            } as CallData

            const result = buildAddressFromCallData(callerData)
            expect(result).toBe('123 Main St, New York, NY, 10001')
        })

        it('should filter out "NA" values', () => {
            const callerData: CallData = {
                streetNumber: '123',
                streetName: 'NA',
                streetType: 'St',
                city: 'New York',
                state: 'NA',
                zip: '10001',
            } as CallData

            const result = buildAddressFromCallData(callerData)
            expect(result).toBe('123 St, New York, 10001')
        })

        it('should filter out empty strings', () => {
            const callerData: CallData = {
                streetNumber: '123',
                streetName: '',
                streetType: 'St',
                city: 'New York',
                state: 'NY',
                zip: '',
            } as CallData

            const result = buildAddressFromCallData(callerData)
            expect(result).toBe('123 St, New York, NY')
        })

        it('should trim whitespace from parts', () => {
            const callerData: CallData = {
                streetNumber: '  123  ',
                streetName: '  Main  ',
                streetType: '  St  ',
                city: '  New York  ',
                state: '  NY  ',
                zip: '  10001  ',
            } as CallData

            const result = buildAddressFromCallData(callerData)
            expect(result).toBe('123 Main St, New York, NY, 10001')
        })

        it('should use fallback address when no parts available', () => {
            const callerData: CallData = {
                address: 'Fallback Address',
            } as CallData

            const result = buildAddressFromCallData(callerData)
            expect(result).toBe('Fallback Address')
        })

        it('should return "-" when no address parts and no fallback', () => {
            const callerData: CallData = {} as CallData

            const result = buildAddressFromCallData(callerData)
            expect(result).toBe('-')
        })

        it('should handle missing street parts', () => {
            const callerData: CallData = {
                city: 'New York',
                state: 'NY',
                zip: '10001',
            } as CallData

            const result = buildAddressFromCallData(callerData)
            expect(result).toBe('New York, NY, 10001')
        })

        it('should handle only city and state', () => {
            const callerData: CallData = {
                city: 'Los Angeles',
                state: 'CA',
            } as CallData

            const result = buildAddressFromCallData(callerData)
            expect(result).toBe('Los Angeles, CA')
        })

        it('should join street parts correctly', () => {
            const callerData: CallData = {
                streetNumber: '456',
                streetName: 'Oak',
                streetType: 'Avenue',
                city: 'Chicago',
                state: 'IL',
                zip: '60601',
            } as CallData

            const result = buildAddressFromCallData(callerData)
            expect(result).toBe('456 Oak Avenue, Chicago, IL, 60601')
        })
    })
})
