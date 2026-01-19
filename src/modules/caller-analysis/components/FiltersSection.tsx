import React, { useEffect, useState } from 'react'
import {
    DurationRangeFilter,
    FilterSelect,
    TimeFilter,
} from '../../../components/ui'
import { Search } from '../../../components/common'
import { useCampaignOptions } from '../constants/filterOptions'
import type { FilterState } from '../types'
import type { SelectOption } from '@/components/ui/FilterSelect'
import { useAuth } from '@/contexts/AuthContext'
import { callerAnalysisApi } from '@/services/api/callerAnalysis'
import { apiClient } from '@/services/api'
import { useCampaignStore } from '@/modules/org/store/campaignStore'

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
    const campaignOptions = useCampaignOptions()
    const campaignsLoading = useCampaignStore((s) => s.loading)
    const { user, loading: authLoading } = useAuth()
    const isAuthenticated = !!user

    // Fetch tags from database when auth is ready
    useEffect(() => {
        const fetchTagsInternal = async () => {
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

        const fetchTags = () => {
            // Don't fetch if auth is still loading
            if (authLoading) {
                return
            }

            // Wait for auth initialization before fetching tags
            if (!isAuthenticated || !apiClient.isAuthInitialized()) {
                // Wait for apiClient to be initialized (max 2 seconds)
                const maxAttempts = 20
                let attempts = 0
                const checkAuth = setInterval(() => {
                    attempts++
                    if (
                        apiClient.isAuthInitialized() ||
                        attempts >= maxAttempts
                    ) {
                        clearInterval(checkAuth)
                        if (apiClient.isAuthInitialized() && isAuthenticated) {
                            // Now fetch tags
                            fetchTagsInternal()
                        } else {
                            setIsLoadingTags(false)
                        }
                    }
                }, 100)
                return () => clearInterval(checkAuth)
            }

            // Auth is ready, fetch tags
            fetchTagsInternal()
        }

        fetchTags()
    }, [authLoading, isAuthenticated])

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
            {campaignsLoading ? (
                <div className="col-span-1 flex items-center justify-center">
                    <span className="text-sm text-gray-500">
                        Loading campaigns...
                    </span>
                </div>
            ) : (
                <FilterSelect
                    defaultValue={{ title: 'Campaign', value: 'campaign' }}
                    filterList={campaignOptions}
                    setFilter={onFiltersChange.campaign}
                    multiple={true}
                    selectedValues={filters.campaignFilter}
                    className="col-span-1"
                />
            )}
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
