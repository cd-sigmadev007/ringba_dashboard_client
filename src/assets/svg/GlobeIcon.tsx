import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const GlobeIcon: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
    >
        <path
            d="M1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8Z"
            stroke="currentColor"
            stroke-linejoin="round"
        />
        <path
            d="M5 8C5 6.14348 5.31607 4.36301 5.87868 3.05025C6.44129 1.7375 7.20435 1 8 1C8.79565 1 9.55871 1.7375 10.1213 3.05025C10.6839 4.36301 11 6.14348 11 8C11 9.85652 10.6839 11.637 10.1213 12.9497C9.55871 14.2625 8.79565 15 8 15C7.20435 15 6.44129 14.2625 5.87868 12.9497C5.31607 11.637 5 9.85652 5 8Z"
            stroke="currentColor"
            stroke-linejoin="round"
        />
        <path
            d="M1.5 10.3337H14.5M1.5 5.66699H14.5"
            stroke="currentColor"
            stroke-linecap="round"
        />
    </svg>
)

export default GlobeIcon
