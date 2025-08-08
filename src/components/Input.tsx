import React from 'react';
import clsx from 'clsx';
import { useThemeStore } from '../store/themeStore';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  isCheckbox?: boolean;
  shadow?: boolean;
  register?: any;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  error,
  type = 'text',
  className,
  disabled = false,
  isCheckbox = false,
  shadow = true,
  register = () => {},
  name = '',
  required = false,
  ...props
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div
      className={clsx(
        isDark ? 'theme-dark' : 'theme-light',
        !isCheckbox && 'w-full',
        'rounded-[7px]',
        !shadow && 'shadow-none'
      )}
    >
      <input
        className={clsx(
          'rounded-[7px] w-full px-[15px] py-[10px] placeholder:text-[#A1A5B7] focus:outline-0 border border-transparent focus:border-[#007FFF] transition-all duration-100 ease-in',
          error && '!border-[#F64E60]',
          !isDark && 'bg-[#EFF2F5] focus:bg-[#FFFFFF] text-[#3F4254]',
          isDark ? 'bg-[#002B57] focus:bg-[#001E3C] text-white' : '',
          className,
          disabled && 'opacity-40 cursor-not-allowed',
          type === 'number' && 'text-right appearance-none',
          type === 'checkbox' &&
            '!w-[16px] !h-[16px] cursor-pointer rounded-[3px] border-[1px] border-[#A1A5B7] focus:outline-0 accent-[#0069ff] checked:bg-[#F5F8FA] checked:text-[#3F4254]'
        )}
        disabled={disabled}
        type={type}
        name={name}
        required={required}
        {...(register && register(name, { required: required }))}
        {...props}
      />
      {error && (
        <p className="text-[#F64E60] ml-1px flex text-left text-[14px] items-start mt-1.5 gap-2.5 leading-5 justify-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
          >
            <path
              d="M10.5 2.03125C8.92393 2.03125 7.38326 2.49861 6.0728 3.37423C4.76235 4.24984 3.74097 5.49439 3.13784 6.95049C2.5347 8.40659 2.37689 10.0088 2.68437 11.5546C2.99185 13.1004 3.7508 14.5203 4.86525 15.6348C5.9797 16.7492 7.39959 17.5082 8.94538 17.8156C10.4912 18.1231 12.0934 17.9653 13.5495 17.3622C15.0056 16.759 16.2502 15.7377 17.1258 14.4272C18.0014 13.1167 18.4688 11.5761 18.4688 10C18.4646 7.88783 17.6237 5.86334 16.1302 4.3698C14.6367 2.87627 12.6122 2.03538 10.5 2.03125ZM10.5 17.0312C9.10935 17.0312 7.74993 16.6189 6.59365 15.8463C5.43737 15.0737 4.53615 13.9755 4.00398 12.6907C3.4718 11.406 3.33255 9.9922 3.60386 8.62827C3.87516 7.26434 4.54482 6.01149 5.52816 5.02816C6.5115 4.04482 7.76435 3.37516 9.12827 3.10385C10.4922 2.83255 11.906 2.97179 13.1907 3.50397C14.4755 4.03615 15.5737 4.93736 16.3463 6.09365C17.1189 7.24993 17.5313 8.60935 17.5313 10C17.5292 11.8642 16.7877 13.6514 15.4696 14.9696C14.1514 16.2877 12.3642 17.0292 10.5 17.0312ZM10.0313 10.625V6.25C10.0313 6.12568 10.0806 6.00645 10.1685 5.91854C10.2565 5.83064 10.3757 5.78125 10.5 5.78125C10.6243 5.78125 10.7436 5.83064 10.8315 5.91854C10.9194 6.00645 10.9688 6.12568 10.9688 6.25V10.625C10.9688 10.7493 10.9194 10.8685 10.8315 10.9565C10.7436 11.0444 10.6243 11.0938 10.5 11.0938C10.3757 11.0938 10.2565 11.0444 10.1685 10.9565C10.0806 10.8685 10.0313 10.7493 10.0313 10.625ZM11.2813 13.4375C11.2813 13.592 11.2354 13.7431 11.1496 13.8715C11.0637 14 10.9417 14.1002 10.799 14.1593C10.6562 14.2184 10.4991 14.2339 10.3476 14.2037C10.196 14.1736 10.0568 14.0992 9.94758 13.9899C9.83832 13.8807 9.76391 13.7415 9.73377 13.5899C9.70362 13.4384 9.71909 13.2813 9.77822 13.1385C9.83735 12.9958 9.93749 12.8738 10.066 12.7879C10.1944 12.7021 10.3455 12.6562 10.5 12.6562C10.7072 12.6562 10.9059 12.7386 11.0524 12.8851C11.1989 13.0316 11.2813 13.2303 11.2813 13.4375Z"
              fill="#F64E60"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
