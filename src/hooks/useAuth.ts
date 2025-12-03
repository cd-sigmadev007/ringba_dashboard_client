/**
 * useAuth Hook
 * Combines Auth0 authentication with backend session check
 * Returns true if user is authenticated via EITHER Auth0 OR backend session
 */

import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { apiClient } from '@/services/api'

interface UseAuthResult {
    isAuthenticated: boolean
    isLoading: boolean
    hasBackendSession: boolean
    hasAuth0Session: boolean
}

export function useAuth(): UseAuthResult {
    const { isAuthenticated: auth0Authenticated, isLoading: auth0Loading } =
        useAuth0()
    const [hasBackendSession, setHasBackendSession] = useState(false)
    const [isCheckingSession, setIsCheckingSession] = useState(true)

    // Check backend session
    useEffect(() => {
        let mounted = true

        const checkBackendSession = async () => {
            try {
                // Try to get current user from backend session
                await apiClient.get('/api/auth/me')
                if (mounted) {
                    setHasBackendSession(true)
                }
            } catch (error) {
                // No backend session
                if (mounted) {
                    setHasBackendSession(false)
                }
            } finally {
                if (mounted) {
                    setIsCheckingSession(false)
                }
            }
        }

        // Check session immediately and on mount
        checkBackendSession()

        // Also check when auth0 state changes (in case user logs out)
        if (!auth0Loading) {
            checkBackendSession()
        }

        return () => {
            mounted = false
        }
    }, [auth0Loading, auth0Authenticated])

    // User is authenticated if EITHER Auth0 OR backend session exists
    const isAuthenticated = auth0Authenticated || hasBackendSession
    const isLoading = auth0Loading || isCheckingSession

    return {
        isAuthenticated,
        isLoading,
        hasBackendSession,
        hasAuth0Session: auth0Authenticated,
    }
}
