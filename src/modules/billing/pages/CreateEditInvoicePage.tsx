/**
 * Create/Edit Invoice Page
 * Two-column layout with form on left and live preview on right
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import clsx from 'clsx'
import { toast } from 'react-hot-toast'
import {
    useCreateInvoice,
    useDeleteInvoice,
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
import { Modal } from '@/components/ui/Modal'
import { SendIcon } from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'
import { usePermissions } from '@/hooks/usePermissions'
import { downloadInvoicePdf } from '../pdf/InvoicePdf'
import { cn } from '@/lib'

export default function CreateEditInvoicePage() {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const navigate = useNavigate()
    const params = useParams({ strict: false })
    const id = params?.id
    const isEditMode = !!id
    const { role } = usePermissions()

    // Access control: Only super_admin and org_admin can access
    const canAccess = role === 'super_admin' || role === 'org_admin'

    useEffect(() => {
        if (role && !canAccess) {
            navigate({ to: '/caller-analysis' })
        }
    }, [role, canAccess, navigate])

    const { data: existingInvoice } = useInvoice(isEditMode ? id : null)
    const { data: organizations } = useOrganizations()
    const { data: customers } = useCustomers()
    const createMutation = useCreateInvoice()
    const updateMutation = useUpdateInvoice()
    const sendMutation = useSendInvoice()
    const saveDraftMutation = useSaveDraft()
    const deleteMutation = useDeleteInvoice()

    // Ref for the preview component to generate PDF
    const previewRef = useRef<HTMLDivElement>(null)

    // Logo upload state
    const [logoFile, setLogoFile] = useState<File | undefined>(undefined)
    const [logoPreview, setLogoPreview] = useState<string | undefined>(
        undefined
    )

    // Send invoice: confirmation modal and flow state for overlay
    const [sendConfirmOpen, setSendConfirmOpen] = useState(false)
    const [sendFlowActive, setSendFlowActive] = useState(false)

    const getApiBaseUrl = useMemo(() => {
        const baseUrl =
            (import.meta as any).env?.VITE_API_BASE_URL ||
            'http://localhost:3001'
        return baseUrl.replace(/\/api$/, '').replace(/\/+$/, '')
    }, [])

    const toAbsoluteLogoUrl = useCallback(
        (logoUrl?: string | null) => {
            if (!logoUrl) return ''
            if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://'))
                return logoUrl
            const base = getApiBaseUrl
            const path = logoUrl.startsWith('/') ? logoUrl : `/${logoUrl}`
            return `${base}${path}`
        },
        [getApiBaseUrl]
    )

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
                logo_url: existingInvoice.logo_url || undefined,
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
            // Set logo preview from existing invoice
            setLogoPreview(
                existingInvoice.logo_url
                    ? toAbsoluteLogoUrl(existingInvoice.logo_url)
                    : undefined
            )
            setLogoFile(undefined)
        } else if (!isEditMode) {
            // Reset logo state for new invoice
            setLogoPreview(undefined)
            setLogoFile(undefined)
        }
    }, [existingInvoice, isEditMode])

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
            logo_url: logoPreview
                ? logoPreview
                : formData.logo_url
                  ? toAbsoluteLogoUrl(formData.logo_url)
                  : undefined,
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
    }, [formData, organizations, customers, logoPreview, toAbsoluteLogoUrl])

    // Logo file handlers
    const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setLogoFile(file)
        if (file) {
            const reader = new FileReader()
            reader.onload = () => setLogoPreview(reader.result as string)
            reader.readAsDataURL(file)
        } else {
            setLogoPreview(
                existingInvoice?.logo_url
                    ? toAbsoluteLogoUrl(existingInvoice.logo_url)
                    : undefined
            )
        }
    }

    const handleRemoveLogo = () => {
        setLogoFile(undefined)
        setLogoPreview(undefined)
        setFormData({
            ...formData,
            logo_url: undefined,
        })
    }

    // Filter out empty items before sending
    const getValidatedFormData = (): CreateInvoiceRequest => {
        return {
            ...formData,
            items: formData.items.filter(
                (item) => item.description.trim() !== '' && item.quantity > 0
            ),
        }
    }

    const handleSendClick = () => {
        const validatedData = getValidatedFormData()
        if (!validatedData.billed_by_id || !validatedData.billed_to_id) {
            toast.error('Please select both "Billed By" and "Billed To"')
            return
        }
        if (validatedData.items.length === 0) {
            toast.error('Please add at least one invoice item')
            return
        }
        setSendConfirmOpen(true)
    }

    const proceedWithSend = async () => {
        const validatedData = getValidatedFormData()
        setSendConfirmOpen(false)
        setSendFlowActive(true)
        try {
            if (!isEditMode || !id) {
                const invoice = await createMutation.mutateAsync({
                    data: validatedData,
                    logoFile,
                })
                await new Promise((resolve) => setTimeout(resolve, 500))
                await sendMutation.mutateAsync(invoice.id)
                navigate({ to: '/billing/invoices' })
            } else {
                await updateMutation.mutateAsync({
                    id,
                    data: validatedData,
                    logoFile,
                })
                await new Promise((resolve) => setTimeout(resolve, 500))
                await sendMutation.mutateAsync(id)
                navigate({ to: '/billing/invoices' })
            }
        } catch (error) {
            // Error handling is done in the mutation hook
        } finally {
            setSendFlowActive(false)
        }
    }

    const handleDownload = async () => {
        const validatedData = getValidatedFormData()

        // Validate required fields
        if (!validatedData.billed_by_id || !validatedData.billed_to_id) {
            return // Error will be shown by form validation
        }

        if (validatedData.items.length === 0) {
            return // Error will be shown by form validation
        }

        // Save/update invoice first if needed
        let invoiceId = id
        if (!isEditMode || !id) {
            try {
                const invoice = await createMutation.mutateAsync({
                    data: validatedData,
                    logoFile,
                })
                invoiceId = invoice.id
                // Wait a bit for the invoice to be fully saved
                await new Promise((resolve) => setTimeout(resolve, 500))
            } catch (error) {
                // Error handling is done in the mutation hook
                return
            }
        } else {
            try {
                await updateMutation.mutateAsync({
                    id,
                    data: validatedData,
                    logoFile,
                })
                // Wait a bit for the update to complete
                await new Promise((resolve) => setTimeout(resolve, 500))
            } catch (error) {
                // Error handling is done in the mutation hook
                return
            }
        }

        try {
            await downloadInvoicePdf(
                previewData,
                `invoice-${validatedData.invoice_number || invoiceId}.pdf`
            )
            toast.success('Invoice PDF downloaded')
        } catch (error) {
            console.error('Error generating PDF:', error)
            toast.error('Failed to generate PDF')
        }
    }

    const handleSaveDraft = async () => {
        const validatedData = getValidatedFormData()

        // For draft, we can save even with empty items, but we need billed_by and billed_to
        if (!validatedData.billed_by_id || !validatedData.billed_to_id) {
            return // Error will be shown by form validation
        }

        if (!isEditMode || !id) {
            // Save as draft for new invoice
            try {
                await createMutation.mutateAsync({
                    data: {
                        ...validatedData,
                        status: 'draft',
                    },
                    logoFile,
                })
                navigate({ to: '/billing/invoices' })
            } catch (error) {
                // Error handling is done in the mutation hook
            }
        } else {
            // Update existing invoice as draft
            try {
                // First update the invoice with current form data
                await updateMutation.mutateAsync({
                    id,
                    data: validatedData,
                    logoFile,
                })
                // Then save as draft (this ensures status is set to draft)
                await saveDraftMutation.mutateAsync({
                    id,
                    data: {
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
        saveDraftMutation.isPending ||
        deleteMutation.isPending

    const sendStepLabel =
        createMutation.isPending
            ? 'Saving invoice…'
            : updateMutation.isPending
              ? 'Updating invoice…'
              : sendMutation.isPending
                ? 'Sending invoice…'
                : null

    if (!canAccess) {
        return null
    }

    return (
        <div className="min-h-screen content relative">
            {/* Send flow overlay: updating then sending */}
            {sendFlowActive && sendStepLabel && (
                <div
                    className={cn(
                        'fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-5',
                        isDark ? 'bg-[#071B2F]/95' : 'bg-white/95',
                        'backdrop-blur-sm'
                    )}
                    role="status"
                    aria-live="polite"
                    aria-label={sendStepLabel}
                >
                    <span
                        className="w-12 h-12 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"
                        aria-hidden
                    />
                    <p
                        className={cn(
                            'text-lg font-medium',
                            isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                        )}
                    >
                        {sendStepLabel}
                    </p>
                    <p
                        className={cn(
                            'text-sm',
                            isDark ? 'text-[#A1A5B7]' : 'text-[#7E8299]'
                        )}
                    >
                        {sendMutation.isPending
                            ? 'Email will be sent to the recipient shortly.'
                            : 'Please wait…'}
                    </p>
                </div>
            )}

            {/* Send confirmation modal */}
            <Modal
                open={sendConfirmOpen}
                onClose={() => setSendConfirmOpen(false)}
                title="Send invoice?"
                size="sm"
                showCloseButton
                closeOnBackdropClick
                showSeparator
            >
                <div className="flex flex-col gap-6">
                    <p
                        className={cn(
                            'text-[15px] leading-relaxed',
                            isDark ? 'text-[#E4E6EF]' : 'text-[#5E6278]'
                        )}
                    >
                        Are you sure you want to send this invoice? The recipient
                        will receive it by email.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setSendConfirmOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={(e) => {
                                e.preventDefault()
                                proceedWithSend()
                            }}
                            disabled={isLoading}
                            className="bg-[#007FFF] hover:bg-[#0254A5] text-white"
                        >
                            Yes, send invoice
                        </Button>
                    </div>
                </div>
            </Modal>

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
                            type="button"
                            variant="secondary"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleSendClick()
                            }}
                            disabled={isLoading}
                            className={clsx(
                                'flex items-center gap-[10px] h-[44px] px-[18px] py-[7px] rounded-[10px] min-w-[140px] justify-center',
                                isDark
                                    ? 'bg-[#132f4c] text-[#F5F8FA] hover:bg-[#1B456F]'
                                    : 'bg-[#132f4c] text-[#F5F8FA] hover:bg-[#1B456F]'
                            )}
                        >
                            {sendStepLabel ? (
                                <>
                                    <span
                                        className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"
                                        aria-hidden
                                    />
                                    <span className="font-medium text-[16px]">
                                        {sendStepLabel}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="font-medium text-[16px]">
                                        Send Invoice
                                    </span>
                                    <SendIcon className="w-[22px] h-[22px]" />
                                </>
                            )}
                        </Button>
                        <InvoiceActionsMenu
                            onSaveDraft={handleSaveDraft}
                            onDownload={handleDownload}
                            onDelete={handleDelete}
                            disabled={isLoading}
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
                            logoPreview={logoPreview}
                            onLogoFileChange={handleLogoFileChange}
                            onRemoveLogo={handleRemoveLogo}
                        />
                    </div>

                    {/* Right: Preview */}
                    <div className="flex-shrink-0">
                        <InvoicePreview
                            invoice={previewData}
                            pdfRef={previewRef}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
