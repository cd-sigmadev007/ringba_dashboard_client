/**
 * Authentication Store
 * Manages user session state
 */

import { create } from 'zustand'
import { authService } from '../services/auth/authService'
import type { UserData } from '../services/auth/authService'

interface AuthState {
    user: UserData | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    login: (accessToken: string) => Promise<void>
    logout: () => Promise<void>
    fetchCurrentUser: () => Promise<void>
    clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (accessToken: string) => {
        try {
            set({ isLoading: true, error: null })
            const response = await authService.login(accessToken)
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            })
        } catch (error: any) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: error?.message || 'Login failed',
            })
            throw error
        }
    },

    logout: async () => {
        try {
            await authService.logout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            })
        }
    },

    fetchCurrentUser: async () => {
        try {
            set({ isLoading: true, error: null })
            const response = await authService.getCurrentUser()
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            })
        } catch (error: any) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: error?.message || 'Failed to fetch user',
            })
        }
    },

    clearError: () => {
        set({ error: null })
    },
}))
