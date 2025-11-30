/**
 * useUserRole Hook
 * Manages user role assignment
 */

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useUsersStore } from '../store/usersStore'
import { useAssignUserRole } from '@/modules/dashboard/hooks/useUsers'

interface UseUserRoleProps {
    user: { id: string; role: string; org_id?: string | null } | null
    onSuccess?: () => void
}

export function useUserRole({ user, onSuccess }: UseUserRoleProps) {
    const assignRoleMutation = useAssignUserRole()
    const { fetchUsers } = useUsersStore()

    // Role state (for inline editing) - use pendingRole to track unsaved changes
    const [pendingRole, setPendingRole] = useState<
        'super_admin' | 'media_buyer'
    >('media_buyer')
    const [assignRoleError, setAssignRoleError] = useState<string | null>(null)

    // Initialize pending role from user
    const initializeRole = (role: string) => {
        setPendingRole(role as 'super_admin' | 'media_buyer')
    }

    // Handle role change (only updates local state, doesn't call API)
    const handleRoleChange = (newRole: string) => {
        const role = newRole as 'super_admin' | 'media_buyer'
        setPendingRole(role)
        setAssignRoleError(null)
    }

    // Save role change
    const saveRoleChange = async (): Promise<boolean> => {
        if (!user || pendingRole === user.role) return true // No change needed

        const devOrgId =
            (import.meta.env.VITE_DEV_ORG_ID as string | undefined) ||
            (typeof window !== 'undefined'
                ? localStorage.getItem('dev_org_id') || undefined
                : undefined)

        try {
            await assignRoleMutation.mutateAsync({
                userId: user.id,
                role: pendingRole,
                orgId: devOrgId || user.org_id || undefined,
            })
            toast.success('User role updated successfully')
            await fetchUsers()
            onSuccess?.()
            return true
        } catch (err: any) {
            setAssignRoleError(err?.message || 'Failed to assign user role')
            setPendingRole(user.role as any) // Revert on error
            toast.error(err?.message || 'Failed to assign user role')
            throw err // Re-throw so caller can handle it
        }
    }

    return {
        // State
        pendingRole,
        assignRoleError,
        isSaving: assignRoleMutation.isPending,

        // Actions
        initializeRole,
        handleRoleChange,
        saveRoleChange,
    }
}
