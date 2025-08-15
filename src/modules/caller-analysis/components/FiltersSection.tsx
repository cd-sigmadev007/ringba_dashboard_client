import React from 'react'
import {
    DurationRangeFilter,
    FilterSelect,
    TimeFilter,
} from '../../../components/ui'
import { Search } from '../../../components/common'
import { campaignOptions, statusOptions } from '../data/mockData'
import type { FilterState } from '../types'

interface FiltersSectionProps {
    filters: FilterState
    onFiltersChange: {
        dateRange: (range: { from?: Date; to?: Date }) => void
        campaign: (value: string | Array<string>) => void
        status: (value: string | Array<string>) => void
        durationRange: (range: { min?: number; max?: number }) => void
        search: (query: string) => void
    }
}

export const FiltersSection: React.FC<FiltersSectionProps> = ({
    filters,
    onFiltersChange,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
            <TimeFilter
                onChange={onFiltersChange.dateRange}
                className="col-span-1 sm:col-span-2 lg:col-span-1"
            />
            <Search
                placeholder="Search caller ID"
                className="col-span-1"
                onSearch={onFiltersChange.search}
                disableDropdown={true}
            />
            <FilterSelect
                defaultValue={{ title: 'Campaign', value: 'campaign' }}
                filterList={campaignOptions}
                setFilter={onFiltersChange.campaign}
                multiple={true}
                selectedValues={filters.campaignFilter}
                className="col-span-1"
            />
            <FilterSelect
                defaultValue={{ title: 'Status', value: 'status' }}
                filterList={statusOptions}
                setFilter={onFiltersChange.status}
                multiple={true}
                selectedValues={filters.statusFilter}
                className="col-span-1"
            />
            <DurationRangeFilter
                value={filters.durationRange}
                onChange={onFiltersChange.durationRange}
                className="col-span-1"
            />
        </div>
    )
}
