import React from 'react'
import clsx from 'clsx'
import { useThemeStore } from '@/store/themeStore'
import { mockHistoryData } from '@/data/caller-tabs-data'
import type { HistoryEntry } from '@/data/caller-tabs-data'

export interface HistoryTabContentProps {
    historyData?: HistoryEntry[]
    className?: string
}

export const HistoryTabContent: React.FC<HistoryTabContentProps> = ({
    historyData = mockHistoryData,
    className
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <div className={clsx('space-y-4 pt-4', className)}>
            <div className="space-y-3">
                {historyData.map((call, index) => (
                    <div key={index} className={clsx(
                        'p-4 rounded-[7px] border transition-all duration-200 hover:shadow-sm',
                        isDark ? 'border-[#1B456F] bg-[#1B456F]/10 hover:bg-[#1B456F]/15' : 'border-[#E1E5E9] bg-[#F8F9FA] hover:bg-[#F1F3F4]'
                    )}>
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={clsx(
                                        'font-semibold text-base',
                                        isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                                    )}>
                                        {call.date}
                                    </div>
                                    <div className={clsx(
                                        'text-sm px-2 py-1 rounded-full',
                                        isDark ? 'bg-[#2D596B] text-[#A1A5B7]' : 'bg-[#E1E5E9] text-[#5E6278]'
                                    )}>
                                        {call.time}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className={clsx(
                                            'text-xs font-medium',
                                            isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                                        )}>
                                            Duration:
                                        </span>
                                        <span className={clsx(
                                            'text-sm font-medium',
                                            isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                                        )}>
                                            {call.duration}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                                <div className={clsx(
                                    'px-3 py-1 rounded-full text-xs font-semibold',
                                    call.status === 'Completed'
                                        ? (isDark ? 'bg-green-900/30 text-green-400 border border-green-500/20' : 'bg-green-50 text-green-700 border border-green-200')
                                        : (isDark ? 'bg-red-900/30 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-700 border border-red-200')
                                )}>
                                    {call.status}
                                </div>
                                
                                <div className="flex flex-col items-end">
                                    <span className={clsx(
                                        'text-xs font-medium',
                                        isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                                    )}>
                                        Revenue
                                    </span>
                                    <span className={clsx(
                                        'text-lg font-bold',
                                        call.revenue > 0 
                                            ? (isDark ? 'text-green-400' : 'text-green-600')
                                            : (isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]')
                                    )}>
                                        ${call.revenue.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HistoryTabContent
