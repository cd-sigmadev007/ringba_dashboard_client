import React from 'react'
import { useThemeStore } from '@/store/themeStore'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const BuildingIcon: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const stroke = isDark ? '#F5F8FA' : '#3F4254'

    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-labelledby={titleId}
            {...props}
        >
            {title ? <title id={titleId}>{title}</title> : null}
            <path
                d="M13.75 20.1668H2.75V4.5835C2.75 2.30833 3.22483 1.8335 5.5 1.8335H11C13.2752 1.8335 13.75 2.30833 13.75 4.5835V20.1668ZM13.75 20.1668V7.3335H16.5C18.7752 7.3335 19.25 7.80833 19.25 10.0835V20.1668H13.75Z"
                stroke={stroke}
                strokeLinejoin="round"
            />
            <path
                d="M7.33203 5.5H9.16536M7.33203 8.25H9.16536M7.33203 11H9.16536"
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.5404 20.167V16.5003C10.5404 15.6359 10.5404 15.2042 10.2718 14.9356C10.0032 14.667 9.57145 14.667 8.70703 14.667H7.79036C6.92595 14.667 6.4942 14.667 6.22561 14.9356C5.95703 15.2042 5.95703 15.6359 5.95703 16.5003V20.167"
                stroke={stroke}
                strokeLinejoin="round"
            />
        </svg>
    )
}
