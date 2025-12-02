import { useEffect, useState } from 'react'
import type { FilterState } from '../types'
import { useClickOutside } from '@/lib'

type FilterType =
    | 'campaigns'
    | 'duration'
    | 'date'
    | 'type'
    | 'status'
    | 'disputeDate'
    | 'disputeAmount'
    | 'disputeStatus'

interface UseFilterDropdownProps {
    isOpen: boolean
    onClose: () => void
    triggerRef?: React.RefObject<HTMLButtonElement | null>
    filterType?: FilterType
}

export function useFilterDropdown({
    isOpen,
    onClose,
    triggerRef,
    filterType,
}: UseFilterDropdownProps) {
    const [selectedFilter, setSelectedFilter] = useState<FilterType>(
        filterType || 'campaigns'
    )
    const [position, setPosition] = useState<{
        top?: number
        bottom?: number
        left?: number
        right?: number
    }>({})

    // Update selectedFilter when filterType prop changes
    useEffect(() => {
        if (filterType) {
            setSelectedFilter(filterType)
        }
    }, [filterType])

    // Calculate dropdown position
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

    const dropdownRef = useClickOutside<HTMLDivElement>(() => {
        if (isOpen) {
            onClose()
        }
    })

    return {
        selectedFilter,
        setSelectedFilter,
        position,
        dropdownRef,
    }
}

/**
 * Calculate active filter count from filter state
 */
export function useActiveFilterCount(filters: FilterState): number {
    return (
        filters.campaignFilter.length +
        filters.statusFilter.length +
        (filters.durationRange.min !== undefined ||
        filters.durationRange.max !== undefined
            ? 1
            : 0) +
        (filters.searchQuery ? 1 : 0) +
        (filters.dateRange.from ? 1 : 0)
    )
}
