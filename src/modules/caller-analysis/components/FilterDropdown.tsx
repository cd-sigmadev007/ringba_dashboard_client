import { useEffect, useState } from 'react'
import { useCampaignOptions } from '../constants/filterOptions'
import type { FilterState } from '../types'
import { useThemeStore } from '@/store/themeStore'
import { cn, useClickOutside } from '@/lib'
import Button from '@/components/ui/Button'
import { DurationRangeFilter, FilterSelect, TimeFilter } from '@/components/ui'
import { Search } from '@/components/common'
import { useCampaignStore } from '@/modules/org/store/campaignStore'
import { useFilterTags } from '../hooks/useFilterTags'
import { useFilterCategorySearch } from '../hooks/useFilterSearch'
import { CampaignFilterSection } from './CampaignFilterSection'

type FilterType = 'campaigns' | 'duration' | 'date' | 'type' | 'status' | 'disputeDate' | 'disputeAmount' | 'disputeStatus'

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
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
    filters,
    onFiltersChange,
    onClearAll,
    onClose,
    isOpen,
    triggerRef,
}) => {
    const [selectedFilter, setSelectedFilter] = useState<FilterType>('campaigns')
    const [campaignSearchQuery, setCampaignSearchQuery] = useState('')
    const [filterSearchQuery, setFilterSearchQuery] = useState('')
    const { statusOptions, isLoadingTags } = useFilterTags(isOpen)
    const campaignOptions = useCampaignOptions()
    const campaignsLoading = useCampaignStore((s) => s.loading)
    const { shouldShowFilter, shouldShowSection } = useFilterCategorySearch(filterSearchQuery)
    const dropdownRef = useClickOutside<HTMLDivElement>(() => {
        if (isOpen) {
            onClose()
        }
    })

    // Calculate active filter count
    const activeFilterCount =
        filters.campaignFilter.length +
        filters.statusFilter.length +
        (filters.durationRange.min !== undefined ||
        filters.durationRange.max !== undefined
            ? 1
            : 0) +
        (filters.searchQuery ? 1 : 0) +
        (filters.dateRange.from ? 1 : 0)

    // Calculate dropdown position
    const [position, setPosition] = useState<{
        top?: number
        bottom?: number
        left?: number
        right?: number
    }>({})

    useEffect(() => {
        if (isOpen && triggerRef?.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            const spaceAbove = rect.top

            if (spaceBelow < 600 && spaceAbove > spaceBelow) {
                setPosition({
                    bottom: window.innerHeight - rect.top,
                    left: rect.left,
                })
            } else {
                setPosition({
                    top: rect.bottom + 8,
                    left: rect.left,
                })
            }
        }
    }, [isOpen, triggerRef])


    // Handle campaign toggle
    const handleCampaignToggle = (campaignValue: string) => {
        const currentCampaigns = filters.campaignFilter || []
        const isSelected = currentCampaigns.includes(campaignValue)
        
        if (isSelected) {
            onFiltersChange.campaign(
                currentCampaigns.filter((c) => c !== campaignValue)
            )
        } else {
            onFiltersChange.campaign([...currentCampaigns, campaignValue])
        }
    }

    if (!isOpen) return null

    return (
        <div
            ref={dropdownRef}
            className={cn(
                'fixed z-[1000] backdrop-blur-[25px] backdrop-filter',
                'bg-[rgba(7,27,47,0.9)] border border-[#132f4c]',
                'rounded-[7px] shadow-lg',
                'w-[650px] max-h-[600px] flex flex-col'
            )}
            style={position}
        >
            <div className="flex flex-col gap-[15px] p-[20px] flex-1 overflow-hidden">
                {/* Main Content: Two Column Layout */}
                <div className="flex gap-[16px] flex-1 min-h-0">
                    {/* Left Panel: Filter Categories */}
                    <div className="w-[220px] flex flex-col gap-[10px] h-full overflow-hidden">
                        {/* Search Filters Header */}
                        <div className="shrink-0">
                            <Search
                                placeholder="Search Filters"
                                className="w-full"
                                onSearch={(query) => setFilterSearchQuery(query)}
                                disableDropdown={true}
                            />
                        </div>

                        {/* Filter Categories List */}
                        <div className="flex-1 overflow-y-auto custom-scroll flex flex-col gap-[16px]">
                            {/* CALLS Section */}
                            {shouldShowSection('Calls', [
                                'Campaigns',
                                'Duration',
                                'Date',
                                'Type',
                                'Status',
                            ]) && (
                                <div className="flex flex-col items-start">
                                    <div className="flex gap-[8px] items-center px-[10px] py-[8px] rounded-[7px] w-full">
                                        <p
                                            className={cn(
                                                'font-["Poppins:SemiBold",sans-serif]',
                                                'leading-[normal] not-italic text-[14px]',
                                                'text-[#a1a5b7] text-nowrap uppercase'
                                            )}
                                        >
                                            Calls
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-start px-[16px] py-0 w-full">
                                        {/* Campaigns */}
                                        {shouldShowFilter('Campaigns') && (
                                            <button
                                                onClick={() =>
                                                    setSelectedFilter('campaigns')
                                                }
                                                className={cn(
                                                    'flex gap-[8px] items-center px-[10px] py-[5px]',
                                                    'rounded-[7px] w-full text-left',
                                                    'hover:opacity-80 transition-opacity'
                                                )}
                                            >
                                                <p
                                                    className={cn(
                                                        'font-["Poppins:Regular",sans-serif]',
                                                        'leading-[normal] not-italic text-[14px]',
                                                        'text-nowrap',
                                                        selectedFilter ===
                                                            'campaigns'
                                                            ? 'text-[#007fff]'
                                                            : 'text-[#f5f8fa]'
                                                    )}
                                                >
                                                    Campaigns
                                                </p>
                                            </button>
                                        )}
                                        {/* Duration */}
                                        {shouldShowFilter('Duration') && (
                                            <button
                                                onClick={() =>
                                                    setSelectedFilter('duration')
                                                }
                                                className={cn(
                                                    'flex gap-[10px] items-center px-[10px] py-[5px]',
                                                    'rounded-[7px] w-full text-left',
                                                    'hover:opacity-80 transition-opacity'
                                                )}
                                            >
                                                <p
                                                    className={cn(
                                                        'font-["Poppins:Regular",sans-serif]',
                                                        'leading-[normal] not-italic text-[14px]',
                                                        'text-nowrap',
                                                        selectedFilter ===
                                                            'duration'
                                                            ? 'text-[#007fff]'
                                                            : 'text-[#f5f8fa]'
                                                    )}
                                                >
                                                    Duration
                                                </p>
                                            </button>
                                        )}
                                        {/* Date */}
                                        {shouldShowFilter('Date') && (
                                            <button
                                                onClick={() =>
                                                    setSelectedFilter('date')
                                                }
                                                className={cn(
                                                    'flex gap-[10px] items-center px-[10px] py-[5px]',
                                                    'rounded-[7px] w-full text-left',
                                                    'hover:opacity-80 transition-opacity'
                                                )}
                                            >
                                                <p
                                                    className={cn(
                                                        'font-["Poppins:Regular",sans-serif]',
                                                        'leading-[normal] not-italic text-[14px]',
                                                        'text-nowrap',
                                                        selectedFilter === 'date'
                                                            ? 'text-[#007fff]'
                                                            : 'text-[#f5f8fa]'
                                                    )}
                                                >
                                                    Date
                                                </p>
                                            </button>
                                        )}
                                        {/* Type */}
                                        {shouldShowFilter('Type') && (
                                            <button
                                                onClick={() =>
                                                    setSelectedFilter('type')
                                                }
                                                className={cn(
                                                    'flex gap-[10px] items-center px-[10px] py-[5px]',
                                                    'rounded-[7px] w-full text-left',
                                                    'hover:opacity-80 transition-opacity'
                                                )}
                                            >
                                                <p
                                                    className={cn(
                                                        'font-["Poppins:Regular",sans-serif]',
                                                        'leading-[normal] not-italic text-[14px]',
                                                        'text-nowrap',
                                                        selectedFilter === 'type'
                                                            ? 'text-[#007fff]'
                                                            : 'text-[#f5f8fa]'
                                                    )}
                                                >
                                                    Type
                                                </p>
                                            </button>
                                        )}
                                        {/* Status */}
                                        {shouldShowFilter('Status') && (
                                            <button
                                                onClick={() =>
                                                    setSelectedFilter('status')
                                                }
                                                className={cn(
                                                    'flex gap-[10px] items-center px-[10px] py-[5px]',
                                                    'rounded-[7px] w-full text-left',
                                                    'hover:opacity-80 transition-opacity'
                                                )}
                                            >
                                                <p
                                                    className={cn(
                                                        'font-["Poppins:Regular",sans-serif]',
                                                        'leading-[normal] not-italic text-[14px]',
                                                        'text-nowrap',
                                                        selectedFilter ===
                                                            'status'
                                                            ? 'text-[#007fff]'
                                                            : 'text-[#f5f8fa]'
                                                    )}
                                                >
                                                    Status
                                                </p>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* DISPUTE Section */}
                            {shouldShowSection('Dispute', [
                                'Dispute Date',
                                'Dispute Amount',
                                'Dispute Status',
                            ]) && (
                                <div className="flex flex-col items-start">
                                    <div className="flex gap-[8px] items-center px-[10px] py-[8px] rounded-[7px] w-full">
                                        <p
                                            className={cn(
                                                'font-["Poppins:SemiBold",sans-serif]',
                                                'leading-[normal] not-italic text-[14px]',
                                                'text-[#a1a5b7] text-nowrap uppercase'
                                            )}
                                        >
                                            Dispute
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-start px-[16px] py-0 w-full">
                                        {shouldShowFilter('Dispute Date') && (
                                            <button
                                                onClick={() =>
                                                    setSelectedFilter('disputeDate')
                                                }
                                                className={cn(
                                                    'flex gap-[8px] items-center px-[10px] py-[5px]',
                                                    'rounded-[7px] w-full text-left',
                                                    'hover:opacity-80 transition-opacity'
                                                )}
                                            >
                                                <p
                                                    className={cn(
                                                        'font-["Poppins:Regular",sans-serif]',
                                                        'leading-[normal] not-italic text-[14px]',
                                                        'text-nowrap',
                                                        selectedFilter ===
                                                            'disputeDate'
                                                            ? 'text-[#007fff]'
                                                            : 'text-[#f5f8fa]'
                                                    )}
                                                >
                                                    Dispute Date
                                                </p>
                                            </button>
                                        )}
                                        {shouldShowFilter('Dispute Amount') && (
                                            <button
                                                onClick={() =>
                                                    setSelectedFilter(
                                                        'disputeAmount'
                                                    )
                                                }
                                                className={cn(
                                                    'flex gap-[10px] items-center px-[10px] py-[5px]',
                                                    'rounded-[7px] w-full text-left',
                                                    'hover:opacity-80 transition-opacity'
                                                )}
                                            >
                                                <p
                                                    className={cn(
                                                        'font-["Poppins:Regular",sans-serif]',
                                                        'leading-[normal] not-italic text-[14px]',
                                                        'text-nowrap',
                                                        selectedFilter ===
                                                            'disputeAmount'
                                                            ? 'text-[#007fff]'
                                                            : 'text-[#f5f8fa]'
                                                    )}
                                                >
                                                    Dispute Amount
                                                </p>
                                            </button>
                                        )}
                                        {shouldShowFilter('Dispute Status') && (
                                            <button
                                                onClick={() =>
                                                    setSelectedFilter(
                                                        'disputeStatus'
                                                    )
                                                }
                                                className={cn(
                                                    'flex gap-[10px] items-center px-[10px] py-[5px]',
                                                    'rounded-[7px] w-full text-left',
                                                    'hover:opacity-80 transition-opacity'
                                                )}
                                            >
                                                <p
                                                    className={cn(
                                                        'font-["Poppins:Regular",sans-serif]',
                                                        'leading-[normal] not-italic text-[14px]',
                                                        'text-nowrap',
                                                        selectedFilter ===
                                                            'disputeStatus'
                                                            ? 'text-[#007fff]'
                                                            : 'text-[#f5f8fa]'
                                                    )}
                                                >
                                                    Dispute Status
                                                </p>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Filter Content */}
                    <div className="flex-1 flex flex-col gap-[10px] h-full overflow-hidden">
                        {selectedFilter === 'campaigns' && (
                            <CampaignFilterSection
                                campaigns={campaignOptions}
                                selectedCampaigns={filters.campaignFilter}
                                onCampaignToggle={handleCampaignToggle}
                                searchQuery={campaignSearchQuery}
                                onSearchChange={setCampaignSearchQuery}
                                isLoading={campaignsLoading}
                            />
                        )}

                        {selectedFilter === 'duration' && (
                            <div className="flex-1 overflow-y-auto custom-scroll">
                                <DurationRangeFilter
                                    value={filters.durationRange}
                                    onChange={onFiltersChange.durationRange}
                                    className="w-full"
                                />
                            </div>
                        )}

                        {selectedFilter === 'date' && (
                            <div className="flex-1 overflow-y-auto custom-scroll">
                                <TimeFilter
                                    onChange={onFiltersChange.dateRange}
                                    className="w-full"
                                />
                            </div>
                        )}

                        {selectedFilter === 'type' && (
                            <div className="flex-1 overflow-y-auto custom-scroll flex items-center justify-center">
                                <p className="text-[14px] text-[#a1a5b7]">
                                    Type filter coming soon
                                </p>
                            </div>
                        )}

                        {selectedFilter === 'status' && (
                            <div className="flex-1 overflow-y-auto custom-scroll">
                                {isLoadingTags ? (
                                    <div className="flex items-center justify-center py-4">
                                        <span className="text-[14px] text-[#a1a5b7]">
                                            Loading tags...
                                        </span>
                                    </div>
                                ) : (
                                    <FilterSelect
                                        defaultValue={{
                                            title: 'Status',
                                            value: 'status',
                                        }}
                                        filterList={statusOptions}
                                        setFilter={onFiltersChange.status}
                                        multiple={true}
                                        selectedValues={filters.statusFilter}
                                        className="w-full"
                                    />
                                )}
                            </div>
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
                <div className="border-t border-[#1b456f] flex items-center justify-between shrink-0 pt-0">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            onClearAll()
                            onClose()
                        }}
                        className={cn(
                            'border border-[#1b456f] px-[15px] py-[9px]',
                            'rounded-[7px] h-auto min-h-0',
                            'text-[#a1a5b7]'
                        )}
                    >
                        Clear All
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onClose}
                        className="px-[15px] py-[9px] rounded-[7px] h-auto min-h-0"
                    >
                        Apply {activeFilterCount > 0 ? `${activeFilterCount} ` : ''}
                        Filter{activeFilterCount !== 1 ? 's' : ''}
                    </Button>
                </div>
            </div>
        </div>
    )
}
