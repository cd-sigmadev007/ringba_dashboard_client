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
    const { isLoading, error, isAuthenticated, getAccessTokenSilently, user, getIdTokenClaims } =
        useAuth0()
    const navigate = useNavigate()
    const [loginError, setLoginError] = useState<string | null>(null)
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [userId, setUserId] = useState<string>('N/A')
    const loginAttemptedRef = useRef(false)

    // Extract user ID from token or user object
    useEffect(() => {
        const extractUserId = async () => {
            if (user?.sub) {
                setUserId(user.sub)
                return
            }
            
            try {
                const idTokenClaims = await getIdTokenClaims()
                if (idTokenClaims?.sub) {
                    setUserId(idTokenClaims.sub)
                    return
                }
            } catch (e) {
                // Ignore
            }
            
            try {
                const accessToken = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                    },
                })
                if (accessToken) {
                    const parts = accessToken.split('.')
                    if (parts.length === 3) {
                        const payload = JSON.parse(
                            atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
                        )
                        if (payload.sub) {
                            setUserId(payload.sub)
                            return
                        }
                    }
                }
            } catch (e) {
                // Ignore
            }
        }
        
        extractUserId()
    }, [user, getIdTokenClaims, getAccessTokenSilently, error, loginError])

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
                    
                    // Extract user ID from token
                    const parts = accessToken.split('.')
                    if (parts.length === 3) {
                        const payload = JSON.parse(
                            atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
                        )
                        if (payload.sub) {
                            setUserId(payload.sub)
                        }
                    }

                    // Call backend login endpoint to create session
                    // This endpoint doesn't require auth, so apiClient.post will skip auth wait
                    await apiClient.post(
                        '/api/auth/login',
                        {
                            accessToken,
                        }
                    )

                    // Verify session was created by checking /api/auth/me
                    // Wait a bit to ensure cookie is set
                    await new Promise((resolve) => setTimeout(resolve, 100))

                    try {
                        await apiClient.get('/api/auth/me')
                    } catch (meError) {
                        // Session verification failed, but continuing
                    }

                    // Redirect to caller analysis after successful login
                    navigate({ to: '/caller-analysis' })
                } catch (err: any) {
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
        const errorText = error?.message || loginError || ''
        const userIdMatch = errorText.match(/User ID: ([^|]+)/)
        const extractedUserId = userIdMatch ? userIdMatch[1].trim() : (userId !== 'N/A' ? userId : 'N/A')
        
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400">
                        Authentication failed
                    </p>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {errorText.split('|')[0].trim()}
                        {
                            (error?.message === 'unauthorized' || errorText.includes('unauthorized')) && (
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Your email is not authorized to access this application. Please contact your administrator.
                                </p>
                            )
                        }
                    </div>
                    {extractedUserId !== 'N/A' && (
                        <p className="mt-4 text-xs text-center font-bold text-gray-900 dark:text-gray-100">
                            <span className="font-bold">User ID:</span> {extractedUserId}
                        </p>
                    )}
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
