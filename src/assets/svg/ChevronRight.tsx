import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const ChevronRight: React.FC<
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
            d="M12.8358 12L10.3608 9.52499L11.0678 8.81799L14.2498 12L11.0678 15.182L10.3608 14.475L12.8358 12Z"
            fill="#EBEBEB"
        />
    </svg>
)
