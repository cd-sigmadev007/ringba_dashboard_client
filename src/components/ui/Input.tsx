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
                            // Only apply dark mode styles if customBg is not provided
                            !className?.includes('bg-[') && isDark
                                ? 'bg-[#002B57] focus:bg-[#001E3C] text-white'
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
                    <div className="mt-2 flex items-start gap-2">
                        {error && (
                            <>
                                <svg
                                    className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="text-sm text-destructive">
                                    {error}
                                </p>
                            </>
                        )}

                        {success && !error && (
                            <>
                                <svg
                                    className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0"
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
