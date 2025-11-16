/**
 * Dashboard Page
 * Role-based dashboard that shows different content based on user permissions
 */

import { useState } from 'react'
import OrganizationList from '../components/OrganizationList'
import CreateOrganizationForm from '../components/CreateOrganizationForm'
import UserList from '../components/UserList'
import AssignUserToOrgModal from '../components/AssignUserToOrgModal'
import AssignUserRoleModal from '../components/AssignUserRoleModal'
import AllowedEmailsList from '../components/AllowedEmailsList'
import AddAllowedEmailModal from '../components/AddAllowedEmailModal'
import type { User } from '../services/adminApi'
import Button from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { UserRole } from '@/types/auth'
import { usePermissions } from '@/hooks/usePermissions'
import { AuthDebugPanel } from '@/components/debug/AuthDebugPanel'

export default function DashboardPage() {
    const { role, isAuthenticated, isLoading } = usePermissions()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedUserForOrg, setSelectedUserForOrg] = useState<User | null>(
        null
    )
    const [selectedUserForRole, setSelectedUserForRole] = useState<User | null>(
        null
    )
    const [isAddEmailModalOpen, setIsAddEmailModalOpen] = useState(false)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Loading...
                    </p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Please log in to access the dashboard
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Debug Panel - Remove in production */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mb-4">
                    <AuthDebugPanel />
                </div>
            )}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Welcome! Manage your resources based on your role.
                </p>
            </div>

            {/* Super Admin Section */}
            {role === UserRole.SUPER_ADMIN && (
                <div className="space-y-6">
                    <Tabs
                        tabs={[
                            {
                                id: 'organizations',
                                label: 'Organizations',
                                content: (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                Organizations
                                            </h2>
                                            <Button
                                                variant="primary"
                                                onClick={() =>
                                                    setIsCreateModalOpen(true)
                                                }
                                            >
                                                Create Organization
                                            </Button>
                                        </div>
                                        <OrganizationList />
                                    </div>
                                ),
                            },
                            {
                                id: 'users',
                                label: 'Users',
                                content: (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                All Users
                                            </h2>
                                        </div>

                                        <UserList
                                            onAssignOrg={(user) =>
                                                setSelectedUserForOrg(user)
                                            }
                                            onAssignRole={(user) =>
                                                setSelectedUserForRole(user)
                                            }
                                        />
                                    </div>
                                ),
                            },
                            {
                                id: 'allowed-emails',
                                label: 'Allowed Emails',
                                content: (
                                    <div className="space-y-4">
                                        <AllowedEmailsList
                                            onAddEmail={() =>
                                                setIsAddEmailModalOpen(true)
                                            }
                                        />
                                    </div>
                                ),
                            },
                        ]}
                        defaultActiveTab="organizations"
                    />
                </div>
            )}

            {/* Org Admin Section */}
            {role === UserRole.ORG_ADMIN && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        Organization Admin Dashboard
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Campaign and user management features coming soon...
                    </p>
                </div>
            )}

            {/* Regular User Section */}
            {role === UserRole.USER && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        User Dashboard
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Access your assigned campaigns and data here...
                    </p>
                </div>
            )}

            {/* No Role / Fallback */}
            {!role && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                    <p className="text-yellow-800 dark:text-yellow-200">
                        No role assigned. Please contact an administrator.
                    </p>
                </div>
            )}

            {/* Create Organization Modal */}
            <CreateOrganizationForm
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {/* Assign User to Org Modal */}
            <AssignUserToOrgModal
                isOpen={!!selectedUserForOrg}
                onClose={() => setSelectedUserForOrg(null)}
                user={selectedUserForOrg}
            />

            {/* Assign User Role Modal */}
            <AssignUserRoleModal
                isOpen={!!selectedUserForRole}
                onClose={() => setSelectedUserForRole(null)}
                user={selectedUserForRole}
            />

            {/* Add Allowed Email Modal */}
            <AddAllowedEmailModal
                open={isAddEmailModalOpen}
                onClose={() => setIsAddEmailModalOpen(false)}
            />
        </div>
    )
}
