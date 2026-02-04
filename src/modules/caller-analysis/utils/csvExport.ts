import type { CallData } from '../types'

/**
 * Convert selected CallData rows to CSV format and trigger download
 */
export function exportToCSV(data: Array<CallData>, filename?: string): void {
    if (data.length === 0) {
        console.warn('No data to export')
        return
    }

    // Define column headers
    const headers = [
        'Caller ID',
        'Last Call',
        'Duration',
        'Lifetime Revenue',
        'Campaign',
        'Status',
        'Action',
        'Revenue',
        'First Name',
        'Last Name',
        'Email',
        'Address',
        'City',
        'State',
        'Zip',
    ]

    // Convert data to CSV rows
    const rows = data.map((row) => {
        return [
            row.callerId || '',
            row.lastCall || '',
            row.duration || '',
            (row.lifetimeRevenue || 0).toString(),
            row.campaign || '',
            Array.isArray(row.status)
                ? row.status.join('; ')
                : row.status || '',
            row.action || '',
            (row.revenue || '').toString(),
            row.firstName || '',
            row.lastName || '',
            row.email || '',
            row.address || '',
            row.city || '',
            row.state || '',
            (row as CallData & { zip?: string }).zip ?? row.g_zip ?? '',
        ]
    })

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
