/**
 * Billing Invoices API Service
 */

import type { ApiResponse } from '@/services/api'
import type { CreateInvoiceRequest, Invoice, UpdateInvoiceRequest  } from '../types'
import { apiClient } from '@/services/api'

export interface InvoicesResponse extends ApiResponse<Array<Invoice>> {
    data: Array<Invoice>
}

export interface InvoiceResponse extends ApiResponse<Invoice> {
    data: Invoice
}

/**
 * Get all invoices
 */
export async function fetchInvoices(): Promise<Array<Invoice>> {
    const response = await apiClient.get<InvoicesResponse>(
        '/api/admin/invoices'
    )
    return response.data
}

/**
 * Get invoice by ID
 */
export async function getInvoiceById(id: string): Promise<Invoice> {
    const response = await apiClient.get<InvoiceResponse>(
        `/api/admin/invoices/${id}`
    )
    return response.data
}

/**
 * Create a new invoice
 */
export async function createInvoice(
    data: CreateInvoiceRequest
): Promise<Invoice> {
    const response = await apiClient.post<InvoiceResponse>(
        '/api/admin/invoices',
        data
    )
    return response.data
}

/**
 * Update an invoice
 */
export async function updateInvoice(
    id: string,
    data: UpdateInvoiceRequest
): Promise<Invoice> {
    const response = await apiClient.put<InvoiceResponse>(
        `/api/admin/invoices/${id}`,
        data
    )
    return response.data
}

/**
 * Delete an invoice
 */
export async function deleteInvoice(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<{ id: string }>>(
        `/api/admin/invoices/${id}`
    )
}

/**
 * Send invoice via email
 */
export async function sendInvoice(id: string): Promise<void> {
    await apiClient.post<ApiResponse<{ sent: boolean }>>(
        `/api/admin/invoices/${id}/send`
    )
}

/**
 * Download invoice PDF
 */
export async function downloadInvoicePDF(id: string): Promise<Blob> {
    const response = await apiClient.get(`/api/admin/invoices/${id}/pdf`, {
        responseType: 'blob',
    })
    return response.data
}

/**
 * Save invoice as draft
 */
export async function saveDraft(
    id: string,
    data: UpdateInvoiceRequest
): Promise<Invoice> {
    const response = await apiClient.post<InvoiceResponse>(
        `/api/admin/invoices/${id}/save-draft`,
        data
    )
    return response.data
}
