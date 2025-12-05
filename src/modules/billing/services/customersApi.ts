/**
 * Billing Customers API Service
 */

import type { ApiResponse } from '@/services/api'
import { apiClient } from '@/services/api'

export interface Customer {
    id: string
    name: string
    email?: string | null
    country_code?: string | null
    phone_number?: string | null
    billing_address?: string | null
    country?: string | null
    state?: string | null
    city?: string | null
    postal_code?: string | null
    gst_vat_tax_id?: string | null
    created_at: string
    created_by: string | null
}

export interface CreateCustomerRequest {
    name: string
    email?: string
    country_code?: string
    phone_number?: string
    billing_address?: string
    country?: string
    state?: string
    city?: string
    postal_code?: string
    gst_vat_tax_id?: string
}

export interface UpdateCustomerRequest {
    name?: string
    email?: string
    country_code?: string
    phone_number?: string
    billing_address?: string
    country?: string
    state?: string
    city?: string
    postal_code?: string
    gst_vat_tax_id?: string
}

export interface CustomersResponse extends ApiResponse<Array<Customer>> {
    data: Array<Customer>
}

export interface CustomerResponse extends ApiResponse<Customer> {
    data: Customer
}

/**
 * Get all customers
 */
export async function getCustomers(): Promise<CustomersResponse> {
    return apiClient.get<CustomersResponse>('/api/admin/customers')
}

/**
 * Get customer by ID
 */
export async function getCustomerById(id: string): Promise<CustomerResponse> {
    return apiClient.get<CustomerResponse>(`/api/admin/customers/${id}`)
}

/**
 * Create a new customer
 */
export async function createCustomer(
    data: CreateCustomerRequest
): Promise<CustomerResponse> {
    return apiClient.post<CustomerResponse>('/api/admin/customers', data)
}

/**
 * Update a customer
 */
export async function updateCustomer(
    id: string,
    data: UpdateCustomerRequest
): Promise<CustomerResponse> {
    return apiClient.put<CustomerResponse>(`/api/admin/customers/${id}`, data)
}

/**
 * Delete a customer
 */
export async function deleteCustomer(
    id: string
): Promise<ApiResponse<{ id: string }>> {
    return apiClient.delete<ApiResponse<{ id: string }>>(
        `/api/admin/customers/${id}`
    )
}
