import React from 'react'
import clsx from 'clsx'
import type { CallData } from '../../types'
import { useThemeStore } from '@/store/themeStore'

export interface SummaryTabContentProps {
    callerData: CallData
    className?: string
}

export const SummaryTabContent: React.FC<SummaryTabContentProps> = ({
    callerData,
    className,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const summaryText = callerData.summary || 'No summary available'

    const valueClass = clsx(
        'text-sm',
        isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    )

    return (
        <div className={clsx(className, 'p-4')}>
            <p className={clsx(valueClass, 'whitespace-pre-wrap break-words')}>
                {summaryText}
            </p>
        </div>
    )
}

export default SummaryTabContent
