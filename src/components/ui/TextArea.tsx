import React from 'react'
import clsx from 'clsx'
import type { TextareaHTMLAttributes } from 'react'
import { useThemeStore } from '@/store/themeStore'

export interface TextAreaProps
    extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
    label?: string
    /** Remove focus ring border color/background shadow like Input.shadow */
    shadow?: boolean
    /** Optional fixed width class, e.g. w-[440px] */
    widthClassName?: string
    /** Optional error message to display below the field */
    error?: string
}

/**
 * TextArea – matches the visual language of our Input component.
 * - Supports label, dark/light theme tokens
 * - Respects shadow toggle and arbitrary width via widthClassName
 */
export const TextArea: React.FC<TextAreaProps> = ({
    className,
    label,
    placeholder,
    rows = 5,
    shadow = true,
    widthClassName = 'w-full',
    error,
    ...rest
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <div className={clsx('flex flex-col', widthClassName)}>
            {label ? (
                <label className="block text-sm font-medium mb-1">
                    {label}
                </label>
            ) : null}
            <textarea
                rows={rows}
                placeholder={placeholder}
                className={clsx(
                    // base sizing and radius matches Input
                    'w-full px-[15px] py-[10px] rounded-[7px] text-[14px] resize-vertical outline-none border transition-all duration-100 ease-in',
                    // base + focus colors mirror Input with proper contrast
                    isDark
                        ? 'bg-[#002B57] focus:bg-[#001E3C] text-[#F5F8FA] placeholder:text-[#A1A5B7] border-transparent'
                        : 'bg-white focus:bg-white text-[#3F4254] placeholder:text-[#A1A5B7] border-[#ECECEC]',
                    // focus ring color
                    'focus:border-[#007FFF]',
                    // error state - match Input component
                    error && 'border-[#F64E60] focus:border-[#F64E60]',
                    // optional shadow behavior
                    !shadow && 'shadow-none',
                    className
                )}
                {...rest}
            />
            {/* Error message - match Input component format */}
            {error && (
                <div className="mt-2 flex items-start gap-2">
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
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}
        </div>
    )
}

export default TextArea
