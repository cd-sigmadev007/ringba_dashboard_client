import React from 'react'
import clsx from 'clsx'
import { useThemeStore } from '@/store/themeStore'

interface CampaignFormFieldProps {
    label: string
    children: React.ReactNode
    error?: string
}

export const CampaignFormField: React.FC<CampaignFormFieldProps> = ({
    label,
    children,
    error,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6">
            <label
                className={clsx(
                    'text-sm font-medium md:min-w-[140px] md:pt-3',
                    isDark ? 'text-white' : 'text-gray-700'
                )}
            >
                {label}
            </label>
            <div className="flex-1 w-full">
                {children}
                {error && (
                    <p
                        className={clsx(
                            'text-sm mt-1',
                            isDark ? 'text-red-400' : 'text-red-600'
                        )}
                    >
                        {error}
                    </p>
                )}
            </div>
        </div>
    )
}
