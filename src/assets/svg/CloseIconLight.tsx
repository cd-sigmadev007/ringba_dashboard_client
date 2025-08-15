import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const CloseIconLight: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => (
    <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <path
            d="M6.75879 18.1242L12.0018 12.8812L17.2448 18.1242M17.2448 7.63818L12.0008 12.8812L6.75879 7.63818"
            stroke="#3F4254"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)
