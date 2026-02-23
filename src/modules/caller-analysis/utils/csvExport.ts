import type { CallData } from '../types'
import type { ColumnVisibility } from '../hooks/useTableColumns'

/** Column ID -> { header label, value extractor } for CSV export */
const COLUMN_CSV_CONFIG: Record<
    string,
    { header: string; getValue: (row: CallData) => string }
> = {
    callerId: {
        header: 'Caller ID',
        getValue: (r) => r.callerId || '',
    },
    lastCall: {
        header: 'Last Call',
        getValue: (r) => r.lastCall || '',
    },
    duration: {
        header: 'Duration',
        getValue: (r) => r.duration || '',
    },
    lifetimeRevenue: {
        header: 'Lifetime Revenue',
        getValue: (r) => (r.lifetimeRevenue ?? 0).toString(),
    },
    revenue: {
        header: 'Revenue',
        getValue: (r) =>
            r.revenue != null && Number.isFinite(Number(r.revenue))
                ? Number(r.revenue).toFixed(2)
                : 'Pending',
    },
    ringbaCost: {
        header: 'Ringba Cost',
        getValue: (r) =>
            r.ringbaCost != null && Number.isFinite(Number(r.ringbaCost))
                ? Number(r.ringbaCost).toFixed(2)
                : '—',
    },
    adCost: {
        header: 'Ad Cost',
        getValue: (r) =>
            r.adCost != null && Number.isFinite(Number(r.adCost))
                ? Number(r.adCost).toFixed(2)
                : '—',
    },
    targetName: {
        header: 'Target Name',
        getValue: (r) => r.targetName ?? '',
    },
    publisherName: {
        header: 'Publisher',
        getValue: (r) => r.publisherName ?? '',
    },
    campaign: {
        header: 'Campaign',
        getValue: (r) => r.campaign || '',
    },
    status: {
        header: 'Status',
        getValue: (r) =>
            Array.isArray(r.status)
                ? r.status.join('; ')
                : String(r.status ?? ''),
    },
    phoneNumber: {
        header: 'Phone Number',
        getValue: (r) => r.phoneNumber ?? r.callerId ?? '',
    },
    callTimestamp: {
        header: 'Call Timestamp',
        getValue: (r) =>
            (r.callTimestamp ?? r.call_timestamp)
                ? String(r.callTimestamp ?? r.call_timestamp)
                : '',
    },
    callLengthInSeconds: {
        header: 'Call Length (s)',
        getValue: (r) =>
            r.callLengthInSeconds != null ? String(r.callLengthInSeconds) : '',
    },
    street_number: {
        header: 'Street Number',
        getValue: (r) => r.street_number ?? '',
    },
    street_name: {
        header: 'Street Name',
        getValue: (r) => r.street_name ?? '',
    },
    street_type: {
        header: 'Street Type',
        getValue: (r) => r.street_type ?? '',
    },
    city: {
        header: 'City',
        getValue: (r) => r.city ?? '',
    },
    state: {
        header: 'State',
        getValue: (r) => r.state ?? '',
    },
    g_zip: {
        header: 'Zip',
        getValue: (r) =>
            (r as CallData & { zip?: string }).zip ?? r.g_zip ?? '',
    },
    firstName: {
        header: 'First Name',
        getValue: (r) => r.firstName ?? '',
    },
    lastName: {
        header: 'Last Name',
        getValue: (r) => r.lastName ?? '',
    },
    email: {
        header: 'Email',
        getValue: (r) => r.email ?? '',
    },
    address: {
        header: 'Address',
        getValue: (r) => r.address ?? '',
    },
}

/** Column order for CSV (matches table order when visible) */
const COLUMN_ORDER = [
    'callerId',
    'lastCall',
    'duration',
    'lifetimeRevenue',
    'revenue',
    'ringbaCost',
    'adCost',
    'targetName',
    'publisherName',
    'campaign',
    'status',
    'phoneNumber',
    'callTimestamp',
    'callLengthInSeconds',
    'street_number',
    'street_name',
    'street_type',
    'city',
    'state',
    'g_zip',
    'firstName',
    'lastName',
    'email',
    'address',
]

/**
 * Convert selected CallData rows to CSV format and trigger download.
 * Exports only columns that are visible in the table (based on columnVisibility).
 */
export function exportToCSV(
    data: Array<CallData>,
    columnVisibility: ColumnVisibility,
    filename?: string
): void {
    if (data.length === 0) {
        console.warn('No data to export')
        return
    }

    // Build visible columns: fixed cols in table order + any dynamic cols (from attributes)
    const fixedVisible = COLUMN_ORDER.filter(
        (id) => columnVisibility[id] === true
    )
    const dynamicVisible = Object.keys(columnVisibility).filter(
        (id) =>
            columnVisibility[id] === true &&
            !COLUMN_ORDER.includes(id) &&
            id !== 'select' &&
            id !== 'action'
    )
    const visibleCols = [...fixedVisible, ...dynamicVisible]

    const getHeader = (id: string) =>
        COLUMN_CSV_CONFIG[id]?.header ?? id.replace(/_/g, ' ')
    const getValue = (id: string) => (row: CallData) => {
        const c = COLUMN_CSV_CONFIG[id]
        if (c) return c.getValue(row)
        const r = row as any
        const val = r[id] ?? r.attributes?.[id]
        if (val == null || val === '') return ''
        return typeof val === 'object' ? JSON.stringify(val) : String(val)
    }

    if (visibleCols.length === 0) {
        console.warn('No visible columns to export')
        return
    }

    const headers = visibleCols.map(getHeader)
    const rows = data.map((row) => visibleCols.map((id) => getValue(id)(row)))

    // Escape CSV values (handle commas, quotes, and newlines)
    const escapeCSV = (value: string): string => {
        if (
            value.includes(',') ||
            value.includes('"') ||
            value.includes('\n')
        ) {
            return `"${value.replace(/"/g, '""')}"`
        }
        return value
    }

    // Build CSV content
    const csvContent = [
        headers.map(escapeCSV).join(','),
        ...rows.map((row) => row.map(escapeCSV).join(',')),
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute(
        'download',
        filename ||
            `caller-analysis-${new Date().toISOString().split('T')[0]}.csv`
    )
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
}
