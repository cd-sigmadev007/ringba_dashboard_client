import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const ChevronDownLight: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => (
    <svg
        width="11"
        height="7"
        viewBox="0 0 11 7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <path
            d="M1.16602 1.375L5.49935 5.70833L9.83268 1.375"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)
