/**
 * VisualizerPage.tsx
 * Top-level page for the visual query builder.
 */
import React from 'react'
import clsx from 'clsx'
import { VisualizerContainer } from '../containers/VisualizerContainer'
import { useThemeStore } from '@/store/themeStore'

export const VisualizerPage: React.FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <div className={clsx('flex flex-col h-full min-h-0 px-6 py-5 gap-5')}>
            {/* Page header */}
            <div className="flex items-start justify-between gap-4 shrink-0">
                <div>
                    <h1
                        className={clsx(
                            'text-2xl font-bold',
                            isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                        )}
                    >
                        Query Builder
                    </h1>
                </div>
                <div
                    className={clsx(
                        'flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium',
                        isDark
                            ? 'bg-green-900/20 border-green-800 text-green-400'
                            : 'bg-green-50 border-green-200 text-green-600'
                    )}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Read-only · SELECT only
                </div>
            </div>

            {/* Builder */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <VisualizerContainer />
            </div>
        </div>
    )
}

export default VisualizerPage
