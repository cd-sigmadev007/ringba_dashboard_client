import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const NotConvertedIcon: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <circle cx="12" cy="12" r="10" fill="#A1A5B7" />
        <circle
            cx="12"
            cy="12"
            r="7.5"
            fill="none"
            stroke="white"
            strokeWidth="0.2"
        />
        <line
            x1="7.5"
            y1="12"
            x2="16.5"
            y2="12"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
)

export default NotConvertedIcon
