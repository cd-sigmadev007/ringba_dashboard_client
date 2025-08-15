import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const SearchIcon: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        className={className}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <path
            d="M17.2059 16.4688L20.374 19.6362C20.7203 19.9824 20.7203 20.5437 20.3741 20.8899C20.0279 21.2362 19.4665 21.2361 19.1203 20.8899L15.9529 17.7217C14.5412 18.8535 12.7852 19.469 10.9758 19.4664C6.57369 19.4664 3.00098 15.8937 3.00098 11.4916C3.00098 7.08955 6.57369 3.51685 10.9758 3.51685C15.3779 3.51685 18.9506 7.08955 18.9506 11.4916C18.9531 13.301 18.3376 15.057 17.2059 16.4688ZM15.4284 15.8113C16.5529 14.6549 17.1809 13.1047 17.1784 11.4916C17.1784 8.06514 14.4023 5.28902 10.9758 5.28902C7.54927 5.28902 4.77315 8.06514 4.77315 11.4916C4.77315 14.9181 7.54927 17.6943 10.9758 17.6943C12.5888 17.6968 14.139 17.0688 15.2955 15.9442L15.4284 15.8113Z"
            className="btn-aside"
        />
    </svg>
)
