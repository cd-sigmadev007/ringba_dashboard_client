/**
 * TanStack Query Hooks for Organizations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createOrganization, getOrganizations } from '../services/adminApi'
import type { CreateOrganizationRequest } from '../services/adminApi'

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
        mutationFn: async (data: CreateOrganizationRequest) => {
            return createOrganization(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] })
        },
    })
}
