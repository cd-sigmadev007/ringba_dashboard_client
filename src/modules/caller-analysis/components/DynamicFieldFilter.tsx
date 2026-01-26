import React, { useState, useEffect } from 'react'
import { useGetFieldValues } from '../graphql/hooks'
import type { FieldDefinition, CallerFilter } from '../graphql/types'
import { FilterOperator } from '../graphql/types'
import Button from '@/components/ui/Button'

interface DynamicFieldFilterProps {
    field: FieldDefinition
    value?: any
    operator?: FilterOperator
    onChange: (value: any, operator: FilterOperator) => void
    onRemove: () => void
    baseFilter?: CallerFilter // For filtering field values
}

export const DynamicFieldFilter: React.FC<DynamicFieldFilterProps> = ({
    field,
    value,
    operator = FilterOperator.EQ,
    onChange,
    onRemove,
    baseFilter,
}) => {
    const [localValue, setLocalValue] = useState(value || '')
    const [localOperator, setLocalOperator] = useState(operator)
    const [showValues, setShowValues] = useState(false)

    // Fetch distinct values for this field
    const { data: fieldValues, isLoading } = useGetFieldValues(
        field.name,
        baseFilter,
        100
    )

    useEffect(() => {
        if (localValue !== value || localOperator !== operator) {
            onChange(localValue, localOperator)
        }
    }, [localValue, localOperator])

    const renderInput = () => {
        switch (field.type) {
            case 'STRING':
                return (
                    <div className="relative">
                        <input
                            type="text"
                            value={localValue}
                            onChange={(e) => setLocalValue(e.target.value)}
                            placeholder={`Filter by ${field.name}`}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            onFocus={() => setShowValues(true)}
                        />
                        {showValues && fieldValues && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {isLoading ? (
                                    <div className="p-2 text-sm text-gray-500">
                                        Loading...
                                    </div>
                                ) : (
                                    fieldValues.edges.map((edge) => (
                                        <div
                                            key={edge.cursor}
                                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between"
                                            onClick={() => {
                                                setLocalValue(edge.node.value)
                                                setShowValues(false)
                                            }}
                                        >
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {edge.node.value || '(empty)'}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {edge.node.count}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )

            case 'NUMBER':
                return (
                    <input
                        type="number"
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        placeholder={`Filter by ${field.name}`}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                )

            case 'BOOLEAN':
                return (
                    <select
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="">All</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                )

            case 'DATE':
                return (
                    <input
                        type="date"
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                )

            default:
                return (
                    <input
                        type="text"
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        placeholder={`Filter by ${field.name}`}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                )
        }
    }

    return (
        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[100px]">
                {field.name}
            </span>

            <select
                value={localOperator}
                onChange={(e) => setLocalOperator(e.target.value as FilterOperator)}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
            >
                <option value={FilterOperator.EQ}>=</option>
                <option value={FilterOperator.NE}>≠</option>
                <option value={FilterOperator.IN}>In</option>
                <option value={FilterOperator.NOT_IN}>Not In</option>
                <option value={FilterOperator.CONTAINS}>Contains</option>
                {field.type === 'NUMBER' && (
                    <>
                        <option value={FilterOperator.GT}>&gt;</option>
                        <option value={FilterOperator.GTE}>&gt;=</option>
                        <option value={FilterOperator.LT}>&lt;</option>
                        <option value={FilterOperator.LTE}>&lt;=</option>
                    </>
                )}
            </select>

            <div className="flex-1">{renderInput()}</div>

            <Button
                variant="ghost"
                onClick={onRemove}
                className="text-red-600 hover:text-red-700"
            >
                ✕
            </Button>
        </div>
    )
}
