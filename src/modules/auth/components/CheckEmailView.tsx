import React from 'react'
import { Link } from '@tanstack/react-router'
import { AuthCard } from './AuthCard'
import { useThemeStore } from '@/store/themeStore'
import Button from '@/components/ui/Button'

import tickPng from '@/assets/png/tick.png'

export interface CheckEmailViewProps {
    email?: string
}

export const CheckEmailView: React.FC<CheckEmailViewProps> = ({
    email = '',
}) => {
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
                    Check Your Email
                </h1>
                <p className={`text-sm ${textMuted} mt-2 mb-8`}>
                    We have sent a password reset link to{' '}
                    <strong className={textClr}>{email || 'your email'}</strong>
                    . Please check your inbox and follow the instructions.
                </p>
                <Link to="/login">
                    <Button variant="ghost" className="w-full">
                        Back to Login
                    </Button>
                </Link>
            </div>
        </AuthCard>
    )
}
