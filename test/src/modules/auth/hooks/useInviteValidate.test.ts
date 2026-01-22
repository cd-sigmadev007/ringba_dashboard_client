import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useInviteValidate } from '@/modules/auth/hooks/useInviteValidate'
import { authApi } from '@/modules/auth/services/authApi'

vi.mock('@/modules/auth/services/authApi', () => ({
    authApi: {
        validateInvite: vi.fn(),
    },
}))

// Mock window.location
const mockLocation = {
    pathname: '/invite/test-token',
}

describe('useInviteValidate', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        Object.defineProperty(window, 'location', {
            value: mockLocation,
            writable: true,
        })
    })

    it('should extract token from URL path', async () => {
        Object.defineProperty(window, 'location', {
            value: { pathname: '/invite/test-token-123' },
            writable: true,
        })

        vi.mocked(authApi.validateInvite).mockResolvedValueOnce({ email: 'test@example.com' })

        const { result } = renderHook(() => useInviteValidate())

        await waitFor(() => {
            expect(result.current.validating).toBe(false)
        })

        expect(result.current.token).toBe('test-token-123')
    })

    it('should validate token and set email', async () => {
        vi.mocked(authApi.validateInvite).mockResolvedValueOnce({
            email: 'test@example.com',
        })

        const { result } = renderHook(() => useInviteValidate())

        await waitFor(() => {
            expect(result.current.validating).toBe(false)
        })

        expect(result.current.email).toBe('test@example.com')
        expect(result.current.invalid).toBe(false)
    })

    it('should handle invalid token', async () => {
        vi.mocked(authApi.validateInvite).mockRejectedValueOnce(new Error('Invalid token'))

        const { result } = renderHook(() => useInviteValidate())

        await waitFor(() => {
            expect(result.current.validating).toBe(false)
        })

        expect(result.current.invalid).toBe(true)
        expect(result.current.email).toBe('')
    })

    it('should handle missing token', () => {
        Object.defineProperty(window, 'location', {
            value: { pathname: '/invite/' },
            writable: true,
        })

        const { result } = renderHook(() => useInviteValidate())

        expect(result.current.invalid).toBe(true)
        expect(result.current.validating).toBe(false)
    })
})
