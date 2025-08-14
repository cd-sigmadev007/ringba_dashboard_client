import React from 'react';
import { useThemeStore } from '../../store/themeStore';
import clsx from 'clsx';

interface SVGRProps {
  title?: string;
  titleId?: string;
  className?: string;
}

export const CopyIcon: React.FC<React.SVGProps<SVGSVGElement> & SVGRProps> = ({
  title,
  titleId,
  className,
  ...props
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="15"
      viewBox="0 0 13 15"
      fill="none"
      className={clsx(
        'transition-all duration-200 cursor-pointer',
        isDark ? 'text-[#F5F8FA]' : 'text-[#5E6278]',
        className
      )}
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M4.58824 11.7C4.16765 11.7 3.80773 11.563 3.50847 11.2891C3.20871 11.0147 3.05882 10.685 3.05882 10.3V1.9C3.05882 1.515 3.20871 1.1853 3.50847 0.9109C3.80773 0.636967 4.16765 0.5 4.58824 0.5H11.4706C11.8912 0.5 12.2514 0.636967 12.5511 0.9109C12.8504 1.1853 13 1.515 13 1.9V10.3C13 10.685 12.8504 11.0147 12.5511 11.2891C12.2514 11.563 11.8912 11.7 11.4706 11.7H4.58824ZM4.58824 10.3H11.4706V1.9H4.58824V10.3ZM1.52941 14.5C1.10882 14.5 0.748647 14.363 0.448882 14.0891C0.149627 13.8147 0 13.485 0 13.1V4C0 3.80167 0.0734118 3.6353 0.220235 3.5009C0.366549 3.36697 0.548039 3.3 0.764706 3.3C0.981373 3.3 1.16312 3.36697 1.30994 3.5009C1.45625 3.6353 1.52941 3.80167 1.52941 4V13.1H9.17647C9.39314 13.1 9.57488 13.1672 9.72171 13.3016C9.86802 13.4355 9.94118 13.6017 9.94118 13.8C9.94118 13.9983 9.86802 14.1645 9.72171 14.2984C9.57488 14.4328 9.39314 14.5 9.17647 14.5H1.52941Z"
        fill="currentColor"
        className="transition-colors duration-200"
      />
    </svg>
  );
};

export default CopyIcon;
