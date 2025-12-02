import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FilterState } from '../types'

interface FilterStore {
    filters: FilterState
    tempFilters: FilterState
    setFilters: (filters: FilterState) => void
    setTempFilters: (filters: FilterState) => void
    resetTempFilters: () => void
    applyTempFilters: () => void
    clearAllFilters: () => void
}

const initialFilterState: FilterState = {
    dateRange: {},
    campaignFilter: [],
    statusFilter: [],
    durationFilter: 'all',
    durationRange: {},
    searchQuery: '',
}

export const useFilterStore = create<FilterStore>()(
    persist(
        (set) => ({
            filters: initialFilterState,
            tempFilters: initialFilterState,
            setFilters: (filters) => set({ filters }),
            setTempFilters: (tempFilters) => set({ tempFilters }),
            resetTempFilters: () =>
                set((state) => ({ tempFilters: state.filters })),
            applyTempFilters: () =>
                set((state) => ({ filters: state.tempFilters })),
            clearAllFilters: () =>
                set({
                    filters: initialFilterState,
                    tempFilters: initialFilterState,
                }),
        }),
        {
            name: 'ringba-caller-filters',
            partialize: (state) => ({ filters: state.filters }),
        }
    )
)
