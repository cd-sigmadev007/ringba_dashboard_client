import React from 'react'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/themeStore'

interface AuthCardProps {
    children: React.ReactNode
    className?: string
}

/**
 * Auth card/panel with modal-like styling. Matches design system:
 * theme-dark: bg #071B2F, border #1B456F
 * theme-light: bg white, border #E1E5E9
 */
export const AuthCard: React.FC<AuthCardProps> = ({ children, className }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <div
            className={cn(
                'w-full w-[400px] max-md:w-[90vw] rounded-[10px] shadow-lg flex flex-col',
                isDark
                    ? 'bg-[#071B2F] border border-[#1B456F]'
                    : 'bg-white border border-[#E1E5E9]',
                className
            )}
        >
            {children}
        </div>
    )
}
