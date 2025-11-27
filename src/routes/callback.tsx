/**
 * Auth0 Callback Route
 * Handles the redirect after Auth0 authentication
 */

import { useEffect, useRef, useState } from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import type { RootRoute } from '@tanstack/react-router'
import { apiClient } from '@/services/api'

function Callback() {
    const { isLoading, error, isAuthenticated, getAccessTokenSilently } =
        useAuth0()
    const navigate = useNavigate()
    const [loginError, setLoginError] = useState<string | null>(null)
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const loginAttemptedRef = useRef(false)

    useEffect(() => {
        const handleLogin = async () => {
            if (isLoading || error || loginAttemptedRef.current) {
                // If there's an error, it's already handled by the early return
                // The error will be displayed in the render below
                return
            }

            if (isAuthenticated && !isLoggingIn) {
                loginAttemptedRef.current = true
                try {
                    setIsLoggingIn(true)
                    // Get Auth0 access token
                    const accessToken = await getAccessTokenSilently()

                    if (!accessToken) {
                        throw new Error('Failed to get access token')
                    }

                    // Call backend login endpoint to create session
                    // This endpoint doesn't require auth, so apiClient.post will skip auth wait
                    const loginResponse = await apiClient.post('/api/auth/login', {
                        accessToken,
                    })

                    console.log('✅ Backend login successful, session created', loginResponse)

                    // Verify session was created by checking /api/auth/me
                    // Wait a bit to ensure cookie is set
                    await new Promise((resolve) => setTimeout(resolve, 100))
                    
                    try {
                        const meResponse = await apiClient.get('/api/auth/me')
                        console.log('✅ Session verified:', meResponse)
                    } catch (meError) {
                        console.warn('⚠️ Session verification failed, but continuing:', meError)
                    }

                    // Redirect to caller analysis after successful login
                    navigate({ to: '/caller-analysis' })
                } catch (err: any) {
                    console.error('❌ Backend login failed:', err)
                    setLoginError(err.message || 'Failed to create session')
                    // Still redirect to caller analysis, but with error state
                    navigate({ to: '/caller-analysis' })
                } finally {
                    setIsLoggingIn(false)
                }
            }
        }

        handleLogin()
    }, [
        isLoading,
        error,
        isAuthenticated,
        getAccessTokenSilently,
        navigate,
        isLoggingIn,
    ])

    if (isLoading || isLoggingIn) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        {isLoggingIn
                            ? 'Creating session...'
                            : 'Completing login...'}
                    </p>
                </div>
            </div>
        )
    }

    if (error || loginError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400">
                        Authentication failed
                    </p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {error?.message || loginError}
                    </p>
                </div>
            </div>
        )
    }

    return null
}

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/callback',
        component: Callback,
        getParentRoute: () => parentRoute,
    })
