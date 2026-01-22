import React from 'react'

interface SuccessCheckIconProps extends React.SVGProps<SVGSVGElement> {
    className?: string
}

/** Green checkmark for success screens (Check Your Email, Password Changed, Device registration successful) */
export const SuccessCheckIcon: React.FC<SuccessCheckIconProps> = ({
    className,
    ...props
}) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
        />
    </svg>
)

export default SuccessCheckIcon
