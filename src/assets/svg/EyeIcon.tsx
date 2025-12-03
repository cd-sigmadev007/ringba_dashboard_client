import React from 'react'

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
}) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <path
            d="M10 3C5 3 1.73 7.11 1 10C1.73 12.89 5 17 10 17C15 17 18.27 12.89 19 10C18.27 7.11 15 3 10 3ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15ZM10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z"
            fill="currentColor"
        />
    </svg>
)

export default EyeIcon
