import React from 'react'
import { useThemeStore } from '@/store/themeStore'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const AuthBgSearch: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const iconColor = isDark ? '#5E8FC7' : '#7E8299'
    const iconOpacity = isDark ? '0.3' : '0.2'

    return (
        <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-labelledby={titleId}
            {...props}
        >
            {title ? <title id={titleId}>{title}</title> : null}
            <g opacity={iconOpacity}>
                <path
                    d="M36.4155 33.8291L45.243 39.937"
                    stroke={iconColor}
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                />
                <path
                    d="M21.3307 10.456C18.4745 10.9443 15.8272 12.2686 13.7236 14.2614C11.62 16.2542 10.1546 18.8261 9.51271 21.6517C8.87079 24.4774 9.08119 27.43 10.1173 30.1361C11.1534 32.8421 12.9687 35.1802 15.3337 36.8546C17.6986 38.529 20.5069 39.4645 23.4035 39.5428C26.3001 39.6211 29.1549 38.8388 31.6068 37.2946C34.0588 35.7505 35.9978 33.5139 37.1786 30.8678C38.3595 28.2217 38.7291 25.2848 38.2408 22.4286C37.5859 18.5986 35.4364 15.1857 32.2652 12.9404C29.094 10.6952 25.1608 9.80152 21.3307 10.456Z"
                    stroke={iconColor}
                    strokeWidth="2"
                    strokeMiterlimit="10"
                />
            </g>
        </svg>
    )
}
