/**
 * Auth Debug Panel
 * Component to help diagnose authentication issues
 */

import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'

export function AuthDebugPanel() {
    const {
        isAuthenticated,
        user,
        getIdTokenClaims,
        getAccessTokenSilently,
    } = useAuth0()
    const [idTokenClaims, setIdTokenClaims] = useState<any>(null)
    const [accessTokenClaims, setAccessTokenClaims] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadClaims = async () => {
            if (!isAuthenticated) return

            try {
                // Get ID token claims
                const idClaims = await getIdTokenClaims()
                setIdTokenClaims(idClaims)

                // Get access token and decode
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
                                atob(
                                    parts[1]
                                        .replace(/-/g, '+')
                                        .replace(/_/g, '/')
                                )
                            )
                            setAccessTokenClaims(payload)
                        }
                    }
                } catch (tokenError) {
                    setError(
                        `Failed to get access token: ${
                            tokenError instanceof Error
                                ? tokenError.message
                                : 'Unknown error'
                        }`
                    )
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
            }
        }

        loadClaims()
    }, [isAuthenticated, getIdTokenClaims, getAccessTokenSilently])

    if (!isAuthenticated) {
        return (
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
                <p className="text-sm">Not authenticated</p>
            </div>
        )
    }

    const audience = import.meta.env.VITE_AUTH0_AUDIENCE || ''

    // Extract role from both tokens
    const idTokenRole =
        idTokenClaims?.[`${audience}/role`] || idTokenClaims?.role
    const accessTokenRole =
        accessTokenClaims?.[`${audience}/role`] || accessTokenClaims?.role

    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
            <h3 className="font-bold mb-2">Auth Debug Info</h3>
            <div className="space-y-2">
                <div>
                    <strong>User:</strong> {user?.email}
                </div>
                <div>
                    <strong>Auth0 User ID:</strong> {user?.sub}
                </div>
                <div>
                    <strong>Audience:</strong> {audience}
                </div>
                <div>
                    <strong>ID Token Role:</strong>{' '}
                    {idTokenRole || '❌ Not found'}
                </div>
                <div>
                    <strong>Access Token Role:</strong>{' '}
                    {accessTokenRole || '❌ Not found'}
                </div>
                {error && (
                    <div className="text-red-600 dark:text-red-400">
                        <strong>Error:</strong> {error}
                    </div>
                )}
                <details className="mt-2">
                    <summary className="cursor-pointer">
                        ID Token Claims (click to expand)
                    </summary>
                    <pre className="mt-2 p-2 bg-white dark:bg-gray-900 rounded overflow-auto max-h-40">
                        {JSON.stringify(idTokenClaims, null, 2)}
                    </pre>
                </details>
                <details className="mt-2">
                    <summary className="cursor-pointer">
                        Access Token Claims (click to expand)
                    </summary>
                    <pre className="mt-2 p-2 bg-white dark:bg-gray-900 rounded overflow-auto max-h-40">
                        {JSON.stringify(accessTokenClaims, null, 2)}
                    </pre>
                </details>
            </div>
        </div>
    )
}
