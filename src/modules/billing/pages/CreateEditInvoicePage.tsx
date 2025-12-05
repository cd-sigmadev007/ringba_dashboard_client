/**
 * Create/Edit Invoice Page
 * Two-column layout with form on left and live preview on right
 */

import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import clsx from 'clsx'
import {
    useCreateInvoice,
    useDeleteInvoice,
    useDownloadInvoicePDF,
    useInvoice,
    useSaveDraft,
    useSendInvoice,
    useUpdateInvoice,
} from '../hooks/useInvoices'
import { InvoiceForm } from '../components/InvoiceForm'
import { InvoicePreview } from '../components/InvoicePreview'
import { InvoiceActionsMenu } from '../components/InvoiceActionsMenu'
import { useOrganizations } from '../hooks/useOrganizations'
import { useCustomers } from '../hooks/useCustomers'
import type { CreateInvoiceRequest } from '../types'
import Button from '@/components/ui/Button'
import { SendIcon } from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'

export default function CreateEditInvoicePage() {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const navigate = useNavigate()
    const params = useParams({ strict: false })
    const id = params?.id
    const isEditMode = !!id

    const { data: existingInvoice } = useInvoice(isEditMode ? id : null)
    const { data: organizations } = useOrganizations()
    const { data: customers } = useCustomers()
    const createMutation = useCreateInvoice()
    const updateMutation = useUpdateInvoice()
    const sendMutation = useSendInvoice()
    const downloadMutation = useDownloadInvoicePDF()
    const saveDraftMutation = useSaveDraft()
    const deleteMutation = useDeleteInvoice()

    const [formData, setFormData] = useState<CreateInvoiceRequest>({
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        billed_by_id: '',
        billed_to_id: '',
        billed_to_type: 'organization',
        currency_code: 'USD',
        currency_symbol: '$',
        tax_rate: 0,
        discount_rate: 0,
        items: [
            {
                description: '',
                quantity: 1,
                unit_price: 0,
                vat_rate: 0,
            },
        ],
    })

    // Populate form when editing
    useEffect(() => {
        if (existingInvoice) {
            setFormData({
                invoice_number: existingInvoice.invoice_number,
                status: existingInvoice.status,
                invoice_date:
                    typeof existingInvoice.invoice_date === 'string'
                        ? existingInvoice.invoice_date.split('T')[0]
                        : new Date().toISOString().split('T')[0],
                due_date:
                    typeof existingInvoice.due_date === 'string'
                        ? existingInvoice.due_date.split('T')[0]
                        : new Date().toISOString().split('T')[0],
                billed_by_id: existingInvoice.billed_by_id,
                billed_to_id: existingInvoice.billed_to_id,
                billed_to_type: existingInvoice.billed_to_type,
                currency_code: existingInvoice.currency_code,
                currency_symbol: existingInvoice.currency_symbol,
                tax_rate: existingInvoice.tax_rate,
                discount_rate: existingInvoice.discount_rate,
                payment_instructions:
                    existingInvoice.payment_instructions || undefined,
                notes: existingInvoice.notes || undefined,
                items: existingInvoice.items?.map((item) => ({
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    vat_rate: item.vat_rate,
                })) || [
                    {
                        description: '',
                        quantity: 1,
                        unit_price: 0,
                        vat_rate: 0,
                    },
                ],
            })
        }
    }, [existingInvoice])

    // Calculate totals for preview
    const previewData = useMemo(() => {
        const subtotal = formData.items.reduce(
            (sum, item) => sum + item.quantity * item.unit_price,
            0
        )
        const taxAmount = subtotal * ((formData.tax_rate || 0) / 100)
        const discountAmount = subtotal * ((formData.discount_rate || 0) / 100)
        const totalAmount = subtotal + taxAmount - discountAmount

        // Get billed by (from) details
        let billedByName = 'Clickdee Mediashare OÜ'
        let billedByEmail = ''
        let billedByAddress = ''
        const billedByVatId = 'EE102168578'
        const billedByRegNo = '14587434'

        if (formData.billed_by_id && organizations) {
            const org = organizations.find(
                (o) => o.id === formData.billed_by_id
            )
            if (org) {
                billedByName = org.name
                billedByEmail = org.email || ''
                const addressParts = [
                    org.billing_address,
                    org.city,
                    org.state,
                    org.postal_code,
                    org.country,
                ].filter(Boolean)
                billedByAddress = addressParts.join('\n')
                // Note: VAT ID and Reg No would need to be added to Organization type if available
            }
        }

        // Get billed to details
        let billedToName = 'N/A'
        let billedToEmail = ''
        let billedToAddress = ''

        if (formData.billed_to_type === 'organization' && organizations) {
            const org = organizations.find(
                (o) => o.id === formData.billed_to_id
            )
            if (org) {
                billedToName = org.name
                billedToEmail = org.email || ''
                const addressParts = [
                    org.billing_address,
                    org.city,
                    org.state,
                    org.postal_code,
                    org.country,
                ].filter(Boolean)
                billedToAddress = addressParts.join(', ')
            }
        } else if (formData.billed_to_type === 'customer' && customers) {
            const customer = customers.find(
                (c) => c.id === formData.billed_to_id
            )
            if (customer) {
                billedToName = customer.name
                billedToEmail = customer.email || ''
                const addressParts = [
                    customer.billing_address,
                    customer.city,
                    customer.state,
                    customer.postal_code,
                    customer.country,
                ].filter(Boolean)
                billedToAddress = addressParts.join(', ')
            }
        }

        return {
            invoice_number: formData.invoice_number || 'INV-XXXX',
            invoice_date: formData.invoice_date,
            due_date: formData.due_date,
            billed_by_name: billedByName,
            billed_by_email: billedByEmail,
            billed_by_address: billedByAddress,
            billed_by_vat_id: billedByVatId,
            billed_by_reg_no: billedByRegNo,
            billed_to_name: billedToName,
            billed_to_email: billedToEmail,
            billed_to_address: billedToAddress,
            currency_symbol: formData.currency_symbol,
            subtotal: Math.round(subtotal * 100) / 100,
            tax_rate: formData.tax_rate || 0,
            tax_amount: Math.round(taxAmount * 100) / 100,
            discount_rate: formData.discount_rate || 0,
            discount_amount: Math.round(discountAmount * 100) / 100,
            total_amount: Math.round(totalAmount * 100) / 100,
            payment_instructions: formData.payment_instructions,
            notes: formData.notes,
            items: formData.items.map((item, index) => ({
                id: `temp-${index}`,
                invoice_id: '',
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total: item.quantity * item.unit_price,
                vat_rate: item.vat_rate || 0,
                order_index: index,
                created_at: new Date().toISOString(),
            })),
        }
    }, [formData, organizations, customers])

    const handleSend = async () => {
        if (!isEditMode || !id) {
            // Save first, then send
            try {
                const invoice = await createMutation.mutateAsync(formData)
                await sendMutation.mutateAsync(invoice.id)
                navigate({ to: '/billing/invoices' })
            } catch (error) {
                // Error handling is done in the mutation hook
            }
        } else {
            try {
                await sendMutation.mutateAsync(id)
                navigate({ to: '/billing/invoices' })
            } catch (error) {
                // Error handling is done in the mutation hook
            }
        }
    }

    const handleDownload = async () => {
        if (!isEditMode || !id) {
            // Save first, then download
            try {
                const invoice = await createMutation.mutateAsync(formData)
                await downloadMutation.mutateAsync(invoice.id)
            } catch (error) {
                // Error handling is done in the mutation hook
            }
        } else {
            try {
                await downloadMutation.mutateAsync(id)
            } catch (error) {
                // Error handling is done in the mutation hook
            }
        }
    }

    const handleSaveDraft = async () => {
        if (!isEditMode || !id) {
            // Save as draft
            try {
                await createMutation.mutateAsync({
                    ...formData,
                    status: 'draft',
                })
                navigate({ to: '/billing/invoices' })
            } catch (error) {
                // Error handling is done in the mutation hook
            }
        } else {
            try {
                await saveDraftMutation.mutateAsync({
                    id,
                    data: {
                        ...formData,
                        status: 'draft',
                    },
                })
                navigate({ to: '/billing/invoices' })
            } catch (error) {
                // Error handling is done in the mutation hook
            }
        }
    }

    const handleDelete = async () => {
        if (!isEditMode || !id) return

        if (
            window.confirm(
                'Are you sure you want to delete this invoice? This action cannot be undone.'
            )
        ) {
            try {
                await deleteMutation.mutateAsync(id)
                navigate({ to: '/billing/invoices' })
            } catch (error) {
                // Error handling is done in the mutation hook
            }
        }
    }

    const isLoading =
        createMutation.isPending ||
        updateMutation.isPending ||
        sendMutation.isPending ||
        downloadMutation.isPending ||
        saveDraftMutation.isPending ||
        deleteMutation.isPending

    return (
        <div className="min-h-screen content">
            <div className="p-3 sm:p-4 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1
                        className={clsx(
                            'text-[32px] font-semibold tracking-[-0.96px]',
                            isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                        )}
                    >
                        {isEditMode ? 'Edit Invoice' : 'New Invoice'}
                    </h1>
                    <div className="flex items-center gap-[10px]">
                        <Button
                            variant="secondary"
                            onClick={handleSend}
                            disabled={isLoading}
                            className={clsx(
                                'flex items-center gap-[5px] px-[10px] py-[7px] rounded-[10px]',
                                isDark
                                    ? 'bg-[#002B57] text-[#F5F8FA]'
                                    : 'bg-[#002B57] text-[#F5F8FA]'
                            )}
                        >
                            <SendIcon className="w-[22px] h-[22px]" />
                            <span className="text-[14px] font-regular">
                                Send Invoice
                            </span>
                        </Button>
                        <InvoiceActionsMenu
                            onSaveDraft={handleSaveDraft}
                            onDownload={handleDownload}
                            onDelete={handleDelete}
                            disabled={isLoading || !isEditMode}
                        />
                    </div>
                </div>

                {/* Two-column layout */}
                <div className="flex gap-[24px]">
                    {/* Left: Form */}
                    <div className="flex-shrink-0">
                        <InvoiceForm
                            formData={formData}
                            onChange={setFormData}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Right: Preview */}
                    <div className="flex-shrink-0">
                        <InvoicePreview invoice={previewData} />
                    </div>
                </div>
            </div>
        </div>
    )
}
