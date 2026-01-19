import React from 'react'
import { useThemeStore } from '@/store/themeStore'
import { cn } from '@/lib/utils'

export const ValidatingInviteView: React.FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <div
            className={cn(
                'w-full max-w-[400px] rounded-[10px] border p-8 text-center text-[#A1A5B7]',
                isDark
                    ? 'border-[#1B456F] bg-[#071B2F]'
                    : 'border-[#E1E5E9] bg-white'
            )}
        >
            Validating invitation...
        </div>
    )
}
