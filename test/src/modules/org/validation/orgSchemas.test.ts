import { describe, it, expect } from 'vitest'
import { orgZSchema, orgYupSchema } from '@/modules/org/validation/orgSchemas'

describe('orgSchemas', () => {
    const validData = {
        orgName: 'Test Organization',
        description: 'Test description',
        country: 'US',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        phone: '1234567890',
        website: 'https://example.com',
    }

    describe('orgZSchema (Zod)', () => {
        it('should validate correct data', () => {
            const result = orgZSchema.safeParse(validData)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })

        it('should require orgName with min length 2', () => {
            expect(orgZSchema.safeParse({ ...validData, orgName: '' }).success).toBe(false)
            expect(orgZSchema.safeParse({ ...validData, orgName: 'A' }).success).toBe(false)
            expect(orgZSchema.safeParse({ ...validData, orgName: 'AB' }).success).toBe(true)
        })

        it('should require country with min length 2', () => {
            expect(orgZSchema.safeParse({ ...validData, country: '' }).success).toBe(false)
            expect(orgZSchema.safeParse({ ...validData, country: 'U' }).success).toBe(false)
            expect(orgZSchema.safeParse({ ...validData, country: 'US' }).success).toBe(true)
        })

        it('should require address with min length 3', () => {
            expect(orgZSchema.safeParse({ ...validData, address: '' }).success).toBe(false)
            expect(orgZSchema.safeParse({ ...validData, address: 'AB' }).success).toBe(false)
            expect(orgZSchema.safeParse({ ...validData, address: 'ABC' }).success).toBe(true)
        })

        it('should require city with min length 1', () => {
            expect(orgZSchema.safeParse({ ...validData, city: '' }).success).toBe(false)
            expect(orgZSchema.safeParse({ ...validData, city: 'A' }).success).toBe(true)
        })

        it('should require state with min length 1', () => {
            expect(orgZSchema.safeParse({ ...validData, state: '' }).success).toBe(false)
            expect(orgZSchema.safeParse({ ...validData, state: 'N' }).success).toBe(true)
        })

        it('should require postalCode with min length 3', () => {
            expect(orgZSchema.safeParse({ ...validData, postalCode: '' }).success).toBe(false)
            expect(orgZSchema.safeParse({ ...validData, postalCode: '12' }).success).toBe(false)
            expect(orgZSchema.safeParse({ ...validData, postalCode: '123' }).success).toBe(true)
        })

        it('should allow empty description', () => {
            expect(orgZSchema.safeParse({ ...validData, description: '' }).success).toBe(true)
            expect(orgZSchema.safeParse({ ...validData, description: undefined }).success).toBe(
                true
            )
        })

        it('should limit description to 1000 characters', () => {
            const longDescription = 'A'.repeat(1001)
            expect(orgZSchema.safeParse({ ...validData, description: longDescription }).success).toBe(
                false
            )
            expect(
                orgZSchema.safeParse({ ...validData, description: 'A'.repeat(1000) }).success
            ).toBe(true)
        })

        it('should allow empty phone', () => {
            expect(orgZSchema.safeParse({ ...validData, phone: '' }).success).toBe(true)
            expect(orgZSchema.safeParse({ ...validData, phone: undefined }).success).toBe(true)
        })

        it('should require phone to be at least 7 characters if provided', () => {
            expect(orgZSchema.safeParse({ ...validData, phone: '123456' }).success).toBe(false)
            expect(orgZSchema.safeParse({ ...validData, phone: '1234567' }).success).toBe(true)
        })

        it('should allow empty website', () => {
            expect(orgZSchema.safeParse({ ...validData, website: '' }).success).toBe(true)
            expect(orgZSchema.safeParse({ ...validData, website: undefined }).success).toBe(true)
        })

        it('should validate website URL format if provided', () => {
            expect(orgZSchema.safeParse({ ...validData, website: 'invalid-url' }).success).toBe(
                false
            )
            expect(orgZSchema.safeParse({ ...validData, website: 'http://example.com' }).success).toBe(
                true
            )
            expect(orgZSchema.safeParse({ ...validData, website: 'https://example.com' }).success).toBe(
                true
            )
        })
    })

    describe('orgYupSchema (Yup)', () => {
        it('should validate correct data', async () => {
            await expect(orgYupSchema.validate(validData)).resolves.toEqual(validData)
        })

        it('should require orgName', async () => {
            await expect(
                orgYupSchema.validate({ ...validData, orgName: '' })
            ).rejects.toThrow()
            await expect(
                orgYupSchema.validate({ ...validData, orgName: 'A' })
            ).rejects.toThrow()
        })

        it('should require country', async () => {
            await expect(orgYupSchema.validate({ ...validData, country: '' })).rejects.toThrow()
        })

        it('should require address', async () => {
            await expect(orgYupSchema.validate({ ...validData, address: '' })).rejects.toThrow()
        })

        it('should require city', async () => {
            await expect(orgYupSchema.validate({ ...validData, city: '' })).rejects.toThrow()
        })

        it('should require state', async () => {
            await expect(orgYupSchema.validate({ ...validData, state: '' })).rejects.toThrow()
        })

        it('should require postalCode', async () => {
            await expect(orgYupSchema.validate({ ...validData, postalCode: '' })).rejects.toThrow()
        })

        it('should allow null description', async () => {
            await expect(
                orgYupSchema.validate({ ...validData, description: null })
            ).resolves.toBeDefined()
        })

        it('should limit description to 1000 characters', async () => {
            const longDescription = 'A'.repeat(1001)
            await expect(
                orgYupSchema.validate({ ...validData, description: longDescription })
            ).rejects.toThrow()
        })

        it('should allow null phone', async () => {
            await expect(orgYupSchema.validate({ ...validData, phone: null })).resolves.toBeDefined()
        })

        it('should allow null website', async () => {
            await expect(orgYupSchema.validate({ ...validData, website: null })).resolves.toBeDefined()
        })

        it('should validate website URL format if provided', async () => {
            await expect(
                orgYupSchema.validate({ ...validData, website: 'invalid-url' })
            ).rejects.toThrow()
            await expect(
                orgYupSchema.validate({ ...validData, website: 'http://example.com' })
            ).resolves.toBeDefined()
            await expect(
                orgYupSchema.validate({ ...validData, website: 'https://example.com' })
            ).resolves.toBeDefined()
        })
    })
})
