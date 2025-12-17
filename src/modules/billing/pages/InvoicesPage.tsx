/**
 * Invoices Page
 * Main page for billing/invoices
 */

import clsx from 'clsx'
import { useNavigate } from '@tanstack/react-router'
import { useDownloadInvoicePDF, useInvoices } from '../hooks/useInvoices'
import { InvoicesTable } from '../components/InvoicesTable'
import type { Invoice } from '../types'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import { AddIcon } from '@/assets/svg'

export default function InvoicesPage() {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const navigate = useNavigate()
    const { data: invoices = [], isLoading } = useInvoices()
    const downloadMutation = useDownloadInvoicePDF()

    const handleCreate = () => {
        navigate({ to: '/billing/invoices/new' })
    }

    const handleEdit = (invoice: Invoice) => {
        navigate({ to: `/billing/invoices/${invoice.id}/edit` })
    }

    const handleDownload = async (invoice: Invoice) => {
        try {
            await downloadMutation.mutateAsync(invoice.id)
        } catch (error) {
            // Error handling is done in the mutation hook
        }
    }

    return (
        <div className="min-h-screen content">
            <div className="p-3 sm:p-4 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1
                        className={clsx(
                            'text-[32px] font-semibold tracking-[-0.96px]',
                            isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                        )}
                    >
                        Invoices
                    </h1>
                    <Button
                        variant="secondary"
                        onClick={handleCreate}
                        className={clsx(
                            'flex items-center gap-[5px] px-[10px] py-[7px] rounded-[10px]',
                            isDark
                                ? 'bg-[#002B57] text-[#F5F8FA]'
                                : 'bg-[#002B57] text-[#F5F8FA]'
                        )}
                    >
                        <AddIcon className="w-5 h-5" />
                        <span className="text-[14px] font-regular">
                            New Invoice
                        </span>
                    </Button>
                </div>

                {/* Table */}
                <InvoicesTable
                    data={invoices}
                    onEdit={handleEdit}
                    onDownload={handleDownload}
                    loading={isLoading}
                />
            </div>
        </div>
    )
}
