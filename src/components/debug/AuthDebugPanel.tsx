/**
 * Auth Debug Panel - shows user and role from AuthContext and usePermissions
 */

import { useAuth } from '@/contexts/AuthContext'
import { usePermissions } from '@/hooks/usePermissions'

export function AuthDebugPanel() {
    const { user, loading } = useAuth()
    const { role, org_id, campaign_ids } = usePermissions()
    const isAuthenticated = !!user

    if (loading) {
        return (
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                Loading auth...
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
                <p className="text-sm">Not authenticated</p>
            </div>
        )
    }

    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
            <h3 className="font-bold mb-2">Auth Debug Info</h3>
            <div className="space-y-2">
                <div>
                    <strong>User:</strong> {user?.email}
                </div>
                <div>
                    <strong>Role:</strong> {role ?? '—'}
                </div>
                <div>
                    <strong>Org ID:</strong> {org_id ?? '—'}
                </div>
                <div>
                    <strong>Campaigns:</strong> {campaign_ids?.length ?? 0}
                </div>
            </div>
        </div>
    )
}
