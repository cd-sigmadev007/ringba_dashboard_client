import React, { useCallback, useRef, useState } from 'react'
import { AuthCard } from './AuthCard'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import Logo from '@/components/logo'
import { BackArrowIcon } from '@/assets/svg'
import { cn } from '@/lib/utils'

export interface InviteOtpFormProps {
    email: string
    onBack: () => void
    onRequestCode: () => Promise<void>
    onVerify: (otp: string) => Promise<void>
    error?: string | null
    clearError: () => void
}

const OTP_LENGTH = 6
const RESEND_COOLDOWN_SEC = 60

/**
 * OTP verification step. Matches Figma: Back, title, code sent to email,
 * 6-digit boxes, Verify, Resend with countdown.
 * https://www.figma.com/design/.../node-id=4031-1319
 */
export const InviteOtpForm: React.FC<InviteOtpFormProps> = ({
    email,
    onBack,
    onRequestCode,
    onVerify,
    error,
    clearError,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [digits, setDigits] = useState<Array<string>>(
        Array(OTP_LENGTH).fill('')
    )
    const [loading, setLoading] = useState(false)
    const [cooldown, setCooldown] = useState(0)
    const inputRefs = useRef<Array<HTMLInputElement | null>>([])

    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const textMuted = 'text-[#A1A5B7]'

    const otp = digits.join('')
    const canVerify = otp.length === OTP_LENGTH

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

    const handleResend = async () => {
        if (cooldown > 0) return
        clearError()
        try {
            await onRequestCode()
            runCooldown()
        } catch (_) {}
    }

    const handleChange = (i: number, v: string) => {
        const char = v.replace(/\D/g, '').slice(-1)
        const next = [...digits]
        next[i] = char
        setDigits(next)
        clearError()
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
        clearError()
        const focus = Math.min(pasted.length, OTP_LENGTH - 1)
        inputRefs.current[focus]?.focus()
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError()
        if (!canVerify) return
        setLoading(true)
        try {
            await onVerify(otp)
        } finally {
            setLoading(false)
        }
    }

    const inputBase = cn(
        'w-11 h-12 rounded-[7px] text-center text-lg font-medium border transition-all',
        'focus:outline-none focus:border-[#007FFF]',
        isDark
            ? 'bg-[#002B57] border-[#1B456F] text-[#F5F8FA]'
            : 'bg-white border-[#E1E5E9] text-[#3F4254]'
    )

    return (
        <AuthCard>
            <div className="p-6 sm:p-8">
                <div className="flex items-center justify-center mb-6 relative">
                    <button
                        type="button"
                        onClick={onBack}
                        className={cn(
                            'absolute left-0 p-1 rounded hover:opacity-80',
                            isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                        )}
                        aria-label="Back"
                    >
                        <BackArrowIcon className="w-6 h-6" />
                    </button>
                    <Logo />
                </div>

                <h1 className={`text-xl font-semibold ${textClr} text-center`}>
                    OTP Verification
                </h1>
                <p className={`text-sm ${textMuted} mt-1 mb-6 text-center`}>
                    Enter the 6-digit verification code that was sent to{' '}
                    <strong className={textClr}>{email}</strong>
                </p>

                <form
                    onSubmit={handleVerify}
                    className="flex flex-col gap-4 items-center"
                >
                    <div
                        className="flex justify-center gap-1 w-full"
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

                    {error && (
                        <p className="text-sm text-[#F64E60] text-center w-full">
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={!canVerify || loading}
                        className="w-full"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </Button>

                    <div className="text-center">
                        <p className={`text-sm ${textMuted}`}>
                            Didn&apos;t receive any code?
                        </p>
                        {cooldown > 0 ? (
                            <p
                                className={`text-sm font-medium ${textClr} mt-1`}
                            >
                                Resend in{' '}
                                {String(Math.floor(cooldown / 60)).padStart(
                                    2,
                                    '0'
                                )}
                                :{String(cooldown % 60).padStart(2, '0')}
                            </p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                className={`text-sm font-medium ${textClr} mt-1 hover:underline`}
                            >
                                Resend
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </AuthCard>
    )
}
