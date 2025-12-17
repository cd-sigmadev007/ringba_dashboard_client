/**
 * PDF Generator Utility
 * Generates PDFs from invoice data using html2pdf (client-side)
 * This ensures the downloaded PDF matches exactly what's shown in the UI
 */

import html2pdf from 'html2pdf.js'
import { createRoot, Root } from 'react-dom/client'
import React from 'react'
import { InvoicePreview } from '../components/InvoicePreview'
import type { Invoice } from '../types'

/**
 * Transform invoice data to the format expected by InvoicePreview
 */
function transformInvoiceForPreview(invoice: Invoice) {
    // Build billed_to_address from parts if needed
    let billedToAddress = invoice.billed_to_name
        ? (invoice as any).billed_to_address
        : undefined

    // If billed_to_address is not available, try to build it from parts
    if (!billedToAddress && (invoice as any).billed_to_city) {
        const addressParts = [
            (invoice as any).billed_to_address,
            (invoice as any).billed_to_city,
            (invoice as any).billed_to_state,
            (invoice as any).billed_to_postal_code,
            (invoice as any).billed_to_country,
        ]
            .filter(Boolean)
            .join(', ')
        if (addressParts) {
            billedToAddress = addressParts
        }
    }

    return {
        invoice_number: invoice.invoice_number,
        invoice_date: invoice.invoice_date,
        due_date: invoice.due_date,
        billed_by_name: invoice.billed_by_name,
        billed_by_email: invoice.billed_by_email,
        billed_by_address: invoice.billed_by_address,
        billed_by_vat_id: (invoice as any).billed_by_vat_id || 'EE102168578',
        billed_by_reg_no: (invoice as any).billed_by_reg_no || '14587434',
        billed_to_name: invoice.billed_to_name,
        billed_to_email: invoice.billed_to_email,
        billed_to_address: billedToAddress,
        currency_symbol: invoice.currency_symbol,
        subtotal: invoice.subtotal,
        tax_rate: invoice.tax_rate,
        tax_amount: invoice.tax_amount,
        discount_rate: invoice.discount_rate,
        discount_amount: invoice.discount_amount,
        total_amount: invoice.total_amount,
        payment_instructions: invoice.payment_instructions,
        notes: invoice.notes,
        items: invoice.items || [],
    }
}

/**
 * Generate PDF from an HTML element
 */
async function generatePDFFromElement(
    element: HTMLElement,
    invoiceNumber: string
): Promise<void> {
    // Wait a bit more for any pending renders
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Configure html2pdf options (same as in CreateEditInvoicePage)
    const opt = {
        margin: [0, 0, 0, 0] as [number, number, number, number],
        filename: `invoice-${invoiceNumber}.pdf`,
        image: { type: 'jpeg' as const, quality: 1.0 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            width: element.offsetWidth,
            height: element.scrollHeight,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
        },
        jsPDF: {
            unit: 'px' as const,
            format: [element.offsetWidth, element.scrollHeight] as [
                number,
                number,
            ],
            orientation:
                element.scrollHeight > element.offsetWidth
                    ? ('portrait' as const)
                    : ('landscape' as const),
        },
    }

    // Generate and download PDF
    await html2pdf().set(opt).from(element).save()
}

/**
 * Generate and download PDF from invoice data
 */
export async function generateInvoicePDF(invoice: Invoice): Promise<void> {
    // Create a temporary container div
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.top = '-9999px'
    container.style.width = '565px'
    document.body.appendChild(container)

    let root: Root | null = null

    try {
        // Transform invoice data for preview
        const previewData = transformInvoiceForPreview(invoice)

        // Render InvoicePreview component into the container
        root = createRoot(container)
        root.render(
            React.createElement(InvoicePreview, {
                invoice: previewData,
            })
        )

        // Wait for React to render
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Find the actual invoice content element (the white card inside InvoicePreview)
        // The InvoicePreview has a structure with a wrapper, we need the inner content div
        const previewContent = container.querySelector(
            '#invoice-preview-content'
        ) as HTMLElement

        if (!previewContent) {
            // Fallback: try to find the white card by class
            const whiteCard = container.querySelector('.bg-white') as HTMLElement
            if (!whiteCard) {
                throw new Error('Could not find invoice preview content')
            }
            // Use whiteCard if previewContent not found
            await generatePDFFromElement(whiteCard, invoice.invoice_number)
            return
        }

        // Generate PDF from the element
        await generatePDFFromElement(previewContent, invoice.invoice_number)
    } finally {
        // Clean up: unmount React component and remove container
        try {
            if (root) {
                root.unmount()
            }
        } catch (e) {
            // If unmount fails, try to remove the container anyway
            console.warn('Error unmounting React component:', e)
        }
        if (container.parentNode) {
            document.body.removeChild(container)
        }
    }
}

