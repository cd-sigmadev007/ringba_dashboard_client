/**
 * Input component with TypeScript support and modern design patterns
 */

import React, { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { useThemeStore } from '../../store/themeStore'
import type { VariantProps } from 'class-variance-authority'
import type { InputHTMLAttributes } from 'react'

// Input variants using class-variance-authority
const inputVariants = cva(
    // Base styles
    'rounded-[7px] w-full px-[15px] py-[10px] placeholder:text-[#A1A5B7] focus:outline-0 border border-transparent focus:border-[#007FFF] transition-all duration-100 ease-in bg-[#FFF] text-[#3F4254] disabled:opacity-40 disabled:cursor-not-allowed',
    {
        variants: {
            variant: {
                default: '',
                error: 'border-[#F64E60] focus:border-[#F64E60]',
                success: 'border-green-500 focus:border-green-500',
            },
            inputSize: {
                sm: 'h-8 px-2 text-xs',
                md: 'h-10 px-3 text-sm',
                lg: 'h-12 px-4 text-base',
            },
        },
        defaultVariants: {
            variant: 'default',
            inputSize: 'md',
        },
    }
)

export interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
        VariantProps<typeof inputVariants> {
    /**
     * Error message to display below the input
     */
    error?: string
    /**
     * Success message to display below the input
     */
    success?: string
    /**
     * Helper text to display below the input
     */
    helperText?: string
    /**
     * Label for the input
     */
    label?: string
    /**
     * Icon to display before the input
     */
    leftIcon?: React.ReactNode
    /**
     * Icon to display after the input
     */
    rightIcon?: React.ReactNode
    /**
     * Whether to show/hide the shadow
     */
    shadow?: boolean
    /**
     * Container className for styling the wrapper
     */
    containerClassName?: string
}

/**
 * Input component with multiple variants and sizes
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   error="Please enter a valid email"
 * />
 *
 * <Input
 *   variant="success"
 *   leftIcon={<SearchIcon />}
 *   placeholder="Search..."
 * />
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            containerClassName,
            variant,
            inputSize,
            type = 'text',
            error,
            success,
            helperText,
            label,
            leftIcon,
            rightIcon,
            shadow = true,
            ...props
        },
        ref
    ) => {
        const inputVariant = error ? 'error' : success ? 'success' : variant
        const { theme } = useThemeStore()
        const isDark = theme === 'dark'

        return (
            <div className={cn('w-full', containerClassName)}>
                {label && (
                    <label className="block text-sm font-medium text-foreground mb-2">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        type={type}
                        className={cn(
                            inputVariants({ variant: inputVariant, inputSize }),
                            // Dark mode styles - ensure proper contrast
                            !className?.includes('bg-[') && isDark
                                ? 'bg-[#002B57] focus:bg-[#001E3C] text-[#F5F8FA] placeholder:text-[#A1A5B7]'
                                : '',
                            // Light mode - ensure proper contrast and border
                            !className?.includes('bg-[') && !isDark
                                ? 'bg-white text-[#3F4254] border-[#ECECEC] focus:border-[#007FFF]'
                                : '',
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            !shadow && 'shadow-none',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {/* Message display */}
                {(error || success || helperText) && (
                    <div className="mt-2 flex items-center gap-2">
                        {error && (
                            <>
                                <svg
                                    className="h-[15px] w-[15px] flex-shrink-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    aria-hidden
                                >
                                    <path
                                        d="M10 2.03125C8.42393 2.03125 6.88326 2.49861 5.5728 3.37423C4.26235 4.24984 3.24097 5.49439 2.63784 6.95049C2.0347 8.40659 1.87689 10.0088 2.18437 11.5546C2.49185 13.1004 3.2508 14.5203 4.36525 15.6348C5.4797 16.7492 6.89959 17.5082 8.44538 17.8156C9.99116 18.1231 11.5934 17.9653 13.0495 17.3622C14.5056 16.759 15.7502 15.7377 16.6258 14.4272C17.5014 13.1167 17.9688 11.5761 17.9688 10C17.9646 7.88783 17.1237 5.86334 15.6302 4.3698C14.1367 2.87627 12.1122 2.03538 10 2.03125ZM10 17.0312C8.60935 17.0312 7.24993 16.6189 6.09365 15.8463C4.93737 15.0737 4.03615 13.9755 3.50398 12.6907C2.9718 11.406 2.83255 9.9922 3.10386 8.62827C3.37516 7.26434 4.04482 6.01149 5.02816 5.02816C6.0115 4.04482 7.26435 3.37516 8.62827 3.10385C9.9922 2.83255 11.406 2.97179 12.6907 3.50397C13.9755 4.03615 15.0737 4.93736 15.8463 6.09365C16.6189 7.24993 17.0313 8.60935 17.0313 10C17.0292 11.8642 16.2877 13.6514 14.9696 14.9696C13.6514 16.2877 11.8642 17.0292 10 17.0312ZM9.53125 10.625V6.25C9.53125 6.12568 9.58064 6.00645 9.66855 5.91854C9.75646 5.83064 9.87568 5.78125 10 5.78125C10.1243 5.78125 10.2436 5.83064 10.3315 5.91854C10.4194 6.00645 10.4688 6.12568 10.4688 6.25V10.625C10.4688 10.7493 10.4194 10.8685 10.3315 10.9565C10.2436 11.0444 10.1243 11.0938 10 11.0938C9.87568 11.0938 9.75646 11.0444 9.66855 10.9565C9.58064 10.8685 9.53125 10.7493 9.53125 10.625ZM10.7813 13.4375C10.7813 13.592 10.7354 13.7431 10.6496 13.8715C10.5637 14 10.4417 14.1002 10.299 14.1593C10.1562 14.2184 9.99914 14.2339 9.84759 14.2037C9.69604 14.1736 9.55684 14.0992 9.44758 13.9899C9.33832 13.8807 9.26391 13.7415 9.23377 13.5899C9.20362 13.4384 9.21909 13.2813 9.27822 13.1385C9.33735 12.9958 9.43749 12.8738 9.56596 12.7879C9.69444 12.7021 9.84549 12.6562 10 12.6562C10.2072 12.6562 10.4059 12.7386 10.5524 12.8851C10.6989 13.0316 10.7813 13.2303 10.7813 13.4375Z"
                                        fill="#F64E60"
                                    />
                                </svg>
                                <p
                                    className="text-sm"
                                    style={{ color: '#F64E60' }}
                                >
                                    {error}
                                </p>
                            </>
                        )}

                        {success && !error && (
                            <>
                                <svg
                                    className="h-4 w-4 text-green-500 flex-shrink-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="text-sm text-green-500">
                                    {success}
                                </p>
                            </>
                        )}

                        {helperText && !error && !success && (
                            <p className="text-sm text-muted-foreground">
                                {helperText}
                            </p>
                        )}
                    </div>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input, inputVariants }
