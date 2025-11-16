import React from 'react'
import clsx from 'clsx'
import { useThemeStore } from '@/store/themeStore'

const OrgHeader: React.FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <div className="flex items-center justify-between">
            <div>
                <h1
                    className={clsx(
                        'text-2xl font-semibold',
                        isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                    )}
                >
                    Organization Profile
                </h1>
            </div>
        </div>
    )
}

export default OrgHeader
