import React from 'react'
import { useGetAvailableFields } from '../graphql/hooks'
import { DynamicFieldFilter } from './DynamicFieldFilter'
import type { FieldDefinition, FilterOperator, CallerFilter } from '../graphql/types'
import Button from '@/components/ui/Button'

interface DynamicFiltersSectionProps {
    filters: Array<{ field: FieldDefinition; value: any; operator: FilterOperator }>
    onAddFilter: () => void
    onRemoveFilter: (index: number) => void
    onFilterChange: (
        index: number,
        value: any,
        operator: FilterOperator
    ) => void
    baseFilter?: CallerFilter
}

export const DynamicFiltersSection: React.FC<DynamicFiltersSectionProps> = ({
    filters,
    onAddFilter,
    onRemoveFilter,
    onFilterChange,
    baseFilter,
}) => {
    const { data: availableFields } = useGetAvailableFields()

    const filterableFields =
        availableFields?.filter((f) => f.filterable && f.source === 'DYNAMIC') || []

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dynamic Field Filters
                </h3>
                <Button
                    variant="secondary"
                    onClick={onAddFilter}
                    disabled={filterableFields.length === 0}
                >
                    + Add Filter
                </Button>
            </div>

            {filters.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
                    No dynamic filters applied
                </div>
            ) : (
                filters.map((filter, index) => (
                    <DynamicFieldFilter
                        key={index}
                        field={filter.field}
                        value={filter.value}
                        operator={filter.operator}
                        onChange={(value, operator) =>
                            onFilterChange(index, value, operator)
                        }
                        onRemove={() => onRemoveFilter(index)}
                        baseFilter={baseFilter}
                    />
                ))
            )}
        </div>
    )
}
