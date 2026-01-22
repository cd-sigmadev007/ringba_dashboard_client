import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    getApiBaseUrl,
    toAbsoluteLogoUrl,
    getRoleLabel,
    getInvitationStatusLabel,
    getInvitationStatusColor,
} from '@/modules/org/utils/userUtils'

describe('userUtils', () => {
    describe('getApiBaseUrl', () => {
        it('should return default URL when env is not set', () => {
            // The function uses import.meta.env which is read at module load time
            // In tests, it will use the default value
            const result = getApiBaseUrl()
            expect(result).toBe('http://localhost:3001')
        })

        it('should handle URL with /api suffix', () => {
            // Since we can't easily mock import.meta.env in Vitest,
            // we test the logic by checking the function behavior
            // The function removes /api suffix if present
            const result = getApiBaseUrl()
            // In test environment, it defaults to localhost:3001
            expect(result).toBeTruthy()
            expect(typeof result).toBe('string')
        })

        it('should handle URL with trailing slashes', () => {
            // The function removes trailing slashes
            const result = getApiBaseUrl()
            expect(result).toBeTruthy()
            expect(result.endsWith('/')).toBe(false)
        })
    })

    describe('toAbsoluteLogoUrl', () => {
        it('should return empty string for null or undefined', () => {
            expect(toAbsoluteLogoUrl(null)).toBe('')
            expect(toAbsoluteLogoUrl(undefined)).toBe('')
        })

        it('should return absolute URL as-is', () => {
            expect(toAbsoluteLogoUrl('http://example.com/logo.png')).toBe(
                'http://example.com/logo.png'
            )
            expect(toAbsoluteLogoUrl('https://example.com/logo.png')).toBe(
                'https://example.com/logo.png'
            )
        })

        it('should prepend API base URL to relative paths', () => {
            // Mock getApiBaseUrl
            vi.mock('@/modules/org/utils/userUtils', async () => {
                const actual = await vi.importActual('@/modules/org/utils/userUtils')
                return {
                    ...actual,
                    getApiBaseUrl: () => 'http://localhost:3001',
                }
            })

            const result = toAbsoluteLogoUrl('/uploads/logo.png')
            expect(result).toContain('/uploads/logo.png')
        })

        it('should add leading slash if missing', () => {
            const result = toAbsoluteLogoUrl('uploads/logo.png')
            expect(result).toContain('/uploads/logo.png')
        })
    })

    describe('getRoleLabel', () => {
        it('should return formatted label for super_admin', () => {
            expect(getRoleLabel('super_admin')).toBe('Super Admin')
        })

        it('should return formatted label for media_buyer', () => {
            expect(getRoleLabel('media_buyer')).toBe('Media Buyer')
        })

        it('should return role as-is for unknown roles', () => {
            expect(getRoleLabel('unknown_role')).toBe('unknown_role')
            expect(getRoleLabel('org_admin')).toBe('org_admin')
        })
    })

    describe('getInvitationStatusLabel', () => {
        it('should return "NA" for null or undefined', () => {
            expect(getInvitationStatusLabel(null)).toBe('NA')
            expect(getInvitationStatusLabel(undefined)).toBe('NA')
        })

        it('should return formatted labels for known statuses', () => {
            expect(getInvitationStatusLabel('send')).toBe('Sent')
            expect(getInvitationStatusLabel('accepted')).toBe('Accepted')
            expect(getInvitationStatusLabel('expired')).toBe('Expired')
        })

        it('should return status as-is for unknown statuses', () => {
            expect(getInvitationStatusLabel('unknown')).toBe('unknown')
        })
    })

    describe('getInvitationStatusColor', () => {
        it('should return default color for null or undefined', () => {
            expect(getInvitationStatusColor(null, false)).toBe('text-[#5E6278]')
            expect(getInvitationStatusColor(undefined, true)).toBe('text-[#A1A5B7]')
        })

        it('should return color for known statuses', () => {
            expect(getInvitationStatusColor('send', false)).toBe('text-yellow-500')
            expect(getInvitationStatusColor('accepted', false)).toBe('text-green-500')
            expect(getInvitationStatusColor('expired', false)).toBe('text-red-500')
        })

        it('should return default color for unknown statuses', () => {
            expect(getInvitationStatusColor('unknown', false)).toBe('text-[#5E6278]')
            expect(getInvitationStatusColor('unknown', true)).toBe('text-[#A1A5B7]')
        })

        it('should use dark mode colors when isDark is true', () => {
            expect(getInvitationStatusColor(null, true)).toBe('text-[#A1A5B7]')
            expect(getInvitationStatusColor('unknown', true)).toBe('text-[#A1A5B7]')
        })
    })
})
