/**
 * Customers Page
 * Main page for billing/customers matching Figma design (node-id: 4643-10577)
 */

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useNavigate } from '@tanstack/react-router'
import { useCustomers, useDeleteCustomer } from '../hooks/useCustomers'
import { CustomersTable } from '../components/CustomersTable'
import { CreateEditCustomerModal } from '../components/CreateEditCustomerModal'
import type { Customer } from '../services/customersApi'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import { AddIcon } from '@/assets/svg'
import { Modal } from '@/components/ui/Modal'
import { usePermissions } from '@/hooks/usePermissions'

export default function CustomersPage() {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const navigate = useNavigate()
    const { data: customers = [], isLoading } = useCustomers()
    const deleteMutation = useDeleteCustomer()
    const { role } = usePermissions()

    // Access control: Only super_admin and org_admin can access
    const canAccess = role === 'super_admin' || role === 'org_admin'

    useEffect(() => {
        if (role && !canAccess) {
            navigate({ to: '/caller-analysis' })
        }
    }, [role, canAccess, navigate])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(
        null
    )
    const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleCreate = () => {
        setEditingCustomer(null)
        setIsModalOpen(true)
    }

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer)
        setIsModalOpen(true)
    }

    const handleDeleteClick = (customer: Customer) => {
        setDeleteCustomer(customer)
    }

    if (!canAccess) {
        return null
    }

    const handleDeleteConfirm = async () => {
        if (!deleteCustomer) return

        setIsDeleting(true)
        try {
            await deleteMutation.mutateAsync(deleteCustomer.id)
            setDeleteCustomer(null)
        } catch (error) {
            // Error handling is done in the mutation hook
        } finally {
            setIsDeleting(false)
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingCustomer(null)
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
                        Customers
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
                            New Customer
                        </span>
                    </Button>
                </div>

                {/* Table */}
                <CustomersTable
                    data={customers}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    loading={isLoading}
                />

                {/* Create/Edit Modal */}
                <CreateEditCustomerModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    customer={editingCustomer}
                />

                {/* Delete Confirmation Modal */}
                <Modal
                    open={!!deleteCustomer}
                    onClose={() => !isDeleting && setDeleteCustomer(null)}
                    title="Delete Customer"
                    position="center"
                    size="sm"
                >
                    <div className="space-y-4 p-2">
                        <p className="text-sm">
                            Are you sure you want to delete{' '}
                            <strong>{deleteCustomer?.name}</strong>? This action
                            cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => setDeleteCustomer(null)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                                className="bg-[#F64E60] hover:bg-[#E63950] text-white"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    )
}
