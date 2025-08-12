import React from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
  className?: string;
}

export const ChevronDownDark: React.FC<React.SVGProps<SVGSVGElement> & SVGRProps> = ({
  title,
  titleId,
  className,
  ...props
}) => (
  <svg
    width="13"
    height="14"
    viewBox="0 0 13 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M2.16602 5.375L6.49935 9.70833L10.8327 5.375"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
