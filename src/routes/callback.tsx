/**
 * Auth0 Callback Route
 * Handles the redirect after Auth0 authentication
 */

import { useEffect, useState } from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { useAuthStore } from '../store/authStore'
import { apiClient } from '../services/api'
import type { RootRoute } from '@tanstack/react-router'

function Callback() {
    const { isLoading, error, isAuthenticated, getAccessTokenSilently } =
        useAuth0()
    const navigate = useNavigate()
    const { login } = useAuthStore()
    const [loginError, setLoginError] = useState<string | null>(null)

    useEffect(() => {
        const handleLogin = async () => {
            if (isLoading) return

            if (error) {
                console.error('Auth0 callback error:', error)
                setLoginError(error.message)
                return
            }

            if (isAuthenticated) {
                try {
                    // Get Auth0 access token
                    const accessToken = await getAccessTokenSilently()

                    // Login to backend to create session
                    await login(accessToken)

                    // Initialize API client
                    apiClient.initializeAuth()

                    // Redirect to home after successful login
                    navigate({ to: '/' })
                } catch (err: any) {
                    console.error('Backend login error:', err)
                    setLoginError(err?.message || 'Failed to complete login')
                }
            }
        }

        handleLogin()
    }, [
        isLoading,
        error,
        isAuthenticated,
        getAccessTokenSilently,
        login,
        navigate,
    ])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        Completing login...
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
                        {loginError || error?.message}
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
