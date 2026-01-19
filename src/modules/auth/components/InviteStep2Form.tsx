import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AuthCard } from './AuthCard'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import Logo from '@/components/logo'

export interface InviteStep2FormProps {
    email: string
    onSubmit: (firstName: string, lastName: string) => Promise<void>
    error?: string | null
    clearError: () => void
}

export const InviteStep2Form: React.FC<InviteStep2FormProps> = ({
    email,
    onSubmit,
    error,
    clearError,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [fieldError, setFieldError] = useState<{
        firstName?: string
        lastName?: string
    }>({})

    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const textMuted = 'text-[#A1A5B7]'
    const linkClr = 'text-[#007FFF] hover:underline'

    const validate = () => {
        const next: { firstName?: string; lastName?: string } = {}
        if (!firstName.trim()) next.firstName = 'First name is required'
        if (!lastName.trim()) next.lastName = 'Last name is required'
        setFieldError(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError()
        if (!validate()) return
        setSubmitting(true)
        try {
            await onSubmit(firstName.trim(), lastName.trim())
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <AuthCard>
            <div className="p-6 sm:p-8">
                <div className="flex justify-center mb-6">
                    <Logo />
                </div>
                <h1 className={`text-xl font-semibold ${textClr} text-center`}>Welcome</h1>
                <p className={`text-sm ${textMuted} mt-1 mb-2 text-center`}>
                    Create a new account.
                </p>
                <p className={`text-sm ${textClr} mb-6 text-center`}>
                    You are signing up with <strong>{email}</strong>
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="First Name"
                        value={firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value)
                            setFieldError((f) => ({
                                ...f,
                                firstName: undefined,
                            }))
                        }}
                        placeholder="First name"
                        error={fieldError.firstName}
                    />
                    <Input
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value)
                            setFieldError((f) => ({
                                ...f,
                                lastName: undefined,
                            }))
                        }}
                        placeholder="Last name"
                        error={fieldError.lastName}
                    />
                    {error && <p className="text-sm text-[#F64E60]">{error}</p>}
                    <Button
                        type="submit"
                        disabled={
                            submitting || !firstName.trim() || !lastName.trim()
                        }
                    >
                        {submitting ? 'Signing up...' : 'Sign up'}
                    </Button>
                </form>
                <p className={`text-sm text-center ${textMuted} mt-4`}>
                    Already have an account?{' '}
                    <Link to="/login" className={linkClr}>
                        Login
                    </Link>
                </p>
            </div>
        </AuthCard>
    )
}
