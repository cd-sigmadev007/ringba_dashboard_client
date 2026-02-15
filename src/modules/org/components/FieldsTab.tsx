import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import {  fieldsApi } from '../services/fieldsApi'
import type {CallDataField} from '../services/fieldsApi';
import { useThemeStore } from '@/store/themeStore'
import { usePermissions } from '@/hooks/usePermissions'
import { Modal, Table } from '@/components/ui'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { EditIcon } from '@/assets/svg/EditIcon'
import { DeleteIcon } from '@/assets/svg/DeleteIcon'
import { EyeIcon } from '@/assets/svg/EyeIcon'
import { EyeOffIcon } from '@/assets/svg/EyeOffIcon'

// Fixed fields are standard columns - read-only, cannot be changed or hidden
const FIXED_FIELD_NAMES = new Set([
    'caller_id',
    'ringba_id',
    'campaign_id',
    'call_duration',
    'call_timestamp',
    'campaignName',
    'publisherName',
    'targetName',
    'recordingUrl',
    'transcript',
    'firstName',
    'lastName',
    'email',
    'type',
    'address',
    'street_number',
    'street_name',
    'street_type',
    'city',
    'state',
    'g_zip',
    'billed',
    'latestPayout',
    'ringbaCost',
    'adCost',
    'ai_processed',
    'processed_at',
    'attributes',
    'hung_up',
    'id',
])

