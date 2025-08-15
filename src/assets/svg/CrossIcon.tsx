import React from 'react'

interface CrossIconProps {
    className?: string
}

const CrossIcon: React.FC<CrossIconProps> = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            className={className}
        >
            <path
                d="M6 14.5L10 10.5L14 14.5M14 6.5L9.99924 10.5L6 6.5"
                stroke="#F5F8FA"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    )
}

export default CrossIcon
