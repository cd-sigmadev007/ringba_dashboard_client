import React from 'react'
import clsx from 'clsx'
import { useThemeStore } from '../../store/themeStore'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const EyeIcon: React.FC<React.SVGProps<SVGSVGElement> & SVGRProps> = ({
    title,
    titleId,
    className,
    ...props
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <svg
            width="17"
            height="13"
            viewBox="0 0 17 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={clsx(
                'transition-all duration-200 cursor-pointer',
                isDark ? 'text-[#F5F8FA]' : 'text-[#5E6278]',
                className
            )}
            aria-labelledby={titleId}
            {...props}
        >
            {title ? <title id={titleId}>{title}</title> : null}
            <path
                d="M0.932751 7.09833C1.80858 8.6025 4.27692 12.1 8.28108 12.1C12.2919 12.1 14.7561 8.60083 15.6311 7.09833C15.7503 6.89409 15.8131 6.6618 15.8129 6.4253C15.8128 6.1888 15.7497 5.9566 15.6303 5.7525C14.7553 4.24917 12.2886 0.75 8.28108 0.75C4.27358 0.75 1.80775 4.2475 0.932751 5.75083C0.813079 5.9552 0.75 6.18776 0.75 6.42458C0.75 6.66141 0.813079 6.89397 0.932751 7.09833Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <path
                d="M8.28125 8.6123C8.86141 8.6123 9.41781 8.38184 9.82805 7.9716C10.2383 7.56136 10.4687 7.00497 10.4687 6.4248C10.4687 5.84464 10.2383 5.28824 9.82805 4.87801C9.41781 4.46777 8.86141 4.2373 8.28125 4.2373C7.70109 4.2373 7.14469 4.46777 6.73445 4.87801C6.32422 5.28824 6.09375 5.84464 6.09375 6.4248C6.09375 7.00497 6.32422 7.56136 6.73445 7.9716C7.14469 8.38184 7.70109 8.6123 8.28125 8.6123Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default EyeIcon
