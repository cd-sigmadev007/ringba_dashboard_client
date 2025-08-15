import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const TwitterIcon: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 1200 1227"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <path
            className="footer-icon"
            d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
            fill="#ECECEC"
        />
        <defs>
            <clipPath id="clip0_529_107961">
                <rect
                    width="20"
                    height="20"
                    className={'footer-icon'}
                    transform="translate(-0.000976562 0.542297)"
                />
            </clipPath>
        </defs>
    </svg>
)
