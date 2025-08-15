import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cva } from 'class-variance-authority'
import type { FC, ReactNode } from 'react'
import type { VariantProps } from 'class-variance-authority'

import { cn, useIsMobile } from '@/lib'
import { useClickOutside } from '@/lib/hooks/useClickOutside'
import CrossIcon from '@/assets/svg/CrossIcon'

// Overlay container variants
const modalVariants = cva('fixed inset-0 z-[9999] flex', {
    variants: {
        overlay: {
            default: 'bg-black/70',
            blur: 'bg-black/70 backdrop-blur-sm',
            dark: 'bg-black/70',
        },
        position: {
            center: 'items-center justify-center',
            top: 'items-start justify-center',
            bottom: 'items-end justify-center',
            left: 'items-center justify-start',
            right: 'items-center justify-end',
        },
    },
    defaultVariants: {
        overlay: 'default',
        position: 'center',
    },
})

// Modal content variants
const modalContentVariants = cva(
    'relative bg-[#071B2F] border-0 shadow-lg pointer-events-auto',
    {
        variants: {
            size: {
                sm: 'max-w-sm',
                md: 'max-w-lg',
                lg: 'max-w-2xl',
                xl: 'max-w-4xl',
                full: 'w-full h-full',
            },
            position: {
                center: 'rounded-[10px] m-4',
                top: 'rounded-b-[10px] max-w-full',
                bottom: 'rounded-t-[10px] max-w-full',
                left: 'rounded-r-[10px] h-full',
                right: 'rounded-l-[10px] h-full',
            },
            animation: {
                scale: 'animate-in zoom-in-95 duration-300',
                fade: 'animate-in fade-in duration-300',
                slide: '',
            },
        },
        compoundVariants: [
            {
                animation: 'slide',
                position: 'bottom',
                class: 'animate-in slide-in-from-bottom-4 duration-300',
            },
            {
                animation: 'slide',
                position: 'top',
                class: 'animate-in slide-in-from-top-4 duration-300',
            },
            {
                animation: 'slide',
                position: 'left',
                class: 'animate-in slide-in-from-left-4 duration-300',
            },
            {
                animation: 'slide',
                position: 'right',
                class: 'animate-in slide-in-from-right-4 duration-300',
            },
        ],
        defaultVariants: {
            size: 'md',
            position: 'center',
            animation: 'scale',
        },
    }
)

export interface ModalProps
    extends VariantProps<typeof modalVariants>,
        VariantProps<typeof modalContentVariants> {
    open: boolean
    onClose: () => void
    children: ReactNode
    title?: ReactNode
    showCloseButton?: boolean
    showSeparator?: boolean
    className?: string
    overlayClassName?: string
    container?: Element
    border?: boolean
}

export const Modal: FC<ModalProps> = ({
    open,
    onClose,
    children,
    title,
    showCloseButton = true,
    showSeparator = false,
    overlay,
    position,
    size,
    animation,
    className,
    overlayClassName,
    container,
    border = false,
}) => {
    // Body scroll lock
    const isMobile = useIsMobile()

    // Click outside handler
    const modalRef = useClickOutside<HTMLDivElement>(() => {
        onClose()
    })

    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [open])

    if (!open) return null

    const modalContent = (
        <div
            className={cn(
                modalVariants({ overlay, position }),
                overlayClassName
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            onClick={(e) => {
                // Stop propagation to prevent event bubbling
                e.stopPropagation()
            }}
        >
            <div
                ref={modalRef}
                className={cn(
                    modalContentVariants({ size, position, animation }),
                    className,
                    'pb-6'
                )}
                onClick={(e) => {
                    // Stop propagation to prevent the modal content from closing when clicked
                    e.stopPropagation()
                }}
            >
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between px-6 pt-6 pb-4 rounded-t-[10px] sticky top-0 bg-[#071B2F] z-10">
                        {title && (
                            <h2
                                id="modal-title"
                                className={cn(
                                    'text-[24px] font-semibold text-[#F5F8FA]',
                                    isMobile && 'text-[20px]'
                                )}
                            >
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onClose()
                                }}
                                className="hover:bg-[#1B456F]/20 rounded-[20px] transition-colors"
                                aria-label="Close modal"
                            >
                                <CrossIcon className="w-[30px] h-[30px]" />
                            </button>
                        )}
                    </div>
                )}

                {showSeparator && <div className="mx-6 h-px bg-[#A1A5B7]" />}

                <div
                    className={cn(
                        'mx-6 overflow-y-auto custom-scroll border border-[#1B456F] rounded-[7px] bg-transparent',
                        !border && 'border-none',
                        'max-h-full pr-2'
                    )}
                    onClick={(e) => {
                        // Stop propagation to prevent the content area from closing when clicked
                        e.stopPropagation()
                    }}
                >
                    <div className="text-[#F5F8FA]">{children}</div>
                </div>
            </div>
        </div>
    )

    return createPortal(modalContent, container || document.body)
}
