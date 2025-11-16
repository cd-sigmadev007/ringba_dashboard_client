import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const AddIcon: React.FC<React.SVGProps<SVGSVGElement> & SVGRProps> = ({
    title,
    titleId,
    className,
    ...props
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className={className}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <path
            d="M9.99935 15.8332C9.53911 15.8332 9.16602 15.4601 9.16602 14.9998V10.8332H4.99935C4.53911 10.8332 4.16602 10.4601 4.16602 9.99984C4.16602 9.5396 4.53911 9.1665 4.99935 9.1665H9.16602V4.99984C9.16602 4.5396 9.53911 4.1665 9.99935 4.1665C10.4596 4.1665 10.8327 4.5396 10.8327 4.99984V9.1665H14.9993C15.4596 9.1665 15.8327 9.5396 15.8327 9.99984C15.8327 10.4601 15.4596 10.8332 14.9993 10.8332H10.8327V14.9998C10.8327 15.4601 10.4596 15.8332 9.99935 15.8332Z"
            fill="currentColor"
        />
    </svg>
)

export default AddIcon
