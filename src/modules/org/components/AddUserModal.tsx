import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useUsersStore } from '../store/usersStore'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface AddUserModalProps {
    isOpen: boolean
    onClose: () => void
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const { createUser } = useUsersStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!name.trim()) {
            setError('Name is required')
            return
        }

        if (!email.trim()) {
            setError('Email is required')
            return
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address')
            return
        }

        try {
            const result = await createUser({
                email: email.trim(),
                name: name.trim(),
                invitation_status: 'send',
            })

            if (result) {
                toast.success(
                    'User created successfully! Email added to allowlist. User can now register with Auth0.'
                )
                setName('')
                setEmail('')
                onClose()
            } else {
                toast.error('Failed to create user. Please try again.')
            }
        } catch (err: any) {
            const errorMessage =
                err?.message || 'Failed to create user. Please try again.'
            setError(errorMessage)
            toast.error(errorMessage)
        }
    }

    const handleClose = () => {
        setName('')
        setEmail('')
        setError(null)
        onClose()
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            className="w-full"
            title="Add New User"
            size="full"
            position="bottom"
        >
            <form onSubmit={handleSubmit} className="space-y-4 p-2" noValidate>
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-1"
                    >
                        Name
                    </label>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter user name"
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-1"
                    >
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter user email"
                        required
                    />
                </div>

                {error && (
                    <div className="text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-4 w-full">
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        className="w-full"
                    >
                        Add User
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
