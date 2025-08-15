import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement> & SVGRProps> = ({
    title,
    titleId,
    className,
    ...props
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="13"
        viewBox="0 0 12 13"
        fill="none"
        className={`transition-all duration-200 ${className}`}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <path
            d="M2.5 1.5L11 6.5L2.5 11.5V1.5Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinejoin="round"
        />
    </svg>
)

export default PlayIcon
