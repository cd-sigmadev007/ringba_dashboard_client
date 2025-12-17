/**
 * Billing Invoices API Service
 */

import axios from 'axios'
import type { ApiResponse } from '@/services/api'
import type {
    CreateInvoiceRequest,
    Invoice,
    UpdateInvoiceRequest,
} from '../types'
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
 * Uses axios directly to ensure proper blob handling
 */
export async function downloadInvoicePDF(id: string): Promise<Blob> {
    // Get base URL from environment or use relative URL
    const baseURL = import.meta.env.VITE_API_BASE_URL || ''
    const url = `${baseURL}/api/admin/invoices/${id}/pdf`

    // Use axios directly for blob responses to ensure proper handling
    const response = await axios.get(url, {
        responseType: 'blob',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
        },
    })

    // Axios with responseType: 'blob' returns response.data as a Blob
    if (response.data instanceof Blob) {
        return response.data
    }

    // Fallback: create Blob from response data
    return new Blob([response.data], { type: 'application/pdf' })
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
