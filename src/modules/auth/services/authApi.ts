import { apiClient } from '@/services/api'

export const authApi = {
    validateInvite(token: string): Promise<{ email?: string }> {
        return apiClient
            .get(`/api/invitations/validate/${token}`)
            .then((r: any) => r?.data ?? r)
    },

    forgotPassword(email: string): Promise<void> {
        return apiClient.post('/api/auth/forgot-password', { email })
    },

    validateResetToken(token: string): Promise<void> {
        return apiClient.get(
            `/api/auth/validate-reset-token?token=${encodeURIComponent(token)}`
        )
    },

    resetPassword(token: string, newPassword: string): Promise<void> {
        return apiClient.post('/api/auth/reset-password', {
            token,
            newPassword,
        })
    },

    requestOtp(email: string, purpose: 'login' | 'signup'): Promise<void> {
        return apiClient.post('/api/auth/request-otp', { email, purpose })
    },
}
