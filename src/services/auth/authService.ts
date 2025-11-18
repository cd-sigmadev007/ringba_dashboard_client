/**
 * Authentication Service
 * Handles login, logout, and session management
 */

import { apiClient } from '../api'

export interface LoginResponse {
    success: boolean
    data: {
        user: {
            id: string
            email: string
            role: string
            orgId: string | null
            campaignIds: Array<string>
        }
    }
    message: string
}

export interface UserData {
    id: string
    email: string
    role: string
    orgId: string | null
    campaignIds: Array<string>
}

export interface CurrentUserResponse {
    success: boolean
    data: {
        user: UserData
    }
    message: string
}

class AuthService {
    /**
     * Login with Auth0 access token
     * Validates token with backend and creates session
     */
    async login(accessToken: string): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>('/auth/login', {
            accessToken,
        })
    }

    /**
     * Logout - destroys session
     */
    async logout(): Promise<void> {
        return apiClient.post('/auth/logout')
    }

    /**
     * Get current user from session
     */
    async getCurrentUser(): Promise<CurrentUserResponse> {
        return apiClient.get<CurrentUserResponse>('/auth/me')
    }
}

export const authService = new AuthService()
