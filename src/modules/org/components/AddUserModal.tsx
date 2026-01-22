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
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const { createUser } = useUsersStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!firstName.trim()) {
            setError('First name is required')
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
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                invitation_status: 'send',
            })

            if (result) {
                toast.success(
                    'User created successfully! Email added to allowlist. User can now register with Auth0.'
                )
                setFirstName('')
                setLastName('')
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
        setFirstName('')
        setLastName('')
        setEmail('')
        setError(null)
        onClose()
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            title="Add New User"
            size="md"
            position="center"
        >
            <form onSubmit={handleSubmit} className="space-y-4 p-2" noValidate>
                <div>
                    <label
                        htmlFor="firstName"
                        className="block text-sm font-medium mb-1"
                    >
                        First Name
                    </label>
                    <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter first name"
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="lastName"
                        className="block text-sm font-medium mb-1"
                    >
                        Last Name (optional)
                    </label>
                    <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter last name"
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
