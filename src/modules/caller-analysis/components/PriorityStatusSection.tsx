import React from 'react'
import clsx from 'clsx'
import { useThemeStore } from '@/store/themeStore'
import { Status } from '@/modules'
import { useIsMobile } from '@/lib/hooks/useMediaQuery'

export interface PriorityStatusSectionProps {
    title: string
    statuses: Array<string>
    className?: string
    enablePillOverflow?: boolean
}

export const PriorityStatusSection: React.FC<PriorityStatusSectionProps> = ({
    title,
    statuses,
    className,
    enablePillOverflow = false,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const isMobile = useIsMobile()

    const labelClass = clsx(
        'text-sm w-full max-w-[150px] whitespace-nowrap',
        isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]',
        isMobile ? 'max-w-none w-full' : ''
    )

    // Always show the category section, even if empty
    // This ensures all categories are visible when they have statuses
    return (
        <div
            className={clsx(
                'flex flex-col border-b last:border-b-0',
                isDark ? 'border-[#1B456F]' : 'border-[#E1E5E9]',
                className
            )}
        >
            <div
                className={clsx(
                    'flex p-3.5 items-start overflow-x-auto gap-x-[32px]',
                    isMobile ? 'flex-col gap-y-3' : 'flex-row'
                )}
            >
                <p className={labelClass}>{title}</p>
                <div className="flex-1 overflow-x-fixed">
                    {statuses.length > 0 ? (
                        <Status
                            enablePillOverflow={enablePillOverflow}
                            status={statuses}
                        />
                    ) : (
                        <span
                            className={clsx(
                                'text-sm italic',
                                isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                            )}
                        >
                            No statuses in this category
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PriorityStatusSection
