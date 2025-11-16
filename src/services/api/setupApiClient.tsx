/**
 * Setup ApiClient with Auth0 Authentication
 * This component initializes the apiClient with Auth0 access tokens
 */

import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { apiClient } from './index'

export function ApiClientSetup({ children }: { children: React.ReactNode }) {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0()

    useEffect(() => {
        if (isAuthenticated) {
            // Initialize apiClient with Auth0 token getter
            apiClient.initializeAuth(getAccessTokenSilently)
        }
    }, [isAuthenticated, getAccessTokenSilently])

    return <>{children}</>
}
