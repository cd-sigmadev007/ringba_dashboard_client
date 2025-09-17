import React, { useState } from 'react'
import clsx from 'clsx'
import JsonView from '@uiw/react-json-view'
import { useThemeStore } from '@/store/themeStore'
import { generateMockJsonData } from '@/data/caller-tabs-data'
import type { CallData } from '../../types'
import '@/styles/json-viewer-monokai.css'

export interface JSONTabContentProps {
    callerData: CallData
    jsonData?: any
    className?: string
}

export const JSONTabContent: React.FC<JSONTabContentProps> = ({
    callerData,
    jsonData,
    className
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    
    const data = jsonData || generateMockJsonData(callerData)

    return (
        <div className={clsx('space-y-6 p-6', className)}>
            {/* JSON Viewer */}
            <div className={clsx(
                'rounded-[8px] border overflow-hidden shadow-sm',
                isDark ? 'border-[#3E3D32] shadow-black/20 json-viewer-dark' : 'border-[#E1E5E9] shadow-gray-100 json-viewer-light'
            )}>
                <div className="json-viewer-container">
                    <JsonView 
                        value={data}
                        displayDataTypes={false}
                        enableClipboard={false}
                        collapsed={false}
                    />
                </div>
            </div>
        </div>
    )
}

export default JSONTabContent
