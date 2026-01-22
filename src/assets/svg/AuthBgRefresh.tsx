import React from 'react'
import { useThemeStore } from '@/store/themeStore'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const AuthBgRefresh: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const iconColor = isDark ? '#5E8FC7' : '#7E8299'
    const iconOpacity = isDark ? '0.3' : '0.2'

    return (
        <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-labelledby={titleId}
            {...props}
        >
            {title ? <title id={titleId}>{title}</title> : null}
            <g opacity={iconOpacity}>
                <path
                    d="M35.222 39.1194C39.8108 35.563 42.864 29.3413 42.1957 23.1473C41.7037 18.5872 39.4203 14.4093 35.8479 11.5328C32.2756 8.6562 27.7068 7.31658 23.1467 7.80859"
                    stroke={iconColor}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M14.7817 10.8849C9.91733 14.4059 7.11795 20.461 7.80807 26.8571C8.30008 31.4172 10.5834 35.595 14.1558 38.4716C17.7282 41.3481 22.2969 42.6878 26.857 42.1957"
                    stroke={iconColor}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M15.4808 14.8904L14.9802 10.2503L10.3401 10.751"
                    stroke={iconColor}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M34.8479 34.9365L35.3061 39.1832L39.5528 38.725"
                    stroke={iconColor}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    )
}
