import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
    checked?: boolean
    isDark?: boolean
}

export const CheckboxIcon: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({
    title,
    titleId,
    className,
    checked = false,
    isDark = false,
    ...props
}) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        {checked ? (
            <>
                <rect
                    x="2.5"
                    y="2.5"
                    width="15"
                    height="15"
                    rx="2.5"
                    fill={isDark ? '#F5F8FA' : '#007FFF'}
                />
                <path
                    d="M14.4375 7.1875L8.75 12.875L5.5625 9.6875"
                    stroke={isDark ? '#001E3C' : 'white'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </>
        ) : (
            <rect
                x="2.5"
                y="2.5"
                width="15"
                height="15"
                rx="2.5"
                stroke={isDark ? '#F5F8FA' : '#A1A5B7'}
                strokeWidth="1"
                fill="none"
            />
        )}
    </svg>
)
