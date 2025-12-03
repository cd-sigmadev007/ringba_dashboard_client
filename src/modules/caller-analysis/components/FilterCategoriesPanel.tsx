import { useFilterCategorySearch } from '../hooks/useFilterSearch'
import { cn } from '@/lib'
import { Search } from '@/components/common'

type FilterType =
    | 'campaigns'
    | 'duration'
    | 'date'
    | 'type'
    | 'status'
    | 'disputeDate'
    | 'disputeAmount'
    | 'disputeStatus'

interface FilterCategoriesPanelProps {
    selectedFilter: FilterType
    onFilterSelect: (filter: FilterType) => void
    searchQuery: string
    onSearchChange: (query: string) => void
    isMobile: boolean
}

export const FilterCategoriesPanel: React.FC<FilterCategoriesPanelProps> = ({
    selectedFilter,
    onFilterSelect,
    searchQuery,
    onSearchChange,
    isMobile,
}) => {
    const { shouldShowFilter, shouldShowSection } =
        useFilterCategorySearch(searchQuery)

    return (
        <div
            className={cn(
                'flex flex-col gap-[10px] h-full overflow-hidden min-h-0',
                isMobile ? 'w-full' : 'w-[220px]'
            )}
        >
            <Search
                placeholder="Search Filters"
                className="w-full"
                onSearch={onSearchChange}
                disableDropdown={true}
                background="bg-[#132f4c]"
            />

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
                            {shouldShowFilter('Campaigns') && (
                                <button
                                    onClick={() => onFilterSelect('campaigns')}
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
                                            selectedFilter === 'campaigns'
                                                ? 'text-[#007fff]'
                                                : 'text-[#f5f8fa]'
                                        )}
                                    >
                                        Campaigns
                                    </p>
                                </button>
                            )}
                            {shouldShowFilter('Duration') && (
                                <button
                                    onClick={() => onFilterSelect('duration')}
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
                                            selectedFilter === 'duration'
                                                ? 'text-[#007fff]'
                                                : 'text-[#f5f8fa]'
                                        )}
                                    >
                                        Duration
                                    </p>
                                </button>
                            )}
                            {shouldShowFilter('Date') && (
                                <button
                                    onClick={() => onFilterSelect('date')}
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
                            {shouldShowFilter('Type') && (
                                <button
                                    onClick={() => onFilterSelect('type')}
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
                            {shouldShowFilter('Status') && (
                                <button
                                    onClick={() => onFilterSelect('status')}
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
                                            selectedFilter === 'status'
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
                                        onFilterSelect('disputeDate')
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
                                            selectedFilter === 'disputeDate'
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
                                        onFilterSelect('disputeAmount')
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
                                            selectedFilter === 'disputeAmount'
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
                                        onFilterSelect('disputeStatus')
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
                                            selectedFilter === 'disputeStatus'
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
    )
}
