/**
 * Invoice Actions Menu Component
 * Three-dot menu with Save Draft, Download PDF, Delete Invoice options
 */

import React, { useState } from 'react'
import clsx from 'clsx'
import { DeleteIcon, DownloadIcon, DraftIcon } from '@/assets/svg'
import { useClickOutside } from '@/lib'
import { useThemeStore } from '@/store/themeStore'

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
            {/* Three-dot button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={clsx(
                    'w-[44px] h-[44px] flex items-center justify-center rounded-[10px]',
                    isDark ? 'bg-[#132F4C]' : 'bg-[#132F4C]',
                    !disabled && 'hover:bg-[#1B456F]',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                >
                    <circle cx="11" cy="5.5" r="1.5" fill="#F5F8FA" />
                    <circle cx="11" cy="11" r="1.5" fill="#F5F8FA" />
                    <circle cx="11" cy="16.5" r="1.5" fill="#F5F8FA" />
                </svg>
            </button>

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
                                    'flex gap-[10px] items-center p-[10px] rounded-[7px] transition-colors',
                                    index === 0
                                        ? isDark
                                            ? 'bg-[#1B456F]'
                                            : 'bg-[#1B456F]'
                                        : '',
                                    isDark
                                        ? 'text-[#F5F8FA] hover:bg-[#1B456F]'
                                        : 'text-[#F5F8FA] hover:bg-[#1B456F]'
                                )}
                            >
                                {item.icon}
                                <span className="text-[16px] font-medium">
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
