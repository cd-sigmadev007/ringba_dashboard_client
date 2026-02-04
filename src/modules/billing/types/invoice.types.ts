/**
 * Shared invoice data model for UI preview and PDF generation.
 * Used by InvoicePreview (React/Tailwind) and InvoicePdf (@react-pdf/renderer).
 */

export interface InvoicePreviewItem {
    id?: string
    invoice_id?: string
    description: string
    quantity: number
    unit_price: number
    total: number
    vat_rate: number
    order_index?: number
    created_at?: string
}

/** Company (billed by) info */
export interface InvoiceCompanyInfo {
    billed_by_name?: string
    billed_by_email?: string
    billed_by_address?: string
    billed_by_vat_id?: string
    billed_by_reg_no?: string
}

/** Client (billed to) info */
export interface InvoiceClientInfo {
    billed_to_name?: string
    billed_to_email?: string
    billed_to_address?: string
}

/** Invoice meta (number, dates) */
export interface InvoiceMeta {
    invoice_number: string
    invoice_date: string
    due_date: string
}

/** Totals, tax, discount */
export interface InvoiceTotals {
    currency_symbol: string
    subtotal: number
    tax_rate: number
    tax_amount: number
    discount_rate: number
    discount_amount: number
    total_amount: number
}

/** Single data shape consumed by both preview and PDF */
export interface InvoicePreviewData
    extends InvoiceCompanyInfo,
        InvoiceClientInfo,
        InvoiceMeta,
        InvoiceTotals {
    payment_instructions?: string | null
    notes?: string | null
    logo_url?: string | null
    items?: Array<InvoicePreviewItem>
}
