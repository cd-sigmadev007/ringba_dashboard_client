import React from 'react'
import { useThemeStore } from '@/store/themeStore'
// import { cn } from '@/lib'

interface CrossIconProps {
    className?: string
}

const CrossIcon: React.FC<CrossIconProps> = ({ className }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            className={className}
        >
            <path
                d="M6 14.5L10 10.5L14 14.5M14 6.5L9.99924 10.5L6 6.5"
                stroke={isDark ? '#F5F8FA' : '#3F4254'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default CrossIcon
