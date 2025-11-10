/**
 * Assign User to Organization Modal
 * Allows super admin to assign or change user's organization
 */

import { useEffect, useState } from 'react'
import { useAssignUserToOrg } from '../hooks/useUsers'
import { useOrganizations } from '../hooks/useOrganizations'
import type { Organization, User } from '../services/adminApi'
import { Modal } from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface AssignUserToOrgModalProps {
    isOpen: boolean
    onClose: () => void
    user: User | null
}

export default function AssignUserToOrgModal({
    isOpen,
    onClose,
    user,
}: AssignUserToOrgModalProps) {
    const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { data: orgsData, isLoading: orgsLoading } = useOrganizations()
    const assignMutation = useAssignUserToOrg()

    useEffect(() => {
        if (user && isOpen) {
            setSelectedOrgId(user.org_id)
            setError(null)
        }
    }, [user, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!user) return

        if (user.role === 'super_admin') {
            setError('Super admin cannot be assigned to an organization')
            return
        }

        if (selectedOrgId === null) {
            setError(
                'Cannot remove organization from org_admin or user. Change role first.'
            )
            return
        }

        try {
            await assignMutation.mutateAsync({
                userId: user.id,
                orgId: selectedOrgId,
            })

            onClose()
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to assign user to organization'
            )
        }
    }

    const handleClose = () => {
        if (!assignMutation.isPending) {
            setSelectedOrgId(null)
            setError(null)
            onClose()
        }
    }

    const organizations = orgsData?.data || []

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            title={`Assign Organization${user ? ` - ${user.email}` : ''}`}
            size="md"
            position="center"
            overlay="default"
        >
            {!user ? (
                <p className="text-gray-600 dark:text-gray-400">
                    No user selected
                </p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Current Role:{' '}
                            <span className="font-normal">{user.role}</span>
                        </label>
                        {user.role === 'super_admin' && (
                            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-4">
                                Note: Super admins cannot be assigned to
                                organizations
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="org-select"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            Organization
                        </label>
                        {orgsLoading ? (
                            <div className="p-4 text-center">
                                Loading organizations...
                            </div>
                        ) : (
                            <select
                                id="org-select"
                                value={selectedOrgId || ''}
                                onChange={(e) =>
                                    setSelectedOrgId(e.target.value || null)
                                }
                                disabled={
                                    assignMutation.isPending ||
                                    user.role === 'super_admin' ||
                                    organizations.length === 0
                                }
                                className="w-full px-[15px] py-[10px] rounded-[7px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-0 focus:border-[#007FFF] disabled:opacity-50 disabled:cursor-not-allowed"
                                required={user.role !== 'super_admin'}
                            >
                                <option value="">
                                    {organizations.length === 0
                                        ? 'No organizations available'
                                        : 'Select organization...'}
                                </option>
                                {organizations.map((org: Organization) => (
                                    <option key={org.id} value={org.id}>
                                        {org.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="ghost"
                            onClick={handleClose}
                            disabled={assignMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <button
                            type="submit"
                            disabled={
                                assignMutation.isPending ||
                                user.role === 'super_admin' ||
                                !selectedOrgId
                            }
                            className="text-[#F5F8FA] bg-[#007FFF] hover:bg-[#0254A5] active:bg-[#0254A5] py-[9px] px-[15px] rounded-[7px] transition-all duration-300 ease-in-out text-[14px] leading-5 cursor-pointer disabled:cursor-default disabled:opacity-50 disabled:!bg-[#E0E0E0] disabled:text-[#7E8299]"
                        >
                            {assignMutation.isPending
                                ? 'Updating...'
                                : 'Update Organization'}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    )
}