export const FieldsTab: React.FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const { isAuthenticated, isLoading: authLoading, role } = usePermissions()

    const canAccess = role === 'super_admin' || role === 'org_admin'

    const [fields, setFields] = useState<Array<CallDataField>>([])
    const [loading, setLoading] = useState(false)
    const [editField, setEditField] = useState<CallDataField | null>(null)
    const [editDisplayName, setEditDisplayName] = useState('')
    const [saving, setSaving] = useState(false)
    const [deleteField, setDeleteField] = useState<CallDataField | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [hidingField, setHidingField] = useState<string | null>(null)
    const [editHidden, setEditHidden] = useState(false)

    const fetchFields = async (silent = false) => {
        try {
            if (!silent) setLoading(true)
            const data = await fieldsApi.getFields(true)
            setFields(data)
        } catch (err: any) {
            toast.error(err?.message || 'Failed to fetch fields')
        } finally {
            if (!silent) setLoading(false)
        }
    }

    useEffect(() => {
        if (isAuthenticated && canAccess && !authLoading) {
            fetchFields()
        }
    }, [isAuthenticated, canAccess, authLoading])

    const handleEdit = (field: CallDataField) => {
        setEditField(field)
        setEditDisplayName(field.display_name || field.field_name)
        setEditHidden(field.hidden)
    }

    const handleSaveEdit = async () => {
        if (!editField) return
        try {
            setSaving(true)
            await fieldsApi.updateField(editField.field_name, {
                display_name: editDisplayName.trim() || null,
                hidden: editHidden,
            })
            toast.success('Field updated')
            setEditField(null)
            fetchFields(true)
        } catch (err: any) {
            toast.error(err?.message || 'Failed to update field')
        } finally {
            setSaving(false)
        }
    }

    const handleHide = async (field: CallDataField) => {
        try {
            setHidingField(field.field_name)
            await fieldsApi.updateField(field.field_name, {
                hidden: !field.hidden,
            })
            toast.success(field.hidden ? 'Field shown' : 'Field hidden')
            fetchFields(true)
        } catch (err: any) {
            toast.error(err?.message || 'Failed to update field')
        } finally {
            setHidingField(null)
        }
    }

    const handleDelete = (field: CallDataField) => {
        setDeleteField(field)
    }

    const handleConfirmDelete = async () => {
        if (!deleteField) return
        try {
            setDeleting(true)
            await fieldsApi.deleteField(deleteField.field_name)
            toast.success('Field deleted')
            setDeleteField(null)
            fetchFields(true)
        } catch (err: any) {
            toast.error(err?.message || 'Failed to delete field')
        } finally {
            setDeleting(false)
        }
    }

    const fixedFields = fields.filter((f) =>
        FIXED_FIELD_NAMES.has(f.field_name)
    )
    const otherFields = fields.filter(
        (f) => !FIXED_FIELD_NAMES.has(f.field_name)
    )

    const fixedColumns = React.useMemo(
        () => [
            {
                id: 'field_name',
                header: 'Field name',
                accessorKey: 'field_name',
                cell: ({ getValue }: any) => (
                    <span className="text-sm font-mono">{getValue()}</span>
                ),
                meta: { width: 220 },
            },
            {
                id: 'display_name',
                header: 'Display name',
                accessorKey: 'display_name',
                cell: ({ getValue }: any) => (
                    <span className="text-sm">{getValue() || '-'}</span>
                ),
                meta: { width: 220 },
            },
        ],
        []
    )

    const otherColumns = React.useMemo(
        () => [
            {
                id: 'field_name',
                header: 'Field name',
                accessorKey: 'field_name',
                cell: ({ getValue }: any) => (
                    <span className="text-sm font-mono">{getValue()}</span>
                ),
                meta: { width: 220 },
            },
            {
                id: 'display_name',
                header: 'Display name',
                accessorKey: 'display_name',
                cell: ({ getValue }: any) => (
                    <span className="text-sm">{getValue() || '-'}</span>
                ),
                meta: { width: 220 },
            },
            {
                id: 'hidden',
                header: 'Status',
                accessorKey: 'hidden',
                cell: ({ getValue }: any) => (
                    <span
                        className={clsx(
                            'text-xs px-2 py-0.5 rounded',
                            getValue()
                                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        )}
                    >
                        {getValue() ? 'Hidden' : 'Visible'}
                    </span>
                ),
                meta: { width: 100 },
            },
            {
                id: 'action',
                header: 'Action',
                accessorKey: 'field_name',
                cell: ({ row }: any) => {
                    const field = row.original as CallDataField
                    if (!canAccess) return <span className="text-sm">-</span>
                    const isHiding = hidingField === field.field_name
                    return (
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                className="p-1 min-w-0 w-[24px] h-[24px] flex items-center justify-center"
                                title="Edit"
                                onClick={() => handleEdit(field)}
                            >
                                <EditIcon className="w-[19px] h-[19px]" />
                            </Button>
                            <span
                                role="button"
                                tabIndex={isHiding ? -1 : 0}
                                aria-disabled={isHiding}
                                className={clsx(
                                    'p-1 min-w-0 w-[24px] h-[24px] flex items-center justify-center rounded hover:bg-muted cursor-pointer',
                                    isHiding && 'pointer-events-none'
                                )}
                                title={
                                    field.hidden ? 'Show field' : 'Hide field'
                                }
                                onClick={() => !isHiding && handleHide(field)}
                                onKeyDown={(e) =>
                                    (e.key === 'Enter' || e.key === ' ') &&
                                    !isHiding &&
                                    handleHide(field)
                                }
                            >
                                {isHiding ? (
                                    <div className="animate-spin rounded-full w-[18px] h-[18px] border-2 border-current border-t-transparent" />
                                ) : field.hidden ? (
                                    <EyeIcon className="w-[20px] h-[20px]" />
                                ) : (
                                    <EyeOffIcon className="w-[20px] h-[20px]" />
                                )}
                            </span>
                            <span
                                role="button"
                                tabIndex={0}
                                className="p-1 min-w-0 w-[24px] h-[24px] flex items-center justify-center rounded hover:bg-muted cursor-pointer"
                                title="Delete field"
                                onClick={() => handleDelete(field)}
                                onKeyDown={(e) =>
                                    (e.key === 'Enter' || e.key === ' ') &&
                                    handleDelete(field)
                                }
                            >
                                <DeleteIcon className="w-[20px] h-[20px]" />
                            </span>
                        </div>
                    )
                },
                meta: { width: 120 },
            },
        ],
        [canAccess, hidingField]
    )

    if (!authLoading && isAuthenticated && !canAccess) {
        return (
            <div className="flex items-center justify-center w-full py-8">
                <p
                    className={clsx(
                        'text-sm',
                        isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                    )}
                >
                    You don&apos;t have permission to manage fields. Only Super
                    Admin and Org Admin can access.
                </p>
            </div>
        )
    }

    if (loading || authLoading) {
        return (
            <div className="flex items-center justify-center w-full py-8">
                <p
                    className={clsx(
                        'text-sm',
                        isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                    )}
                >
                    Loading fields...
                </p>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center w-full py-8">
                <p
                    className={clsx(
                        'text-sm',
                        isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                    )}
                >
                    Please log in to access fields.
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            <p
                className={clsx(
                    'text-sm',
                    isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                )}
            >
                Fields are automatically added when new data arrives from
                webhooks. You can update display names and hide fields from the
                caller analysis UI.
            </p>

            {/* Fixed fields – read-only */}
            <div>
                <h3 className="text-sm font-medium mb-2">Fixed fields</h3>
                <p
                    className={clsx(
                        'text-xs mb-2',
                        isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                    )}
                >
                    Core columns that cannot be edited or hidden.
                </p>
                <Table
                    data={fixedFields}
                    columns={fixedColumns}
                    loading={loading}
                    emptyMessage="No fixed fields."
                    pagination={fixedFields.length > 10}
                    pageSize={10}
                />
            </div>

            {/* Other fields – editable */}
            <div>
                <h3 className="text-sm font-medium mb-2">Other fields</h3>
                <p
                    className={clsx(
                        'text-xs mb-2',
                        isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                    )}
                >
                    Custom and webhook fields. You can edit display names and
                    visibility.
                </p>
                <Table
                    data={otherFields}
                    columns={otherColumns}
                    loading={loading}
                    emptyMessage="No other fields. Fields will appear when call data is received."
                    pagination={otherFields.length > 10}
                    pageSize={10}
                />
            </div>

            {/* Edit modal */}
            <Modal
                open={!!editField}
                onClose={() => setEditField(null)}
                title="Edit field"
                size="sm"
            >
                {editField && (
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Field: <code>{editField.field_name}</code>
                        </p>
                        <Input
                            label="Display name"
                            value={editDisplayName}
                            onChange={(e) => setEditDisplayName(e.target.value)}
                            placeholder={editField.field_name}
                        />
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={editHidden}
                                onChange={(e) =>
                                    setEditHidden(e.target.checked)
                                }
                                className="sr-only"
                            />
                            <Checkbox checked={editHidden} />
                            <span className="text-sm">
                                Hidden (exclude from caller analysis)
                            </span>
                        </label>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => setEditField(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSaveEdit}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete confirmation modal */}
            <Modal
                open={!!deleteField}
                onClose={() => setDeleteField(null)}
                title="Delete field"
                size="sm"
            >
                {deleteField && (
                    <div className="flex flex-col gap-4">
                        <p
                            className={clsx(
                                'text-sm',
                                isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                            )}
                        >
                            Delete &quot;
                            {deleteField.display_name || deleteField.field_name}
                            &quot;? The field will be removed from the registry.
                            It may reappear if new call data arrives with this
                            attribute.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => setDeleteField(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
