import React, { useState } from 'react'
import {
    OnboardingStep1Welcome,
    OnboardingStep2Profile,
    OnboardingStep3Complete,
} from '../components'
import { Modal } from '@/components/ui/Modal'
import { authApi } from '@/modules/auth/services/authApi'
import { useAuth } from '@/contexts/AuthContext'

const STEPS = 3

export interface OnboardingModalContainerProps {
    open: boolean
    onComplete: () => void
}

/**
 * Non-skippable onboarding modal (3 steps). Shown when user.onboardingCompletedAt is null.
 * Step 2: First name (required), Last name (optional). On "Let's Go!" step 3: complete-onboarding with names, refetchMe, onComplete.
 */
export const OnboardingModalContainer: React.FC<
    OnboardingModalContainerProps
> = ({ open, onComplete }) => {
    const { user, refetchMe } = useAuth()
    const [step, setStep] = useState(1)
    const [step2Names, setStep2Names] = useState<{
        firstName: string
        lastName: string
    } | null>(null)

    const handleStep1LetsGo = () => setStep(2)
    const handleStep2Continue = (firstName: string, lastName: string) => {
        setStep2Names({ firstName, lastName })
        setStep(3)
    }
    const handleStep3LetsGo = async () => {
        try {
            await authApi.completeOnboarding(
                step2Names?.firstName,
                step2Names?.lastName
            )
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
            className="!max-w-[750px] w-full"
            contentClassName="!mx-0 !mb-0 !p-0"
        >
            {step === 1 && (
                <OnboardingStep1Welcome
                    onLetsGo={handleStep1LetsGo}
                    dots={dots}
                />
            )}
            {step === 2 && (
                <OnboardingStep2Profile
                    initialFirstName={user?.firstName ?? ''}
                    initialLastName={user?.lastName ?? ''}
                    onContinue={handleStep2Continue}
                    dots={dots}
                />
            )}
            {step === 3 && (
                <OnboardingStep3Complete
                    onLetsGo={handleStep3LetsGo}
                    dots={dots}
                />
            )}
        </Modal>
    )
}
