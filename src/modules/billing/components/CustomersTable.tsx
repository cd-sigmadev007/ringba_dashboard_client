/**
 * Customers Table Component
 * Uses reusable Table component with columns matching Figma design
 */

import React, { useMemo } from 'react'
import { Table } from '@/components/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { Customer } from '../services/customersApi'
import { EditIcon, DeleteIcon } from '@/assets/svg'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import clsx from 'clsx'

interface CustomersTableProps {
    data: Customer[]
    onEdit: (customer: Customer) => void
    onDelete: (customer: Customer) => void
    loading?: boolean
}

export const CustomersTable: React.FC<CustomersTableProps> = ({
    data,
    onEdit,
    onDelete,
    loading = false,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const columns = useMemo<Array<ColumnDef<Customer>>>(
        () => [
            {
                accessorKey: 'name',
                header: 'NAME',
                cell: ({ getValue }) => {
                    const name = getValue() as string
                    return (
                        <span className="text-[14px] font-medium text-[#F5F8FA]">
                            {name || '-'}
                        </span>
                    )
                },
                size: 217,
            },
            {
                accessorKey: 'email',
                header: 'email',
                cell: ({ getValue }) => {
                    const email = getValue() as string | null | undefined
                    return (
                        <span className="text-[14px] font-medium text-[#F5F8FA]">
                            {email || '-'}
                        </span>
                    )
                },
                size: 243,
            },
            {
                id: 'contact',
                header: 'contact',
                cell: ({ row }) => {
                    const customer = row.original
                    const countryCode = customer.country_code || ''
                    const phoneNumber = customer.phone_number || ''
                    const contact = countryCode && phoneNumber
                        ? `${countryCode} ${phoneNumber}`
                        : countryCode || phoneNumber || '-'
                    return (
                        <span className="text-[14px] font-medium text-[#F5F8FA]">
                            {contact}
                        </span>
                    )
                },
                size: 185,
            },
            {
                accessorKey: 'billing_address',
                header: 'Billing address',
                cell: ({ getValue }) => {
                    const address = getValue() as string | null | undefined
                    const displayAddress = address
                        ? address.length > 40
                            ? `${address.substring(0, 40)}...`
                            : address
                        : '-'
                    return (
                        <span className="text-[14px] font-medium text-[#F5F8FA]">
                            {displayAddress}
                        </span>
                    )
                },
                size: 347,
            },
            {
                id: 'actions',
                header: 'Action',
                cell: ({ row }) => {
                    const customer = row.original
                    return (
                        <div className="flex items-center gap-[5px]">
                            <Button
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onEdit(customer)
                                }}
                                className={clsx(
                                    'p-1 min-w-0 w-[24px] h-[24px] flex items-center justify-center',
                                    isDark
                                        ? 'border border-[#0254A5] hover:bg-[#0254A5]/20'
                                        : 'border border-[#0254A5] hover:bg-[#0254A5]/10'
                                )}
                            >
                                <EditIcon className="w-[19px] h-[19px]" />
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete(customer)
                                }}
                                className={clsx(
                                    'p-1 min-w-0 w-[24px] h-[24px] flex items-center justify-center',
                                    isDark
                                        ? 'border border-[#0254A5] hover:bg-[#0254A5]/20'
                                        : 'border border-[#0254A5] hover:bg-[#0254A5]/10'
                                )}
                            >
                                <DeleteIcon className="w-[20px] h-[20px]" />
                            </Button>
                        </div>
                    )
                },
                size: 133,
            },
        ],
        [isDark, onEdit, onDelete]
    )

    return (
        <Table
            data={data}
            columns={columns}
            loading={loading}
            pagination={true}
            pageSize={10}
            emptyMessage="No customers found"
        />
    )
}

