import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const WarningIcon: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="16"
        viewBox="0 0 18 16"
        fill="none"
        className={`transition-all duration-200 ${className}`}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <path
            d="M9.00021 6.58558V9.41216M1.73789 11.9568C1.06185 13.0875 1.90729 14.5 3.25858 14.5H14.7418C16.0924 14.5 16.9378 13.0875 16.2625 11.9568L10.5217 2.34797C9.84565 1.21734 8.15478 1.21734 7.47874 2.34797L1.73789 11.9568ZM9.00021 11.6734H9.00568V11.6795H9.00021V11.6734Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export default WarningIcon
