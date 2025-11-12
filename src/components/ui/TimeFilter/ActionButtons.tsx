/**
 * ActionButtons Component
 * Renders Clear and Done buttons for the date picker
 */

import React from 'react'
import Button from '../Button'
import { cn, useIsMobile } from '@/lib'

interface ActionButtonsProps {
    onClear: () => void
    onDone: () => void
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    onClear,
    onDone,
}) => {
    const isMobile = useIsMobile()

    return (
        <div
            className={cn(
                'flex justify-between gap-2',
                isMobile && 'flex w-full justify-between gap-2'
            )}
        >
            <Button
                className={isMobile ? 'w-full' : ''}
                variant="ghost"
                onClick={(e) => {
                    e.stopPropagation()
                    onClear()
                }}
            >
                Clear
            </Button>
            <Button
                className={isMobile ? 'w-full' : ''}
                variant="primary"
                onClick={(e) => {
                    e.stopPropagation()
                    onDone()
                }}
            >
                Done
            </Button>
        </div>
    )
}
