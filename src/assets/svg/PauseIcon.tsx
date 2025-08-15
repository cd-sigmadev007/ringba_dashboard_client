import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const PauseIcon: React.FC<React.SVGProps<SVGSVGElement> & SVGRProps> = ({
    title,
    titleId,
    className,
    ...props
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="13"
        viewBox="0 0 12 13"
        fill="none"
        className={`transition-all duration-200 ${className}`}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <path
            d="M9 12.5C8.732 12.5 8.49833 12.4003 8.299 12.201C8.09967 12.0017 8 11.768 8 11.5V1.5C8 1.232 8.09967 0.998333 8.299 0.799C8.49833 0.599666 8.732 0.5 9 0.5H10.5C10.768 0.5 11.0017 0.599666 11.201 0.799C11.4003 0.998333 11.5 1.232 11.5 1.5V11.5C11.5 11.768 11.4003 12.0017 11.201 12.201C11.0017 12.4003 10.768 12.5 10.5 12.5H9ZM1.5 12.5C1.232 12.5 0.998333 12.4003 0.799 12.201C0.599666 12.0017 0.5 11.768 0.5 11.5V1.5C0.5 1.232 0.599666 0.998333 0.799 0.799C0.998333 0.599666 1.232 0.5 1.5 0.5H3C3.268 0.5 3.50167 0.599666 3.701 0.799C3.90033 0.998333 4 1.232 4 1.5V11.5C4 11.768 3.90033 12.0017 3.701 12.201C3.50167 12.4003 3.268 12.5 3 12.5H1.5Z"
            fill="currentColor"
        />
    </svg>
)

export default PauseIcon
