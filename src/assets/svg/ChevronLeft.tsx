import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const ChevronLeft: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => (
    <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <path
            d="M11.664 12L14.139 14.475L13.432 15.182L10.25 12L13.432 8.81799L14.139 9.52499L11.664 12Z"
            fill="#EBEBEB"
        />
    </svg>
)
