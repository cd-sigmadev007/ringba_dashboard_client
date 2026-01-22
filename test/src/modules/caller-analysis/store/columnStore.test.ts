import { beforeEach, describe, expect, it } from 'vitest'
import type { ColumnVisibility } from '@/modules/caller-analysis/hooks/useTableColumns'
import { useColumnStore } from '@/modules/caller-analysis/store/columnStore'

describe('columnStore', () => {
    beforeEach(() => {
        // Reset store to initial state before each test
        useColumnStore.getState().resetColumns()
    })

    it('should initialize with all columns visible', () => {
        const state = useColumnStore.getState()
        expect(state.columnVisibility).toEqual({
            callerId: true,
            lastCall: true,
            duration: true,
            lifetimeRevenue: true,
            campaign: true,
            action: true,
            status: true,
        })
    })

    it('should set column visibility', () => {
        const newVisibility: ColumnVisibility = {
            callerId: true,
            lastCall: false,
            duration: true,
            lifetimeRevenue: false,
            campaign: true,
            action: false,
            status: true,
        }

        useColumnStore.getState().setColumnVisibility(newVisibility)

        expect(useColumnStore.getState().columnVisibility).toEqual(
            newVisibility
        )
    })

    it('should toggle a column', () => {
        const initialState = useColumnStore.getState().columnVisibility
        expect(initialState.callerId).toBe(true)

        useColumnStore.getState().toggleColumn('callerId')

        expect(useColumnStore.getState().columnVisibility.callerId).toBe(false)

        useColumnStore.getState().toggleColumn('callerId')

        expect(useColumnStore.getState().columnVisibility.callerId).toBe(true)
    })

    it('should toggle multiple columns independently', () => {
        useColumnStore.getState().toggleColumn('lastCall')
        useColumnStore.getState().toggleColumn('duration')

        const state = useColumnStore.getState().columnVisibility
        expect(state.lastCall).toBe(false)
        expect(state.duration).toBe(false)
        expect(state.callerId).toBe(true) // Unchanged
    })

    it('should reset columns to initial state', () => {
        useColumnStore.getState().setColumnVisibility({
            callerId: false,
            lastCall: false,
            duration: false,
            lifetimeRevenue: false,
            campaign: false,
            action: false,
            status: false,
        })

        useColumnStore.getState().resetColumns()

        expect(useColumnStore.getState().columnVisibility).toEqual({
            callerId: true,
            lastCall: true,
            duration: true,
            lifetimeRevenue: true,
            campaign: true,
            action: true,
            status: true,
        })
    })
})
