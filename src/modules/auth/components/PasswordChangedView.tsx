import React from 'react'
import { Link } from '@tanstack/react-router'
import { AuthCard } from './AuthCard'
import { useThemeStore } from '@/store/themeStore'
import { SuccessCheckIcon } from '@/assets/svg'
import Button from '@/components/ui/Button'

export const PasswordChangedView: React.FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const textMuted = 'text-[#A1A5B7]'

    return (
        <AuthCard>
            <div className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#132f4c] flex items-center justify-center mx-auto mb-6">
                    <SuccessCheckIcon className="w-10 h-10 text-[#138a00]" />
                </div>
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
