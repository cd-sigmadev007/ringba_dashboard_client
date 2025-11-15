import React from 'react'
import clsx from 'clsx'
import { Priority, STATUS_PRIORITY_MAP } from '../types/priority.types'
import { PriorityStatusSection } from './PriorityStatusSection'
import type { CallData } from '../types'
import { useThemeStore } from '@/store/themeStore'
import { useIsMobile } from '@/lib'
import { Modal } from '@/components/ui'

export interface StatusModalProps {
    callerData: CallData
    isOpen: boolean
    onClose: () => void
}

export const StatusModal: React.FC<StatusModalProps> = ({
    callerData,
    isOpen,
    onClose,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const isMobile = useIsMobile()

    // Categorize statuses by priority dynamically using STATUS_PRIORITY_MAP
    // This ensures all tags from the database are shown, not just hardcoded ones
    const categorizeByPriority = (statuses: Array<string>) => {
        const highest: Array<string> = []
        const high: Array<string> = []
        const medium: Array<string> = []
        const low: Array<string> = []

        statuses.forEach((status) => {
            const priority = STATUS_PRIORITY_MAP[status] ?? Priority.LOW
            switch (priority) {
                case Priority.HIGHEST:
                    highest.push(status)
                    break
                case Priority.HIGH:
                    high.push(status)
                    break
                case Priority.MEDIUM:
                    medium.push(status)
                    break
                case Priority.LOW:
                    low.push(status)
                    break
                default:
                    low.push(status) // Default to low if not found
            }
        })

        return { highest, high, medium, low }
    }

    const {
        highest: highestPriorityStatuses,
        high: highPriorityStatuses,
        medium: mediumPriorityStatuses,
        low: lowPriorityStatuses,
    } = categorizeByPriority(callerData.status)

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Status Overview"
            position={isMobile ? 'bottom' : 'center'}
            size={isMobile ? 'full' : 'xl'}
            className={isMobile ? 'max-w-full max-h-[40vh]' : 'max-w-4xl'}
            animation={isMobile ? 'slide' : 'fade'}
            border={true}
        >
            <div className="space-y-6">
                {/* Status Sections */}
                <div
                    className={clsx(
                        'flex flex-col rounded-sm',
                        isDark ? 'bg-transparent' : 'bg-[#FFFFFF]'
                    )}
                >
                    <PriorityStatusSection
                        title="Highest Priority"
                        statuses={highestPriorityStatuses}
                    />

                    <PriorityStatusSection
                        title="High Priority"
                        statuses={highPriorityStatuses}
                    />

                    <PriorityStatusSection
                        title="Medium Priority"
                        statuses={mediumPriorityStatuses}
                    />

                    <PriorityStatusSection
                        title="Low Priority"
                        statuses={lowPriorityStatuses}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default StatusModal
