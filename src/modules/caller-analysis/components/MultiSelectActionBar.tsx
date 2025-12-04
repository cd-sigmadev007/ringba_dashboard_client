import React from 'react'
import clsx from 'clsx'
import { DeleteIcon, DownloadIcon, RaiseDisputeIcon } from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'
import { useIsMobile } from '@/lib'

interface MultiSelectActionBarProps {
    selectedCount: number
    onRaiseDispute: () => void
    onDelete: () => void
    onDownloadCSV: () => void
}

export const MultiSelectActionBar: React.FC<MultiSelectActionBarProps> = ({
    selectedCount,
    onRaiseDispute,
    onDelete,
    onDownloadCSV,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const isMobile = useIsMobile()

    if (selectedCount === 0) {
        return null
    }

    return (
        <div
            className={clsx(
                'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50',
                'xl:left-[calc(256px+(100vw-256px)/2)] xl:-translate-x-1/2',
                'px-4 py-2 rounded-2xl shadow-[0px_24px_30px_0px_rgba(0,0,0,0.1)]',
                isDark ? 'bg-[#1b456f]' : 'bg-white',
                // Mobile: vertical layout, desktop: horizontal
                isMobile
                    ? 'flex flex-col gap-2.5 w-[320px]'
                    : 'flex items-center justify-between w-[680px]'
            )}
        >
            {/* Selected count */}
            <div
                className={clsx(
                    'px-3 py-1 rounded-[14px]',
                    'shadow-[0px_24px_30px_0px_rgba(0,0,0,0.1)]',
                    isMobile ? 'w-full' : ''
                )}
            >
                <p
                    className={clsx(
                        'font-medium text-xs whitespace-nowrap',
                        isDark ? 'text-[#F5F8FA]' : 'text-gray-900',
                        isMobile ? 'text-center' : ''
                    )}
                >
                    {selectedCount} item{selectedCount !== 1 ? 's' : ''}{' '}
                    selected
                </p>
            </div>

            {/* Action buttons */}
            <div
                className={clsx(
                    'flex items-center',
                    isMobile
                        ? 'flex-wrap gap-2.5 justify-center w-full'
                        : 'gap-2.5'
                )}
            >
                {/* Raise Dispute */}
                <button
                    onClick={onRaiseDispute}
                    className={clsx(
                        'flex gap-1 items-center justify-center p-1 rounded-2xl',
                        'transition-colors hover:opacity-80',
                        isDark ? 'text-[#F5F8FA]' : 'text-gray-900'
                    )}
                >
                    <RaiseDisputeIcon className="w-[19px] h-5" />
                    <span
                        className={clsx(
                            'font-medium text-xs whitespace-nowrap',
                            isDark ? 'text-[#F5F8FA]' : 'text-gray-900'
                        )}
                    >
                        Raise Dispute
                    </span>
                </button>

                {/* Delete Items */}
                <button
                    onClick={onDelete}
                    className={clsx(
                        'flex gap-1 items-center justify-center p-1 rounded-2xl',
                        'transition-colors hover:opacity-80',
                        isDark ? 'text-[#F5F8FA]' : 'text-gray-900'
                    )}
                >
                    <DeleteIcon className="w-5 h-5" />
                    <span
                        className={clsx(
                            'font-medium text-xs whitespace-nowrap',
                            isDark ? 'text-[#F5F8FA]' : 'text-gray-900'
                        )}
                    >
                        Delete Items
                    </span>
                </button>

                {/* Download CSV */}
                <button
                    onClick={onDownloadCSV}
                    className={clsx(
                        'flex gap-1 items-center justify-center p-1 rounded-2xl',
                        'transition-colors hover:opacity-80',
                        isDark ? 'text-[#F5F8FA]' : 'text-gray-900'
                    )}
                >
                    <DownloadIcon className="w-[17px] h-[17px]" />
                    <span
                        className={clsx(
                            'font-medium text-xs whitespace-nowrap',
                            isDark ? 'text-[#F5F8FA]' : 'text-gray-900'
                        )}
                    >
                        Download CSV
                    </span>
                </button>
            </div>
        </div>
    )
}
