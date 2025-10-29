/**
 * User List Component
 * Displays all users in a table format for super admins
 */

import { useMemo } from 'react'
import { useUsers } from '../hooks/useUsers'
import { useOrganizations } from '../hooks/useOrganizations'
import Table from '@/components/ui/Table'
import TableLoader from '@/components/ui/TableLoader'
import Button from '@/components/ui/Button'
import type { ColumnDef } from '@tanstack/react-table'
import type { User, Organization } from '../services/adminApi'

interface UserListProps {
  onAssignOrg: (user: User) => void
  onAssignRole: (user: User) => void
}

export default function UserList({
  onAssignOrg,
  onAssignRole,
}: UserListProps) {
  const { data: usersData, isLoading: usersLoading, error: usersError } = useUsers()
  const { data: orgsData } = useOrganizations()

  // Create a map of org_id -> org_name for quick lookup
  const orgMap = useMemo(() => {
    if (!orgsData?.data) return new Map<string, string>()
    return new Map(
      orgsData.data.map((org: Organization) => [org.id, org.name])
    )
  }, [orgsData])

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => (
          <span className="font-medium">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: (info) => {
          const role = info.getValue() as string
          const roleLabels: Record<string, string> = {
            super_admin: 'Super Admin',
            org_admin: 'Org Admin',
            user: 'User',
          }
          return (
            <span className="px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {roleLabels[role] || role}
            </span>
          )
        },
      },
      {
        accessorKey: 'org_id',
        header: 'Organization',
        cell: (info) => {
          const orgId = info.getValue() as string | null
          const user = info.row.original
          
          if (!orgId) {
            // Show "Pending Assignment" badge for users without org (except super admins)
            if (user.role !== 'super_admin') {
              return (
                <span className="px-2 py-1 text-xs rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                  Pending Assignment
                </span>
              )
            }
            return <span className="text-gray-400 italic">None</span>
          }
          const orgName = orgMap.get(orgId)
          if (!orgName) {
            return <span className="text-sm text-gray-400 italic">Loading...</span>
          }
          return <span className="text-sm">{orgName as string}</span>
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: (info) => {
          const date = new Date(info.getValue() as string)
          return (
            <span className="text-sm">
              {date.toLocaleDateString()} {date.toLocaleTimeString()}
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const user = info.row.original
          return (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => onAssignOrg(user)}
                className="text-xs px-2 py-1"
              >
                Assign Org
              </Button>
              <Button
                variant="ghost"
                onClick={() => onAssignRole(user)}
                className="text-xs px-2 py-1"
              >
                Assign Role
              </Button>
            </div>
          )
        },
      },
    ],
    [orgMap, onAssignOrg, onAssignRole]
  )

  if (usersLoading) {
    return <TableLoader />
  }

  if (usersError) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-600 dark:text-red-400">
          Error loading users:{' '}
          {usersError instanceof Error ? usersError.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  const users = usersData?.data || []

  return (
    <div className="w-full">
      {users.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No users found.
          </p>
        </div>
      ) : (
        <Table
          data={users}
          columns={columns}
          showHeader={true}
          size="medium"
        />
      )}
    </div>
  )
}

