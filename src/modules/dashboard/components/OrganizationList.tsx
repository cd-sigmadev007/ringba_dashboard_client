/**
 * Organization List Component
 * Displays organizations in a table format for super admins
 */

import { useMemo } from 'react'
import { useOrganizations } from '../hooks/useOrganizations'
import type { ColumnDef } from '@tanstack/react-table'
import type { Organization } from '../services/adminApi'
import Table from '@/components/ui/Table'
import TableLoader from '@/components/ui/TableLoader'

export default function OrganizationList() {
    const { data, isLoading, error } = useOrganizations()

    const columns = useMemo<Array<ColumnDef<Organization>>>(
        () => [
            {
                accessorKey: 'name',
                header: 'Organization Name',
                cell: (info) => (
                    <span className="font-medium">
                        {info.getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: 'id',
                header: 'ID',
                cell: (info) => (
                    <span className="text-sm text-gray-500 font-mono">
                        {(info.getValue() as string).substring(0, 8)}...
                    </span>
                ),
            },
            {
                accessorKey: 'created_at',
                header: 'Created At',
                cell: (info) => {
                    const date = new Date(info.getValue() as string)
                    return (
                        <span className="text-sm">
                            {date.toLocaleDateString()}{' '}
                            {date.toLocaleTimeString()}
                        </span>
                    )
                },
            },
            {
                accessorKey: 'created_by',
                header: 'Created By',
                cell: (info) => (
                    <span className="text-sm text-gray-600">
                        {(info.getValue() as string) || 'System'}
                    </span>
                ),
            },
        ],
        []
    )

    if (isLoading) {
        return <TableLoader />
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400">
                    Error loading organizations:{' '}
                    {error instanceof Error ? error.message : 'Unknown error'}
                </p>
            </div>
        )
    }

    const organizations = data?.data || []

    return (
        <div className="w-full">
            {organizations.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                        No organizations found. Create your first organization
                        to get started.
                    </p>
                </div>
            ) : (
                <Table
                    data={organizations}
                    columns={columns}
                    showHeader={true}
                    pagination={true}
                    pageSize={10}
                    emptyMessage="No organizations found"
                    size="medium"
                />
            )}
        </div>
    )
}
