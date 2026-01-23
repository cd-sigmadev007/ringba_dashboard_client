import React, { useCallback, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { EyeIcon, EyeOffIcon } from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'
import { authApi } from '@/modules/auth/services/authApi'
import { cn } from '@/lib/utils'

const OTP_LENGTH = 6
const RESEND_COOLDOWN_SEC = 60
const ERR = '#F64E60'
const OK = '#16a34a'

function passChecks(p: string) {
    const hasLower = /[a-z]/.test(p)
    const hasUpper = /[A-Z]/.test(p)
    const hasNumber = /[0-9]/.test(p)
    const hasSpecial = /[^A-Za-z0-9]/.test(p)
    const count = [hasLower, hasUpper, hasNumber, hasSpecial].filter(
        Boolean
    ).length
    return {
        length: p.length >= 8,
        threeOf: count >= 3,
        hasLower,
        hasUpper,
        hasNumber,
        hasSpecial,
    }
}

export const ChangePasswordForm: React.FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [digits, setDigits] = useState<Array<string>>(
        Array(OTP_LENGTH).fill('')
    )
    const [loading, setLoading] = useState(false)
    const [requestingOtp, setRequestingOtp] = useState(false)
    const [cooldown, setCooldown] = useState(0)
    const [fieldError, setFieldError] = useState<{
        newPassword?: string
        confirmPassword?: string
        otp?: string
    }>({})
    const inputRefs = useRef<Array<HTMLInputElement | null>>([])

    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const textMuted = 'text-[#A1A5B7]'

    const checks = useMemo(() => passChecks(newPassword), [newPassword])
    const showValidation = newPassword.length > 0

    const otp = digits.join('')
    const canSubmit =
        checks.length &&
        checks.threeOf &&
        newPassword === confirmPassword &&
        otp.length === OTP_LENGTH

    const runCooldown = useCallback(() => {
        setCooldown(RESEND_COOLDOWN_SEC)
        const id = setInterval(() => {
            setCooldown((s) => {
                if (s <= 1) {
                    clearInterval(id)
                    return 0
                }
                return s - 1
            })
        }, 1000)
    }, [])

    const handleRequestOtp = async () => {
        if (cooldown > 0) return
        setRequestingOtp(true)
        try {
            await authApi.requestChangePasswordOtp()
            toast.success('Verification code sent to your email')
            runCooldown()
        } catch (err: any) {
            toast.error(
                err?.message ||
                    'Failed to send verification code. Please try again.'
            )
        } finally {
            setRequestingOtp(false)
        }
    }

    const handleChange = (i: number, v: string) => {
        const char = v.replace(/\D/g, '').slice(-1)
        const next = [...digits]
        next[i] = char
        setDigits(next)
        if (fieldError.otp) {
            setFieldError((f) => ({ ...f, otp: undefined }))
        }
        if (char && i < OTP_LENGTH - 1) {
            inputRefs.current[i + 1]?.focus()
        }
    }

    const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !digits[i] && i > 0) {
            inputRefs.current[i - 1]?.focus()
            const next = [...digits]
            next[i - 1] = ''
            setDigits(next)
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pasted = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, OTP_LENGTH)
        if (!pasted) return
        const next = [...digits]
        for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
        setDigits(next)
        if (fieldError.otp) {
            setFieldError((f) => ({ ...f, otp: undefined }))
        }
        const focus = Math.min(pasted.length, OTP_LENGTH - 1)
        inputRefs.current[focus]?.focus()
    }

    const validate = () => {
        const next: {
            newPassword?: string
            confirmPassword?: string
            otp?: string
        } = {}
        if (!newPassword) {
            next.newPassword = 'Password is required'
        } else if (!checks.length) {
            next.newPassword = 'At least 8 characters required'
        } else if (!checks.threeOf) {
            next.newPassword =
                'Use at least 3 of: lower, upper, number, special'
        }
        if (newPassword !== confirmPassword) {
            next.confirmPassword = 'Passwords do not match'
        }
        if (otp.length !== OTP_LENGTH) {
            next.otp = 'Please enter the 6-digit verification code'
        }
        setFieldError(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFieldError({})
        if (!validate()) return
        setLoading(true)
        try {
            await authApi.changePassword(otp, newPassword)
            toast.success('Password changed successfully')
            // Reset form
            setNewPassword('')
            setConfirmPassword('')
            setDigits(Array(OTP_LENGTH).fill(''))
            setFieldError({})
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                'Failed to change password. Please try again.'
            if (err?.response?.status === 401) {
                setFieldError((f) => ({
                    ...f,
                    otp: 'Invalid or expired verification code',
                }))
            }
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const inputBase = cn(
        'w-11 h-12 rounded-[7px] text-center text-lg font-medium border transition-all',
        'focus:outline-none focus:border-[#007FFF]',
        isDark
            ? 'bg-[#002B57] border-[#1B456F] text-[#F5F8FA]'
            : 'bg-white border-[#E1E5E9] text-[#3F4254]',
        fieldError.otp && 'border-[#F64E60] focus:border-[#F64E60]'
    )

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-start max-md:flex-col gap-[10px] w-full max-w-[720px]">
                <label
                    className={cn('text-[14px] w-[220px] shrink-0', textClr)}
                >
                    New Password
                </label>
                <div className="w-full">
                    <Input
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
                        shadow={false}
                        className="w-full"
                    />
                    {showValidation && (
                        <div
                            className={cn(
                                'rounded-[5px] border p-4 mt-3',
                                isDark ? 'border-[#1B456F]' : 'border-[#E1E5E9]'
                            )}
                        >
                            <p
                                className={cn(
                                    'text-sm font-medium mb-3',
                                    textMuted
                                )}
                            >
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
                                        <span>
                                            {checks.hasLower ? '✓' : '✗'}
                                        </span>
                                        <span>Lower case letters (a-z)</span>
                                    </p>
                                    <p
                                        className="flex items-center gap-2"
                                        style={{
                                            color: checks.hasUpper ? OK : ERR,
                                        }}
                                    >
                                        <span>
                                            {checks.hasUpper ? '✓' : '✗'}
                                        </span>
                                        <span>Upper case letters (A-Z)</span>
                                    </p>
                                    <p
                                        className="flex items-center gap-2"
                                        style={{
                                            color: checks.hasNumber ? OK : ERR,
                                        }}
                                    >
                                        <span>
                                            {checks.hasNumber ? '✓' : '✗'}
                                        </span>
                                        <span>Numbers (0-9)</span>
                                    </p>
                                    <p
                                        className="flex items-center gap-2"
                                        style={{
                                            color: checks.hasSpecial ? OK : ERR,
                                        }}
                                    >
                                        <span>
                                            {checks.hasSpecial ? '✓' : '✗'}
                                        </span>
                                        <span>
                                            Special characters (e.g. !@#$%^&*)
                                        </span>
                                    </p>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-start max-md:flex-col gap-[10px] w-full max-w-[720px]">
                <label
                    className={cn('text-[14px] w-[220px] shrink-0', textClr)}
                >
                    Confirm Password
                </label>
                <div className="w-full">
                    <Input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value)
                            setFieldError((f) => ({
                                ...f,
                                confirmPassword: undefined,
                            }))
                        }}
                        placeholder="Confirm new password"
                        error={fieldError.confirmPassword}
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
                        shadow={false}
                        className="w-full"
                    />
                </div>
            </div>

            <div className="flex items-start max-md:flex-col gap-[10px] w-full max-w-[720px]">
                <label
                    className={cn('text-[14px] w-[220px] shrink-0', textClr)}
                >
                    Verification Code
                </label>
                <div className="w-full flex flex-col gap-3">
                    <div
                        className="flex justify-start gap-1"
                        onPaste={handlePaste}
                    >
                        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                            <input
                                key={i}
                                ref={(el) => {
                                    inputRefs.current[i] = el
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digits[i]}
                                onChange={(e) =>
                                    handleChange(i, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className={inputBase}
                                aria-label={`Digit ${i + 1}`}
                            />
                        ))}
                    </div>
                    {fieldError.otp && (
                        <p className="text-sm text-[#F64E60]">
                            {fieldError.otp}
                        </p>
                    )}
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleRequestOtp}
                            disabled={requestingOtp || cooldown > 0}
                            className="text-sm"
                        >
                            {requestingOtp
                                ? 'Sending...'
                                : cooldown > 0
                                  ? `Resend in ${String(Math.floor(cooldown / 60)).padStart(2, '0')}:${String(cooldown % 60).padStart(2, '0')}`
                                  : 'Request Code'}
                        </Button>
                        <p className={cn('text-xs', textMuted)}>
                            Enter the 6-digit code sent to your email
                        </p>
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                variant="secondary"
                disabled={!canSubmit || loading}
            >
                {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
        </form>
    )
}
