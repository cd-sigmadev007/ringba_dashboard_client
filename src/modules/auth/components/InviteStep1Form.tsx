import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AuthCard } from './AuthCard'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { EyeIcon, EyeOffIcon } from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'

export interface InviteStep1FormProps {
    email: string
    onNext: (data: { password: string; otp: string }) => void
    onRequestCode: () => Promise<void>
    error?: string | null
    clearError: () => void
}

export const InviteStep1Form: React.FC<InviteStep1FormProps> = ({
    email,
    onNext,
    onRequestCode,
    error,
    clearError,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [otp, setOtp] = useState('')
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [requesting, setRequesting] = useState(false)
    const [fieldError, setFieldError] = useState<{
        password?: string
        confirm?: string
        otp?: string
    }>({})
    const [formError, setFormError] = useState<string | undefined>()

    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const textMuted = 'text-[#A1A5B7]'
    const linkClr = 'text-[#007FFF] hover:underline'

    const handleRequestCode = async () => {
        clearError()
        setFieldError((f) => ({ ...f, otp: undefined }))
        setRequesting(true)
        try {
            await onRequestCode()
        } finally {
            setRequesting(false)
        }
    }

    const validate = () => {
        const next: { password?: string; confirm?: string; otp?: string } = {}
        if (!password) next.password = 'Password is required'
        else if (password.length < 8)
            next.password = 'Password must be at least 8 characters'
        if (password !== confirm) next.confirm = 'Passwords do not match'
        if (!otp.trim()) next.otp = 'Code is required'
        setFieldError(next)
        if (!agreeTerms) {
            setFormError('You must agree to the Terms and Privacy Policy')
            return false
        }
        setFormError(undefined)
        return Object.keys(next).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        clearError()
        if (!validate()) return
        onNext({ password, otp })
    }

    return (
        <AuthCard>
            <div className="p-6 sm:p-8">
                <h1 className={`text-xl font-semibold ${textClr}`}>Welcome</h1>
                <p className={`text-sm ${textMuted} mt-1 mb-6`}>
                    Create a new account.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                            setFieldError((f) => ({
                                ...f,
                                password: undefined,
                            }))
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
                    <label
                        className="flex items-start gap-2 cursor-pointer"
                        onClick={() => setAgreeTerms((t) => !t)}
                    >
                        <Checkbox checked={agreeTerms} />
                        <span className={`text-sm ${textMuted}`}>
                            I agree to the{' '}
                            <a href="#" className={linkClr}>
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className={linkClr}>
                                Privacy Policy
                            </a>
                        </span>
                    </label>
                    <div>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleRequestCode}
                            disabled={requesting}
                            className="w-full mb-2"
                        >
                            {requesting ? 'Sending...' : 'Request code'}
                        </Button>
                        <Input
                            label="One-time passcode"
                            type="text"
                            inputMode="numeric"
                            value={otp}
                            onChange={(e) => {
                                setOtp(
                                    e.target.value
                                        .replace(/\D/g, '')
                                        .slice(0, 6)
                                )
                                setFieldError((f) => ({ ...f, otp: undefined }))
                            }}
                            placeholder="Enter code from email"
                            error={fieldError.otp}
                        />
                    </div>
                    {formError && (
                        <p className="text-sm text-[#F64E60]">{formError}</p>
                    )}
                    {error && <p className="text-sm text-[#F64E60]">{error}</p>}
                    <Button
                        type="submit"
                        disabled={
                            !agreeTerms || !otp.trim() || password !== confirm
                        }
                    >
                        Sign up
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
