import clsx from 'clsx'
import { forwardRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useThemeStore } from '@/store/themeStore'

type ButtonVariant = 'primary' | 'ghost' | 'secondary' | 'default'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    className?: string
    children: ReactNode
    disabled?: boolean
    hasTooltip?: boolean
    tooltipText?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    variant = 'primary',
    className,
    children,
    disabled,
    hasTooltip = false,
    tooltipText = '',
    ...rest
}, ref) => {
    const [isVisible, setVisibility] = useState(false)
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const buttonTypes: Record<ButtonVariant, string> = {
        primary:
            'text-[#F5F8FA] bg-[#007FFF] hover:bg-[#0254A5] active:bg-[#0254A5] ' +
            (isDark
                ? 'disabled:!bg-[#132F4C] disabled:text-[#7E8299]'
                : 'disabled:!bg-[#E0E0E0] disabled:text-[#7E8299]'),
        ghost:
            'text-btn-ghost border border-[#1B456F] ' +
            (isDark ? 'hover:bg-[#0254A5]' : 'hover:bg-[#E0E0E0]'),
        secondary: 'bg-[#002B57] hover:bg-opacity-80 text-[#EFF2F5]',
        default: '',
    }

    return (
        <button
            ref={ref}
            className={twMerge(
                clsx(
                    buttonTypes[variant],
                    'py-[9px] px-[15px] rounded-[7px] relative transition-all duration-300 ease-in-out text-[14px] leading-5 cursor-pointer disabled:cursor-default disabled:opacity-50',
                    className
                )
            )}
            onMouseEnter={() => hasTooltip && setVisibility(true)}
            onMouseLeave={() => hasTooltip && setVisibility(false)}
            disabled={disabled}
            {...rest}
        >
            {isVisible && hasTooltip && (
                <div className="flex-row p-1.5 rounded-lg text-center text-sm absolute -top-12 -left-8 bg-[#5E6278] text-slate-50 z-50">
                    {tooltipText}
                </div>
            )}
            {children}
        </button>
    )
})

Button.displayName = 'Button'

export default Button
