/**
 * TanStack Query Hooks for Billing Organizations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    fetchOrganizations,
    createOrg,
    updateOrg,
    type CreateOrganizationRequest,
    type UpdateOrganizationRequest,
} from '../services/organizationsApi'
import toast from 'react-hot-toast'

export function useOrganizations() {
    return useQuery({
        queryKey: ['billing', 'organizations'],
        queryFn: fetchOrganizations,
        retry: 1,
    })
}

export function useCreateOrganization() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateOrganizationRequest) => createOrg(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['billing', 'organizations'] })
            queryClient.invalidateQueries({ queryKey: ['organizations'] })
            toast.success('Organization created successfully')
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to create organization')
        },
    })
}

export function useUpdateOrganization() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateOrganizationRequest
        }) => updateOrg(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['billing', 'organizations'] })
            queryClient.invalidateQueries({ queryKey: ['organizations'] })
            toast.success('Organization updated successfully')
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to update organization')
        },
    })
}

