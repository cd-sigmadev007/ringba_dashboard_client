import React, { useState } from 'react'
import clsx from 'clsx'
import AceEditor from 'react-ace'
import type { CallData } from '../../types'
import { useThemeStore } from '@/store/themeStore'
import { CopyIcon } from '@/assets/svg'
import { Tooltip } from '@/components/common'
import Button from '@/components/ui/Button'

// Import Ace Editor modes and themes
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/theme-xcode'

import 'ace-builds/src-noconflict/ext-language_tools'
import '@/styles/json-editor.css'

export interface JSONTabContentProps {
    callerData: CallData
    jsonData?: any
    className?: string
}

export const JSONTabContent: React.FC<JSONTabContentProps> = ({
    callerData,
    jsonData,
    className,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const [copied, setCopied] = useState(false)

    // Use actual callerData instead of mock data
    const data = jsonData || callerData
    const jsonString = JSON.stringify(data, null, 2)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsonString)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy JSON:', err)
            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = jsonString
            textArea.style.position = 'fixed'
            textArea.style.left = '-999999px'
            document.body.appendChild(textArea)
            textArea.select()
            try {
                document.execCommand('copy')
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            } catch (fallbackErr) {
                console.error('Fallback copy failed:', fallbackErr)
            }
            document.body.removeChild(textArea)
        }
    }

    return (
        <div className={clsx('space-y-6 pt-4', className)}>
            {/* Header with Copy Button */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#F5F8FA]">
                    Caller Data (JSON)
                </h3>
                <Tooltip tooltipText={copied ? 'Copied!' : 'Copy JSON'}>
                    <Button
                        variant="ghost"
                        className="p-1 min-w-0 h-auto"
                        onClick={handleCopy}
                    >
                        <CopyIcon />
                    </Button>
                </Tooltip>
            </div>

            {/* JSON Viewer */}
            <div
                className={clsx(
                    'rounded-[8px] border overflow-hidden shadow-sm',
                    isDark
                        ? 'border-[#1B456F] shadow-black/20'
                        : 'border-[#E1E5E9] shadow-gray-100'
                )}
            >
                <AceEditor
                    mode="json"
                    theme="monokai"
                    value={jsonString}
                    readOnly={true}
                    width="100%"
                    height="600px"
                    fontSize={14}
                    showPrintMargin={false}
                    showGutter={true}
                    highlightActiveLine={false}
                    wrapEnabled={true}
                    setOptions={{
                        enableBasicAutocompletion: false,
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2,
                        useWorker: false,
                        wrap: true,
                        indentedSoftWrap: true,
                    }}
                    style={{
                        backgroundColor: isDark ? '#001e3c' : '#ffffff',
                    }}
                    editorProps={{
                        $blockScrolling: true,
                    }}
                    className={clsx(
                        'json-editor',
                        isDark ? 'json-editor-dark' : 'json-editor-light'
                    )}
                />
            </div>
        </div>
    )
}

export default JSONTabContent
