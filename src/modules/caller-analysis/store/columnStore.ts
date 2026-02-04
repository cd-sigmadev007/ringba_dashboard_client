import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ColumnVisibility } from '../hooks/useTableColumns'

interface ColumnStore {
    columnVisibility: ColumnVisibility
    setColumnVisibility: (visibility: ColumnVisibility) => void
    toggleColumn: (columnId: keyof ColumnVisibility) => void
    resetColumns: () => void
}

const initialColumnVisibility: ColumnVisibility = {
    callerId: true,
    lastCall: true,
    duration: true,
    lifetimeRevenue: true,
    campaign: true,
    action: true,
    status: true,
    // Revenue/cost columns (optional, hidden by default)
    revenue: false,
    ringbaCost: false,
    adCost: false,
    targetName: false,
    publisherName: false,
    // Standard fields (optional, hidden by default)
    phoneNumber: false,
    callTimestamp: false,
    callLengthInSeconds: false,
    // Note: these correspond to raw database names
    street_number: false,
    street_name: false,
    street_type: false,
    city: false,
    state: false,
    g_zip: false,
}

export const useColumnStore = create<ColumnStore>()(
    persist(
        (set) => ({
            columnVisibility: initialColumnVisibility,
            setColumnVisibility: (columnVisibility) =>
                set({ columnVisibility }),
            toggleColumn: (columnId) =>
                set((state) => ({
                    columnVisibility: {
                        ...state.columnVisibility,
                        [columnId]: !state.columnVisibility[columnId],
                    },
                })),
            resetColumns: () =>
                set({
                    columnVisibility: initialColumnVisibility,
                }),
        }),
        {
            name: 'ringba-caller-columns',
            partialize: (state) => ({
                columnVisibility: state.columnVisibility,
            }),
            version: 1, // Bump version to clear stale local storage state
        }
    )
)
