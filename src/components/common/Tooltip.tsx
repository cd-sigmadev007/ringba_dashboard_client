import React, { useMemo } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import clsx from 'clsx'
import type { ReactNode } from 'react'

interface TooltipProps {
    tooltipText: ReactNode
    children: ReactNode
    id?: string | number
    disable?: boolean
    className?: string
    classContainer?: string
    fragment?: boolean
    width?: string | number
}

export const Tooltip: React.FC<TooltipProps> = ({
    tooltipText,
    children,
    id,
    disable = false,
    className,
    classContainer,
    fragment = false,
    width,
}) => {
    // Generate unique ID if none provided
    const uniqueId = useMemo(() => {
        if (id) return String(id)
        // Use crypto.randomUUID() for unique ID generation with fallback
        try {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (crypto.randomUUID) {
                return `tooltip-${crypto.randomUUID()}`
            } else {
                // Fallback for environments without crypto.randomUUID
                return `tooltip-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`
            }
        } catch {
            // Fallback for any crypto errors
            return `tooltip-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`
        }
    }, [id])

    return (
        <>
            {fragment ? (
                <div id={uniqueId} style={{ width }}>
                    {children}
                </div>
            ) : (
                <div id={uniqueId}>{children}</div>
            )}
            {!disable && (
                <ReactTooltip
                    positionStrategy="fixed"
                    anchorId={uniqueId}
                    style={{
                        backgroundColor: '#5E6278',
                        color: '#F5F8FA',
                        borderRadius: 5,
                        padding: '5px 12px',
                        display: 'flex',
                        zIndex: 999999,
                    }}
                    className={clsx(
                        classContainer,
                        'opaque transition-opacity duration-300 shadow-sm'
                    )}
                >
                    <div
                        className={clsx(
                            'text-center flex flex-wrap justify-center font-medium text-[12px] text-wrap max-w-[20rem]',
                            className
                        )}
                    >
                        {tooltipText}
                    </div>
                </ReactTooltip>
            )}
        </>
    )
}
