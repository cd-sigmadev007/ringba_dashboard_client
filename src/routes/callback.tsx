/**
 * Auth0 Callback Route
 * Handles the redirect after Auth0 authentication
 */

import { useEffect } from 'react'
import { createRoute, useNavigate } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import type { RootRoute } from '@tanstack/react-router'

function Callback() {
    const { isLoading, error } = useAuth0()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading && !error) {
            // Redirect to home after successful authentication
            navigate({ to: '/' })
        } else if (error) {
            // Handle error - redirect to home with error state
            console.error('Auth0 callback error:', error)
            navigate({ to: '/' })
        }
    }, [isLoading, error, navigate])

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

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400">
                        Authentication failed
                    </p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {error.message}
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
