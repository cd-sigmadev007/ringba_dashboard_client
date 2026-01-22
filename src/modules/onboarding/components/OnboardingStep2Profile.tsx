import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import { OnboardingDots } from './OnboardingDots'

export interface OnboardingStep2ProfileProps {
    initialFirstName: string
    initialLastName: string
    onContinue: (firstName: string, lastName: string) => void
    dots: { total: number; current: number }
}

/**
 * Profile Setup. First name (required), Last name (optional). Continue.
 */
export const OnboardingStep2Profile: React.FC<OnboardingStep2ProfileProps> = ({
    initialFirstName,
    initialLastName,
    onContinue,
    dots,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const textMuted = 'text-[#A1A5B7]'

    const [firstName, setFirstName] = useState(initialFirstName)
    const [lastName, setLastName] = useState(initialLastName)
    const [error, setError] = useState<{ firstName?: string }>({})

    const handleContinue = () => {
        const fn = firstName.trim()
        if (!fn) {
            setError({ firstName: 'First name is required' })
            return
        }
        setError({})
        onContinue(fn, lastName.trim())
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-between items-stretch p-6">
            {/* Left: title, description, dots at bottom (Figma 2439-34655) */}
            <div className="flex flex-col flex-1 min-w-0 md:max-w-[300px]">
                <h2 className={`text-2xl font-semibold ${textClr}`}>Profile Setup</h2>
                <p className={`text-sm ${textMuted} mt-2`}>
                    Provide your name and set-up your passwords.
                </p>
                <OnboardingDots total={dots.total} current={dots.current} className="mt-auto pt-6 md:pt-0 self-start" />
            </div>
            {/* Right: form */}
            <div className="flex flex-col gap-[40px] flex-1 w-full min-w-0 md:max-w-[300px]">
                <div className="flex flex-col gap-4">
                <Input
                    label="First Name"
                    value={firstName}
                    onChange={(e) => {
                        setFirstName(e.target.value)
                        setError((e) => ({ ...e, firstName: undefined }))
                    }}
                    placeholder="First name"
                    error={error.firstName}
                />
                <Input
                    label="Last Name (optional)"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                />
                </div>
                <Button onClick={handleContinue} className="w-full mt-4">
                    Continue
                </Button>
            </div>
        </div>
    )
}
