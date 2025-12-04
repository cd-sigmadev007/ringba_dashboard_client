import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const BillingIcon: React.FC<React.SVGProps<SVGSVGElement> & SVGRProps> = ({
    title,
    titleId,
    className,
    ...props
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        className={className}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <path
            d="M2.75 4.125C2.75 3.50368 3.25368 3 3.875 3H18.125C18.7463 3 19.25 3.50368 19.25 4.125V17.875C19.25 18.4963 18.7463 19 18.125 19H3.875C3.25368 19 2.75 18.4963 2.75 17.875V4.125ZM4.125 4.125V17.875H18.125V4.125H4.125ZM6.875 7.33333H15.125V8.58333H6.875V7.33333ZM6.875 10.5417H15.125V11.7917H6.875V10.5417ZM6.875 13.75H12.375V15H6.875V13.75Z"
            fill="currentColor"
        />
    </svg>
)

export default BillingIcon

