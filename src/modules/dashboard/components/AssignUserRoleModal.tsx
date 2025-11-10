/**
 * Assign User Role Modal
 * Allows super admin to assign or change user's role and organization
 */

import { useEffect, useState } from 'react'
import { useAssignUserRole } from '../hooks/useUsers'
import { useOrganizations } from '../hooks/useOrganizations'
import type { Organization, User } from '../services/adminApi'
import { Modal } from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface AssignUserRoleModalProps {
    isOpen: boolean
    onClose: () => void
    user: User | null
}

export default function AssignUserRoleModal({
    isOpen,
    onClose,
    user,
}: AssignUserRoleModalProps) {
    const [selectedRole, setSelectedRole] = useState<
        'super_admin' | 'org_admin' | 'user'
    >('user')
    const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { data: orgsData, isLoading: orgsLoading } = useOrganizations()
    const assignMutation = useAssignUserRole()

    useEffect(() => {
        if (user && isOpen) {
            setSelectedRole(user.role)
            setSelectedOrgId(user.org_id)
            setError(null)
        }
    }, [user, isOpen])

    useEffect(() => {
        if (selectedRole === 'super_admin') {
            setSelectedOrgId(null)
        } else if (!selectedOrgId && user?.org_id) {
            setSelectedOrgId(user.org_id)
        }
    }, [selectedRole, user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!user) return

        if (selectedRole === 'super_admin' && selectedOrgId !== null) {
            setError('Super admin must not have an organization')
            return
        }

        if (
            (selectedRole === 'org_admin' || selectedRole === 'user') &&
            !selectedOrgId
        ) {
            setError('Organization is required for org_admin and user roles')
            return
        }

        try {
            await assignMutation.mutateAsync({
                userId: user.id,
                role: selectedRole,
                orgId: selectedOrgId || undefined,
            })

            onClose()
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to assign user role'
            )
        }
    }

    const handleClose = () => {
        if (!assignMutation.isPending) {
            setSelectedRole('user')
            setSelectedOrgId(null)
            setError(null)
            onClose()
        }
    }

    const organizations = orgsData?.data || []
    const requiresOrg = selectedRole === 'org_admin' || selectedRole === 'user'

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            title={`Assign Role${user ? ` - ${user.email}` : ''}`}
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
                        <label
                            htmlFor="role-select"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            Role
                        </label>
                        <select
                            id="role-select"
                            value={selectedRole}
                            onChange={(e) =>
                                setSelectedRole(
                                    e.target.value as
                                        | 'super_admin'
                                        | 'org_admin'
                                        | 'user'
                                )
                            }
                            disabled={assignMutation.isPending}
                            className="w-full px-[15px] py-[10px] rounded-[7px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-0 focus:border-[#007FFF] disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                        >
                            <option value="super_admin">Super Admin</option>
                            <option value="org_admin">Org Admin</option>
                            <option value="user">User</option>
                        </select>
                        {selectedRole === 'super_admin' && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Super admins are not assigned to any
                                organization
                            </p>
                        )}
                    </div>

                    {requiresOrg && (
                        <div>
                            <label
                                htmlFor="org-select"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Organization{' '}
                                <span className="text-red-500">*</span>
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
                                        organizations.length === 0
                                    }
                                    className="w-full px-[15px] py-[10px] rounded-[7px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-0 focus:border-[#007FFF] disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
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
                    )}

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
                                (requiresOrg && !selectedOrgId)
                            }
                            className="text-[#F5F8FA] bg-[#007FFF] hover:bg-[#0254A5] active:bg-[#0254A5] py-[9px] px-[15px] rounded-[7px] transition-all duration-300 ease-in-out text-[14px] leading-5 cursor-pointer disabled:cursor-default disabled:opacity-50 disabled:!bg-[#E0E0E0] disabled:text-[#7E8299]"
                        >
                            {assignMutation.isPending
                                ? 'Updating...'
                                : 'Update Role'}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    )
}
