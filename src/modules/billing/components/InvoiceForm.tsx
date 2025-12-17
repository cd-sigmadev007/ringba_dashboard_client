/**
 * Invoice Form Component
 * Form for creating/editing invoices with real-time calculations
 */

import React, { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { useOrganizations } from '../hooks/useOrganizations'
import { useCustomers } from '../hooks/useCustomers'
import { fetchCurrencies } from '../services/currencyApi'
import { InvoiceItemRow } from './InvoiceItemRow'
import type { InvoiceItemData } from './InvoiceItemRow'
import type { CreateInvoiceRequest } from '../types'
import { Input } from '@/components/ui/Input'
import { TextArea } from '@/components/ui/TextArea'
import FormSelect from '@/components/ui/FormSelect'
import { AddIcon } from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'

interface InvoiceFormProps {
    formData: CreateInvoiceRequest
    onChange: (data: CreateInvoiceRequest) => void
    errors?: Record<string, string>
    disabled?: boolean
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
    formData,
    onChange,
    errors = {},
    disabled = false,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const { data: organizations } = useOrganizations()
    const { data: customers } = useCustomers()
    const [currencies, setCurrencies] = useState<
        Array<{
            title: string
            value: string
            symbol: string
            flagEmoji?: string
        }>
    >([])

    // Fetch currencies on mount
    useEffect(() => {
        fetchCurrencies().then((list) => {
            setCurrencies(
                list.map((c) => ({
                    title: `${c.code} (${c.symbol})`,
                    value: c.code,
                    symbol: c.symbol,
                    flagEmoji: c.flagEmoji,
                }))
            )
        })
    }, [])

    // Note: Calculations are done in the preview component
    // The form data itself doesn't need to store calculated values

    // Prepare billed by options (organizations)
    const billedByOptions = useMemo(() => {
        if (!organizations) return []
        return organizations.map((org) => ({
            title: org.name,
            value: org.id,
        }))
    }, [organizations])

    // Prepare billed to options (organizations + customers)
    const billedToOptions = useMemo(() => {
        const orgs =
            organizations?.map((org) => ({
                title: `${org.name} (Organization)`,
                value: `org_${org.id}`,
                type: 'organization' as const,
            })) || []

        const custs =
            customers?.map((cust) => ({
                title: `${cust.name} (Customer)`,
                value: `cust_${cust.id}`,
                type: 'customer' as const,
            })) || []

        return [...orgs, ...custs]
    }, [organizations, customers])

    const handleFieldChange = (
        field: keyof CreateInvoiceRequest,
        value: any
    ) => {
        onChange({
            ...formData,
            [field]: value,
        })
    }

    const handleItemChange = (index: number, item: InvoiceItemData) => {
        const newItems = [...formData.items]
        newItems[index] = item
        onChange({
            ...formData,
            items: newItems,
        })
    }

    const handleAddItem = () => {
        onChange({
            ...formData,
            items: [
                ...formData.items,
                {
                    description: '',
                    quantity: 1,
                    unit_price: 0,
                    vat_rate: 0,
                },
            ],
        })
    }

    const handleDeleteItem = (index: number) => {
        const newItems = formData.items.filter((_, i) => i !== index)
        onChange({
            ...formData,
            items: newItems,
        })
    }

    const handleBilledToChange = (value: string) => {
        if (value.startsWith('org_')) {
            const orgId = value.replace('org_', '')
            onChange({
                ...formData,
                billed_to_id: orgId,
                billed_to_type: 'organization',
            })
        } else if (value.startsWith('cust_')) {
            const custId = value.replace('cust_', '')
            onChange({
                ...formData,
                billed_to_id: custId,
                billed_to_type: 'customer',
            })
        }
    }

    const handleCurrencyChange = (value: string) => {
        const currency = currencies.find((c) => c.value === value)
        if (currency) {
            onChange({
                ...formData,
                currency_code: currency.value,
                currency_symbol: currency.symbol,
            })
        }
    }

    const getBilledToValue = () => {
        if (formData.billed_to_type === 'organization') {
            return `org_${formData.billed_to_id}`
        } else {
            return `cust_${formData.billed_to_id}`
        }
    }

    return (
        <div className="flex flex-col gap-[24px] w-[440px]">
            {/* Invoice Number */}
            <div className="flex flex-col gap-[10px]">
                <label
                    className={clsx(
                        'text-[14px] font-regular',
                        isDark ? 'text-white' : 'text-[#3F4254]'
                    )}
                >
                    Invoice Number
                </label>
                <Input
                    value={formData.invoice_number || ''}
                    onChange={(e) =>
                        handleFieldChange('invoice_number', e.target.value)
                    }
                    placeholder="Auto-generated"
                    disabled={disabled}
                    className={clsx(
                        isDark
                            ? 'bg-[#002B57] focus:bg-[#002B57] text-[#F5F8FA]'
                            : 'bg-[#002B57] focus:bg-[#002B57] text-[#F5F8FA]'
                    )}
                    error={errors.invoice_number}
                />
            </div>

            {/* Invoice Date & Due Date */}
            <div className="flex gap-[16px]">
                <div className="flex flex-col gap-[10px] flex-1">
                    <label
                        className={clsx(
                            'text-[14px] font-regular',
                            isDark ? 'text-white' : 'text-[#3F4254]'
                        )}
                    >
                        Invoice Date
                    </label>
                    <Input
                        type="date"
                        value={formData.invoice_date}
                        onChange={(e) =>
                            handleFieldChange('invoice_date', e.target.value)
                        }
                        disabled={disabled}
                        className={clsx(
                            isDark
                                ? 'bg-[#002B57] text-[#F5F8FA]'
                                : 'bg-[#002B57] text-[#F5F8FA]'
                        )}
                        error={errors.invoice_date}
                    />
                </div>
                <div className="flex flex-col gap-[10px] flex-1">
                    <label
                        className={clsx(
                            'text-[14px] font-regular',
                            isDark ? 'text-white' : 'text-[#3F4254]'
                        )}
                    >
                        Due Date
                    </label>
                    <Input
                        type="date"
                        value={formData.due_date}
                        onChange={(e) =>
                            handleFieldChange('due_date', e.target.value)
                        }
                        disabled={disabled}
                        className={clsx(
                            isDark
                                ? 'bg-[#002B57] text-[#F5F8FA]'
                                : 'bg-[#002B57] text-[#F5F8FA]'
                        )}
                        error={errors.due_date}
                    />
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#132F4C] w-full" />

            {/* Billed By */}
            <div className="flex flex-col gap-[10px]">
                <label
                    className={clsx(
                        'text-[14px] font-regular',
                        isDark ? 'text-white' : 'text-[#3F4254]'
                    )}
                >
                    Billed by
                </label>
                <FormSelect
                    options={billedByOptions}
                    value={formData.billed_by_id}
                    placeholder="Select Organization"
                    onChange={(value) =>
                        handleFieldChange('billed_by_id', value)
                    }
                    className={clsx(
                        isDark
                            ? 'bg-[#002B57] text-[#F5F8FA] border-transparent'
                            : 'bg-[#002B57] text-[#F5F8FA] border-transparent'
                    )}
                    error={errors.billed_by_id}
                />
            </div>

            {/* Billed To */}
            <div className="flex flex-col gap-[10px]">
                <label
                    className={clsx(
                        'text-[14px] font-regular',
                        isDark ? 'text-white' : 'text-[#3F4254]'
                    )}
                >
                    Billed to
                </label>
                <FormSelect
                    options={billedToOptions}
                    value={getBilledToValue()}
                    placeholder="Select Organization or Customer"
                    onChange={handleBilledToChange}
                    className={clsx(
                        isDark
                            ? 'bg-[#002B57] text-[#F5F8FA] border-transparent'
                            : 'bg-[#002B57] text-[#F5F8FA] border-transparent'
                    )}
                    error={errors.billed_to_id}
                />
            </div>

            {/* Divider */}
            <div className="h-px bg-[#132F4C] w-full" />

            {/* Currency */}
            <div className="flex flex-col gap-[10px]">
                <label
                    className={clsx(
                        'text-[14px] font-regular',
                        isDark ? 'text-white' : 'text-[#3F4254]'
                    )}
                >
                    Currency
                </label>
                <FormSelect
                    options={currencies}
                    value={formData.currency_code}
                    placeholder="Select Currency"
                    onChange={handleCurrencyChange}
                    className={clsx(
                        isDark
                            ? 'bg-[#002B57] text-[#F5F8FA] border-transparent'
                            : 'bg-[#002B57] text-[#F5F8FA] border-transparent'
                    )}
                    error={errors.currency_code}
                />
            </div>

            {/* Items */}
            <div className="flex flex-col gap-[10px]">
                <div className="flex gap-[10px] items-start">
                    <label
                        className={clsx(
                            'text-[14px] font-regular flex-1',
                            isDark ? 'text-white' : 'text-[#3F4254]'
                        )}
                    >
                        Items
                    </label>
                    <span
                        className={clsx(
                            'text-[14px] font-regular min-w-[84px]',
                            isDark ? 'text-white' : 'text-[#3F4254]'
                        )}
                    >
                        Qty
                    </span>
                    <span
                        className={clsx(
                            'text-[14px] font-regular flex-1',
                            isDark ? 'text-white' : 'text-[#3F4254]'
                        )}
                    >
                        Unit Price
                    </span>
                </div>

                {formData.items.map((item, index) => (
                    <InvoiceItemRow
                        key={index}
                        item={item}
                        index={index}
                        onChange={handleItemChange}
                        onDelete={handleDeleteItem}
                        disabled={disabled}
                    />
                ))}

                <button
                    type="button"
                    onClick={handleAddItem}
                    disabled={disabled}
                    className="flex gap-[4px] items-center text-[#007FFF] text-[14px] font-medium"
                >
                    <span>Add New</span>
                    <AddIcon className="w-[20px] h-[20px]" />
                </button>
            </div>

            {/* Tax & Discount */}
            <div className="flex gap-[16px]">
                <div className="flex flex-col gap-[10px] flex-1">
                    <label
                        className={clsx(
                            'text-[14px] font-regular',
                            isDark ? 'text-white' : 'text-[#3F4254]'
                        )}
                    >
                        Tax
                    </label>
                    <div className="relative">
                        <Input
                            type="number"
                            value={formData.tax_rate?.toString() || '0'}
                            onChange={(e) =>
                                handleFieldChange(
                                    'tax_rate',
                                    parseFloat(e.target.value) || 0
                                )
                            }
                            placeholder="0"
                            min="0"
                            max="100"
                            step="0.01"
                            disabled={disabled}
                            className={clsx(
                                'pr-8',
                                isDark
                                    ? 'bg-[#002B57] text-[#F5F8FA]'
                                    : 'bg-[#002B57] text-[#F5F8FA]'
                            )}
                        />
                        <span className="absolute right-[15px] top-1/2 transform -translate-y-1/2 text-[#F5F8FA] text-[14px]">
                            %
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-[10px] flex-1">
                    <label
                        className={clsx(
                            'text-[14px] font-regular',
                            isDark ? 'text-white' : 'text-[#3F4254]'
                        )}
                    >
                        Discount
                    </label>
                    <div className="relative">
                        <Input
                            type="number"
                            value={formData.discount_rate?.toString() || '0'}
                            onChange={(e) =>
                                handleFieldChange(
                                    'discount_rate',
                                    parseFloat(e.target.value) || 0
                                )
                            }
                            placeholder="0"
                            min="0"
                            max="100"
                            step="0.01"
                            disabled={disabled}
                            className={clsx(
                                'pr-8',
                                isDark
                                    ? 'bg-[#002B57] text-[#F5F8FA]'
                                    : 'bg-[#002B57] text-[#F5F8FA]'
                            )}
                        />
                        <span className="absolute right-[15px] top-1/2 transform -translate-y-1/2 text-[#F5F8FA] text-[14px]">
                            %
                        </span>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#132F4C] w-full" />

            {/* Payment Instructions */}
            <div className="flex flex-col gap-[10px]">
                <label
                    className={clsx(
                        'text-[14px] font-regular',
                        isDark ? 'text-white' : 'text-[#3F4254]'
                    )}
                >
                    Payment Instructions
                </label>
                <TextArea
                    value={formData.payment_instructions || ''}
                    onChange={(e) =>
                        handleFieldChange(
                            'payment_instructions',
                            e.target.value
                        )
                    }
                    placeholder="Enter payment instructions"
                    rows={4}
                    disabled={disabled}
                    className={clsx(
                        'h-[112px]',
                        isDark
                            ? 'bg-[#002B57] focus:bg-[#002B57] text-[#F5F8FA]'
                            : 'bg-[#002B57] focus:bg-[#002B57] text-[#F5F8FA]'
                    )}
                />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-[10px]">
                <label
                    className={clsx(
                        'text-[14px] font-regular',
                        isDark ? 'text-white' : 'text-[#3F4254]'
                    )}
                >
                    Notes
                </label>
                <TextArea
                    value={formData.notes || ''}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    placeholder="Enter notes"
                    rows={4}
                    disabled={disabled}
                    className={clsx(
                        'h-[112px]',
                        isDark
                            ? 'bg-[#002B57] focus:bg-[#002B57] text-[#F5F8FA]'
                            : 'bg-[#002B57] focus:bg-[#002B57] text-[#F5F8FA]'
                    )}
                />
            </div>
        </div>
    )
}
