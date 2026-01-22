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

    completeOnboarding(firstName?: string, lastName?: string): Promise<void> {
        return apiClient
            .post('/api/auth/complete-onboarding', { first_name: firstName, last_name: lastName })
            .then(() => {})
    },

    async updateProfile(data: {
        first_name?: string
        last_name?: string
        profile_picture?: File
    }): Promise<any> {
        const formData = new FormData()
        if (data.first_name !== undefined) {
            formData.append('first_name', data.first_name)
        }
        if (data.last_name !== undefined) {
            formData.append('last_name', data.last_name)
        }
        if (data.profile_picture) {
            formData.append('profile_picture', data.profile_picture)
        }

        const res = await apiClient.patch('/api/auth/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return res.data
    },
}
