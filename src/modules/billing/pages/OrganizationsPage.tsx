/**
 * Organizations Page
 * Main page for billing/organizations matching Figma design (node-id: 4643-10916)
 */

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useNavigate } from '@tanstack/react-router'
import {
    useDeleteOrganization,
    useOrganizations,
} from '../hooks/useOrganizations'
import { OrganizationsTable } from '../components/OrganizationsTable'
import { CreateEditOrganizationModal } from '../components/CreateEditOrganizationModal'
import type { Organization } from '../types'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import { AddIcon } from '@/assets/svg'
import { usePermissions } from '@/hooks/usePermissions'

export default function OrganizationsPage() {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const navigate = useNavigate()
    const { data: organizations = [], isLoading } = useOrganizations()
    const deleteMutation = useDeleteOrganization()
    const { role } = usePermissions()

    // Access control: Only super_admin and org_admin can access
    const canAccess = role === 'super_admin' || role === 'org_admin'

    useEffect(() => {
        if (role && !canAccess) {
            navigate({ to: '/caller-analysis' })
        }
    }, [role, canAccess, navigate])

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

    if (!canAccess) {
        return null
    }

    const handleDelete = async (org: Organization) => {
        if (
            window.confirm(
                `Are you sure you want to delete "${org.name}"? This action cannot be undone.`
            )
        ) {
            try {
                await deleteMutation.mutateAsync(org.id)
            } catch (error) {
                // Error handling is done in the mutation hook
            }
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingOrg(null)
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
                        Organizations
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
                            New Organization
                        </span>
                    </Button>
                </div>

                {/* Table */}
                <OrganizationsTable
                    data={organizations}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={isLoading}
                />

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
