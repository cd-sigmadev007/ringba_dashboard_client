/**
 * Organizations Page
 * Main page for billing/organizations matching Figma design (node-id: 4643-10916)
 */

import React, { useState } from 'react'
import { useOrganizations } from '../hooks/useOrganizations'
import { OrganizationsTable } from '../components/OrganizationsTable'
import { CreateEditOrganizationModal } from '../components/CreateEditOrganizationModal'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import { AddIcon } from '@/assets/svg'
import type { Organization } from '../types'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function OrganizationsPage() {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const { data: organizations = [], isLoading } = useOrganizations()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null)

    const handleCreate = () => {
        setEditingOrg(null)
        setIsModalOpen(true)
    }

    const handleEdit = (org: Organization) => {
        setEditingOrg(org)
        setIsModalOpen(true)
    }

    const handleDelete = async (org: Organization) => {
        if (
            window.confirm(
                `Are you sure you want to delete "${org.name}"? This action cannot be undone.`
            )
        ) {
            // TODO: Implement delete API call
            toast.error('Delete functionality not yet implemented')
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingOrg(null)
    }

    // Calculate pagination info
    const currentPage = 1
    const pageSize = 10
    const totalItems = organizations.length
    const startItem = totalItems > 0 ? 1 : 0
    const endItem = Math.min(pageSize, totalItems)

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
                        Organizations
                    </h1>
                    <Button
                        variant="secondary"
                        onClick={handleCreate}
                        className={clsx(
                            'flex items-center gap-[5px] px-[10px] py-[7px] rounded-[10px]',
                            isDark ? 'bg-[#002B57] text-[#F5F8FA]' : 'bg-[#002B57] text-[#F5F8FA]'
                        )}
                    >
                        <AddIcon className="w-5 h-5" />
                        <span className="text-[14px] font-regular">New Organization</span>
                    </Button>
                </div>

                {/* Table */}
                <OrganizationsTable
                    data={organizations}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={isLoading}
                />

                {/* Pagination Footer */}
                {totalItems > 0 && (
                    <div className="flex items-center justify-between mt-6">
                        <p
                            className={clsx(
                                'text-[16px] font-medium',
                                isDark ? 'text-[#A1A5B7]' : 'text-[#7E8299]'
                            )}
                        >
                            Showing {startItem}-{endItem} of {totalItems} items
                        </p>
                        <div className="flex gap-[10px] items-center">
                            <div
                                className={clsx(
                                    'h-[35px] w-[40px] flex items-center justify-center rounded-[10px]',
                                    isDark
                                        ? 'bg-[#1A64FF] text-[#F0F5FF]'
                                        : 'bg-[#1A64FF] text-[#F0F5FF]'
                                )}
                            >
                                <span className="text-[16px] font-medium">{currentPage}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create/Edit Modal */}
                <CreateEditOrganizationModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    organization={editingOrg}
                />
            </div>
        </div>
    )
}

