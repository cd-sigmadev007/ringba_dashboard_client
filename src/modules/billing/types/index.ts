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
