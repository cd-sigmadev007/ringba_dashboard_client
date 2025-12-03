/**
 * Auth API Service
 * Handles all authentication-related API calls
 */

import { apiClient } from '@/services/api'
import type {
    LoginCredentials,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
} from '../types'

export const authApi = {
    /**
     * Login with email and password
     */
    async passwordLogin(credentials: LoginCredentials) {
        return apiClient.post('/api/auth/password-login', credentials)
    },

    /**
     * Request password reset email
     */
    async forgotPassword(data: ForgotPasswordRequest) {
        return apiClient.post('/api/auth/forgot-password', data)
    },

    /**
     * Reset password with token from email
     */
    async resetPassword(data: ResetPasswordRequest) {
        return apiClient.post('/api/auth/reset-password', data)
    },

    /**
     * Change password for logged-in user
     */
    async changePassword(data: ChangePasswordRequest) {
        return apiClient.post('/api/auth/change-password', data)
    },
}

