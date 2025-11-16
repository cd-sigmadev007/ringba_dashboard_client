import React from 'react'
import { useThemeStore } from '@/store/themeStore'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const CampaignIcon: React.FC<
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
                d="M9 3L11.5 7.5L16.5 8.5L13 12L13.5 17L9 14.5L4.5 17L5 12L1.5 8.5L6.5 7.5L9 3Z"
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default CampaignIcon
