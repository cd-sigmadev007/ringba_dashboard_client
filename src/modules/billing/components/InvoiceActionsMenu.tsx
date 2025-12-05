/**
 * Invoice Actions Menu Component
 * Three-dot menu with Save Draft, Download PDF, Delete Invoice options
 */

import React, { useState } from 'react'
import clsx from 'clsx'
import { DeleteIcon, DownloadIcon, DraftIcon, ThreeDotIcon } from '@/assets/svg'
import { useClickOutside } from '@/lib'
import { useThemeStore } from '@/store/themeStore'
import Button from '@/components/ui/Button'

interface InvoiceActionsMenuProps {
    onSaveDraft: () => void
    onDownload: () => void
    onDelete: () => void
    disabled?: boolean
}

export const InvoiceActionsMenu: React.FC<InvoiceActionsMenuProps> = ({
    onSaveDraft,
    onDownload,
    onDelete,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const menuRef = useClickOutside<HTMLDivElement>(() => {
        if (isOpen) setIsOpen(false)
    })

    const menuItems = [
        {
            label: 'Save Draft',
            icon: <DraftIcon className="w-[20px] h-[20px]" />,
            onClick: () => {
                onSaveDraft()
                setIsOpen(false)
            },
        },
        {
            label: 'Download PDF',
            icon: <DownloadIcon className="w-[17px] h-[17px]" />,
            onClick: () => {
                onDownload()
                setIsOpen(false)
            },
        },
        {
            label: 'Delete Invoice',
            icon: <DeleteIcon className="w-[20px] h-[20px]" />,
            onClick: () => {
                onDelete()
                setIsOpen(false)
            },
        },
    ]

    return (
        <div ref={menuRef} className="relative">
            {/* Three-dot trigger button */}
            <Button
                variant="sec"
                onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(!isOpen)
                }}
                disabled={disabled}
                className={clsx(
                    'p-1 min-w-0 flex items-center justify-center',
                    isDark
                        ? 'border border-[#0254A5] hover:bg-[#0254A5]/20'
                        : 'border border-[#0254A5] hover:bg-[#0254A5]/10'
                )}
            >
                <ThreeDotIcon className="w-[22px] h-[22px]" />
            </Button>
            
            {/* Dropdown menu */}
            {isOpen && (
                <div
                    className={clsx(
                        'absolute right-0 top-[calc(100%+10px)] w-[189px] rounded-[7px] shadow-[0px_10px_35px_0px_rgba(0,0,0,0.04)] z-50',
                        isDark ? 'bg-[#002B57]' : 'bg-[#002B57]'
                    )}
                >
                    <div className="flex flex-col gap-[5px] p-[10px]">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={item.onClick}
                                className={clsx(
                                    'flex gap-[10px] items-center p-[10px] rounded-[7px] transition-colors w-full',
                                    index === 0
                                        ? 'bg-[#1B456F]'
                                        : 'bg-transparent hover:bg-[#1B456F]',
                                    'text-[#F5F8FA]'
                                )}
                            >
                                {item.icon}
                                <span className="text-[16px] font-medium font-[\'Poppins\',sans-serif]">
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
