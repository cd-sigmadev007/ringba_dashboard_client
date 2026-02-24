import React, { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { useUsersStore } from '../store/usersStore'
import { AddUserModal } from '../components/AddUserModal'
import { UserDetailModal } from '../components/UserDetailModal'
import { usersApi } from '../services/usersApi'
import type { UserDto } from '../services/usersApi'
import { Modal, Table } from '@/components/ui'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import { usePermissions } from '@/hooks/usePermissions'
import { AddIcon } from '@/assets/svg/AddIcon'
import { apiClient } from '@/services/api'
import { useIsMobile } from '@/lib/hooks/useMediaQuery'
import { DefaultAvatar } from '@/assets/svg'
import { DeleteIcon } from '@/assets/svg/DeleteIcon'

interface UserRow {
    id: string
    email: string
    role: 'super_admin' | 'org_admin' | 'media_buyer'
    invitation_status?: 'send' | 'accepted' | 'expired' | null
    logo_url?: string | null
    first_name?: string | null
    last_name?: string | null
}

const UsersPage: React.FC = () => {
    const { users, loading, fetchUsers } = useUsersStore()
    const { isAuthenticated, isLoading: authLoading, role } = usePermissions()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const isMobile = useIsMobile()

    // Access control: Only super_admin and org_admin can access
    const canAccess = role === 'super_admin' || role === 'org_admin'

    const handleRowClick = useCallback(
        (row: UserRow) => {
            const user = users.find((u) => u.id === row.id)
            if (user) {
                setSelectedUser(user)
                setIsDetailModalOpen(true)
            }
        },
        [users]
    )

    const handleCreate = useCallback(() => {
        setIsAddModalOpen(true)
    }, [])

    const getApiBaseUrl = () => {
        const baseUrl =
            (import.meta as any).env?.VITE_API_BASE_URL ||
            'http://localhost:3001'
        return baseUrl.replace(/\/api$/, '').replace(/\/+$/, '')
    }

    const toAbsoluteLogoUrl = (logoUrl?: string | null) => {
        if (!logoUrl) return ''
        if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://'))
            return logoUrl
        const base = getApiBaseUrl()
        const path = logoUrl.startsWith('/') ? logoUrl : `/${logoUrl}`
        return `${base}${path}`
    }

    const getRoleLabel = (userRole: string) => {
        if (userRole === 'super_admin') return 'Super Admin'
        if (userRole === 'org_admin') return 'Org Admin'
        if (userRole === 'media_buyer') return 'Media Buyer'
        return userRole // Fallback for unknown roles
    }

    const getInvitationStatusLabel = (status?: string | null) => {
        if (!status) return 'NA'
        if (status === 'send') return 'Sent'
        if (status === 'accepted') return 'Accepted'
        if (status === 'expired') return 'Expired'
        return status
    }

    const handleDeleteUser = useCallback(
        async (userId: string, e: React.MouseEvent) => {
            e.stopPropagation() // Prevent row click
            if (
                !window.confirm(
                    'Are you sure you want to delete this user? This action cannot be undone.'
                )
            ) {
                return
            }

            try {
                await usersApi.deleteUser(userId)
                toast.success('User deleted successfully')
                await fetchUsers() // Refresh list
            } catch (error: any) {
                toast.error(
                    error?.message || 'Failed to delete user. Please try again.'
                )
            }
        },
        [fetchUsers]
    )

    const columns = React.useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'email',
                cell: ({ getValue, row }: any) => {
                    const email = getValue()
                    const firstName = row?.original?.first_name
                    const lastName = row?.original?.last_name
                    const displayName =
                        firstName && lastName
                            ? `${firstName} ${lastName}`.trim()
                            : firstName ||
                              lastName ||
                              email.split('@')[0] ||
                              email
                    const url = toAbsoluteLogoUrl(row?.original?.logo_url)
                    return (
                        <div className="flex items-center gap-2">
                            {url ? (
                                <img
                                    src={url}
                                    alt={displayName}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                            ) : (
                                <DefaultAvatar className="w-6 h-6" />
                            )}
                            <span className="text-sm font-medium">
                                {displayName}
                            </span>
                        </div>
                    )
                },
                meta: { width: 260 },
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: ({ getValue }: any) => (
                    <span className="text-sm">{getValue()}</span>
                ),
                meta: { width: 240 },
            },
            {
                header: 'Role',
                accessorKey: 'role',
                cell: ({ getValue }: any) => {
                    const userRole = getValue()
                    return (
                        <span className="text-sm">
                            {getRoleLabel(userRole)}
                        </span>
                    )
                },
                meta: { width: 120 },
            },
            {
                header: 'Invitation',
                accessorKey: 'invitation_status',
                cell: ({ getValue }: any) => {
                    const status = getValue()
                    return (
                        <span className="text-sm">
                            {getInvitationStatusLabel(status)}
                        </span>
                    )
                },
                meta: { width: 120 },
            },
            {
                header: 'Actions',
                accessorKey: 'actions',
                enableSorting: false,
                cell: ({ row }: any) => {
                    return (
                        <div className="flex items-center justify-center">
                            <Button
                                variant="ghost"
                                className="p-1 min-w-0 h-auto"
                                onClick={(e) =>
                                    handleDeleteUser(row.original.id, e)
                                }
                                title="Delete User"
                            >
                                <DeleteIcon className="w-5 h-5" />
                            </Button>
                        </div>
                    )
                },
                meta: { width: 80, sticky: 'right', align: 'center' },
            },
        ],
        [isDark, handleDeleteUser]
    )

    useEffect(() => {
        // Only fetch users when authentication is ready, user is authenticated, and has access
        if (!authLoading && isAuthenticated && canAccess) {
            // Check if apiClient is initialized, if not wait a bit and retry
            if (apiClient.isAuthInitialized()) {
                fetchUsers()
            } else {
                // Wait for apiClient to be initialized (max 2 seconds)
                const maxAttempts = 20
                let attempts = 0
                const checkAuth = setInterval(() => {
                    attempts++
                    if (
                        apiClient.isAuthInitialized() ||
                        attempts >= maxAttempts
                    ) {
                        clearInterval(checkAuth)
                        if (apiClient.isAuthInitialized()) {
                            fetchUsers()
                        } else {
                            console.error(
                                'ApiClient not initialized after waiting'
                            )
                        }
                    }
                }, 100)
                return () => clearInterval(checkAuth)
            }
        }
    }, [fetchUsers, isAuthenticated, authLoading, canAccess])

    const data: Array<UserRow> = users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        invitation_status: u.invitation_status ?? null,
        logo_url: u.logo_url ?? null,
        first_name: u.first_name ?? null,
        last_name: u.last_name ?? null,
    }))

    // Show access denied if user doesn't have required role
    if (!authLoading && isAuthenticated && !canAccess) {
        return (
            <div className={clsx('p-4 md:p-6 lg:p-8 space-y-4')}>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                    <p className="text-yellow-800 dark:text-yellow-200">
                        Access Denied. You must be a Super Admin or Org Admin to
                        view users.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={clsx('p-4 md:p-6 lg:p-8 space-y-4')}>
            <div className="flex items-center max-md:gap-y-6 max-md:flex-col max-md:items-start justify-between mb-6 py-6">
                <h1 className="text-xl font-semibold">Users</h1>
                <Button
                    id="open-add-user"
                    variant="secondary"
                    onClick={handleCreate}
                    className="flex items-center gap-2"
                >
                    <AddIcon className="w-5 h-5" />
                    New User
                </Button>
            </div>
            <div className="w-full">
                <Table
                    data={data}
                    columns={columns as any}
                    pagination={true}
                    loading={loading || authLoading}
                    className={clsx(theme === 'dark' ? 'dark' : '')}
                    clickableRows={true}
                    onRowClick={handleRowClick}
                />
            </div>

            {/* Add User Modal */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={async () => {
                    setIsAddModalOpen(false)
                    try {
                        await fetchUsers() // Refresh list after adding
                    } catch (error: any) {
                        toast.error('Failed to refresh users list')
                    }
                }}
            />

            {/* User Detail Modal */}
            <Modal
                open={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false)
                    setSelectedUser(null)
                }}
                position={isMobile ? 'bottom' : 'right'}
                title="User Details"
                size="full"
                className={isMobile ? 'max-w-full max-h-[80vh]' : 'w-[600px]'}
                animation={isMobile ? 'slide' : 'fade'}
            >
                <UserDetailModal
                    user={selectedUser}
                    onClose={() => {
                        setIsDetailModalOpen(false)
                        setSelectedUser(null)
                    }}
                    onUserUpdated={async () => {
                        await fetchUsers()
                    }}
                    onUserDeleted={async () => {
                        await fetchUsers()
                    }}
                />
            </Modal>
        </div>
    )
}

export default UsersPage
