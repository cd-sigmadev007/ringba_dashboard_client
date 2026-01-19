import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useInviteValidate } from '../hooks'
import {
    InviteInvalidView,
    InviteStep1Form,
    InviteStep2Form,
    ValidatingInviteView,
} from '../components'
import { useAuth } from '@/contexts/AuthContext'

export const InviteContainer: React.FC = () => {
    const navigate = useNavigate()
    const { setPassword, error, clearError } = useAuth()
    const { token, validating, invalid, email } = useInviteValidate()
    const [step, setStep] = useState<1 | 2>(1)
    const [step1Data, setStep1Data] = useState<{
        password: string
        otp: string
    } | null>(null)

    const { requestInviteOtp } = useAuth()

    const handleRequestCode = () => requestInviteOtp(token)

    const handleStep2Submit = async (firstName: string, lastName: string) => {
        if (!step1Data) return
        await setPassword({
            invitationToken: token,
            password: step1Data.password,
            otp: step1Data.otp,
            first_name: firstName,
            last_name: lastName,
        })
        navigate({ to: '/caller-analysis' })
    }

    if (validating) return <ValidatingInviteView />

    if (invalid) return <InviteInvalidView />

    if (step === 1) {
        return (
            <InviteStep1Form
                email={email}
                onNext={(data) => {
                    setStep1Data(data)
                    setStep(2)
                }}
                onRequestCode={handleRequestCode}
                error={error}
                clearError={clearError}
            />
        )
    }

    if (!step1Data) return <InviteInvalidView />

    return (
        <InviteStep2Form
            email={email}
            onSubmit={handleStep2Submit}
            error={error}
            clearError={clearError}
        />
    )
}
