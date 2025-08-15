import React from 'react'
import { cn } from '@/lib'

// Priority enum
export enum Priority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  HIGHEST = 3,
}

// Priority Tailwind color mapping
const priorityColors: Record<Priority, string> = {
  [Priority.HIGHEST]: 'bg-priority-highest text-white', // highest = red
  [Priority.HIGH]: 'bg-priority-high text-white', // high = orange/brown
  [Priority.MEDIUM]: 'bg-priority-medium text-white', // medium = yellow
  [Priority.LOW]: 'bg-priority-low text-white', // low = green
}

// Priority inline styles as fallback
const priorityInlineStyles: Record<Priority, React.CSSProperties> = {
  [Priority.HIGHEST]: { backgroundColor: '#994141', color: 'white' },
  [Priority.HIGH]: { backgroundColor: '#7C5228', color: 'white' },
  [Priority.MEDIUM]: { backgroundColor: '#B6A11C', color: 'white' },
  [Priority.LOW]: { backgroundColor: '#3B6934', color: 'white' },
}

// Priority label mapping
const priorityLabels: Record<Priority, string> = {
  [Priority.HIGHEST]: 'Highest',
  [Priority.HIGH]: 'High',
  [Priority.MEDIUM]: 'Medium',
  [Priority.LOW]: 'Low',
}

// Status to priority mapping
export const statusPriorityMap: Record<string, Priority> = {
  'High-Quality Un-billed (Critical)': Priority.HIGHEST,
  'Chargeback Risk (Critical)': Priority.HIGHEST,
  'Wrong Appliance Category': Priority.HIGH,
  'Wrong Pest Control Category': Priority.HIGH,
  'Short Call (<90s)': Priority.HIGH,
  'Buyer Hung Up': Priority.HIGH,
  'Immediate Hangup (<10s)': Priority.HIGH,
  'No Coverage (ZIP)': Priority.HIGH,
  'Competitor Mentioned': Priority.MEDIUM,
  'Booking Intent': Priority.MEDIUM,
  'Warranty/Status Inquiry': Priority.MEDIUM,
  'Positive Sentiment': Priority.LOW,
  'Negative Sentiment': Priority.LOW,
  'Repeat Customer': Priority.LOW,
  'Technical Terms Used': Priority.LOW,
}

export interface StatusProps {
  status: Array<Map<string, string>> | string
  truncate?: boolean
  enablePillOverflow?: boolean
}

export const Status: React.FC<StatusProps> = ({
                                                status,
                                                truncate = true,
                                                enablePillOverflow = false,
                                              }) => {
  // Convert status to array if it's a string
  const statusArray = typeof status === 'string' ? [status] : Array.from(status)

  return (
    <div className={cn('flex gap-2', enablePillOverflow && 'overflow-x-auto')}>
      {statusArray.map((tag, index) => {
        const tagString = typeof tag === 'string' ? tag : tag.get('title') || ''
        const priority = statusPriorityMap[tagString] ?? Priority.LOW
        const colorClasses = priorityColors[priority]
        const inlineStyles = priorityInlineStyles[priority]

        // Debug logging
        console.log('Status tag:', tagString, 'Priority:', priority, 'Classes:', colorClasses, 'Styles:', inlineStyles)

        return (
          <span
            className={cn(
              'flex items-center px-2 py-1 rounded-[13px] text-xs whitespace-nowrap',
              colorClasses,
              truncate && 'truncate'
            )}
            style={inlineStyles}
            key={index}
          >
            {tagString}
          </span>
        )
      })}
    </div>
  )
}

export default Status
