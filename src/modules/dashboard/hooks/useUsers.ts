/**
 * TanStack Query Hooks for Users Management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    assignUserRole,
    assignUserToOrg,
    getAllUsers,
} from '../services/adminApi'
import { useAuth } from '@/contexts/AuthContext'

export function useUsers() {
    const { user } = useAuth()
    const isAuthenticated = !!user

    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            return getAllUsers()
        },
        enabled: isAuthenticated,
        retry: 1,
    })
}

export function useAssignUserToOrg() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            userId,
            orgId,
        }: {
            userId: string
            orgId: string | null
        }) => {
            return assignUserToOrg(userId, orgId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.invalidateQueries({ queryKey: ['organizations'] })
        },
    })
}

export function useAssignUserRole() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            userId,
            role,
            orgId,
        }: {
            userId: string
            role: 'super_admin' | 'org_admin' | 'media_buyer'
            orgId?: string | null
        }) => {
            return assignUserRole(userId, role, orgId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.invalidateQueries({ queryKey: ['organizations'] })
        },
    })
}
