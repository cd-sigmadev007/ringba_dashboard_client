import React from 'react'
import { AuthCard } from './AuthCard'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'

import donePng from '@/assets/png/done.png'

export interface EmailVerifiedViewProps {
    onGreat: () => void
}

/**
 * Shown once after invite signup (set password + OTP + first/last) succeeds.
 * "Great!" logs the user in and navigates to main layout; onboarding modal shows on top.
 * Figma: 4031-1412
 */
export const EmailVerifiedView: React.FC<EmailVerifiedViewProps> = ({ onGreat }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const textMuted = 'text-[#A1A5B7]'

    return (
        <AuthCard>
            <div className="p-6 sm:p-8 flex flex-col items-center text-center">
                <img src={donePng} alt="" className="mx-auto mb-6 object-contain flex-shrink-0" aria-hidden />
                <h1 className={`text-xl font-semibold ${textClr}`}>Email Verified!</h1>
                <p className={`text-sm ${textMuted} mt-1 mb-6`}>
                    Your email has been successfully verified.
                </p>
                <Button onClick={onGreat} className="w-full">
                    Great!
                </Button>
            </div>
        </AuthCard>
    )
}
