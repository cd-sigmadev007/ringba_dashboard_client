/**
 * OperatorSelector.tsx
 * Dropdown that only shows operators valid for the selected field type.
 * Uses VizSelect for consistent design with no clipping.
 */
import React, { useMemo } from 'react'
import type { FieldType, Operator, VisualizerSchema } from '../types'
import { OPERATOR_LABELS } from '../types'
import { VizSelect } from './VizSelect'
import type { VizSelectOption } from './VizSelect'

interface Props {
    fieldType: FieldType | undefined
    schema: VisualizerSchema | undefined
    value: Operator
    onChange: (op: Operator) => void
    disabled?: boolean
}

export const OperatorSelector: React.FC<Props> = ({ fieldType, schema, value, onChange, disabled }) => {
    const options = useMemo<VizSelectOption[]>(() => {
        const ops: Operator[] = fieldType && schema
            ? (schema.allowedOperators[fieldType] ?? [])
            : (Object.keys(OPERATOR_LABELS) as Operator[])
        return ops.map((op) => ({ label: OPERATOR_LABELS[op] ?? op, value: op }))
    }, [fieldType, schema])

    return (
        <VizSelect
            options={options}
            value={value}
            onChange={(v) => onChange(v as Operator)}
            disabled={disabled || !fieldType}
            placeholder="Select operator…"
        />
    )
}
