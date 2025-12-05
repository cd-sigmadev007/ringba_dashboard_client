/**
 * Invoice Item Row Component
 * Editable row for invoice items with description, quantity, unit price
 */

import React from 'react'
import clsx from 'clsx'
import { Input } from '@/components/ui/Input'
import { DeleteIcon } from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'

export interface InvoiceItemData {
    id?: string
    description: string
    quantity: number
    unit_price: number
    vat_rate?: number
}

interface InvoiceItemRowProps {
    item: InvoiceItemData
    index: number
    onChange: (index: number, item: InvoiceItemData) => void
    onDelete: (index: number) => void
    disabled?: boolean
}

export const InvoiceItemRow: React.FC<InvoiceItemRowProps> = ({
    item,
    index,
    onChange,
    onDelete,
    disabled = false,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const handleChange = (
        field: keyof InvoiceItemData,
        value: string | number
    ) => {
        const updatedItem: InvoiceItemData = {
            ...item,
            [field]: value,
        }

        // Auto-calculate total if quantity or unit_price changes
        if (field === 'quantity' || field === 'unit_price') {
            updatedItem.quantity =
                field === 'quantity' ? Number(value) : item.quantity
            updatedItem.unit_price =
                field === 'unit_price' ? Number(value) : item.unit_price
        }

        onChange(index, updatedItem)
    }

    return (
        <div className="flex gap-[16px] items-center">
            <Input
                value={item.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Item description"
                disabled={disabled}
                className={clsx(
                    'min-w-[214px] flex-1',
                    isDark
                        ? 'bg-[#002B57] text-[#F5F8FA]'
                        : 'bg-[#002B57] text-[#F5F8FA]'
                )}
            />
            <Input
                type="number"
                value={item.quantity.toString()}
                onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0
                    handleChange('quantity', val)
                }}
                placeholder="Qty"
                min="0"
                step="0.01"
                disabled={disabled}
                className={clsx(
                    'flex-1',
                    isDark
                        ? 'bg-[#002B57] text-[#F5F8FA]'
                        : 'bg-[#002B57] text-[#F5F8FA]'
                )}
            />
            <Input
                type="number"
                value={item.unit_price.toString()}
                onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0
                    handleChange('unit_price', val)
                }}
                placeholder="Unit Price"
                min="0"
                step="0.01"
                disabled={disabled}
                className={clsx(
                    'flex-1',
                    isDark
                        ? 'bg-[#002B57] text-[#F5F8FA]'
                        : 'bg-[#002B57] text-[#F5F8FA]'
                )}
            />
            <button
                type="button"
                onClick={() => onDelete(index)}
                disabled={disabled}
                className={clsx(
                    'w-[24px] h-[24px] flex items-center justify-center rounded-[7px] border',
                    isDark
                        ? 'border-[#0254A5] hover:bg-[#0254A5]'
                        : 'border-[#0254A5] hover:bg-[#0254A5]',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                <DeleteIcon className="w-[20px] h-[20px]" />
            </button>
        </div>
    )
}
