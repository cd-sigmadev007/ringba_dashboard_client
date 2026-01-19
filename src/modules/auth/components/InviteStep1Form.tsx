import React, { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { AuthCard } from './AuthCard'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { EyeIcon, EyeOffIcon } from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'
import Logo from '@/components/logo'
import { cn } from '@/lib/utils'

const ERR = '#F64E60'
const OK = '#16a34a'

function passChecks(p: string) {
    const hasLower = /[a-z]/.test(p)
    const hasUpper = /[A-Z]/.test(p)
    const hasNumber = /[0-9]/.test(p)
    const hasSpecial = /[^A-Za-z0-9]/.test(p)
    const count = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length
    return {
        length: p.length >= 8,
        threeOf: count >= 3,
        hasLower,
        hasUpper,
        hasNumber,
        hasSpecial,
    }
}

export interface InviteStep1FormProps {
    email: string
    onContinue: (data: { password: string }) => void
    onRequestCode: () => Promise<void>
    error?: string | null
    clearError: () => void
}

/**
 * Signup step 1: Email (read-only), Password, Confirm password.
 * "Continue" sends OTP to email and advances to OTP screen.
 * Password validation per Figma 2356-61954: red when not met, green when met.
 */
export const InviteStep1Form: React.FC<InviteStep1FormProps> = ({
    email,
    onContinue,
    onRequestCode,
    error,
    clearError,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fieldError, setFieldError] = useState<{
        password?: string
        confirm?: string
    }>({})

    const checks = useMemo(() => passChecks(password), [password])
    const showValidation = password.length > 0

    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const textMuted = 'text-[#A1A5B7]'
    const linkClr = 'text-[#007FFF] hover:underline'

    const validate = () => {
        const next: { password?: string; confirm?: string } = {}
        if (!password) next.password = 'Password is required'
        else if (!checks.length) next.password = 'At least 8 characters required'
        else if (!checks.threeOf)
            next.password = 'Use at least 3 of: lower, upper, number, special'
        if (password !== confirm) next.confirm = 'Passwords do not match'
        setFieldError(next)
        return Object.keys(next).length === 0
    }

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError()
        setFieldError({})
        if (!validate()) return
        setLoading(true)
        try {
            await onRequestCode()
            onContinue({ password })
        } catch (_) {
            // onRequestCode failure surfaced via error prop
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthCard>
            <div className="p-6 sm:p-8">
                <div className="flex justify-center mb-6">
                    <Logo />
                </div>
                <h1 className={`text-xl font-semibold ${textClr} text-center`}>Welcome</h1>
                <p className={`text-sm ${textMuted} mt-1 mb-6 text-center`}>
                    Create a new account. Set your password to continue.
                </p>

                <form onSubmit={handleContinue} className="flex flex-col gap-4">
                    <Input
                        label="Email address"
                        type="email"
                        value={email}
                        readOnly
                        disabled
                    />
                    <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setFieldError((f) => ({ ...f, password: undefined }))
                        }}
                        placeholder="Enter password"
                        error={fieldError.password}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="cursor-pointer"
                                aria-label={showPassword ? 'Hide' : 'Show'}
                            >
                                {showPassword ? (
                                    <EyeOffIcon className="w-5 h-5" />
                                ) : (
                                    <EyeIcon className="w-5 h-5" />
                                )}
                            </button>
                        }
                    />
                    {showValidation && (
                        <div
                            className={cn(
                                'rounded-[5px] border p-4',
                                isDark
                                    ? 'border-[#1B456F]'
                                    : 'border-[#E1E5E9]'
                            )}
                        >
                            <p className={`text-sm font-medium ${textMuted} mb-3`}>
                                Your password must contain:
                            </p>
                            <ul className="space-y-2 text-sm">
                                <li
                                    className="flex items-center gap-2"
                                    style={{
                                        color: checks.length ? OK : ERR,
                                    }}
                                >
                                    <span>{checks.length ? '✓' : '✗'}</span>
                                    <span>At least 8 characters</span>
                                </li>
                                <li
                                    className="flex items-center gap-2"
                                    style={{
                                        color: checks.threeOf ? OK : ERR,
                                    }}
                                >
                                    <span>{checks.threeOf ? '✓' : '✗'}</span>
                                    <span>At least 3 of the following:</span>
                                </li>
                                <li className="ml-5 space-y-1.5 pt-0.5">
                                    <p
                                        className="flex items-center gap-2"
                                        style={{
                                            color: checks.hasLower ? OK : ERR,
                                        }}
                                    >
                                        <span>{checks.hasLower ? '✓' : '✗'}</span>
                                        <span>Lower case letters (a-z)</span>
                                    </p>
                                    <p
                                        className="flex items-center gap-2"
                                        style={{
                                            color: checks.hasUpper ? OK : ERR,
                                        }}
                                    >
                                        <span>{checks.hasUpper ? '✓' : '✗'}</span>
                                        <span>Upper case letters (A-Z)</span>
                                    </p>
                                    <p
                                        className="flex items-center gap-2"
                                        style={{
                                            color: checks.hasNumber ? OK : ERR,
                                        }}
                                    >
                                        <span>{checks.hasNumber ? '✓' : '✗'}</span>
                                        <span>Numbers (0-9)</span>
                                    </p>
                                    <p
                                        className="flex items-center gap-2"
                                        style={{
                                            color: checks.hasSpecial ? OK : ERR,
                                        }}
                                    >
                                        <span>{checks.hasSpecial ? '✓' : '✗'}</span>
                                        <span>Special characters (e.g. !@#$%^&*)</span>
                                    </p>
                                </li>
                            </ul>
                        </div>
                    )}
                    <Input
                        label="Confirm password"
                        type={showConfirm ? 'text' : 'password'}
                        value={confirm}
                        onChange={(e) => {
                            setConfirm(e.target.value)
                            setFieldError((f) => ({ ...f, confirm: undefined }))
                        }}
                        placeholder="Confirm password"
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
                    {error && (
                        <p className="text-sm text-[#F64E60]">{error}</p>
                    )}
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? 'Sending code...' : 'Continue'}
                    </Button>
                </form>
                <p className={`text-sm text-center ${textMuted} mt-4 w-full`}>
                    Already have an account?{' '}
                    <Link to="/login" className={linkClr}>
                        Login
                    </Link>
                </p>
            </div>
        </AuthCard>
    )
}
