/**
 * Checkbox component matching Figma design
 * Reusable checkbox with white background and black checkmark when checked
 */

import React from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
    /**
     * Whether the checkbox is checked
     */
    checked: boolean
    /**
     * Additional className for the checkbox container
     */
    className?: string
    /**
     * Size of the checkbox (default: 20px)
     */
    size?: number
}

/**
 * Checkbox component matching Figma design
 *
 * @example
 * ```tsx
 * <Checkbox checked={isSelected} />
 * <Checkbox checked={isSelected} size={24} />
 * ```
 */
export const Checkbox: React.FC<CheckboxProps> = ({
    checked,
    className,
    size = 14,
}) => {
    return (
        <div
            className={cn(
                'flex items-center justify-center shrink-0',
                'rounded-[2px] transition-all',
                checked ? 'bg-white' : 'bg-transparent border border-[#F5F8FA]',
                className
            )}
            style={{ width: size, height: size }}
        >
            {checked && (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="#001E3C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )}
        </div>
    )
}
