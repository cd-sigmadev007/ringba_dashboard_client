/**
 * useLogin Hook
 * Handles email/password login
 */

import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { authApi } from '../services/authApi'
import type { LoginCredentials } from '../types'
import { apiClient } from '@/services/api'

export function useLogin() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true)
        setError(null)

        try {
            // Use backend password login endpoint
            await authApi.passwordLogin(credentials)

            // Wait a bit to ensure session cookie is set
            await new Promise((resolve) => setTimeout(resolve, 100))

            // Verify session was created
            try {
                await apiClient.get('/api/auth/me')
                // Session verified, navigate to caller analysis
                navigate({ to: '/caller-analysis' })
            } catch (meError) {
                // Session verification failed
                throw new Error(
                    'Login successful but session verification failed. Please try again.'
                )
            }
        } catch (err: any) {
            const errorMessage =
                err.message || 'Login failed. Please check your credentials.'
            setError(errorMessage)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return {
        login,
        isLoading,
        error,
    }
}
