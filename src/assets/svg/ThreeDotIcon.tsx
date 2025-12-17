/**
 * Three Dot Icon (More Options Menu)
 * Based on Figma design: menu-dots-16, size 22px
 */

import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

const ThreeDotIcon: React.FC<React.SVGProps<SVGSVGElement> & SVGRProps> = ({
    title,
    titleId,
    className,
    ...props
}) => (
    <svg
        width="22"
        height="22"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <circle cx="8" cy="3" r="1.5" fill="currentColor" />
        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
        <circle cx="8" cy="13" r="1.5" fill="currentColor" />
    </svg>
)

export default ThreeDotIcon
export { ThreeDotIcon }
