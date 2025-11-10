import React from 'react'
import clsx from 'clsx'
import AceEditor from 'react-ace'
import { useThemeStore } from '@/store/themeStore'
import { generateMockJsonData } from '@/data/caller-tabs-data'
import type { CallData } from '../../types'

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
    className
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    
    const data = jsonData || generateMockJsonData(callerData)
    const jsonString = JSON.stringify(data, null, 2)

    return (
        <div className={clsx('space-y-6 pt-4', className)}>
            {/* JSON Viewer */}
            <div className={clsx(
                'rounded-[8px] border overflow-hidden shadow-sm',
                isDark ? 'border-[#1B456F] shadow-black/20' : 'border-[#E1E5E9] shadow-gray-100'
            )}>
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
