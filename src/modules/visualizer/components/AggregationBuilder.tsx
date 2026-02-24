/**
 * AggregationBuilder.tsx
 * UI for configuring group-by fields and aggregation functions.
 * Two distinct sub-sections with clear spacing.
 */
import React from 'react'
import clsx from 'clsx'
import { AGG_LABELS } from '../types'
import { FieldSelector } from './FieldSelector'
import { VizSelect } from './VizSelect'
import type { AggDef, AggFn, FieldDef } from '../types'
import type { VizSelectOption } from './VizSelect'
import { useThemeStore } from '@/store/themeStore'

const AGG_FNS: Array<AggFn> = [
    'count',
    'count_distinct',
    'sum',
    'avg',
    'min',
    'max',
]
const AGG_OPTIONS: Array<VizSelectOption> = AGG_FNS.map((fn) => ({
    label: AGG_LABELS[fn],
    value: fn,
}))

interface Props {
    fields: Array<FieldDef>
    groupBy: Array<string>
    aggregations: Array<AggDef>
    onAddGroupBy: (field: string) => void
    onRemoveGroupBy: (field: string) => void
    onAddAggregation: (fn: AggFn, field: string) => void
    onRemoveAggregation: (id: string) => void
}

export const AggregationBuilder: React.FC<Props> = ({
    fields,
    groupBy,
    aggregations,
    onAddGroupBy,
    onRemoveGroupBy,
    onAddAggregation,
    onRemoveAggregation,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [pendingAggFn, setPendingAggFn] = React.useState<AggFn>('count')
    const [pendingAggField, setPendingAggField] = React.useState('')
    const [pendingGroupByField, setPendingGroupByField] = React.useState('')

    const subLabel = (text: string) => (
        <p
            className={clsx(
                'text-[10px] font-bold uppercase tracking-widest mb-2',
                isDark ? 'text-[#4A6080]' : 'text-gray-400'
            )}
        >
            {text}
        </p>
    )

    const addBtnCls = (enabled: boolean) =>
        clsx(
            'w-full py-2 rounded-lg text-xs font-semibold transition-colors mt-2',
            enabled
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'opacity-40 cursor-not-allowed ' +
                      (isDark
                          ? 'bg-[#1E3A5F] text-[#4A6080]'
                          : 'bg-gray-100 text-gray-400')
        )

    const pillCls = clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        isDark
            ? 'bg-blue-900/30 border-blue-700/50 text-blue-300'
            : 'bg-blue-50 border-blue-200 text-blue-700'
    )

    return (
        <div className="space-y-5">
            {/* ── Group By ─────────────────────────────────────── */}
            <div>
                {subLabel('Group By')}

                {/* Current pills */}
                {groupBy.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {groupBy.map((key) => {
                            const def = fields.find((f) => f.key === key)
                            return (
                                <span key={key} className={pillCls}>
                                    {def?.label ?? key}
                                    <button
                                        type="button"
                                        onClick={() => onRemoveGroupBy(key)}
                                        className="hover:text-red-400 transition-colors leading-none"
                                    >
                                        <svg
                                            className="w-3 h-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </span>
                            )
                        })}
                    </div>
                ) : (
                    <p
                        className={clsx(
                            'text-xs mb-3',
                            isDark ? 'text-[#4A6080]' : 'text-gray-400'
                        )}
                    >
                        None selected
                    </p>
                )}

                {/* Add selector */}
                <FieldSelector
                    fields={fields}
                    filterFn={(f) => f.groupable && !groupBy.includes(f.key)}
                    value={pendingGroupByField}
                    onChange={setPendingGroupByField}
                    placeholder="Choose a field…"
                />
                <button
                    type="button"
                    disabled={!pendingGroupByField}
                    onClick={() => {
                        onAddGroupBy(pendingGroupByField)
                        setPendingGroupByField('')
                    }}
                    className={addBtnCls(!!pendingGroupByField)}
                >
                    + Add Group By
                </button>
            </div>

            {/* Divider */}
            <div
                className={clsx(
                    'border-t',
                    isDark ? 'border-[#1E3A5F]' : 'border-gray-100'
                )}
            />

            {/* ── Aggregations ────────────────────────────────── */}
            <div>
                {subLabel('Metrics')}

                {/* Current aggregations */}
                {aggregations.length > 0 ? (
                    <div className="space-y-2 mb-3">
                        {aggregations.map((agg) => {
                            const def = fields.find((f) => f.key === agg.field)
                            return (
                                <div
                                    key={agg.id}
                                    className={clsx(
                                        'flex items-center justify-between rounded-lg px-3 py-2 border text-xs',
                                        isDark
                                            ? 'bg-[#0A1929] border-[#1E3A5F]'
                                            : 'bg-gray-50 border-gray-200'
                                    )}
                                >
                                    <span>
                                        <span className="font-mono text-blue-400 font-semibold">
                                            {AGG_LABELS[agg.fn]}
                                        </span>
                                        {agg.fn !== 'count' && (
                                            <span
                                                className={clsx(
                                                    'ml-1',
                                                    isDark
                                                        ? 'text-[#B0C4DE]'
                                                        : 'text-gray-600'
                                                )}
                                            >
                                                of {def?.label ?? agg.field}
                                            </span>
                                        )}
                                        <span
                                            className={clsx(
                                                'ml-2',
                                                isDark
                                                    ? 'text-[#4A6080]'
                                                    : 'text-gray-400'
                                            )}
                                        >
                                            → {agg.alias}
                                        </span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onRemoveAggregation(agg.id)
                                        }
                                        className={clsx(
                                            'ml-2 transition-colors',
                                            isDark
                                                ? 'text-[#4A6080] hover:text-red-400'
                                                : 'text-gray-400 hover:text-red-500'
                                        )}
                                    >
                                        <svg
                                            className="w-3.5 h-3.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <p
                        className={clsx(
                            'text-xs mb-3',
                            isDark ? 'text-[#4A6080]' : 'text-gray-400'
                        )}
                    >
                        No metrics yet
                    </p>
                )}

                {/* Fn select */}
                <VizSelect
                    options={AGG_OPTIONS}
                    value={pendingAggFn}
                    onChange={(v) => {
                        setPendingAggFn(v as AggFn)
                        setPendingAggField('')
                    }}
                />

                {/* Field picker — only when fn needs a field */}
                {pendingAggFn !== 'count' && (
                    <div className="mt-2">
                        <FieldSelector
                            fields={fields}
                            filterFn={(f) => f.aggregatable}
                            value={pendingAggField}
                            onChange={setPendingAggField}
                            placeholder="Choose a field…"
                        />
                    </div>
                )}

                <button
                    type="button"
                    disabled={pendingAggFn !== 'count' && !pendingAggField}
                    onClick={() => {
                        onAddAggregation(
                            pendingAggFn,
                            pendingAggFn === 'count' ? '*' : pendingAggField
                        )
                        setPendingAggField('')
                    }}
                    className={addBtnCls(
                        pendingAggFn === 'count' || !!pendingAggField
                    )}
                >
                    + Add Metric
                </button>
            </div>
        </div>
    )
}
