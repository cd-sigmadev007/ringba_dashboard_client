/**
 * RefreshButton Component
 * Refresh button with rotating icon and "last updated" time display
 */

import React, { useState, useEffect, useCallback } from 'react'
import { RefreshIcon } from '@/assets/svg'
import { cn } from '@/lib'
import dayjs from 'dayjs'

export interface RefreshButtonProps {
    onRefresh: () => void | Promise<void>
    lastUpdated?: Date | null
    isLoading?: boolean
    className?: string
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
    onRefresh,
    lastUpdated,
    isLoading = false,
    className,
}) => {
    const [isRotating, setIsRotating] = useState(false)
    const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(
        lastUpdated || new Date()
    )
    const [timeAgo, setTimeAgo] = useState<string>('just now')

    // Update time ago text every minute
    useEffect(() => {
        const updateTimeAgo = () => {
            if (lastUpdateTime) {
                const now = dayjs()
                const lastUpdate = dayjs(lastUpdateTime)
                const diffInMinutes = now.diff(lastUpdate, 'minute')

                if (diffInMinutes < 1) {
                    setTimeAgo('just now')
                } else if (diffInMinutes === 1) {
                    setTimeAgo('1 min ago')
                } else {
                    setTimeAgo(`${diffInMinutes} mins ago`)
                }
            }
        }

        // Update immediately
        updateTimeAgo()

        // Update every minute (60000ms)
        const interval = setInterval(updateTimeAgo, 60000)

        return () => clearInterval(interval)
    }, [lastUpdateTime])

    // Update lastUpdateTime when prop changes
    useEffect(() => {
        if (lastUpdated) {
            setLastUpdateTime(lastUpdated)
        }
    }, [lastUpdated])

    const handleRefresh = useCallback(async () => {
        setIsRotating(true)
        setLastUpdateTime(new Date())

        try {
            await onRefresh()
        } catch (error) {
            console.error('Error refreshing data:', error)
        } finally {
            // Keep rotation animation for at least 500ms
            setTimeout(() => {
                setIsRotating(false)
            }, 500)
        }
    }, [onRefresh])

    return (
        <div
            className={cn(
                'flex items-center gap-[15px] justify-end',
                className
            )}
        >
            {/* Last Updated Text */}
            <p
                className={cn(
                    'text-sm whitespace-nowrap',
                    'text-[#A1A5B7]'
                )}
            >
                Updated {timeAgo}
            </p>

            {/* Refresh Button */}
            <button
                onClick={handleRefresh}
                disabled={isLoading || isRotating}
                className={cn(
                    'border border-[#0254a5] rounded-[7px]',
                    'size-[25px] flex items-center justify-center',
                    'transition-all duration-200',
                    'hover:bg-[#0254a5]/10',
                    'active:bg-[#0254a5]/20',
                    'cursor-pointer',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'focus:outline-none focus:ring-2 focus:ring-[#0254a5]/20'
                )}
                aria-label="Refresh data"
            >
                <RefreshIcon
                    className={cn(
                        'size-4 text-[#F5F8FA] transition-transform duration-500',
                        (isRotating || isLoading) && 'animate-spin'
                    )}
                />
            </button>
        </div>
    )
}

export default RefreshButton

