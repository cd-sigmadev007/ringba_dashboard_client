import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AuthCard } from './AuthCard'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'

export interface ForgotPasswordFormProps {
    onSubmit: (email: string) => Promise<void>
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    onSubmit,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [email, setEmail] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [fieldError, setFieldError] = useState<string | undefined>()

    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const linkClr = 'text-[#007FFF] hover:underline'

    const validate = () => {
        if (!email.trim()) {
            setFieldError('Email is required')
            return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setFieldError('Please enter a valid email')
            return false
        }
        setFieldError(undefined)
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        setSubmitting(true)
        try {
            await onSubmit(email)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <AuthCard>
            <div className="p-6 sm:p-8">
                <h1 className={`text-xl font-semibold ${textClr}`}>
                    Forgot Your Password?
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 mt-6"
                >
                    <Input
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setFieldError(undefined)
                        }}
                        placeholder="Enter your email"
                        error={fieldError}
                    />
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full"
                    >
                        {submitting ? 'Sending...' : 'Continue'}
                    </Button>
                    <Link
                        to="/login"
                        className={`text-sm text-center ${linkClr}`}
                    >
                        Back to Login
                    </Link>
                </form>
            </div>
        </AuthCard>
    )
}
