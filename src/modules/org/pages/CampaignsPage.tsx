import React, { useCallback, useEffect } from 'react'
import clsx from 'clsx'
import { useNavigate } from '@tanstack/react-router'
import toast from 'react-hot-toast'
import { useCampaignStore } from '../store/campaignStore'
import { Modal, Table } from '@/components/ui'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import { usePermissions } from '@/hooks/usePermissions'
import { EditIcon } from '@/assets/svg/EditIcon'
import { DeleteIcon } from '@/assets/svg/DeleteIcon'
import { AddIcon } from '@/assets/svg/AddIcon'
import { apiClient } from '@/services/api'

interface CampaignRow {
    id: string
    campaign_id?: string | null
    name: string
    created_at: string
    logo_url?: string | null
}

const CampaignsPage: React.FC = () => {
    const navigate = useNavigate()
    const { campaigns, loading, fetchCampaigns, deleteCampaign } =
        useCampaignStore()
    const { isAuthenticated, isLoading: authLoading } = usePermissions()
    const [deleteRow, setDeleteRow] = React.useState<CampaignRow | null>(null)
    const [deleting, setDeleting] = React.useState(false)
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const handleEdit = useCallback(
        (row: CampaignRow) => {
            navigate({ to: `/organization/campaigns/${row.id}` })
        },
        [navigate]
    )

    const handleCreate = useCallback(() => {
        navigate({ to: '/organization/campaigns/new' })
    }, [navigate])

    const handleDelete = useCallback((row: CampaignRow) => {
        setDeleteRow(row)
    }, [])

    const getApiBaseUrl = () => {
        const baseUrl =
            (import.meta as any).env?.VITE_API_BASE_URL ||
            'http://localhost:3001'
        // Remove trailing /api if present and remove trailing slashes
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

    const columns = React.useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ getValue, row }: any) => {
                    const name = getValue()
                    const url = toAbsoluteLogoUrl(row?.original?.logo_url)
                    return (
                        <div className="flex items-center gap-2">
                            {url ? (
                                <img
                                    src={url}
                                    alt={name}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                            ) : null}
                            <span className="text-sm font-medium">{name}</span>
                        </div>
                    )
                },
                meta: { width: 260 },
            },
            {
                header: 'ID',
                accessorKey: 'campaign_id',
                cell: ({ getValue }: any) => (
                    <span className="text-sm">{getValue() || '-'}</span>
                ),
                meta: { width: 240 },
            },
            {
                header: 'Action',
                accessorKey: 'id',
                cell: ({ row }: any) => {
                    const { original } = row
                    return (
                        <div className="flex items-center gap-[5px]">
                            <Button
                                variant="ghost"
                                className="p-1 min-w-0 w-[24px] h-[24px] flex items-center justify-center"
                                aria-label="Edit"
                                title="Edit"
                                onClick={() => handleEdit(original)}
                            >
                                <EditIcon className="w-[19px] h-[19px]" />
                            </Button>
                            <Button
                                variant="ghost"
                                className="p-1 min-w-0 w-[24px] h-[24px] flex items-center justify-center"
                                aria-label="Delete"
                                title="Delete"
                                onClick={() => handleDelete(original)}
                            >
                                <DeleteIcon className="w-[20px] h-[20px]" />
                            </Button>
                        </div>
                    )
                },
                meta: { width: 160, align: 'left' as any },
            },
        ],
        [isDark, handleEdit, handleDelete]
    )

    useEffect(() => {
        // Only fetch campaigns when authentication is ready, user is authenticated, and apiClient is initialized
        if (!authLoading && isAuthenticated) {
            // Check if apiClient is initialized, if not wait a bit and retry
            if (apiClient.isAuthInitialized()) {
                fetchCampaigns()
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
                            fetchCampaigns()
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
    }, [fetchCampaigns, isAuthenticated, authLoading])

    const data: Array<CampaignRow> = campaigns.map((c) => ({
        id: c.id,
        campaign_id: c.campaign_id ?? null,
        name: c.name,
        created_at: c.created_at as any,
        logo_url: c.logo_url ?? null,
    }))

    return (
        <div className={clsx('p-4 md:p-6 lg:p-8 space-y-4')}>
            <div className="flex items-center max-md:gap-y-6 max-md:flex-col max-md:items-start justify-between mb-6 py-6">
                <h1 className="text-xl font-semibold">Campaigns</h1>
                <Button
                    id="open-create-campaign"
                    variant="secondary"
                    onClick={handleCreate}
                    className="flex items-center gap-2"
                >
                    <AddIcon className="w-5 h-5" />
                    New Campaign
                </Button>
            </div>
            <div className="w-full">
                <Table
                    data={data}
                    columns={columns as any}
                    pagination={true}
                    loading={loading}
                    className={clsx(theme === 'dark' ? 'dark' : '')}
                />
            </div>
            <Modal
                open={!!deleteRow}
                onClose={() => !deleting && setDeleteRow(null)}
                title="Delete Campaign"
                position="center"
                size="sm"
            >
                <div className="space-y-4 p-2">
                    <p className="text-sm">
                        Are you sure you want to delete{' '}
                        <strong>{deleteRow?.name}</strong>? This action cannot
                        be undone.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setDeleteRow(null)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={async () => {
                                if (!deleteRow) return
                                setDeleting(true)
                                try {
                                    const success = await deleteCampaign(
                                        deleteRow.id
                                    )
                                    if (success) {
                                        toast.success(
                                            'Campaign deleted successfully'
                                        )
                                        setDeleteRow(null)
                                    } else {
                                        toast.error('Failed to delete campaign')
                                    }
                                } catch (error: any) {
                                    toast.error(
                                        error?.message ||
                                            'Failed to delete campaign'
                                    )
                                } finally {
                                    setDeleting(false)
                                }
                            }}
                            disabled={deleting}
                            className="bg-[#F64E60] hover:bg-[#E63950] text-white"
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default CampaignsPage
