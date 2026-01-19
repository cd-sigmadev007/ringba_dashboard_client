import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useInviteValidate } from '../hooks'
import {
    InviteInvalidView,
    InviteStep1Form,
    InviteOtpForm,
    InviteStep2Form,
    ValidatingInviteView,
    EmailVerifiedView,
} from '../components'
import { useAuth } from '@/contexts/AuthContext'

export const InviteContainer: React.FC = () => {
    const navigate = useNavigate()
    const { setPassword, refetchMe, error, clearError } = useAuth()
    const { token, validating, invalid, email } = useInviteValidate()
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1) // 4 = Email Verified (show once after signup)
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

    const handleOtpVerify = (otp: string) => {
        setStep1Data((s) => (s ? { ...s, otp } : null))
        setStep(3)
    }

    const handleStep3Submit = async (firstName: string, lastName: string) => {
        if (!step1Data?.password || !step1Data?.otp) return
        await setPassword({
            invitationToken: token,
            password: step1Data.password,
            otp: step1Data.otp,
            first_name: firstName,
            last_name: lastName,
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

    if (!step1Data?.password || !step1Data?.otp) return <InviteInvalidView />

    return (
        <InviteStep2Form
            email={email}
            onSubmit={handleStep3Submit}
            error={error}
            clearError={clearError}
        />
    )
}
