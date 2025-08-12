import React from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
  className?: string;
}

export const LinkedInIcon: React.FC<React.SVGProps<SVGSVGElement> & SVGRProps> = ({
  title,
  titleId,
  className,
  ...props
}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g clipPath="url(#clip0_529_107969)">
      <path
        d="M17.4794 1.19537H1.6225C0.756053 1.19537 -0.000976562 1.81881 -0.000976562 2.67508V18.5672C-0.000976562 19.4282 0.756053 20.1954 1.6225 20.1954H17.4748C18.3459 20.1954 18.999 19.4231 18.999 18.5672V2.67508C19.0041 1.81881 18.3459 1.19537 17.4794 1.19537ZM5.88859 17.0328H3.16667V8.56975H5.88859V17.0328ZM4.62178 7.28301H4.60227C3.73116 7.28301 3.1671 6.63455 3.1671 5.82281C3.1671 4.99622 3.746 4.36303 4.63663 4.36303C5.52725 4.36303 6.07223 4.99156 6.09174 5.82281C6.09131 6.63455 5.52725 7.28301 4.62178 7.28301ZM15.8364 17.0328H13.1145V12.4054C13.1145 11.2968 12.7184 10.5393 11.7336 10.5393C10.9813 10.5393 10.5359 11.0482 10.3379 11.544C10.2637 11.7221 10.2437 11.9647 10.2437 12.2124V17.0328H7.52182V8.56975H10.2437V9.74749C10.6399 9.18343 11.2586 8.37169 12.6985 8.37169C14.4852 8.37169 15.8369 9.54944 15.8369 12.0886L15.8364 17.0328Z"
        className={'footer-icon'}
      />
    </g>
    <defs>
      <clipPath id="clip0_529_107969">
        <rect
          width="20"
          height="20"
          fill="white"
          transform="translate(-0.000976562 0.542297)"
        />
      </clipPath>
    </defs>
  </svg>
);
