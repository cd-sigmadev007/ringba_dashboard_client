import React from 'react'
import { Link } from '@tanstack/react-router'
import { AuthCard } from './AuthCard'
import { useThemeStore } from '@/store/themeStore'
import Button from '@/components/ui/Button'

import tickPng from '@/assets/png/tick.png'

export const PasswordChangedView: React.FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const textMuted = 'text-[#A1A5B7]'

    return (
        <AuthCard>
            <div className="p-6 sm:p-8 text-center">
                <img
                    src={tickPng}
                    alt=""
                    className="w-16 h-16 mx-auto mb-6 object-contain"
                />
                <h1 className={`text-xl font-semibold ${textClr}`}>
                    Password Changed!
                </h1>
                <p className={`text-sm ${textMuted} mt-2 mb-8`}>
                    Your password has been reset successfully. You can now log
                    in with your new credentials.
                </p>
                <Link to="/login">
                    <Button className="w-full">Go to Login</Button>
                </Link>
            </div>
        </AuthCard>
    )
}
