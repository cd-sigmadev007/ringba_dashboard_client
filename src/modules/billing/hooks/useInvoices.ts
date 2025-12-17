/**
 * TanStack Query Hooks for Billing Invoices
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
    createInvoice,
    deleteInvoice,
    downloadInvoicePDF,
    fetchInvoices,
    getInvoiceById,
    saveDraft,
    sendInvoice,
    updateInvoice,
} from '../services/invoicesApi'
import type { CreateInvoiceRequest, UpdateInvoiceRequest } from '../types'

export function useInvoices() {
    return useQuery({
        queryKey: ['billing', 'invoices'],
        queryFn: fetchInvoices,
        retry: 1,
    })
}

export function useInvoice(id: string | null) {
    return useQuery({
        queryKey: ['billing', 'invoices', id],
        queryFn: () => (id ? getInvoiceById(id) : Promise.resolve(null)),
        enabled: !!id,
        retry: 1,
    })
}

export function useCreateInvoice() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateInvoiceRequest) => createInvoice(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['billing', 'invoices'],
            })
            toast.success('Invoice created successfully')
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to create invoice')
        },
    })
}

export function useUpdateInvoice() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateInvoiceRequest
        }) => updateInvoice(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['billing', 'invoices'],
            })
            queryClient.invalidateQueries({
                queryKey: ['billing', 'invoices', variables.id],
            })
            toast.success('Invoice updated successfully')
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to update invoice')
        },
    })
}

export function useDeleteInvoice() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteInvoice(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['billing', 'invoices'],
            })
            toast.success('Invoice deleted successfully')
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to delete invoice')
        },
    })
}

export function useSendInvoice() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => sendInvoice(id),
        onSuccess: (_, invoiceId) => {
            queryClient.invalidateQueries({
                queryKey: ['billing', 'invoices'],
            })
            queryClient.invalidateQueries({
                queryKey: ['billing', 'invoices', invoiceId],
            })
            toast.success('Invoice sent successfully')
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to send invoice')
        },
    })
}

export function useDownloadInvoicePDF() {
    return useMutation({
        mutationFn: async (id: string) => {
            const blob = await downloadInvoicePDF(id)

            // Ensure we have a valid Blob
            if (!(blob instanceof Blob)) {
                throw new Error('Invalid response: expected Blob')
            }

            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `invoice-${id}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Revoke the URL after a short delay to ensure download starts
            setTimeout(() => {
                URL.revokeObjectURL(url)
            }, 100)
        },
        onSuccess: () => {
            toast.success('Invoice PDF downloaded')
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to download invoice PDF')
        },
    })
}

export function useSaveDraft() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateInvoiceRequest
        }) => saveDraft(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['billing', 'invoices'],
            })
            queryClient.invalidateQueries({
                queryKey: ['billing', 'invoices', variables.id],
            })
            toast.success('Invoice saved as draft')
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to save draft')
        },
    })
}
