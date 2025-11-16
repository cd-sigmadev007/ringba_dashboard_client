import React from 'react'

interface SVGRProps {
    title?: string
    titleId?: string
    className?: string
}

export const EditIcon: React.FC<React.SVGProps<SVGSVGElement> & SVGRProps> = ({
    title,
    titleId,
    className,
    ...props
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 19 19"
        fill="none"
        className={className}
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <path
            d="M3.95833 15.0417H5.08646L12.825 7.30313L11.6969 6.175L3.95833 13.9135V15.0417ZM2.375 16.625V13.2604L12.825 2.83021C12.9833 2.68507 13.1583 2.57292 13.3499 2.49375C13.5415 2.41458 13.7425 2.375 13.9531 2.375C14.1637 2.375 14.3682 2.41458 14.5667 2.49375C14.7651 2.57292 14.9366 2.69167 15.0812 2.85L16.1698 3.95833C16.3281 4.10347 16.4437 4.275 16.5165 4.47292C16.5894 4.67083 16.6255 4.86875 16.625 5.06667C16.625 5.27778 16.5888 5.47913 16.5165 5.67071C16.4442 5.86229 16.3287 6.03699 16.1698 6.19479L5.73958 16.625H2.375ZM12.251 6.74896L11.6969 6.175L12.825 7.30313L12.251 6.74896Z"
            fill="currentColor"
        />
    </svg>
)

export default EditIcon
