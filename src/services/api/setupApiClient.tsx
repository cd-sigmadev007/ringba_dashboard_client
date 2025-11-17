/**
 * Setup ApiClient for Cookie-Based Authentication
 * This component initializes the apiClient for cookie-based sessions
 */

import { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { apiClient } from './index'

export function ApiClientSetup({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, fetchCurrentUser } = useAuthStore()

    useEffect(() => {
        // Initialize API client (cookies are automatically sent)
        apiClient.initializeAuth()

        // Fetch current user if authenticated
        if (isAuthenticated) {
            fetchCurrentUser()
        }
    }, [isAuthenticated, fetchCurrentUser])

    return <>{children}</>
}
