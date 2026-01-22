/**
 * usePermissions Hook
 * Reads role, orgId, campaignIds from AuthContext (sourced from /api/auth/me)
 */

import type { UserRole } from '../types/auth'
import { useAuth } from '@/contexts/AuthContext'

export interface UserPermissions {
    role: UserRole | null
    org_id: string | null
    campaign_ids: Array<string>
    isAuthenticated: boolean
    isLoading: boolean
}

export function usePermissions(): UserPermissions {
    const { user, loading } = useAuth()

    if (loading) {
        return {
            role: null,
            org_id: null,
            campaign_ids: [],
            isAuthenticated: false,
            isLoading: true,
        }
    }

    if (!user) {
        return {
            role: null,
            org_id: null,
            campaign_ids: [],
            isAuthenticated: false,
            isLoading: false,
        }
    }

    return {
        role: (user.role as UserRole) || null,
        org_id: user.orgId ?? null,
        campaign_ids: Array.isArray(user.campaignIds) ? user.campaignIds : [],
        isAuthenticated: true,
        isLoading: false,
    }
}
