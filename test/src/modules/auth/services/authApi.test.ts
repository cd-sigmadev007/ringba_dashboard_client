import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authApi } from '@/modules/auth/services/authApi'
import { apiClient } from '@/services/api'

// Mock apiClient
vi.mock('@/services/api', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
    },
}))

describe('authApi', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('validateInvite', () => {
        it('should validate invite token', async () => {
            const mockResponse = { data: { email: 'test@example.com' } }
            vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse)

            const result = await authApi.validateInvite('token-123')

            expect(apiClient.get).toHaveBeenCalledWith(
                '/api/invitations/validate/token-123'
            )
            expect(result).toEqual({ email: 'test@example.com' })
        })

        it('should handle response without data wrapper', async () => {
            const mockResponse = { email: 'test@example.com' }
            vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse as any)

            const result = await authApi.validateInvite('token-123')

            expect(result).toEqual({ email: 'test@example.com' })
        })
    })

    describe('forgotPassword', () => {
        it('should send forgot password request', async () => {
            vi.mocked(apiClient.post).mockResolvedValueOnce({} as any)

            await authApi.forgotPassword('test@example.com')

            expect(apiClient.post).toHaveBeenCalledWith(
                '/api/auth/forgot-password',
                {
                    email: 'test@example.com',
                }
            )
        })
    })

    describe('validateResetToken', () => {
        it('should validate reset token', async () => {
            vi.mocked(apiClient.get).mockResolvedValueOnce({} as any)

            await authApi.validateResetToken('reset-token-123')

            expect(apiClient.get).toHaveBeenCalledWith(
                '/api/auth/validate-reset-token?token=reset-token-123'
            )
        })

        it('should encode token in URL', async () => {
            vi.mocked(apiClient.get).mockResolvedValueOnce({} as any)

            await authApi.validateResetToken('token with spaces')

            expect(apiClient.get).toHaveBeenCalledWith(
                '/api/auth/validate-reset-token?token=token%20with%20spaces'
            )
        })
    })

    describe('resetPassword', () => {
        it('should reset password with token and new password', async () => {
            vi.mocked(apiClient.post).mockResolvedValueOnce({} as any)

            await authApi.resetPassword('reset-token-123', 'newPassword123')

            expect(apiClient.post).toHaveBeenCalledWith(
                '/api/auth/reset-password',
                {
                    token: 'reset-token-123',
                    newPassword: 'newPassword123',
                }
            )
        })
    })

    describe('requestOtp', () => {
        it('should request OTP for login', async () => {
            vi.mocked(apiClient.post).mockResolvedValueOnce({} as any)

            await authApi.requestOtp('test@example.com', 'login')

            expect(apiClient.post).toHaveBeenCalledWith(
                '/api/auth/request-otp',
                {
                    email: 'test@example.com',
                    purpose: 'login',
                }
            )
        })

        it('should request OTP for signup', async () => {
            vi.mocked(apiClient.post).mockResolvedValueOnce({} as any)

            await authApi.requestOtp('test@example.com', 'signup')

            expect(apiClient.post).toHaveBeenCalledWith(
                '/api/auth/request-otp',
                {
                    email: 'test@example.com',
                    purpose: 'signup',
                }
            )
        })
    })

    describe('completeOnboarding', () => {
        it('should complete onboarding with first and last name', async () => {
            vi.mocked(apiClient.post).mockResolvedValueOnce({} as any)

            await authApi.completeOnboarding('John', 'Doe')

            expect(apiClient.post).toHaveBeenCalledWith(
                '/api/auth/complete-onboarding',
                {
                    first_name: 'John',
                    last_name: 'Doe',
                }
            )
        })

        it('should complete onboarding with only first name', async () => {
            vi.mocked(apiClient.post).mockResolvedValueOnce({} as any)

            await authApi.completeOnboarding('John')

            expect(apiClient.post).toHaveBeenCalledWith(
                '/api/auth/complete-onboarding',
                {
                    first_name: 'John',
                    last_name: undefined,
                }
            )
        })

        it('should complete onboarding without names', async () => {
            vi.mocked(apiClient.post).mockResolvedValueOnce({} as any)

            await authApi.completeOnboarding()

            expect(apiClient.post).toHaveBeenCalledWith(
                '/api/auth/complete-onboarding',
                {
                    first_name: undefined,
                    last_name: undefined,
                }
            )
        })
    })
})
