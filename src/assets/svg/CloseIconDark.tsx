import React from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
  className?: string;
}

export const CloseIconDark: React.FC<React.SVGProps<SVGSVGElement> & SVGRProps> = ({
  title,
  titleId,
  className,
  ...props
}) => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M6.75879 17.6072L12.0018 12.3642L17.2448 17.6072M17.2448 7.12122L12.0008 12.3642L6.75879 7.12122"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
