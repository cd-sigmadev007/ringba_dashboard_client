/**
 * Invoices Table Component
 * Uses reusable Table component with columns matching Figma design
 */

import React, { useMemo } from 'react'
import clsx from 'clsx'
import { InvoiceActionsMenu } from './InvoiceActionsMenu'
import type { ColumnDef } from '@tanstack/react-table'
import type { Invoice } from '../types'
import { Table } from '@/components/ui'
import { DownloadIcon, EditIcon } from '@/assets/svg'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'

interface InvoicesTableProps {
    data: Array<Invoice>
    onEdit: (invoice: Invoice) => void
    onDelete: (invoice: Invoice) => void
    onDownload: (invoice: Invoice) => void
    onSaveDraft: (invoice: Invoice) => void
    loading?: boolean
}

const getStatusBadge = (status: Invoice['status']) => {
    const statusConfig = {
        draft: {
            bg: '#132F4C',
            text: '#F5F8FA',
            label: 'Draft',
        },
        issued: {
            bg: '#138A00',
            text: '#F5F8FA',
            label: 'Issued',
        },
        paid: {
            bg: '#007FFF',
            text: '#F5F8FA',
            label: 'Paid',
        },
        overdue: {
            bg: '#FF0000',
            text: '#F5F8FA',
            label: 'Overdue',
        },
        cancelled: {
            bg: '#A1A5B7',
            text: '#F5F8FA',
            label: 'Cancelled',
        },
    }

    const config = statusConfig[status] || statusConfig.draft

    return (
        <span
            className="px-2 py-1 rounded-[7px] text-[12px] font-medium"
            style={{
                backgroundColor: config.bg,
                color: config.text,
            }}
        >
            {config.label}
        </span>
    )
}

export const InvoicesTable: React.FC<InvoicesTableProps> = ({
    data,
    onEdit,
    onDelete,
    onDownload,
    onSaveDraft,
    loading = false,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const columns = useMemo<Array<ColumnDef<Invoice>>>(
        () => [
            {
                accessorKey: 'invoice_number',
                header: 'Invoice ID',
                cell: ({ getValue }) => {
                    const invoiceNumber = getValue() as string
                    return (
                        <span className="text-[14px] font-medium text-[#F5F8FA]">
                            {invoiceNumber || '-'}
                        </span>
                    )
                },
                size: 150,
            },
            {
                accessorKey: 'billed_by_name',
                header: 'Billed By',
                cell: ({ getValue }) => {
                    const name = getValue() as string | undefined
                    return (
                        <span className="text-[14px] font-medium text-[#F5F8FA]">
                            {name || '-'}
                        </span>
                    )
                },
                size: 200,
            },
            {
                accessorKey: 'billed_to_name',
                header: 'Billed To',
                cell: ({ getValue }) => {
                    const name = getValue() as string | undefined
                    return (
                        <span className="text-[14px] font-medium text-[#F5F8FA]">
                            {name || '-'}
                        </span>
                    )
                },
                size: 200,
            },
            {
                accessorKey: 'total_amount',
                header: 'Amount',
                cell: ({ row }) => {
                    const invoice = row.original
                    return (
                        <span className="text-[14px] font-medium text-[#F5F8FA]">
                            {invoice.currency_symbol}
                            {invoice.total_amount.toFixed(2)}
                        </span>
                    )
                },
                size: 150,
            },
            {
                accessorKey: 'invoice_date',
                header: 'Issue Date',
                cell: ({ getValue }) => {
                    const date = getValue() as string | Date
                    const dateStr =
                        date instanceof Date
                            ? date.toISOString().split('T')[0]
                            : typeof date === 'string'
                              ? date.split('T')[0]
                              : '-'
                    return (
                        <span className="text-[14px] font-medium text-[#F5F8FA]">
                            {dateStr}
                        </span>
                    )
                },
                size: 120,
            },
            {
                accessorKey: 'due_date',
                header: 'Due Date',
                cell: ({ getValue }) => {
                    const date = getValue() as string | Date
                    const dateStr =
                        date instanceof Date
                            ? date.toISOString().split('T')[0]
                            : typeof date === 'string'
                              ? date.split('T')[0]
                              : '-'
                    return (
                        <span className="text-[14px] font-medium text-[#F5F8FA]">
                            {dateStr}
                        </span>
                    )
                },
                size: 120,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ getValue }) => {
                    const status = getValue() as Invoice['status']
                    return getStatusBadge(status)
                },
                size: 120,
            },
            {
                id: 'actions',
                header: 'Action',
                cell: ({ row }) => {
                    const invoice = row.original
                    return (
                        <div className="flex items-center gap-[5px]">
                            <Button
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onEdit(invoice)
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
                                    onDownload(invoice)
                                }}
                                className={clsx(
                                    'p-1 min-w-0 w-[24px] h-[24px] flex items-center justify-center',
                                    isDark
                                        ? 'border border-[#0254A5] hover:bg-[#0254A5]/20'
                                        : 'border border-[#0254A5] hover:bg-[#0254A5]/10'
                                )}
                            >
                                <DownloadIcon className="w-[17px] h-[17px]" />
                            </Button>
                            <InvoiceActionsMenu
                                onSaveDraft={() => onSaveDraft(invoice)}
                                onDownload={() => onDownload(invoice)}
                                onDelete={() => onDelete(invoice)}
                            />
                        </div>
                    )
                },
                size: 200,
            },
        ],
        [isDark, onEdit, onDelete, onDownload, onSaveDraft]
    )

    return (
        <Table
            data={data}
            columns={columns}
            loading={loading}
            pagination={true}
            pageSize={10}
            emptyMessage="No invoices found"
        />
    )
}
