import React, { useEffect, useState } from 'react'
import {
    DurationRangeFilter,
    FilterSelect,
    TimeFilter,
} from '../../../components/ui'
import { Search } from '../../../components/common'
import { campaignOptions } from '../constants/filterOptions'
import type { FilterState } from '../types'
import type { SelectOption } from '@/components/ui/FilterSelect'
import { callerAnalysisApi } from '@/services/api/callerAnalysis'

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
    const [statusOptions, setStatusOptions] = useState<Array<SelectOption>>([])
    const [isLoadingTags, setIsLoadingTags] = useState(true)

    // Fetch tags from database on component mount
    useEffect(() => {
        const fetchTags = async () => {
            try {
                setIsLoadingTags(true)
                const tags = await callerAnalysisApi.getTags()
                // Convert tags to SelectOption format
                const options: Array<SelectOption> = tags.map(
                    (tag: { tag_name: string; priority: string }) => ({
                        title: tag.tag_name,
                        value: tag.tag_name,
                    })
                )
                setStatusOptions(options)
            } catch (error) {
                console.error('Failed to fetch tags:', error)
                // Fallback to empty array on error
                setStatusOptions([])
            } finally {
                setIsLoadingTags(false)
            }
        }

        fetchTags()
    }, [])

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
            {isLoadingTags ? (
                <div className="col-span-1 flex items-center justify-center">
                    <span className="text-sm text-gray-500">
                        Loading tags...
                    </span>
                </div>
            ) : (
                <FilterSelect
                    defaultValue={{ title: 'Status', value: 'status' }}
                    filterList={statusOptions}
                    setFilter={onFiltersChange.status}
                    multiple={true}
                    selectedValues={filters.statusFilter}
                    className="col-span-1"
                />
            )}
            <DurationRangeFilter
                value={filters.durationRange}
                onChange={onFiltersChange.durationRange}
                className="col-span-1"
            />
        </div>
    )
}
