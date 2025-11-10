/**
 * Create Organization Form Component
 * Modal form for creating new organizations (super admin only)
 */

import { useState } from 'react'
import { useCreateOrganization } from '../hooks/useOrganizations'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'

interface CreateOrganizationFormProps {
    isOpen: boolean
    onClose: () => void
}

export default function CreateOrganizationForm({
    isOpen,
    onClose,
}: CreateOrganizationFormProps) {
    const [organizationName, setOrganizationName] = useState('')
    const [error, setError] = useState<string | null>(null)
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const createMutation = useCreateOrganization()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!organizationName.trim()) {
            setError('Organization name is required')
            return
        }

        if (organizationName.trim().length < 2) {
            setError('Organization name must be at least 2 characters')
            return
        }

        try {
            await createMutation.mutateAsync({
                name: organizationName.trim(),
            })

            setOrganizationName('')
            setError(null)
            onClose()
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to create organization'
            )
        }
    }

    const handleClose = () => {
        if (!createMutation.isPending) {
            setOrganizationName('')
            setError(null)
            onClose()
        }
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            title="Create New Organization"
            size="md"
            position="center"
            overlay="default"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Organization Name"
                    placeholder="Enter organization name"
                    value={organizationName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setOrganizationName(e.target.value)
                        setError(null)
                    }}
                    error={error || undefined}
                    disabled={createMutation.isPending}
                    required
                    autoFocus
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                        disabled={createMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <button
                        type="submit"
                        className={`text-[#F5F8FA] bg-[#007FFF] hover:bg-[#0254A5] active:bg-[#0254A5] py-[9px] px-[15px] rounded-[7px] transition-all duration-300 ease-in-out text-[14px] leading-5 cursor-pointer disabled:cursor-default disabled:opacity-50 ${
                            isDark
                                ? 'disabled:!bg-[#132F4C] disabled:text-[#7E8299]'
                                : 'disabled:!bg-[#E0E0E0] disabled:text-[#7E8299]'
                        }`}
                        disabled={
                            createMutation.isPending || !organizationName.trim()
                        }
                    >
                        {createMutation.isPending
                            ? 'Creating...'
                            : 'Create Organization'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
