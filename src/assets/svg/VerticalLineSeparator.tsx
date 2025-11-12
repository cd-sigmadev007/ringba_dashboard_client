import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const VerticalLineSeparator: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => (
    <svg
        width="1"
        height="20"
        viewBox="0 0 1 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <line
            x1="0.5"
            y1="0"
            x2="0.5"
            y2="20"
            stroke="#A1A5B7"
            strokeWidth="1"
        />
    </svg>
)

export default VerticalLineSeparator

