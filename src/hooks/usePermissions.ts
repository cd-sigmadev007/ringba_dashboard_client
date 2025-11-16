/**
 * usePermissions Hook
 * Extracts user permissions from Auth0 ID token claims
 */

import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import type { UserRole } from '../types/auth'

export interface UserPermissions {
    role: UserRole | null
    org_id: string | null
    campaign_ids: Array<string>
    isAuthenticated: boolean
    isLoading: boolean
}

export function usePermissions(): UserPermissions {
    const {
        isAuthenticated,
        isLoading,
        getIdTokenClaims,
        getAccessTokenSilently,
    } = useAuth0()
    const [claims, setClaims] = useState<any>(null)
    const [claimsSource, setClaimsSource] = useState<
        'access_token' | 'id_token' | null
    >(null)
    const [claimsLoading, setClaimsLoading] = useState(true)

    useEffect(() => {
        const getClaims = async () => {
            if (isAuthenticated) {
                try {
                    // Try ID token first (for display purposes)
                    const idTokenClaims = await getIdTokenClaims()

                    // Also try to get access token claims (what backend actually validates)
                    let accessTokenClaims: any = null
                    try {
                        // Get access token silently (no popup)
                        const accessToken = await getAccessTokenSilently({
                            authorizationParams: {
                                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                            },
                        })

                        if (accessToken) {
                            // Decode JWT token (simple base64 decode of payload)
                            try {
                                const parts = accessToken.split('.')
                                if (parts.length === 3) {
                                    const payload = JSON.parse(
                                        atob(
                                            parts[1]
                                                .replace(/-/g, '+')
                                                .replace(/_/g, '/')
                                        )
                                    )
                                    accessTokenClaims = payload
                                }
                            } catch (decodeError) {
                                console.warn(
                                    'Could not decode access token:',
                                    decodeError
                                )
                            }
                        }
                    } catch (accessTokenError) {
                        // Silently fail - we'll use ID token claims
                        console.warn(
                            'Could not get access token claims:',
                            accessTokenError
                        )
                    }

                    // Prefer access token claims (what backend uses), fallback to ID token
                    const tokenClaims = accessTokenClaims || idTokenClaims
                    const source = accessTokenClaims
                        ? 'access_token'
                        : 'id_token'

                    // Debug: Log all claims to help troubleshoot
                    console.log('🔍 Auth0 Token Claims:', {
                        source,
                        claims: tokenClaims,
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                    })

                    setClaims(tokenClaims)
                    setClaimsSource(source)
                } catch (error) {
                    console.error('Error getting token claims:', error)
                    setClaims(null)
                }
            } else {
                setClaims(null)
            }
            setClaimsLoading(false)
        }

        getClaims()
    }, [isAuthenticated, getIdTokenClaims, getAccessTokenSilently])

    if (isLoading || claimsLoading) {
        return {
            role: null,
            org_id: null,
            campaign_ids: [],
            isAuthenticated: false,
            isLoading: true,
        }
    }

    if (!isAuthenticated || !claims) {
        return {
            role: null,
            org_id: null,
            campaign_ids: [],
            isAuthenticated: false,
            isLoading: false,
        }
    }

    // Extract custom claims from token
    // Auth0 namespaces custom claims by audience URL when using an API
    // Try multiple possible claim locations:
    // 1. Namespaced by full audience URL: "https://ringba.api/role"
    // 2. Namespaced with trailing slash: "https://ringba.api/role"
    // 3. Direct claims: "role"
    // 4. Check all keys that contain "role"

    const audience = import.meta.env.VITE_AUTH0_AUDIENCE || ''

    // Try all possible claim locations
    let role: UserRole | null = null
    let org_id: string | null = null
    let campaign_ids: Array<string> = []

    // Method 1: Namespaced by full audience URL
    if (audience) {
        role = claims[`${audience}/role`] || null
        org_id = claims[`${audience}/org_id`] || null
        campaign_ids = claims[`${audience}/campaign_ids`] || []
    }

    // Method 2: Direct claims (fallback)
    if (!role) {
        role = claims.role || null
    }
    if (!org_id) {
        org_id = claims.org_id || null
    }
    if (campaign_ids.length === 0) {
        campaign_ids = claims.campaign_ids || []
    }

    // Method 3: Search all keys for role-related claims (debugging)
    if (!role) {
        const allKeys = Object.keys(claims || {})
        const roleKeys = allKeys.filter((key) =>
            key.toLowerCase().includes('role')
        )
        if (roleKeys.length > 0) {
            console.warn(
                '🔍 Found potential role keys:',
                roleKeys.map((key) => ({ key, value: claims[key] }))
            )
            // Try the first role key found
            role = claims[roleKeys[0]] || null
        }
    }

    // Debug output
    if (role) {
        console.log('✅ Found role:', role, {
            org_id,
            campaign_ids_count: campaign_ids.length,
            source: claimsSource,
        })
    } else {
        console.error('❌ No role found in claims!')
        console.error('Available claim keys:', Object.keys(claims || {}))
        console.error('Audience:', audience)
        console.error('Full claims object:', claims)
        console.error('💡 Troubleshooting steps:')
        console.error('   1. Check browser console for Auth0 Action errors')
        console.error('   2. Verify Auth0 Action is configured and enabled')
        console.error('   3. Check backend logs for Auth0 Action calls')
        console.error(
            '   4. Verify user exists in database with correct auth0_user_id'
        )
        console.error(
            '   5. Log out completely and log back in to get fresh token'
        )
        console.error('   6. Check Auth0 Dashboard > Actions > Flows > Login')
    }

    return {
        role,
        org_id,
        campaign_ids,
        isAuthenticated: true,
        isLoading: false,
    }
}
