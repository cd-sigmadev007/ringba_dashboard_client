import React from 'react'
import { useThemeStore } from '@/store/themeStore'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const ProfileIcon: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const strokeColor = isDark ? '#A1A5B7' : '#5E6278'

    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-labelledby={titleId}
            {...props}
        >
            {title ? <title id={titleId}>{title}</title> : null}
            <path
                d="M9 9C10.6569 9 12 7.65685 12 6C12 4.34315 10.6569 3 9 3C7.34315 3 6 4.34315 6 6C6 7.65685 7.34315 9 9 9Z"
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3 15C3 12.2386 5.68629 10 9 10C12.3137 10 15 12.2386 15 15"
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default ProfileIcon
