import { useEffect, useState } from 'react'
import { useCampaignOptions } from '../constants/filterOptions'
import {
    useActiveFilterCount,
    useFilterDropdown,
} from '../hooks/useFilterDropdown'
import { useFilterStore } from '../store/filterStore'
import { CampaignFilterSection } from './CampaignFilterSection'
import { StatusFilterSection } from './StatusFilterSection'
import { DurationFilterSection } from './DurationFilterSection'
import { DateFilterSection } from './DateFilterSection'
import { FilterCategoriesPanel } from './FilterCategoriesPanel'
import type { FilterState } from '../types'
import { cn, useIsMobile } from '@/lib'
import Button from '@/components/ui/Button'
import { useCampaignStore } from '@/modules/org/store/campaignStore'

type FilterType =
    | 'campaigns'
    | 'duration'
    | 'date'
    | 'type'
    | 'status'
    | 'disputeDate'
    | 'disputeAmount'
    | 'disputeStatus'

interface FilterDropdownProps {
    filters: FilterState
    onFiltersChange: {
        dateRange: (range: { from?: Date; to?: Date }) => void
        campaign: (value: string | Array<string>) => void
        status: (value: string | Array<string>) => void
        durationRange: (range: { min?: number; max?: number }) => void
        search: (query: string) => void
    }
    onClearAll: () => void
    onClose: () => void
    isOpen: boolean
    triggerRef?: React.RefObject<HTMLButtonElement | null>
    filterType?: FilterType
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
    filters,
    onFiltersChange,
    onClearAll,
    onClose,
    isOpen,
    triggerRef,
    filterType,
}) => {
    const [campaignSearchQuery, setCampaignSearchQuery] = useState('')
    const [filterSearchQuery, setFilterSearchQuery] = useState('')
    const [statusSearchQuery, setStatusSearchQuery] = useState('')

    const isMobile = useIsMobile()
    const campaignOptions = useCampaignOptions()
    const campaignsLoading = useCampaignStore((s) => s.loading)

    // Use Zustand store for filter state
    const {
        tempFilters,
        setTempFilters,
        applyTempFilters,
        clearAllFilters: clearStoreFilters,
    } = useFilterStore()

    // Use custom hook for dropdown logic
    const { selectedFilter, setSelectedFilter, position, dropdownRef } =
        useFilterDropdown({
            isOpen,
            onClose,
            triggerRef,
            filterType,
        })

    // Calculate active filter count
    const activeFilterCount = useActiveFilterCount(tempFilters)

    // Sync tempFilters with filters when dropdown opens
    useEffect(() => {
        if (isOpen) {
            setTempFilters(filters)
        }
    }, [isOpen, filters, setTempFilters])

    // Handle campaign toggle (update temp state only)
    const handleCampaignToggle = (campaignValue: string) => {
        const currentCampaigns = tempFilters.campaignFilter || []
        const isSelected = currentCampaigns.includes(campaignValue)

        if (isSelected) {
            setTempFilters({
                ...tempFilters,
                campaignFilter: currentCampaigns.filter(
                    (c) => c !== campaignValue
                ),
            })
        } else {
            setTempFilters({
                ...tempFilters,
                campaignFilter: [...currentCampaigns, campaignValue],
            })
        }
    }

    // Handle status toggle (update temp state only)
    const handleStatusToggle = (statusValue: string) => {
        const currentStatus = tempFilters.statusFilter || []
        const isSelected = currentStatus.includes(statusValue)

        if (isSelected) {
            setTempFilters({
                ...tempFilters,
                statusFilter: currentStatus.filter((s) => s !== statusValue),
            })
        } else {
            setTempFilters({
                ...tempFilters,
                statusFilter: [...currentStatus, statusValue],
            })
        }
    }

    // Handle apply button - apply all temp filters
    const handleApply = () => {
        onFiltersChange.campaign(tempFilters.campaignFilter)
        onFiltersChange.status(tempFilters.statusFilter)
        onFiltersChange.durationRange(tempFilters.durationRange)
        onFiltersChange.dateRange(tempFilters.dateRange)
        applyTempFilters()
        onClose()
    }

    // Handle clear all
    const handleClearAll = () => {
        clearStoreFilters()
        onClearAll()
        onClose()
    }

    if (!isOpen) return null

    return (
        <div
            ref={dropdownRef}
            className={cn(
                'fixed z-[1000] backdrop-blur-[25px] absolute left-5 backdrop-filter',
                'bg-[rgba(7,27,47,0.9)] border border-[#132f4c] border-solid',
                'rounded-[7px] shadow-lg flex flex-col',
                isMobile
                    ? 'w-full max-h-[90vh] rounded-t-[10px] rounded-b-none'
                    : 'w-[650px] max-h-[600px]'
            )}
            style={position}
        >
            <div className="flex flex-col gap-[15px] p-[20px] flex-1 overflow-hidden relative min-h-0">
                {/* Main Content: Two Column Layout */}
                <div
                    className={cn(
                        'flex flex-1 min-h-0 overflow-hidden',
                        isMobile ? 'flex-col gap-[16px]' : 'gap-[16px]'
                    )}
                >
                    {/* Left Panel: Filter Categories */}
                    <FilterCategoriesPanel
                        selectedFilter={selectedFilter}
                        onFilterSelect={setSelectedFilter}
                        searchQuery={filterSearchQuery}
                        onSearchChange={setFilterSearchQuery}
                        isMobile={isMobile}
                    />

                    {/* Right Panel: Filter Content */}
                    <div
                        className={cn(
                            'flex-1 flex flex-col gap-[10px] h-full overflow-hidden min-h-0',
                            isMobile && 'min-h-0'
                        )}
                    >
                        {selectedFilter === 'campaigns' && (
                            <CampaignFilterSection
                                campaigns={campaignOptions}
                                selectedCampaigns={tempFilters.campaignFilter}
                                onCampaignToggle={handleCampaignToggle}
                                searchQuery={campaignSearchQuery}
                                onSearchChange={setCampaignSearchQuery}
                                isLoading={campaignsLoading}
                            />
                        )}

                        {selectedFilter === 'duration' && (
                            <DurationFilterSection
                                durationRange={tempFilters.durationRange}
                                onDurationRangeChange={(range) => {
                                    setTempFilters({
                                        ...tempFilters,
                                        durationRange: range,
                                    })
                                }}
                            />
                        )}

                        {selectedFilter === 'date' && (
                            <DateFilterSection
                                dateRange={tempFilters.dateRange}
                                onDateRangeChange={(range) => {
                                    setTempFilters({
                                        ...tempFilters,
                                        dateRange: range,
                                    })
                                }}
                            />
                        )}

                        {selectedFilter === 'type' && (
                            <div className="flex-1 overflow-y-auto custom-scroll flex items-center justify-center">
                                <p className="text-[14px] text-[#a1a5b7]">
                                    Type filter coming soon
                                </p>
                            </div>
                        )}

                        {selectedFilter === 'status' && (
                            <StatusFilterSection
                                selectedStatuses={tempFilters.statusFilter}
                                onStatusToggle={handleStatusToggle}
                                searchQuery={statusSearchQuery}
                                onSearchChange={setStatusSearchQuery}
                                isOpen={isOpen}
                            />
                        )}

                        {(selectedFilter === 'disputeDate' ||
                            selectedFilter === 'disputeAmount' ||
                            selectedFilter === 'disputeStatus') && (
                            <div className="flex-1 overflow-y-auto custom-scroll flex items-center justify-center">
                                <p className="text-[14px] text-[#a1a5b7]">
                                    Dispute filters coming soon
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer: Clear All and Apply Buttons */}
                <div
                    className={cn(
                        'border-t border-[#1b456f] border-solid flex items-center justify-between shrink-0 pt-[15px]',
                        isMobile && 'flex-col gap-[10px]'
                    )}
                >
                    <Button
                        variant="ghost"
                        onClick={handleClearAll}
                        className={cn(
                            'border border-[#1b456f] border-solid px-[15px] py-[9px]',
                            'rounded-[7px] h-auto min-h-0',
                            'text-[#a1a5b7] font-["Poppins:Medium",sans-serif]',
                            'text-[14px]',
                            isMobile && 'w-full'
                        )}
                    >
                        Clear All
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleApply}
                        className={cn(
                            'bg-[#007fff] px-[15px] py-[9px] rounded-[7px]',
                            'h-auto min-h-0 font-["Poppins:Medium",sans-serif]',
                            'text-[14px] text-[#f5f8fa]',
                            isMobile && 'w-full'
                        )}
                    >
                        Apply{' '}
                        {activeFilterCount > 0 ? `${activeFilterCount} ` : ''}
                        Filter{activeFilterCount !== 1 ? 's' : ''}
                    </Button>
                </div>
            </div>
        </div>
    )
}
