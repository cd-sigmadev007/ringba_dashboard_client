import React from 'react'
import clsx from 'clsx'
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

    // Categorize statuses by priority
    const highestPriorityStatuses = callerData.status.filter(
        (status) =>
            status === 'High-Quality Un-billed (Critical)' ||
            status === 'Chargeback Risk (Critical)'
    )

    const highPriorityStatuses = callerData.status.filter(
        (status) =>
            status === 'Wrong Appliance Category' ||
            status === 'Wrong Pest Control Category' ||
            status === 'Short Call (<90s)' ||
            status === 'Buyer Hung Up' ||
            status === 'Immediate Hangup (<10s)' ||
            status === 'No Coverage (ZIP)'
    )

    const mediumPriorityStatuses = callerData.status.filter(
        (status) =>
            status === 'Competitor Mentioned' ||
            status === 'Booking Intent' ||
            status === 'Warranty/Status Inquiry'
    )

    const lowPriorityStatuses = callerData.status.filter(
        (status) =>
            status === 'Positive Sentiment' ||
            status === 'Negative Sentiment' ||
            status === 'Repeat Customer' ||
            status === 'Technical Terms Used'
    )

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
