/**
 * Allowed Emails List Component
 * Displays all allowed emails in a table format for super admins
 */

import { useMemo } from 'react'
import { useAllowedEmails, useRemoveAllowedEmail } from '../hooks/useAllowedEmails'
import Table from '@/components/ui/Table'
import TableLoader from '@/components/ui/TableLoader'
import Button from '@/components/ui/Button'
import type { ColumnDef } from '@tanstack/react-table'
import type { AllowedEmail } from '../services/adminApi'

interface AllowedEmailsListProps {
  onAddEmail: () => void
}

export default function AllowedEmailsList({
  onAddEmail,
}: AllowedEmailsListProps) {
  const { data: allowedEmailsData, isLoading, error } = useAllowedEmails()
  const removeEmailMutation = useRemoveAllowedEmail()

  const handleRemove = async (emailId: string, email: string) => {
    if (window.confirm(`Are you sure you want to remove ${email} from the allowlist?`)) {
      try {
        await removeEmailMutation.mutateAsync({ emailId })
      } catch (error) {
        console.error('Failed to remove email:', error)
        alert('Failed to remove email. Please try again.')
      }
    }
  }

  const columns = useMemo<ColumnDef<AllowedEmail>[]>(
    () => [
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => (
          <span className="font-medium">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'notes',
        header: 'Notes',
        cell: (info) => {
          const notes = info.getValue() as string | null
          return (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {notes || '-'}
            </span>
          )
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Added At',
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
          const email = info.row.original
          return (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => handleRemove(email.id, email.email)}
                className="text-xs px-2 py-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                disabled={removeEmailMutation.isPending}
              >
                {removeEmailMutation.isPending ? 'Removing...' : 'Remove'}
              </Button>
            </div>
          )
        },
      },
    ],
    [removeEmailMutation]
  )

  if (isLoading) {
    return <TableLoader />
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-600 dark:text-red-400">
          Error loading allowed emails:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  const allowedEmails = allowedEmailsData?.data || []

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Allowed Emails</h3>
        <Button onClick={onAddEmail} variant="default">
          Add Email
        </Button>
      </div>

      {allowedEmails.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No allowed emails found.
          </p>
          <Button onClick={onAddEmail} variant="default">
            Add First Email
          </Button>
        </div>
      ) : (
        <Table
          data={allowedEmails}
          columns={columns}
          showHeader={true}
          size="medium"
        />
      )}
    </div>
  )
}

