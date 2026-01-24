/**
 * Setup ApiClient with self-hosted auth (getAccessToken, refresh for 401 retry)
 */

import { useEffect } from 'react'
import { apiClient } from './index'
import { useAuth } from '@/contexts/AuthContext'
import { initializeGraphQLAuth } from '@/lib/graphql/client'

export function ApiClientSetup({ children }: { children: React.ReactNode }) {
    const { getAccessToken, refresh } = useAuth()

    useEffect(() => {
        apiClient.initializeAuth({
            getAccessToken,
            refresh,
        })
        
        // Initialize GraphQL client with same auth token getter
        initializeGraphQLAuth(getAccessToken)
    }, [getAccessToken, refresh])

    return <>{children}</>
}
