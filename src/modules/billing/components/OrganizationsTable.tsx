/**
 * Organizations Table Component
 * Uses reusable Table component with columns matching Figma design
 */

import React, { useMemo } from 'react'
import { Table } from '@/components/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { Organization } from '../types'
import { EditIcon, DeleteIcon } from '@/assets/svg'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import clsx from 'clsx'

interface OrganizationsTableProps {
    data: Organization[]
    onEdit: (org: Organization) => void
    onDelete: (org: Organization) => void
    loading?: boolean
}

export const OrganizationsTable: React.FC<OrganizationsTableProps> = ({
    data,
    onEdit,
    onDelete,
    loading = false,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const columns = useMemo<Array<ColumnDef<Organization>>>(
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
                accessorKey: 'contact',
                header: 'contact',
                cell: ({ row }) => {
                    const org = row.original
                    const countryCode = org.country_code || ''
                    const phoneNumber = org.phone_number || ''
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
                    const org = row.original
                    return (
                        <div className="flex items-center gap-[5px]">
                            <Button
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onEdit(org)
                                }}
                                className={clsx(
                                    'h-[25px] w-[24px] p-0 flex items-center justify-center rounded-[7px]',
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
                                    onDelete(org)
                                }}
                                className={clsx(
                                    'h-[25px] w-[24px] p-0 flex items-center justify-center rounded-[7px]',
                                    isDark
                                        ? 'border border-[#0254A5] hover:bg-[#0254A5]/20'
                                        : 'border border-[#0254A5] hover:bg-[#0254A5]/10'
                                )}
                            >
                                <DeleteIcon className="w-5 h-5" />
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
            emptyMessage="No organizations found"
        />
    )
}

