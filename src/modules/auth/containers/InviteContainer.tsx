import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useInviteValidate } from '../hooks'
import {
    InviteInvalidView,
    InviteStep1Form,
    InviteOtpForm,
    ValidatingInviteView,
    EmailVerifiedView,
} from '../components'
import { useAuth } from '@/contexts/AuthContext'

export const InviteContainer: React.FC = () => {
    const navigate = useNavigate()
    const { setPassword, refetchMe, error, clearError } = useAuth()
    const { token, validating, invalid, email } = useInviteValidate()
    const [step, setStep] = useState<1 | 2 | 4>(1) // 4 = Email Verified (show once after signup)
    const [step1Data, setStep1Data] = useState<{
        password: string
        otp: string
    } | null>(null)

    const { requestInviteOtp } = useAuth()

    const handleRequestCode = () => requestInviteOtp(token)

    const handleStep1Continue = (data: { password: string }) => {
        setStep1Data({ password: data.password, otp: '' })
        setStep(2)
    }

    const handleOtpBack = () => {
        setStep(1)
        setStep1Data(null)
    }

    const handleOtpVerify = async (otp: string) => {
        if (!step1Data?.password) return
        setStep1Data((s) => (s ? { ...s, otp } : null))
        // Names are already in DB from invite creation, no need to collect them here
        await setPassword({
            invitationToken: token,
            password: step1Data.password,
            otp: otp,
        })
        setStep(4) // Email Verified screen (only 1st time; next login goes straight to main)
    }

    const handleEmailVerifiedGreat = async () => {
        await refetchMe()
        navigate({ to: '/caller-analysis' })
    }

    if (validating) return <ValidatingInviteView />

    if (invalid) return <InviteInvalidView />

    if (step === 1) {
        return (
            <InviteStep1Form
                email={email}
                onContinue={handleStep1Continue}
                onRequestCode={handleRequestCode}
                error={error}
                clearError={clearError}
            />
        )
    }

    if (step === 2) {
        return (
            <InviteOtpForm
                email={email}
                onBack={handleOtpBack}
                onRequestCode={handleRequestCode}
                onVerify={handleOtpVerify}
                error={error}
                clearError={clearError}
            />
        )
    }

    if (step === 4) {
        return <EmailVerifiedView onGreat={handleEmailVerifiedGreat} />
    }

    // Step 2 is OTP verification, which calls handleOtpVerify and moves to step 4
    return null
}
