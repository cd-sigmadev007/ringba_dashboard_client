import React, { useMemo } from 'react'
import clsx from 'clsx'
import { PriorityStatusSection } from './PriorityStatusSection'
import type { CallData } from '../types'
import { useThemeStore } from '@/store/themeStore'
import { useIsMobile } from '@/lib'
import { Modal } from '@/components/ui'
import { useTagDefinitionsStore } from '../store/tagDefinitionsStore'

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

    // Use status from callerData + tag definitions store (single source, no per-call fetch)
    const statusToPriorityRows = useTagDefinitionsStore(
        (s) => s.statusToPriorityRows
    )
    const isLoading = useTagDefinitionsStore((s) => s.isLoading)
    const { highest, high, medium, low } = useMemo(
        () => statusToPriorityRows(callerData.status ?? []),
        [statusToPriorityRows, callerData.status]
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
                <div
                    className={clsx(
                        'flex flex-col rounded-sm',
                        isDark ? 'bg-transparent' : 'bg-[#FFFFFF]'
                    )}
                >
                    <PriorityStatusSection
                        title="Highest Priority"
                        statuses={isLoading ? [] : highest}
                    />
                    <PriorityStatusSection
                        title="High Priority"
                        statuses={isLoading ? [] : high}
                    />
                    <PriorityStatusSection
                        title="Medium Priority"
                        statuses={isLoading ? [] : medium}
                    />
                    <PriorityStatusSection
                        title="Low Priority"
                        statuses={isLoading ? [] : low}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default StatusModal
