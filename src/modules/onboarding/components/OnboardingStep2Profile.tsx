import React from 'react'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import { OnboardingDots } from './OnboardingDots'

export interface OnboardingStep2ProfileProps {
    fullName: string
    onContinue: () => void
    dots: { total: number; current: number }
}

/**
 * Profile Setup. Figma 2439-34655
 * Full Name read-only (from first+last on auth). Continue.
 */
export const OnboardingStep2Profile: React.FC<OnboardingStep2ProfileProps> = ({
    fullName,
    onContinue,
    dots,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const textMuted = 'text-[#A1A5B7]'

    return (
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center p-6">
            <div className="flex flex-col flex-1 w-full md:max-w-[300px]">
                <h2 className={`text-2xl font-semibold ${textClr}`}>Profile Setup</h2>
                <p className={`text-sm ${textMuted} mt-2 mb-6`}>
                    Provide your name and set-up your passwords.
                </p>
                <Input
                    label="Full Name"
                    value={fullName}
                    readOnly
                    placeholder="Full name"
                />
                <Button onClick={onContinue} className="w-full mt-4">
                    Continue
                </Button>
                <OnboardingDots total={dots.total} current={dots.current} className="mt-8" />
            </div>
            <div className="flex-1 min-w-0" />
        </div>
    )
}
