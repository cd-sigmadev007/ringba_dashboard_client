import React from 'react'
import { Tooltip } from 'react-tooltip'
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

const Index: React.FC<TooltipProps> = ({
    tooltipText,
    children,
    id = 12,
    disable = false,
    className,
    classContainer,
    fragment = false,
    width,
}) => {
    return (
        <>
            {fragment ? (
                <div id={String(id)} style={{ width }}>
                    {children}
                </div>
            ) : (
                <div id={String(id)}>{children}</div>
            )}
            {!disable && (
                <Tooltip
                    positionStrategy="fixed"
                    anchorId={String(id)}
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
                </Tooltip>
            )}
        </>
    )
}

export default Index
