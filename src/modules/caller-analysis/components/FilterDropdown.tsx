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
import { Modal } from '@/components/ui/Modal'
import { CancelIcon } from '@/assets/svg'
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
    const [mobileView, setMobileView] = useState<'list' | 'detail'>('list')

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
            // Reset mobile view when opening
            if (isMobile) {
                setMobileView('list')
            }
        }
    }, [isOpen, filters, setTempFilters, isMobile])

    // Handle filter selection on mobile - navigate to detail view
    const handleMobileFilterSelect = (filter: FilterType) => {
        setSelectedFilter(filter)
        if (isMobile) {
            setMobileView('detail')
        }
    }

    // Handle back button on mobile
    const handleMobileBack = () => {
        setMobileView('list')
    }

    // Get filter label for mobile header
    const getFilterLabel = (filter: FilterType): string => {
        const labels: Record<FilterType, string> = {
            campaigns: 'Campaigns',
            duration: 'Duration',
            date: 'Date',
            type: 'Type',
            status: 'Status',
            disputeDate: 'Dispute Date',
            disputeAmount: 'Dispute Amount',
            disputeStatus: 'Dispute Status',
        }
        return labels[filter] || 'Filter'
    }

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

    // Render filter content (shared between desktop and mobile)
    const renderFilterContent = () => (
        <>
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
        </>
    )

    // Render filter content wrapper
    const filterContent = (
        <div className="flex flex-col h-full relative h-full">
            {/* Mobile Header with Back and Close buttons */}
            {isMobile && mobileView === 'detail' && (
                <div className="flex items-center justify-between px-0 py-0 mb-[24px] shrink-0">
                    <button
                        onClick={handleMobileBack}
                        className="p-0 hover:opacity-80 transition-opacity"
                        aria-label="Go back"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-[#f5f8fa]"
                        >
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="font-['Poppins:Medium',sans-serif] text-[20px] text-[#f5f8fa]">
                        {getFilterLabel(selectedFilter)}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-0 hover:opacity-80 transition-opacity"
                        aria-label="Close"
                    >
                        <CancelIcon className="w-6 h-6 text-[#f5f8fa]" />
                    </button>
                </div>
            )}

            {/* Main Content: Two Column Layout (Desktop) or Single View (Mobile) */}
            <div
                className={cn(
                    'flex flex-1 min-h-0',
                    isMobile && mobileView === 'list'
                        ? 'flex-col gap-[16px]'
                        : isMobile && mobileView === 'detail'
                          ? 'flex-col'
                          : 'gap-[16px] overflow-hidden'
                )}
            >
                {/* Left Panel: Filter Categories (Desktop or Mobile List View) */}
                {(!isMobile || mobileView === 'list') && (
                    <div
                        className={cn(
                            'flex flex-col',
                            isMobile
                                ? 'flex-1 min-h-0'
                                : 'h-full overflow-y-auto custom-scroll',
                            isMobile &&
                                mobileView === 'list' &&
                                'animate-in slide-in-from-left duration-300'
                        )}
                    >
                        <FilterCategoriesPanel
                            selectedFilter={selectedFilter}
                            onFilterSelect={
                                isMobile
                                    ? handleMobileFilterSelect
                                    : setSelectedFilter
                            }
                            searchQuery={filterSearchQuery}
                            onSearchChange={setFilterSearchQuery}
                            isMobile={isMobile}
                        />
                    </div>
                )}

                {/* Right Panel: Filter Content (Desktop or Mobile Detail View) */}
                {(!isMobile || mobileView === 'detail') && (
                    <div
                        className={cn(
                            'flex-1 flex flex-col gap-[10px] min-h-0',
                            !isMobile && 'h-full overflow-y-auto custom-scroll',
                            isMobile &&
                                mobileView === 'detail' &&
                                'animate-in slide-in-from-right duration-300'
                        )}
                    >
                        {renderFilterContent()}
                    </div>
                )}
            </div>

            {/* Footer: Clear All and Apply Buttons - Sticky at bottom */}
            <div
                className={cn(
                    'border-t border-[#1b456f] border-solid flex items-center justify-between shrink-0 pt-[15px]',
                    isMobile &&
                        'flex-col gap-[10px] sticky bottom-0 bg-[#071b2f] -mx-[20px] px-[20px] z-10',
                    !isMobile && 'mt-[15px]'
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
                    Apply {activeFilterCount > 0 ? `${activeFilterCount} ` : ''}
                    Filter{activeFilterCount !== 1 ? 's' : ''}
                </Button>
            </div>
        </div>
    )

    if (!isOpen) return null

    // Mobile: Use Modal component
    if (isMobile) {
        return (
            <Modal
                open={isOpen}
                onClose={onClose}
                title={mobileView === 'list' ? 'Apply Filters' : undefined}
                position="bottom"
                size="full"
                animation="slide"
                overlay="default"
                className="bg-[#071b2f] h-[75vh] flex flex-col"
                contentClassName={cn(
                    'p-[20px] flex flex-col h-full',
                    isMobile && 'pb-0'
                )}
                showCloseButton={mobileView === 'list'}
            >
                {filterContent}
            </Modal>
        )
    }

    // Desktop: Use dropdown
    return (
        <div
            ref={dropdownRef}
            className={cn(
                'fixed z-[1000] backdrop-blur-[25px] absolute left-5 backdrop-filter',
                'bg-[rgba(7,27,47,0.9)] border border-[#132f4c] border-solid',
                'rounded-[7px] shadow-lg flex flex-col',
                'w-[650px] max-h-[600px]'
            )}
            style={position}
        >
            <div className="flex flex-col gap-[15px] p-[20px] flex-1 overflow-hidden relative min-h-0">
                {filterContent}
            </div>
        </div>
    )
}
