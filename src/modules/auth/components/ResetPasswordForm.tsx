import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AuthCard } from './AuthCard'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { EyeIcon, EyeOffIcon } from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'

export interface ResetPasswordFormProps {
    tokenValid: boolean | null
    onSubmit: (newPassword: string) => Promise<void>
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
    tokenValid,
    onSubmit,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [newPassword, setNewPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fieldError, setFieldError] = useState<{
        newPassword?: string
        confirm?: string
    }>({})

    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const textMuted = 'text-[#A1A5B7]'
    const linkClr = 'text-[#007FFF] hover:underline'

    const validate = () => {
        const next: { newPassword?: string; confirm?: string } = {}
        if (!newPassword) next.newPassword = 'Password is required'
        else if (newPassword.length < 8)
            next.newPassword = 'Password must be at least 8 characters'
        if (newPassword !== confirm) next.confirm = 'Passwords do not match'
        setFieldError(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        if (!validate()) return
        setSubmitting(true)
        try {
            await onSubmit(newPassword)
        } catch (err: any) {
            setError(
                err?.message ||
                    err?.details?.message ||
                    'Failed to reset password'
            )
        } finally {
            setSubmitting(false)
        }
    }

    if (tokenValid === false) {
        return (
            <AuthCard>
                <div className="p-6 sm:p-8 text-center">
                    <p className="text-[#F64E60]">
                        Invalid or expired reset link. Please request a new one.
                    </p>
                    <Link
                        to="/forgot-password"
                        className={`mt-4 inline-block ${linkClr}`}
                    >
                        Request new link
                    </Link>
                    <Link to="/login" className={`mt-2 block ${linkClr}`}>
                        Back to Login
                    </Link>
                </div>
            </AuthCard>
        )
    }

    if (tokenValid !== true) {
        return (
            <AuthCard>
                <div className={`p-6 sm:p-8 text-center ${textMuted}`}>
                    Checking link...
                </div>
            </AuthCard>
        )
    }

    return (
        <AuthCard>
            <div className="p-6 sm:p-8">
                <h1 className={`text-xl font-semibold ${textClr}`}>
                    Change Your Password
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 mt-6"
                >
                    <Input
                        label="New password"
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value)
                            setFieldError((f) => ({
                                ...f,
                                newPassword: undefined,
                            }))
                        }}
                        placeholder="Enter new password"
                        error={fieldError.newPassword}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowNew((s) => !s)}
                                className="cursor-pointer"
                                aria-label={showNew ? 'Hide' : 'Show'}
                            >
                                {showNew ? (
                                    <EyeOffIcon className="w-5 h-5" />
                                ) : (
                                    <EyeIcon className="w-5 h-5" />
                                )}
                            </button>
                        }
                    />
                    <Input
                        label="Confirm password"
                        type={showConfirm ? 'text' : 'password'}
                        value={confirm}
                        onChange={(e) => {
                            setConfirm(e.target.value)
                            setFieldError((f) => ({ ...f, confirm: undefined }))
                        }}
                        placeholder="Confirm new password"
                        error={fieldError.confirm}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowConfirm((s) => !s)}
                                className="cursor-pointer"
                                aria-label={showConfirm ? 'Hide' : 'Show'}
                            >
                                {showConfirm ? (
                                    <EyeOffIcon className="w-5 h-5" />
                                ) : (
                                    <EyeIcon className="w-5 h-5" />
                                )}
                            </button>
                        }
                    />
                    {error && <p className="text-sm text-[#F64E60]">{error}</p>}
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full"
                    >
                        {submitting ? 'Resetting...' : 'Continue'}
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
