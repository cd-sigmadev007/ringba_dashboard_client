/**
 * PresetButtons Component
 * Renders preset date range selection buttons
 */

import React from 'react'
import Button from '../Button'
import { presets } from './constants'
import type { Preset } from './types'
import { useThemeStore } from '@/store/themeStore'
import { cn } from '@/lib'

interface PresetButtonsProps {
    activePreset: string | null
    onPresetClick: (preset: Preset) => void
}

export const PresetButtons: React.FC<PresetButtonsProps> = ({
    activePreset,
    onPresetClick,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <ul className="flex flex-row sm:flex-col flex-wrap gap-1.5 basis-auto sm:basis-[120px] flex-shrink-0">
            {presets.map((p) => (
                <li key={p.label}>
                    <Button
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation()
                            onPresetClick(p)
                        }}
                        className={cn(
                            '!py-2 !px-3 border rounded-md w-full sm:w-full text-start text-sm',
                            isDark
                                ? 'hover:bg-[#1B456F] border-transparent'
                                : 'hover:bg-slate-100 border-transparent',
                            activePreset === p.label
                                ? isDark
                                    ? 'bg-[#1B456F] text-[#F5F8FA]'
                                    : 'bg-slate-200 text-[#3F4254]'
                                : isDark
                                  ? 'text-[#94A3B8]'
                                  : 'text-slate-600'
                        )}
                    >
                        {p.label}
                    </Button>
                </li>
            ))}
        </ul>
    )
}
