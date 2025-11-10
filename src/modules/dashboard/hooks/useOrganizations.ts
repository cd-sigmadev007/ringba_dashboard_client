/**
 * TanStack Query Hooks for Organizations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import type { CreateOrganizationRequest } from '../services/adminApi'

export function useOrganizations() {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0()

    return useQuery({
        queryKey: ['organizations'],
        queryFn: async () => {
            const token = await getAccessTokenSilently()

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/admin/organizations`,
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
                        `Failed to fetch organizations: ${response.status}`
                )
            }

            return response.json()
        },
        enabled: isAuthenticated,
        retry: 1,
    })
}

export function useCreateOrganization() {
    const { getAccessTokenSilently } = useAuth0()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateOrganizationRequest) => {
            const token = await getAccessTokenSilently()

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/admin/organizations`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            )

            if (!response.ok) {
                const error = await response.json()
                throw new Error(
                    error.message || 'Failed to create organization'
                )
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] })
        },
    })
}
