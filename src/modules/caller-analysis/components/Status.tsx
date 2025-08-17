import React, { useMemo } from 'react'
import type { StatusItem } from '@/modules'

import {
    PRIORITY_COLORS,
    PRIORITY_INLINE_STYLES,
    Priority,
    STATUS_PRIORITY_MAP,
} from '@/modules'
import { cn } from '@/lib'
import Tooltip from '../../../components/common/Tooltip'

export interface StatusProps {
    status:
    | Array<Map<string, string>>
    | string
    | Array<string>
    | Array<StatusItem>
    truncate?: boolean
    enablePillOverflow?: boolean
    sortByPriority?: boolean
    sortDirection?: 'asc' | 'desc'
}

// Simple utility functions to avoid import issues
const createStatusItem = (status: string, id?: string): StatusItem => ({
    id: id || `status-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: status,
    priority: STATUS_PRIORITY_MAP[status] ?? Priority.LOW,
})

const sortByPriority = <T extends { priority: Priority }>(
    items: Array<T>
): Array<T> => {
    return [...items].sort((a, b) => b.priority - a.priority)
}

export const Status: React.FC<StatusProps> = ({
    status,
    truncate = false,
    enablePillOverflow = false,
    sortByPriority: shouldSort = true,
    sortDirection = 'desc',
}) => {
    // Convert and process status data
    const processedStatusItems = useMemo((): Array<StatusItem> => {
        if (Array.isArray(status)) {
            if (status.length === 0) return []

            const firstItem = status[0]

            // If it's already StatusItem array
            if (typeof firstItem === 'object' && 'priority' in firstItem) {
                return status as Array<StatusItem>
            }
            // If it's string array, convert to StatusItem
            if (typeof firstItem === 'string') {
                return status.map((tag, index) =>
                    createStatusItem(tag as string, `status-${index}`)
                )
            }
            // If it's Map array, convert to StatusItem
            if (firstItem instanceof Map) {
                return status.map((tag, index) => {
                    const tagString =
                        (tag as Map<string, string>).get('title') || ''
                    return createStatusItem(tagString, `status-${index}`)
                })
            }
        }

        // If it's a string, convert to single StatusItem array
        if (typeof status === 'string') {
            return [createStatusItem(status)]
        }

        // Fallback: empty array
        return []
    }, [status])

    // Sort by priority if requested
    const sortedStatusItems = useMemo(() => {
        if (!shouldSort) return processedStatusItems

        return sortDirection === 'desc'
            ? sortByPriority(processedStatusItems)
            : processedStatusItems.sort((a, b) => a.priority - b.priority)
    }, [processedStatusItems, shouldSort, sortDirection])

    return (
        <div
            className={cn(
                'flex gap-2 max-w-full',
                enablePillOverflow ? 'overflow-x-auto' : 'flex-wrap'
            )}
        >
            {sortedStatusItems.map((statusItem) => {
                const { id, title, priority } = statusItem
                const colorClasses = PRIORITY_COLORS[priority]
                const inlineStyles = PRIORITY_INLINE_STYLES[priority]

                return (
                    <span
                        key={id}
                        className={cn(
                            'flex items-center px-2 py-1 rounded-[13px] text-xs whitespace-nowrap flex-shrink-0',
                            colorClasses,
                            truncate && 'truncate'
                        )}
                        style={inlineStyles}
                        title={`Priority: ${priority}`}
                    >
                        <Tooltip tooltipText={title}>
                            {truncate ? title.slice(0, 8) + '...' : title}
                        </Tooltip>
                    </span>
                )
            })}
        </div>
    )
}

export default Status
