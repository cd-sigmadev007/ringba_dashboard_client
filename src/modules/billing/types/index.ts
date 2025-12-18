/**
 * Billing Module Types
 */

export interface Organization {
    id: string
    name: string
    created_at: string
    created_by: string | null
    email?: string | null
    country_code?: string | null
    phone_number?: string | null
    billing_address?: string | null
    country?: string | null
    state?: string | null
    city?: string | null
    postal_code?: string | null
    gst_vat_tax_id?: string | null
}

export interface CreateOrganizationRequest {
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

export interface UpdateOrganizationRequest {
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

/**
 * Invoice Types
 */
export type InvoiceStatus =
    | 'draft'
    | 'issued'
    | 'paid'
    | 'overdue'
    | 'cancelled'

export interface InvoiceItem {
    id: string
    invoice_id: string
    description: string
    quantity: number
    unit_price: number
    total: number
    vat_rate: number
    order_index: number
    created_at: string
}

export interface Invoice {
    id: string
    invoice_number: string
    status: InvoiceStatus
    invoice_date: string
    due_date: string
    billed_by_id: string
    billed_by_type: 'organization'
    billed_to_id: string
    billed_to_type: 'organization' | 'customer'
    currency_code: string
    currency_symbol: string
    subtotal: number
    tax_rate: number
    tax_amount: number
    discount_rate: number
    discount_amount: number
    total_amount: number
    payment_instructions: string | null
    notes: string | null
    logo_url: string | null
    created_at: string
    created_by: string | null
    updated_at: string
    items?: Array<InvoiceItem>
    // Additional fields from joins
    billed_by_name?: string
    billed_by_email?: string
    billed_to_name?: string
    billed_to_email?: string
}

export interface CreateInvoiceRequest {
    invoice_number?: string
    status?: InvoiceStatus
    invoice_date: string
    due_date: string
    billed_by_id: string
    billed_to_id: string
    billed_to_type: 'organization' | 'customer'
    currency_code: string
    currency_symbol: string
    tax_rate?: number
    discount_rate?: number
    payment_instructions?: string
    notes?: string
    logo_url?: string
    items: Array<{
        description: string
        quantity: number
        unit_price: number
        vat_rate?: number
    }>
}

export interface UpdateInvoiceRequest {
    invoice_number?: string
    status?: InvoiceStatus
    invoice_date?: string
    due_date?: string
    billed_by_id?: string
    billed_to_id?: string
    billed_to_type?: 'organization' | 'customer'
    currency_code?: string
    currency_symbol?: string
    tax_rate?: number
    discount_rate?: number
    payment_instructions?: string
    notes?: string
    logo_url?: string
    items?: Array<{
        id?: string
        description: string
        quantity: number
        unit_price: number
        vat_rate?: number
    }>
}
