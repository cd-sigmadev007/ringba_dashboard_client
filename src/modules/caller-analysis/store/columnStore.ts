import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ColumnVisibility } from '../hooks/useTableColumns'

interface ColumnStore {
    columnVisibility: ColumnVisibility
    // Dynamic fields that are available but may not be selected
    availableDynamicFields: string[]
    // Selected dynamic fields (subset of availableDynamicFields)
    selectedDynamicFields: string[]
    setColumnVisibility: (visibility: ColumnVisibility) => void
    toggleColumn: (columnId: keyof ColumnVisibility) => void
    setAvailableDynamicFields: (fields: string[]) => void
    toggleDynamicField: (fieldName: string) => void
    setSelectedDynamicFields: (fields: string[]) => void
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
    // Displayable columns from CallerFilter (optional, hidden by default)
    phoneNumber: false,
    callTimestamp: false,
    callLengthInSeconds: false,
    // Note: dateFrom, dateTo, durationMin, durationMax, and search are filter parameters only,
    // not displayable columns, so they are not included here
}

export const useColumnStore = create<ColumnStore>()(
    persist(
        (set) => ({
            columnVisibility: initialColumnVisibility,
            availableDynamicFields: [],
            selectedDynamicFields: [],
            setColumnVisibility: (columnVisibility) =>
                set({ columnVisibility }),
            toggleColumn: (columnId) =>
                set((state) => ({
                    columnVisibility: {
                        ...state.columnVisibility,
                        [columnId]: !state.columnVisibility[columnId],
                    },
                })),
            setAvailableDynamicFields: (fields) =>
                set({ availableDynamicFields: fields }),
            toggleDynamicField: (fieldName) =>
                set((state) => {
                    const isSelected = state.selectedDynamicFields.includes(fieldName)
                    return {
                        selectedDynamicFields: isSelected
                            ? state.selectedDynamicFields.filter((f) => f !== fieldName)
                            : [...state.selectedDynamicFields, fieldName],
                    }
                }),
            setSelectedDynamicFields: (fields) =>
                set({ selectedDynamicFields: fields }),
            resetColumns: () =>
                set({
                    columnVisibility: initialColumnVisibility,
                    selectedDynamicFields: [],
                }),
        }),
        {
            name: 'ringba-caller-columns',
            partialize: (state) => ({
                columnVisibility: state.columnVisibility,
                selectedDynamicFields: state.selectedDynamicFields,
            }),
        }
    )
)
