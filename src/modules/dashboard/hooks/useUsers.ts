/**
 * TanStack Query Hooks for Users Management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import type { AssignUserRoleRequest } from '../services/adminApi'

export function useUsers() {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0()

    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const token = await getAccessTokenSilently()

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/admin/users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(
                    errorData.message ||
                        `Failed to fetch users: ${response.status}`
                )
            }

            return response.json()
        },
        enabled: isAuthenticated,
        retry: 1,
    })
}

export function useAssignUserToOrg() {
    const { getAccessTokenSilently } = useAuth0()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            userId,
            orgId,
        }: {
            userId: string
            orgId: string | null
        }) => {
            const token = await getAccessTokenSilently()

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/admin/users/${userId}/assign-org`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ org_id: orgId }),
                }
            )

            if (!response.ok) {
                const error = await response.json()
                throw new Error(
                    error.message || 'Failed to assign user to organization'
                )
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.invalidateQueries({ queryKey: ['organizations'] })
        },
    })
}

export function useAssignUserRole() {
    const { getAccessTokenSilently } = useAuth0()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            userId,
            role,
            orgId,
        }: {
            userId: string
            role: 'super_admin' | 'org_admin' | 'user'
            orgId?: string | null
        }) => {
            const token = await getAccessTokenSilently()

            const body: AssignUserRoleRequest = {
                role,
            }
            if (orgId !== undefined) {
                body.org_id = orgId
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/admin/users/${userId}/assign-role`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                }
            )

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to assign user role')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.invalidateQueries({ queryKey: ['organizations'] })
        },
    })
}
