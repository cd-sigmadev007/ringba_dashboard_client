import { useEffect, useState } from 'react'
import { useCampaignOptions } from '../constants/filterOptions'
import { useFilterTags } from '../hooks/useFilterTags'
import { useFilterCategorySearch } from '../hooks/useFilterSearch'
import { CampaignFilterSection } from './CampaignFilterSection'
import type { FilterState } from '../types'
import { cn, useClickOutside, useIsMobile } from '@/lib'
import Button from '@/components/ui/Button'
import { DurationRangeFilter, TimeFilter } from '@/components/ui'
import { Search } from '@/components/common'
import { useCampaignStore } from '@/modules/org/store/campaignStore'
import { CheckboxIcon } from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'

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
    filterType?: FilterType // Optional: specify which filter to show directly
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
    const [selectedFilter, setSelectedFilter] = useState<FilterType>(
        filterType || 'campaigns'
    )
    const [campaignSearchQuery, setCampaignSearchQuery] = useState('')
    const [filterSearchQuery, setFilterSearchQuery] = useState('')
    const [statusSearchQuery, setStatusSearchQuery] = useState('')
    
    // Temporary filter state (only applied when clicking Apply button)
    const [tempFilters, setTempFilters] = useState<FilterState>(filters)
    
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const { statusOptions, isLoadingTags } = useFilterTags(isOpen)
    const campaignOptions = useCampaignOptions()
    const campaignsLoading = useCampaignStore((s) => s.loading)
    const { shouldShowFilter, shouldShowSection } =
        useFilterCategorySearch(filterSearchQuery)
    const isMobile = useIsMobile()

    // Sync tempFilters with filters when dropdown opens
    useEffect(() => {
        if (isOpen) {
            setTempFilters(filters)
        }
    }, [isOpen, filters])

    // Update selectedFilter when filterType prop changes
    useEffect(() => {
        if (filterType) {
            setSelectedFilter(filterType)
        }
    }, [filterType])
    const dropdownRef = useClickOutside<HTMLDivElement>(() => {
        if (isOpen) {
            onClose()
        }
    })

    // Calculate active filter count from tempFilters (to show count as user selects)
    const activeFilterCount =
        tempFilters.campaignFilter.length +
        tempFilters.statusFilter.length +
        (tempFilters.durationRange.min !== undefined ||
        tempFilters.durationRange.max !== undefined
            ? 1
            : 0) +
        (tempFilters.searchQuery ? 1 : 0) +
        (tempFilters.dateRange.from ? 1 : 0)

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

    // Handle campaign toggle (update temp state only)
    const handleCampaignToggle = (campaignValue: string) => {
        const currentCampaigns = tempFilters.campaignFilter || []
        const isSelected = currentCampaigns.includes(campaignValue)

        if (isSelected) {
            setTempFilters({
                ...tempFilters,
                campaignFilter: currentCampaigns.filter((c) => c !== campaignValue),
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
                    <div
                        className={cn(
                            'flex flex-col gap-[10px] h-full overflow-hidden min-h-0',
                            isMobile ? 'w-full' : 'w-[220px]'
                        )}
                    >
                        {/* Search Filters Header */}
                        <Search
                            placeholder="Search Filters"
                            className="w-full"
                            onSearch={(query) => setFilterSearchQuery(query)}
                            disableDropdown={true}
                            customBg="bg-[#132f4c]"
                            customHeight="h-[37px]"
                            inputClassName="!bg-transparent !border-none focus:!border-none text-[#7e8299] placeholder:!text-[#7e8299]"
                        />

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
                                                    setSelectedFilter(
                                                        'campaigns'
                                                    )
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
                                                    setSelectedFilter(
                                                        'duration'
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
                                                        selectedFilter ===
                                                            'date'
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
                                                        selectedFilter ===
                                                            'type'
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
                                                    setSelectedFilter(
                                                        'disputeDate'
                                                    )
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
                            <div className="flex-1 flex flex-col gap-[24px] overflow-y-auto custom-scroll">
                                <p
                                    className={cn(
                                        'font-["Poppins:SemiBold",sans-serif]',
                                        'leading-[normal] not-italic text-[14px]',
                                        'text-[#a1a5b7] text-nowrap uppercase shrink-0'
                                    )}
                                >
                                    Duration
                                </p>
                                <DurationRangeFilter
                                    value={tempFilters.durationRange}
                                    onChange={(range) => {
                                        setTempFilters({
                                            ...tempFilters,
                                            durationRange: range,
                                        })
                                    }}
                                    className="w-full"
                                    filterType="raw"
                                />
                            </div>
                        )}

                        {selectedFilter === 'date' && (
                            <div className="flex-1 flex flex-col gap-[24px] overflow-y-auto custom-scroll">
                                <p
                                    className={cn(
                                        'font-["Poppins:SemiBold",sans-serif]',
                                        'leading-[normal] not-italic text-[14px]',
                                        'text-[#a1a5b7] text-nowrap uppercase shrink-0'
                                    )}
                                >
                                    Date
                                </p>
                                <TimeFilter
                                    value={tempFilters.dateRange}
                                    onChange={(range) => {
                                        setTempFilters({
                                            ...tempFilters,
                                            dateRange: range,
                                        })
                                    }}
                                    className="w-full"
                                    filterType="raw"
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
                            <>
                                <div className="flex flex-col gap-[5px] items-start shrink-0">
                                    <p
                                        className={cn(
                                            'font-["Poppins:SemiBold",sans-serif]',
                                            'leading-[normal] not-italic text-[14px]',
                                            'text-[#a1a5b7] text-nowrap uppercase'
                                        )}
                                    >
                                        Status
                                    </p>
                                    <Search
                                        placeholder="Search Status"
                                        className="w-full"
                                        onSearch={(query) => {
                                            setStatusSearchQuery(query)
                                        }}
                                        disableDropdown={true}
                                        customBg="bg-[#132f4c]"
                                        customHeight="h-[37px]"
                                        inputClassName="!bg-transparent !border-none focus:!border-none text-[#7e8299] placeholder:!text-[#7e8299]"
                                    />
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scroll flex flex-col gap-[5px]">
                                    {isLoadingTags ? (
                                        <div className="flex items-center justify-center py-4">
                                            <span className="text-[14px] text-[#a1a5b7]">
                                                Loading tags...
                                            </span>
                                        </div>
                                    ) : (
                                        statusOptions
                                            .filter((option) =>
                                                option.title
                                                    .toLowerCase()
                                                    .includes(
                                                        statusSearchQuery.toLowerCase()
                                                    )
                                            )
                                            .map((option) => {
                                                const isSelected = tempFilters.statusFilter.includes(
                                                    option.value
                                                )
                                                return (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => handleStatusToggle(option.value)}
                                                        className={cn(
                                                            'flex gap-[10px] items-center p-[5px]',
                                                            'rounded-[7px] w-full text-left',
                                                            'hover:opacity-80 transition-opacity',
                                                            'box-border'
                                                        )}
                                                    >
                                                        <CheckboxIcon
                                                            checked={isSelected}
                                                            isDark={isDark}
                                                            className="size-[20px] shrink-0"
                                                        />
                                                        <p
                                                            className={cn(
                                                                'font-["Poppins:Regular",sans-serif]',
                                                                'leading-[normal] not-italic text-[14px]',
                                                                'text-[#f5f8fa] text-nowrap'
                                                            )}
                                                        >
                                                            {option.title}
                                                        </p>
                                                    </button>
                                                )
                                            })
                                    )}
                                </div>
                            </>
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
                        onClick={() => {
                            onClearAll()
                            onClose()
                        }}
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
