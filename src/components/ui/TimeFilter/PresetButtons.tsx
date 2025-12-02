/**
 * PresetButtons Component
 * Renders preset date range selection buttons
 */

import React from 'react'
import Button from '../Button'
import { presets } from './constants'
import type { Preset } from './types'
import { cn } from '@/lib'

interface PresetButtonsProps {
    activePreset: string | null
    onPresetClick: (preset: Preset) => void
}

export const PresetButtons: React.FC<PresetButtonsProps> = ({
    activePreset,
    onPresetClick,
}) => {
    return (
        <ul className="flex flex-col gap-[5px] basis-[120px] flex-shrink-0">
            {presets.map((p) => (
                <li key={p.label}>
                    <Button
                        variant={'ghost'}
                        onClick={(e) => {
                            e.stopPropagation()
                            onPresetClick(p)
                        }}
                        className={cn(
                            '!py-[7px] !px-[10px] border-none w-full text-start hover:bg-[#132F4C]',
                            activePreset === p.label ? 'bg-[#132F4C]' : ''
                        )}
                    >
                        {p.label}
                    </Button>
                </li>
            ))}
        </ul>
    )
}
