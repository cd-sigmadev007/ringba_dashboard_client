/**
 * TanStack Query Hooks for Allowed Emails Management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    addAllowedEmail,
    getAllowedEmails,
    removeAllowedEmail,
} from '../services/adminApi'

export function useAllowedEmails() {
    return useQuery({
        queryKey: ['allowed-emails'],
        queryFn: async () => {
            return getAllowedEmails()
        },
        retry: 1,
    })
}

export function useAddAllowedEmail() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            email,
            notes,
        }: {
            email: string
            notes?: string
        }) => {
            return addAllowedEmail(email, notes)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allowed-emails'] })
        },
    })
}

export function useRemoveAllowedEmail() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ emailId }: { emailId: string }) => {
            return removeAllowedEmail(emailId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allowed-emails'] })
        },
    })
}
