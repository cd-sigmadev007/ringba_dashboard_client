/**
 * VisualizationSelector.tsx
 * Horizontal scrollable pill-style chart type selector.
 */
import React from 'react'
import clsx from 'clsx'
import { useThemeStore } from '@/store/themeStore'
import type { VizType } from '../types'
import { VIZ_LABELS } from '../types'

interface Props {
    value: VizType
    onChange: (type: VizType) => void
}

const VIZ_ICONS: Record<VizType, React.ReactNode> = {
    table: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4">
            <path strokeLinecap="round" d="M3 5h18M3 10h18M3 15h18M3 20h18M8 5v15M16 5v15" />
        </svg>
    ),
    bar: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4">
            <path strokeLinecap="round" d="M4 20V10h4v10M10 20V6h4v14M16 20V13h4v7M2 20h20" />
        </svg>
    ),
    stacked_bar: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4">
            <rect x="4" y="10" width="4" height="10" rx="1" /><rect x="4" y="4" width="4" height="6" rx="1" />
            <rect x="10" y="6" width="4" height="14" rx="1" /><rect x="16" y="12" width="4" height="8" rx="1" />
        </svg>
    ),
    line: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4">
            <path strokeLinecap="round" d="M3 17l5-7 5 4 5-8" /><circle cx="3" cy="17" r="1.5" fill="currentColor" />
            <circle cx="8" cy="10" r="1.5" fill="currentColor" /><circle cx="13" cy="14" r="1.5" fill="currentColor" />
            <circle cx="18" cy="6" r="1.5" fill="currentColor" />
        </svg>
    ),
    area: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4">
            <path strokeLinecap="round" d="M3 17l5-7 5 4 5-8" opacity={0.8} />
            <path d="M3 17l5-7 5 4 5-8V21H3Z" fill="currentColor" opacity={0.2} />
        </svg>
    ),
    donut: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4">
            <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" />
        </svg>
    ),
}

const ALL_TYPES: VizType[] = ['table', 'bar', 'stacked_bar', 'line', 'area', 'donut']

export const VisualizationSelector: React.FC<Props> = ({ value, onChange }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
            {ALL_TYPES.map((type) => (
                <button
                    key={type}
                    type="button"
                    onClick={() => onChange(type)}
                    title={VIZ_LABELS[type]}
                    className={clsx(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium whitespace-nowrap flex-shrink-0',
                        value === type
                            ? 'bg-blue-600 border-blue-700 text-white shadow-md shadow-blue-600/20'
                            : isDark
                                ? 'bg-[#0A1929] border-[#1E3A5F] text-[#B0C4DE] hover:border-[#007FFF]/50 hover:text-white'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600',
                    )}
                >
                    {VIZ_ICONS[type]}
                    <span>{VIZ_LABELS[type]}</span>
                </button>
            ))}
        </div>
    )
}
