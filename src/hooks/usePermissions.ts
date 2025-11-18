/**
 * usePermissions Hook
 * Gets user permissions from session (cookie-based auth)
 */

import { useAuthStore } from '../store/authStore'
import type { UserRole } from '../types/auth'

export interface UserPermissions {
    role: UserRole | null
    org_id: string | null
    campaign_ids: Array<string>
    isAuthenticated: boolean
    isLoading: boolean
}

export function usePermissions(): UserPermissions {
    const { user, isAuthenticated, isLoading } = useAuthStore()

    if (isLoading) {
        return {
            role: null,
            org_id: null,
            campaign_ids: [],
            isAuthenticated: false,
            isLoading: true,
        }
    }

    if (!isAuthenticated || !user) {
        return {
            role: null,
            org_id: null,
            campaign_ids: [],
            isAuthenticated: false,
            isLoading: false,
        }
    }

    return {
        role: user.role as UserRole,
        org_id: user.orgId,
        campaign_ids: user.campaignIds,
        isAuthenticated: true,
        isLoading: false,
    }
}
