import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const ConvertedIcon: React.FC<
    React.SVGProps<SVGSVGElement> & SVGRProps
> = ({ title, titleId, className, ...props }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <circle cx="12" cy="12" r="10" fill="#138A00" />
        <path
            d="M10.2905 12.6589L8.70474 11.0068C8.31476 10.6006 7.68247 10.6006 7.29249 11.0068C6.9025 11.4131 6.9025 12.0718 7.29249 12.4781L10.1574 15.4627C10.525 15.8458 11.1212 15.8458 11.4889 15.4627L16.7075 10.026C17.0975 9.6197 17.0975 8.96099 16.7075 8.55471C16.3176 8.14843 15.6852 8.14843 15.2953 8.55471L11.3557 12.6589C11.0616 12.9653 10.5846 12.9653 10.2905 12.6589Z"
            fill="#DAF8D5"
        />
    </svg>
)

export default ConvertedIcon
