import { describe, it, expect, beforeEach } from 'vitest'
import { useFilterStore } from '@/modules/caller-analysis/store/filterStore'
import type { FilterState } from '@/modules/caller-analysis/types'

describe('filterStore', () => {
    beforeEach(() => {
        // Reset store to initial state before each test
        useFilterStore.getState().clearAllFilters()
    })

    it('should initialize with default filter state', () => {
        const state = useFilterStore.getState()
        expect(state.filters).toEqual({
            dateRange: {},
            campaignFilter: [],
            statusFilter: [],
            durationFilter: 'all',
            durationRange: {},
            searchQuery: '',
        })
        expect(state.tempFilters).toEqual(state.filters)
    })

    it('should set filters', () => {
        const newFilters: FilterState = {
            dateRange: { from: '2025-01-01', to: '2025-01-31' },
            campaignFilter: ['campaign-1'],
            statusFilter: ['converted'],
            durationFilter: 'medium',
            durationRange: { min: 60, max: 180 },
            searchQuery: 'test query',
        }

        useFilterStore.getState().setFilters(newFilters)

        expect(useFilterStore.getState().filters).toEqual(newFilters)
    })

    it('should set temp filters', () => {
        const tempFilters: FilterState = {
            dateRange: { from: '2025-01-01' },
            campaignFilter: ['campaign-2'],
            statusFilter: [],
            durationFilter: 'all',
            durationRange: {},
            searchQuery: 'temp query',
        }

        useFilterStore.getState().setTempFilters(tempFilters)

        expect(useFilterStore.getState().tempFilters).toEqual(tempFilters)
        // Filters should remain unchanged
        expect(useFilterStore.getState().filters).not.toEqual(tempFilters)
    })

    it('should reset temp filters to current filters', () => {
        const filters: FilterState = {
            dateRange: { from: '2025-01-01' },
            campaignFilter: ['campaign-1'],
            statusFilter: ['converted'],
            durationFilter: 'medium',
            durationRange: {},
            searchQuery: 'query',
        }

        useFilterStore.getState().setFilters(filters)
        useFilterStore.getState().setTempFilters({
            ...filters,
            searchQuery: 'different query',
        })

        useFilterStore.getState().resetTempFilters()

        expect(useFilterStore.getState().tempFilters).toEqual(filters)
    })

    it('should apply temp filters to filters', () => {
        const tempFilters: FilterState = {
            dateRange: { from: '2025-01-01' },
            campaignFilter: ['campaign-1'],
            statusFilter: ['converted'],
            durationFilter: 'medium',
            durationRange: {},
            searchQuery: 'applied query',
        }

        useFilterStore.getState().setTempFilters(tempFilters)
        useFilterStore.getState().applyTempFilters()

        expect(useFilterStore.getState().filters).toEqual(tempFilters)
    })

    it('should clear all filters', () => {
        const filters: FilterState = {
            dateRange: { from: '2025-01-01' },
            campaignFilter: ['campaign-1'],
            statusFilter: ['converted'],
            durationFilter: 'medium',
            durationRange: { min: 60 },
            searchQuery: 'query',
        }

        useFilterStore.getState().setFilters(filters)
        useFilterStore.getState().setTempFilters(filters)
        useFilterStore.getState().clearAllFilters()

        const state = useFilterStore.getState()
        expect(state.filters).toEqual({
            dateRange: {},
            campaignFilter: [],
            statusFilter: [],
            durationFilter: 'all',
            durationRange: {},
            searchQuery: '',
        })
        expect(state.tempFilters).toEqual(state.filters)
    })
})
