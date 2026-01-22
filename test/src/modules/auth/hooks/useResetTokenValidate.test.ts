import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useResetTokenValidate } from '@/modules/auth/hooks/useResetTokenValidate'
import { authApi } from '@/modules/auth/services/authApi'

vi.mock('@/modules/auth/services/authApi', () => ({
    authApi: {
        validateResetToken: vi.fn(),
    },
}))

// Mock window.location.search
const mockLocation = {
    search: '?token=test-token',
}

describe('useResetTokenValidate', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        Object.defineProperty(window, 'location', {
            value: mockLocation,
            writable: true,
        })
    })

    it('should validate reset token successfully', async () => {
        vi.mocked(authApi.validateResetToken).mockResolvedValueOnce(undefined)

        const { result } = renderHook(() => useResetTokenValidate())

        await waitFor(() => {
            expect(result.current.tokenValid).toBe(true)
        })

        expect(result.current.token).toBe('test-token')
    })

    it('should handle invalid reset token', async () => {
        Object.defineProperty(window, 'location', {
            value: { search: '?token=invalid-token' },
            writable: true,
        })

        vi.mocked(authApi.validateResetToken).mockRejectedValueOnce(
            new Error('Invalid token')
        )

        const { result } = renderHook(() => useResetTokenValidate())

        await waitFor(() => {
            expect(result.current.tokenValid).toBe(false)
        })
    })

    it('should handle missing token', () => {
        Object.defineProperty(window, 'location', {
            value: { search: '' },
            writable: true,
        })

        const { result } = renderHook(() => useResetTokenValidate())

        expect(result.current.tokenValid).toBe(false)
        expect(result.current.token).toBe('')
    })
})
