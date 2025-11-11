import React from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import Button from '../../../components/ui/Button'
import CrossIcon from '../../../assets/svg/CrossIcon'
import { campaignOptions, statusOptions } from '../constants/filterOptions'
import type { FilterState } from '../types'
import type { DurationRange } from '../../../components/ui/DurationRangeFilter'

dayjs.extend(utc)
dayjs.extend(timezone)

interface FilterPillsProps {
    filters: FilterState
    onRemoveFilter: {
        campaign: (filter: string) => void
        status: (filter: string) => void
        durationRange: () => void
        search: () => void
        dateRange: () => void
    }
}

export const FilterPills: React.FC<FilterPillsProps> = ({
    filters,
    onRemoveFilter,
}) => {
    const formatDurationRange = (range: DurationRange) => {
        if (range.min !== undefined && range.max !== undefined) {
            return `${range.min}s - ${range.max}s`
        }
        if (range.min !== undefined) {
            return `Min: ${range.min}s`
        }
        if (range.max !== undefined) {
            return `Max: ${range.max}s`
        }
        return ''
    }

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {/* Campaign Filter Pills */}
            {filters.campaignFilter.map((filter) => {
                const option = campaignOptions.find(
                    (opt) => opt.value === filter
                )
                return (
                    <Button
                        key={filter}
                        variant="secondary"
                        className="px-[10px] text-xs py-[7px] flex gap-[5px] items-center"
                    >
                        <span>{option?.title || filter}</span>
                        <p onClick={() => onRemoveFilter.campaign(filter)}>
                            <CrossIcon className="w-[20px] h-[20px]" />
                        </p>
                    </Button>
                )
            })}

            {/* Status Filter Pills */}
            {filters.statusFilter.map((filter) => {
                const option = statusOptions.find((opt) => opt.value === filter)
                return (
                    <Button
                        key={filter}
                        variant="secondary"
                        className="px-[10px] py-[7px] flex gap-[5px] items-center"
                    >
                        <span>{option?.title || filter}</span>
                        <p onClick={() => onRemoveFilter.status(filter)}>
                            <CrossIcon className="w-[20px] h-[20px]" />
                        </p>
                    </Button>
                )
            })}

            {/* Duration Range Pill */}
            {(filters.durationRange.min !== undefined ||
                filters.durationRange.max !== undefined) && (
                <Button
                    variant="secondary"
                    className="px-[10px] text-xs py-[7px] flex gap-[5px] items-center"
                >
                    <p>{formatDurationRange(filters.durationRange)}</p>
                    <p onClick={onRemoveFilter.durationRange}>
                        <CrossIcon className="w-[20px] h-[20px]" />
                    </p>
                </Button>
            )}

            {/* Search Query Pill */}
            {filters.searchQuery && (
                <Button
                    variant="secondary"
                    className="px-[10px] text-xs py-[7px] flex gap-[5px] items-center"
                >
                    <p>Search: {filters.searchQuery}</p>
                    <p onClick={onRemoveFilter.search}>
                        <CrossIcon className="w-[20px] h-[20px]" />
                    </p>
                </Button>
            )}

            {/* Date Range Pill */}
            {filters.dateRange.from && (
                <Button
                    variant="secondary"
                    className="px-[10px] text-xs py-[7px] flex gap-[5px] items-center"
                >
                    <p>
                        Date:{' '}
                        {(() => {
                            const fromDate = dayjs(filters.dateRange.from).tz(
                                'America/New_York'
                            )
                            const toDate = filters.dateRange.to
                                ? dayjs(filters.dateRange.to).tz(
                                      'America/New_York'
                                  )
                                : null

                            // Check if from and to are on the same day
                            if (toDate && fromDate.isSame(toDate, 'day')) {
                                // Same day: show single date
                                return fromDate.format('MMM DD, YYYY')
                            } else if (toDate) {
                                // Different days: show range
                                return `${fromDate.format('MMM DD, YYYY')} - ${toDate.format('MMM DD, YYYY')}`
                            } else {
                                // Only from date
                                return fromDate.format('MMM DD, YYYY')
                            }
                        })()}
                    </p>
                    <p onClick={onRemoveFilter.dateRange}>
                        <CrossIcon className="w-[20px] h-[20px]" />
                    </p>
                </Button>
            )}
        </div>
    )
}
