import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const DownloadIcon: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => (
    <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <g clipPath="url(#clip0_4643_4408)">
            <path
                d="M2 15H15M8.5 1V11.5M8.5 11.5L12.2917 8.4375M8.5 11.5L4.70833 8.4375"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_4643_4408">
                <rect width="17" height="17" fill="white" />
            </clipPath>
        </defs>
    </svg>
)

export default DownloadIcon
