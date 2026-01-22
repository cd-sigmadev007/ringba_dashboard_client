import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AuthCard } from './AuthCard'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { EyeIcon, EyeOffIcon } from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'

export interface LoginFormProps {
    onSubmit: (data: {
        email: string
        password: string
        remember: boolean
    }) => Promise<void>
    error?: string | null
    clearError: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({
    onSubmit,
    error,
    clearError,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [fieldError, setFieldError] = useState<{
        email?: string
        password?: string
    }>({})

    const validate = () => {
        const next: { email?: string; password?: string } = {}
        if (!email.trim()) next.email = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            next.email = 'Please enter a valid email'
        if (!password) next.password = 'Password is required'
        setFieldError(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError()
        setFieldError({})
        if (!validate()) return
        setSubmitting(true)
        try {
            await onSubmit({ email, password, remember })
        } finally {
            setSubmitting(false)
        }
    }

    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const textMuted = 'text-[#A1A5B7]'
    const linkClr = 'text-[#007FFF] hover:underline'

    return (
        <AuthCard>
            <div className="p-6 sm:p-8">
                <h1 className={`text-xl font-semibold ${textClr}`}>Welcome</h1>
                <p className={`text-sm ${textMuted} mt-1 mb-6`}>
                    Sign in to continue to InsideFi.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setFieldError((f) => ({ ...f, email: undefined }))
                        }}
                        placeholder="Enter your email"
                        error={fieldError.email}
                    />
                    <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setFieldError((f) => ({
                                ...f,
                                password: undefined,
                            }))
                        }}
                        placeholder="Enter your password"
                        error={fieldError.password}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="cursor-pointer"
                                aria-label={
                                    showPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                            >
                                {showPassword ? (
                                    <EyeOffIcon className="w-5 h-5" />
                                ) : (
                                    <EyeIcon className="w-5 h-5" />
                                )}
                            </button>
                        }
                    />

                    <div className="flex items-center justify-between">
                        <label
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setRemember((r) => !r)}
                        >
                            <Checkbox checked={remember} />
                            <span className={`text-sm ${textMuted}`}>
                                Remember me
                            </span>
                        </label>
                        <Link
                            to="/forgot-password"
                            className={`text-sm ${linkClr}`}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {error && <p className="text-sm text-[#F64E60]">{error}</p>}

                    <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full"
                    >
                        {submitting ? 'Signing in...' : 'Login'}
                    </Button>

                    {/* Google sign-in: uncomment when backend supports
                    <div className="flex items-center gap-3 my-2">
                        <div className="flex-1 h-px bg-[#1B456F]" />
                        <span className={`text-sm ${textMuted}`}>Or</span>
                        <div className="flex-1 h-px bg-[#1B456F]" />
                    </div>
                    <Button type="button" variant="ghost" className="w-full" disabled>
                        Sign in with Google
                    </Button>
                    */}
                </form>
            </div>
        </AuthCard>
    )
}
