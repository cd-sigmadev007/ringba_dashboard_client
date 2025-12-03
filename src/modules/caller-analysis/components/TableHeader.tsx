import React from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useCampaignOptions } from '../constants/filterOptions'
import { useFilterTags } from '../hooks/useFilterTags'
import type { DurationRange } from '@/components/ui/DurationRangeFilter'
import type { FilterState } from '../types'
import {
    CancelIcon,
    CheckboxIcon,
    FilterIcon,
    ViewColumnIcon,
} from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'
import { cn } from '@/lib'
import Button from '@/components/ui/Button'

dayjs.extend(utc)
dayjs.extend(timezone)

interface TableHeaderProps {
    filters: FilterState
    onRemoveFilter: {
        campaign: (filter: string) => void
        status: (filter: string) => void
        durationRange: () => void
        search: () => void
        dateRange: () => void
    }
    onFilterClick: () => void
    onFilterPillClick?: (
        filterType: 'campaigns' | 'duration' | 'date' | 'status'
    ) => void
    onColumnsClick: () => void
    onSelectAll?: (checked: boolean) => void
    selectAllChecked?: boolean
}

export const TableHeader: React.FC<TableHeaderProps> = ({
    filters,
    onRemoveFilter,
    onFilterClick,
    onFilterPillClick,
    onColumnsClick,
    onSelectAll,
    selectAllChecked = false,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const campaignOptions = useCampaignOptions()
    const { statusOptions } = useFilterTags(true)

    const formatDurationRange = (range: DurationRange) => {
        if (range.min !== undefined && range.max !== undefined) {
            return `>${range.min / 60}m`
        }
        if (range.min !== undefined) {
            return `>${range.min / 60}m`
        }
        if (range.max !== undefined) {
            return `<${range.max / 60}m`
        }
        return ''
    }

    // Count active filters for badge
    const activeFilterCount =
        filters.campaignFilter.length +
        filters.statusFilter.length +
        (filters.durationRange.min !== undefined ||
        filters.durationRange.max !== undefined
            ? 1
            : 0) +
        (filters.searchQuery ? 1 : 0) +
        (filters.dateRange.from ? 1 : 0)

    return (
        <div
            className={cn(
                'flex items-center justify-between',
                'px-[20px] py-[16px]',
                isDark
                    ? 'bg-[#001e3c] border-[#132f4c]'
                    : 'bg-white border-[#E1E5E9]'
            )}
        >
            {/* Left side: Checkbox and Filter button */}
            <div className="flex gap-[8px] items-center">
                {/* Checkbox */}
                {onSelectAll && (
                    <Button
                        variant="ghost"
                        onClick={() => onSelectAll(!selectAllChecked)}
                        className="p-0 h-5 w-5 flex items-center justify-center border-none"
                    >
                        <CheckboxIcon
                            checked={selectAllChecked}
                            isDark={isDark}
                            className="w-5 h-5"
                        />
                    </Button>
                )}

                {/* Filter Button with Badge */}
                <Button
                    variant="secondary"
                    onClick={onFilterClick}
                    className={cn(
                        'box-border flex gap-[5px] items-center justify-center',
                        'px-[10px] py-[7px] rounded-[10px] shrink-0 w-[34px] relative',
                        'h-auto min-h-0'
                    )}
                >
                    <FilterIcon
                        className={cn(
                            'size-[20px]',
                            isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                        )}
                    />
                    {activeFilterCount > 0 && (
                        <div
                            className={cn(
                                'absolute left-[22px] top-[-9px] rounded-[13px] z-[99] size-[24px]',
                                'flex items-center justify-center',
                                'bg-[#0254a5]'
                            )}
                        >
                            <p
                                className={cn(
                                    'font-["Poppins:Medium",sans-serif] leading-[normal]',
                                    'not-italic text-[#f5f8fa] text-[12px] text-nowrap',
                                    'tracking-[-0.48px]'
                                )}
                            >
                                {activeFilterCount}
                            </p>
                        </div>
                    )}
                </Button>

                {/* Filter Pills */}
                <div className="flex gap-[8px] items-center">
                    {/* Campaign Filter Pills */}
                    {filters.campaignFilter.map((filter) => {
                        const option = campaignOptions.find(
                            (opt) => opt.value === filter
                        )
                        return (
                            <Button
                                key={filter}
                                variant="secondary"
                                onClick={() => onFilterPillClick?.('campaigns')}
                                className={cn(
                                    'box-border flex gap-[5px] items-center',
                                    'px-[10px] py-[7px] rounded-[10px] shrink-0',
                                    'h-auto min-h-0 cursor-pointer'
                                )}
                            >
                                <div
                                    className={cn(
                                        'flex font-["Poppins:Medium",sans-serif]',
                                        'gap-[5px] items-center leading-[normal]',
                                        'not-italic relative shrink-0 text-[14px] text-nowrap'
                                    )}
                                >
                                    <p
                                        className={cn(
                                            'relative shrink-0',
                                            isDark
                                                ? 'text-[#f5f8fa]'
                                                : 'text-[#3F4254]'
                                        )}
                                    >
                                        Campaign:
                                    </p>
                                    <p
                                        className={cn(
                                            'relative shrink-0',
                                            isDark
                                                ? 'text-[#007fff]'
                                                : 'text-[#007FFF]'
                                        )}
                                    >
                                        {option?.title || filter}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onRemoveFilter.campaign(filter)
                                    }}
                                    className="relative shrink-0 size-[20px] flex items-center justify-center ml-1"
                                >
                                    <CancelIcon
                                        className={cn(
                                            'size-[20px]',
                                            isDark
                                                ? 'text-[#F5F8FA]'
                                                : 'text-[#3F4254]'
                                        )}
                                    />
                                </button>
                            </Button>
                        )
                    })}

                    {/* Status Filter Pills */}
                    {filters.statusFilter.map((filter) => {
                        const option = statusOptions.find(
                            (opt) => opt.value === filter
                        )
                        return (
                            <Button
                                key={filter}
                                variant="secondary"
                                onClick={() => onFilterPillClick?.('status')}
                                className={cn(
                                    'box-border flex gap-[5px] items-center',
                                    'px-[10px] py-[7px] rounded-[10px] shrink-0',
                                    'h-auto min-h-0 cursor-pointer'
                                )}
                            >
                                <div
                                    className={cn(
                                        'flex font-["Poppins:Medium",sans-serif]',
                                        'gap-[5px] items-center leading-[normal]',
                                        'not-italic relative shrink-0 text-[14px] text-nowrap'
                                    )}
                                >
                                    <p
                                        className={cn(
                                            'relative shrink-0',
                                            isDark
                                                ? 'text-[#f5f8fa]'
                                                : 'text-[#3F4254]'
                                        )}
                                    >
                                        Status:
                                    </p>
                                    <p
                                        className={cn(
                                            'relative shrink-0',
                                            isDark
                                                ? 'text-[#007fff]'
                                                : 'text-[#007FFF]'
                                        )}
                                    >
                                        {option?.title || filter}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onRemoveFilter.status(filter)
                                    }}
                                    className="relative shrink-0 size-[20px] flex items-center justify-center ml-1"
                                >
                                    <CancelIcon
                                        className={cn(
                                            'size-[20px]',
                                            isDark
                                                ? 'text-[#F5F8FA]'
                                                : 'text-[#3F4254]'
                                        )}
                                    />
                                </button>
                            </Button>
                        )
                    })}

                    {/* Duration Range Pill */}
                    {(filters.durationRange.min !== undefined ||
                        filters.durationRange.max !== undefined) && (
                        <Button
                            variant="secondary"
                            onClick={() => onFilterPillClick?.('duration')}
                            className={cn(
                                'box-border flex gap-[5px] items-center',
                                'px-[10px] py-[7px] rounded-[10px] shrink-0',
                                'h-auto min-h-0 cursor-pointer'
                            )}
                        >
                            <div
                                className={cn(
                                    'flex font-["Poppins:Medium",sans-serif]',
                                    'gap-[5px] items-center leading-[normal]',
                                    'not-italic relative shrink-0 text-[14px] text-nowrap'
                                )}
                            >
                                <p
                                    className={cn(
                                        'relative shrink-0',
                                        isDark
                                            ? 'text-[#f5f8fa]'
                                            : 'text-[#3F4254]'
                                    )}
                                >
                                    Duration
                                </p>
                                <p
                                    className={cn(
                                        'relative shrink-0',
                                        isDark
                                            ? 'text-[#007fff]'
                                            : 'text-[#007FFF]'
                                    )}
                                >
                                    {formatDurationRange(filters.durationRange)}
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onRemoveFilter.durationRange()
                                }}
                                className="relative shrink-0 size-[20px] flex items-center justify-center ml-1"
                            >
                                <CancelIcon
                                    className={cn(
                                        'size-[20px]',
                                        isDark
                                            ? 'text-[#F5F8FA]'
                                            : 'text-[#3F4254]'
                                    )}
                                />
                            </button>
                        </Button>
                    )}

                    {/* Date Range Pill */}
                    {filters.dateRange.from && (
                        <Button
                            variant="secondary"
                            onClick={() => onFilterPillClick?.('date')}
                            className={cn(
                                'box-border flex gap-[5px] items-center',
                                'px-[10px] py-[7px] rounded-[10px] shrink-0',
                                'h-auto min-h-0 cursor-pointer'
                            )}
                        >
                            <div
                                className={cn(
                                    'flex font-["Poppins:Medium",sans-serif]',
                                    'gap-[5px] items-center leading-[normal]',
                                    'not-italic relative shrink-0 text-[14px] text-nowrap'
                                )}
                            >
                                <p
                                    className={cn(
                                        'relative shrink-0',
                                        isDark
                                            ? 'text-[#f5f8fa]'
                                            : 'text-[#3F4254]'
                                    )}
                                >
                                    Date:
                                </p>
                                <p
                                    className={cn(
                                        'relative shrink-0',
                                        isDark
                                            ? 'text-[#007fff]'
                                            : 'text-[#007FFF]'
                                    )}
                                >
                                    {(() => {
                                        const fromDate = dayjs(
                                            filters.dateRange.from
                                        ).tz('America/New_York')
                                        const toDate = filters.dateRange.to
                                            ? dayjs(filters.dateRange.to).tz(
                                                  'America/New_York'
                                              )
                                            : null

                                        if (
                                            toDate &&
                                            fromDate.isSame(toDate, 'day')
                                        ) {
                                            return fromDate.format(
                                                'MMM DD, YYYY'
                                            )
                                        } else if (toDate) {
                                            return `${fromDate.format('MMM DD, YYYY')} - ${toDate.format('MMM DD, YYYY')}`
                                        } else {
                                            return fromDate.format(
                                                'MMM DD, YYYY'
                                            )
                                        }
                                    })()}
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onRemoveFilter.dateRange()
                                }}
                                className="relative shrink-0 size-[20px] flex items-center justify-center ml-1"
                            >
                                <CancelIcon
                                    className={cn(
                                        'size-[20px]',
                                        isDark
                                            ? 'text-[#F5F8FA]'
                                            : 'text-[#3F4254]'
                                    )}
                                />
                            </button>
                        </Button>
                    )}
                </div>
            </div>

            {/* Right side: Columns Button */}
            <Button
                variant="secondary"
                onClick={onColumnsClick}
                className={cn(
                    'box-border flex gap-[5px] items-center',
                    'px-[10px] py-[7px] rounded-[10px] shrink-0',
                    'h-auto min-h-0'
                )}
            >
                <ViewColumnIcon
                    className={cn(
                        'relative shrink-0 size-[20px]',
                        isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                    )}
                />
                <p
                    className={cn(
                        'font-["Poppins:Regular",sans-serif] leading-[normal]',
                        'not-italic relative shrink-0 text-[#f5f8fa] text-[14px]',
                        'text-center text-nowrap',
                        isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                    )}
                >
                    Columns
                </p>
            </Button>
        </div>
    )
}
