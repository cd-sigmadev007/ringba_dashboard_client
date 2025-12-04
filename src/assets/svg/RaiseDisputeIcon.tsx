import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const RaiseDisputeIcon: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => (
    <svg
        width="19"
        height="20"
        viewBox="0 0 19 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <path
            d="M9.50021 8.08558V10.9122M2.23789 13.4568C1.56185 14.5875 2.40729 16 3.75858 16H15.2418C16.5924 16 17.4378 14.5875 16.7625 13.4568L11.0217 3.84797C10.3457 2.71734 8.65478 2.71734 7.97874 3.84797L2.23789 13.4568ZM9.50021 13.1734H9.50568V13.1795H9.50021V13.1734Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export default RaiseDisputeIcon
