import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AuthCard } from './AuthCard'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'

export interface LoginOtpFormProps {
    email: string
    onSubmit: (otp: string) => Promise<void>
    onResend: () => Promise<void>
    onLogout: () => Promise<void>
    clearError: () => void
}

export const LoginOtpForm: React.FC<LoginOtpFormProps> = ({
    email,
    onSubmit,
    onResend,
    onLogout,
    clearError,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [otp, setOtp] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [resending, setResending] = useState(false)
    const [fieldError, setFieldError] = useState<string | undefined>()

    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const textMuted = 'text-[#A1A5B7]'
    const linkClr = 'text-[#007FFF] hover:underline'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError()
        setFieldError(undefined)
        if (!otp.trim()) {
            setFieldError('Code is required')
            return
        }
        setSubmitting(true)
        try {
            await onSubmit(otp)
        } finally {
            setSubmitting(false)
        }
    }

    const handleResend = async () => {
        setResending(true)
        try {
            await onResend()
        } finally {
            setResending(false)
        }
    }

    if (!email) {
        return (
            <AuthCard>
                <div className="p-6 sm:p-8 text-center">
                    <p className="text-[#F64E60]">
                        Missing email. Please start from the login page.
                    </p>
                    <Link
                        to="/login"
                        className={`mt-4 inline-block ${linkClr}`}
                    >
                        Back to Login
                    </Link>
                </div>
            </AuthCard>
        )
    }

    return (
        <AuthCard>
            <div className="p-6 sm:p-8">
                <h1 className={`text-xl font-semibold ${textClr}`}>
                    Login from this device
                </h1>
                <p className={`text-sm ${textMuted} mt-2 mb-6`}>
                    We've detected a new login from this device. To ensure your
                    account's security, please verify your identity.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="One-time passcode"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        value={otp}
                        onChange={(e) => {
                            setOtp(
                                e.target.value.replace(/\D/g, '').slice(0, 6)
                            )
                            setFieldError(undefined)
                        }}
                        placeholder="Enter code"
                        error={fieldError}
                    />

                    <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full"
                    >
                        {submitting ? 'Verifying...' : 'Continue'}
                    </Button>

                    <div className="flex items-center justify-between text-sm">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending}
                            className={linkClr}
                        >
                            Resend Code
                        </button>
                        <button
                            type="button"
                            onClick={() => onLogout()}
                            className={textMuted + ' hover:opacity-80'}
                        >
                            Logout
                        </button>
                    </div>
                </form>
            </div>
        </AuthCard>
    )
}
