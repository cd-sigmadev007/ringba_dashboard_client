/**
 * FilterRuleRow.tsx
 * A single filter rule row: field picker + operator + value input.
 * Stacked layout: field on its own row, then operator + value side-by-side.
 */
import React, { useMemo } from 'react'
import clsx from 'clsx'
import { DATE_PRESET_LABELS } from '../types'
import { FieldSelector } from './FieldSelector'
import { OperatorSelector } from './OperatorSelector'
import { VizSelect } from './VizSelect'
import type { FieldDef, FilterRule, VisualizerSchema } from '../types'
import type { VizSelectOption } from './VizSelect'
import { useThemeStore } from '@/store/themeStore'

interface Props {
    rule: FilterRule
    fields: Array<FieldDef>
    schema: VisualizerSchema | undefined
    onUpdate: (patch: Partial<Omit<FilterRule, 'id' | 'type'>>) => void
    onRemove: () => void
}

const noValueOperators = new Set(['is_null', 'is_not_null'])

export const FilterRuleRow: React.FC<Props> = ({
    rule,
    fields,
    schema,
    onUpdate,
    onRemove,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const fieldDef = useMemo(
        () => fields.find((f) => f.key === rule.field),
        [fields, rule.field]
    )
    const showValue = !noValueOperators.has(rule.operator)

    const inputCls = clsx(
        'w-full rounded-lg px-3 py-2 text-sm border outline-none',
        isDark
            ? 'bg-[#0A1929] border-[#1E3A5F] text-[#F5F8FA] placeholder:text-[#4A6080]'
            : 'bg-white border-gray-200 text-[#3F4254] placeholder:text-gray-400'
    )

    const renderValueInput = () => {
        if (!showValue || !fieldDef) return null

        if (rule.operator === 'date_preset') {
            const presetOpts: Array<VizSelectOption> = [
                { label: 'Select preset…', value: '' },
                ...Object.entries(DATE_PRESET_LABELS).map(([k, v]) => ({
                    label: v,
                    value: k,
                })),
            ]
            return (
                <VizSelect
                    options={presetOpts}
                    value={String(rule.value ?? '')}
                    onChange={(v) => onUpdate({ value: v })}
                />
            )
        }

        if (fieldDef.type === 'boolean') {
            const boolOpts: Array<VizSelectOption> = [
                { label: 'Select…', value: '' },
                { label: 'True', value: 'true' },
                { label: 'False', value: 'false' },
            ]
            return (
                <VizSelect
                    options={boolOpts}
                    value={String(rule.value ?? '')}
                    onChange={(v) => onUpdate({ value: v === 'true' })}
                />
            )
        }

        if (fieldDef.enumValues?.length) {
            if (rule.operator === 'in' || rule.operator === 'not_in') {
                const vals: Array<string> = Array.isArray(rule.value)
                    ? rule.value
                    : []
                return (
                    <div className="flex flex-wrap gap-1.5">
                        {fieldDef.enumValues.map((ev) => (
                            <button
                                key={ev}
                                type="button"
                                onClick={() => {
                                    const next = vals.includes(ev)
                                        ? vals.filter((v) => v !== ev)
                                        : [...vals, ev]
                                    onUpdate({ value: next })
                                }}
                                className={clsx(
                                    'px-2.5 py-1 rounded-full text-xs border font-medium transition-colors',
                                    vals.includes(ev)
                                        ? 'bg-blue-500 border-blue-600 text-white'
                                        : isDark
                                          ? 'bg-[#1E3A5F] border-[#2A5F8F] text-[#B0C4DE] hover:border-blue-500/50'
                                          : 'bg-gray-100 border-gray-200 text-gray-600 hover:border-blue-300'
                                )}
                            >
                                {ev}
                            </button>
                        ))}
                    </div>
                )
            }
            return (
                <VizSelect
                    options={[
                        { label: 'Select…', value: '' },
                        ...fieldDef.enumValues.map((ev) => ({
                            label: ev,
                            value: ev,
                        })),
                    ]}
                    value={String(rule.value ?? '')}
                    onChange={(v) => onUpdate({ value: v })}
                />
            )
        }

        if (rule.operator === 'between') {
            const [lo = '', hi = ''] = Array.isArray(rule.value)
                ? rule.value
                : []
            return (
                <div className="flex items-center gap-2">
                    <input
                        className={inputCls}
                        type={
                            fieldDef.type === 'timestamp'
                                ? 'datetime-local'
                                : 'text'
                        }
                        value={lo}
                        onChange={(e) =>
                            onUpdate({ value: [e.target.value, hi] })
                        }
                        placeholder="From"
                    />
                    <span
                        className={clsx(
                            'text-xs shrink-0',
                            isDark ? 'text-[#4A6080]' : 'text-gray-400'
                        )}
                    >
                        to
                    </span>
                    <input
                        className={inputCls}
                        type={
                            fieldDef.type === 'timestamp'
                                ? 'datetime-local'
                                : 'text'
                        }
                        value={hi}
                        onChange={(e) =>
                            onUpdate({ value: [lo, e.target.value] })
                        }
                        placeholder="To"
                    />
                </div>
            )
        }

        if (rule.operator === 'in' || rule.operator === 'not_in') {
            const vals: Array<string> = Array.isArray(rule.value)
                ? rule.value
                : rule.value
                  ? [String(rule.value)]
                  : []
            return (
                <input
                    className={inputCls}
                    value={vals.join(', ')}
                    onChange={(e) =>
                        onUpdate({
                            value: e.target.value
                                .split(',')
                                .map((v) => v.trim())
                                .filter(Boolean),
                        })
                    }
                    placeholder="value1, value2, …"
                />
            )
        }

        return (
            <input
                className={inputCls}
                type={
                    fieldDef.type === 'timestamp'
                        ? 'datetime-local'
                        : fieldDef.type === 'numeric'
                          ? 'number'
                          : 'text'
                }
                value={rule.value ?? ''}
                onChange={(e) => onUpdate({ value: e.target.value })}
                placeholder="Value…"
            />
        )
    }

    return (
        <div
            className={clsx(
                'rounded-lg border p-3 space-y-2.5',
                isDark
                    ? 'bg-[#0A1929]/60 border-[#1E3A5F]'
                    : 'bg-gray-50 border-gray-200'
            )}
        >
            {/* Row 1: Field selector + remove button */}
            <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                    <FieldSelector
                        fields={fields}
                        filterFn={(f) => f.filterable}
                        value={rule.field}
                        onChange={(key) =>
                            onUpdate({ field: key, operator: 'eq', value: '' })
                        }
                        placeholder="Select field…"
                    />
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className={clsx(
                        'p-1.5 rounded-lg transition-colors flex-shrink-0',
                        isDark
                            ? 'hover:bg-red-900/30 text-[#4A6080] hover:text-red-400'
                            : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                    )}
                    title="Remove rule"
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

            {/* Row 2: Operator selector */}
            {rule.field && (
                <OperatorSelector
                    fieldType={fieldDef?.type}
                    schema={schema}
                    value={rule.operator}
                    onChange={(op) => onUpdate({ operator: op, value: '' })}
                    disabled={!rule.field}
                />
            )}

            {/* Row 3: Value input */}
            {rule.field && showValue && <div>{renderValueInput()}</div>}
        </div>
    )
}
