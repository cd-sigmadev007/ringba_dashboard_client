/**
 * TanStack Query Hooks for Billing Customers
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
    createCustomer,
    deleteCustomer,
    getCustomers,
    updateCustomer,
} from '../services/customersApi'
import type {
    CreateCustomerRequest,
    UpdateCustomerRequest,
} from '../services/customersApi'

export function useCustomers() {
    return useQuery({
        queryKey: ['billing', 'customers'],
        queryFn: async () => {
            const response = await getCustomers()
            return response.data
        },
        retry: 1,
    })
}

export function useCreateCustomer() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateCustomerRequest) => createCustomer(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['billing', 'customers'],
            })
            toast.success('Customer created successfully')
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to create customer')
        },
    })
}

export function useUpdateCustomer() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateCustomerRequest
        }) => updateCustomer(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['billing', 'customers'],
            })
            toast.success('Customer updated successfully')
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to update customer')
        },
    })
}

export function useDeleteCustomer() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteCustomer(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['billing', 'customers'],
            })
            toast.success('Customer deleted successfully')
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to delete customer')
        },
    })
}
