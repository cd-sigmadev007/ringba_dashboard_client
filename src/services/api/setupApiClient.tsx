/**
 * Setup ApiClient with self-hosted auth (getAccessToken, refresh for 401 retry)
 */

import { useEffect } from 'react'
import { apiClient } from './index'
import { useAuth } from '@/contexts/AuthContext'

export function ApiClientSetup({ children }: { children: React.ReactNode }) {
    const { getAccessToken, refresh } = useAuth()

    useEffect(() => {
        apiClient.initializeAuth({
            getAccessToken,
            refresh,
        })
    }, [getAccessToken, refresh])

    return <>{children}</>
}
