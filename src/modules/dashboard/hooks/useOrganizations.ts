/**
 * TanStack Query Hooks for Organizations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createOrganization, getOrganizations } from '../services/adminApi'

export function useOrganizations() {
    return useQuery({
        queryKey: ['organizations'],
        queryFn: async () => {
            return getOrganizations()
        },
        retry: 1,
    })
}

export function useCreateOrganization() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: { name: string }) => {
            return createOrganization(data.name)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] })
        },
    })
}
