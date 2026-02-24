/**
 * VisualizationConfigPanel.tsx
 * Panel to configure axis mappings, series field, value format.
 * Pure UI. Uses VizSelect for consistent, non-clipping dropdowns.
 */
import React from 'react'
import clsx from 'clsx'
import { VizSelect } from './VizSelect'
import type { VizConfig } from '../types'
import type { VizSelectOption } from './VizSelect'
import { useThemeStore } from '@/store/themeStore'

interface ColumnOption {
    key: string
    label: string
}

interface Props {
    config: VizConfig
    columns: Array<ColumnOption>
    onSetXField: (f: string) => void
    onSetYFields: (f: Array<string>) => void
    onSetSeriesField: (f: string) => void
    onSetValueFormat: (f: VizConfig['valueFormat']) => void
}

const fieldLabel = (text: string, isDark: boolean) => (
    <label
        className={clsx(
            'block text-xs font-medium mb-1.5',
            isDark ? 'text-[#B0C4DE]' : 'text-gray-600'
        )}
    >
        {text}
    </label>
)

const FORMAT_OPTIONS: Array<VizSelectOption> = [
    { label: 'Number', value: 'number' },
    { label: 'Percent (%)', value: 'percent' },
]

export const VisualizationConfigPanel: React.FC<Props> = ({
    config,
    columns,
    onSetXField,
    onSetYFields,
    onSetSeriesField,
    onSetValueFormat,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const { type } = config

    const colOptions: Array<VizSelectOption> = [
        { label: '— none —', value: '' },
        ...columns.map((c) => ({ label: c.label, value: c.key })),
    ]

    return (
        <div className="space-y-4">
            {/* X-Axis / Label field */}
            {(type === 'bar' ||
                type === 'stacked_bar' ||
                type === 'line' ||
                type === 'area') && (
                <div>
                    {fieldLabel('X-Axis field', isDark)}
                    <VizSelect
                        options={colOptions}
                        value={config.xField ?? ''}
                        onChange={onSetXField}
                    />
                </div>
            )}

            {type === 'donut' && (
                <div>
                    {fieldLabel('Label field', isDark)}
                    <VizSelect
                        options={colOptions}
                        value={config.xField ?? ''}
                        onChange={onSetXField}
                    />
                </div>
            )}

            {/* Y-Axis checkboxes */}
            {(type === 'bar' ||
                type === 'stacked_bar' ||
                type === 'line' ||
                type === 'area') && (
                <div>
                    {fieldLabel('Y-Axis field(s)', isDark)}
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                        {columns.map((c) => (
                            <label
                                key={c.key}
                                className={clsx(
                                    'flex items-center gap-2 px-2 py-1 rounded cursor-pointer',
                                    isDark
                                        ? 'hover:bg-[#1E3A5F]'
                                        : 'hover:bg-gray-50'
                                )}
                            >
                                <input
                                    type="checkbox"
                                    checked={
                                        config.yFields?.includes(c.key) ?? false
                                    }
                                    onChange={(e) => {
                                        const current = config.yFields ?? []
                                        onSetYFields(
                                            e.target.checked
                                                ? [...current, c.key]
                                                : current.filter(
                                                      (k) => k !== c.key
                                                  )
                                        )
                                    }}
                                    className="accent-blue-500"
                                />
                                <span
                                    className={clsx(
                                        'text-sm',
                                        isDark
                                            ? 'text-[#B0C4DE]'
                                            : 'text-gray-700'
                                    )}
                                >
                                    {c.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Series field (stacked bar) */}
            {type === 'stacked_bar' && (
                <div>
                    {fieldLabel('Series / Stack field', isDark)}
                    <VizSelect
                        options={colOptions}
                        value={config.seriesField ?? ''}
                        onChange={onSetSeriesField}
                    />
                </div>
            )}

            {/* Value format */}
            {type !== 'table' && (
                <div>
                    {fieldLabel('Value format', isDark)}
                    <VizSelect
                        options={FORMAT_OPTIONS}
                        value={config.valueFormat ?? 'number'}
                        onChange={(v) =>
                            onSetValueFormat(v as VizConfig['valueFormat'])
                        }
                    />
                </div>
            )}
        </div>
    )
}
