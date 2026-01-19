import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import {
    OnboardingStep1Welcome,
    OnboardingStep2Profile,
    OnboardingStep3Complete,
} from '../components'
import { authApi } from '@/modules/auth/services/authApi'
import { useAuth } from '@/contexts/AuthContext'

const STEPS = 3

export interface OnboardingModalContainerProps {
    open: boolean
    onComplete: () => void
}

/**
 * Non-skippable onboarding modal (3 steps). Shown when user.onboardingCompletedAt is null.
 * On "Let's Go!" on step 3: POST /api/auth/complete-onboarding, refetchMe, onComplete.
 */
export const OnboardingModalContainer: React.FC<OnboardingModalContainerProps> = ({
    open,
    onComplete,
}) => {
    const { user, refetchMe } = useAuth()
    const [step, setStep] = useState(1)

    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || '—'

    const handleStep1LetsGo = () => setStep(2)
    const handleStep2Continue = () => setStep(3)
    const handleStep3LetsGo = async () => {
        try {
            await authApi.completeOnboarding()
            await refetchMe()
            onComplete()
        } catch (_) {}
    }

    const dots = { total: STEPS, current: step - 1 }

    return (
        <Modal
            open={open}
            onClose={() => {}}
            showCloseButton={false}
            closeOnBackdropClick={false}
            title={undefined}
            size="lg"
            contentClassName="!mx-0 !mb-0 !p-0"
        >
            {step === 1 && (
                <OnboardingStep1Welcome onLetsGo={handleStep1LetsGo} dots={dots} />
            )}
            {step === 2 && (
                <OnboardingStep2Profile
                    fullName={fullName}
                    onContinue={handleStep2Continue}
                    dots={dots}
                />
            )}
            {step === 3 && (
                <OnboardingStep3Complete onLetsGo={handleStep3LetsGo} dots={dots} />
            )}
        </Modal>
    )
}
