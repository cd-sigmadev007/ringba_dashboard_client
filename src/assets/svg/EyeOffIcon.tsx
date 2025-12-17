import React from 'react'
import clsx from 'clsx'
import { useThemeStore } from '../../store/themeStore'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const EyeOffIcon: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <svg
            width="17"
            height="8"
            viewBox="0 0 17 8"
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
                d="M15.5996 0.599609C13.5996 2.59961 11.0996 3.59961 8.09961 3.59961C5.09961 3.59961 2.59961 2.59961 0.599609 0.599609M0.599609 5.09961L2.68294 2.24961M15.5996 5.08161L13.5229 2.24961M5.59961 6.59961L6.01628 3.59961M10.5996 6.59961L10.1829 3.59961"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default EyeOffIcon
