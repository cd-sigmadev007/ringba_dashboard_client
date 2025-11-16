import React, { useCallback, useEffect } from 'react'
import clsx from 'clsx'
import CreateCampaignModal from '../components/CreateCampaignModal'
import { useCampaignStore } from '../store/campaignStore'
import { Modal, Table } from '@/components/ui'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'

interface CampaignRow {
    id: string
    campaign_id?: string | null
    name: string
    created_at: string
    logo_url?: string | null
}

const CampaignsPage: React.FC = () => {
    const { campaigns, loading, fetchCampaigns, deleteCampaign } =
        useCampaignStore()
    const [openCreate, setOpenCreate] = React.useState(false)
    const [editRow, setEditRow] = React.useState<CampaignRow | null>(null)
    const [deleteRow, setDeleteRow] = React.useState<CampaignRow | null>(null)
    const [deleting, setDeleting] = React.useState(false)
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const handleEdit = useCallback((row: CampaignRow) => {
        setEditRow(row)
    }, [])

    const handleDelete = useCallback((row: CampaignRow) => {
        setDeleteRow(row)
    }, [])

    const getApiBaseUrl = () => {
        const baseUrl =
            (import.meta as any).env?.VITE_API_BASE_URL ||
            'http://localhost:3001'
        return baseUrl.replace(/\/api$/, '')
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
                                className="p-1 min-w-0 h-auto w-[24px] h-[25px]"
                                aria-label="Edit"
                                title="Edit"
                                onClick={() => handleEdit(original)}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </Button>
                            <Button
                                variant="ghost"
                                className="p-1 min-w-0 h-auto w-[24px] h-[25px]"
                                aria-label="Delete"
                                title="Delete"
                                onClick={() => handleDelete(original)}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
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
        fetchCampaigns()
    }, [fetchCampaigns])

    const data: Array<CampaignRow> = campaigns.map((c) => ({
        id: c.id,
        campaign_id: c.campaign_id ?? null,
        name: c.name,
        created_at: c.created_at as any,
        logo_url: c.logo_url ?? null,
    }))

    return (
        <div className={clsx('p-4 md:p-6 lg:p-8 space-y-4')}>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Campaigns</h1>
                <Button
                    id="open-create-campaign"
                    variant="secondary"
                    onClick={() => setOpenCreate(true)}
                >
                    Create Campaign
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
            <CreateCampaignModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
            />
            <CreateCampaignModal
                open={!!editRow}
                onClose={() => setEditRow(null)}
                campaign={editRow as any}
            />
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
                                await deleteCampaign(deleteRow.id)
                                setDeleting(false)
                                setDeleteRow(null)
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
