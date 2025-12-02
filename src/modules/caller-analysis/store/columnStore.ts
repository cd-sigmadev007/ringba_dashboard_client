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
                set({ columnVisibility: initialColumnVisibility }),
        }),
        {
            name: 'ringba-caller-columns',
            partialize: (state) => ({
                columnVisibility: state.columnVisibility,
            }),
        }
    )
)
