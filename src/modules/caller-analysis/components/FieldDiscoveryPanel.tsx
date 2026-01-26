import React, { useEffect } from 'react'
import { useGetAvailableFields } from '../graphql/hooks'
import { useColumnStore } from '../store/columnStore'
import Button from '@/components/ui/Button'
import { CheckboxIcon } from '@/assets/svg'
import { useThemeStore } from '@/store/themeStore'
import { cn } from '@/lib'

interface FieldDiscoveryPanelProps {
    isOpen: boolean
    onClose: () => void
}

export const FieldDiscoveryPanel: React.FC<FieldDiscoveryPanelProps> = ({
    isOpen,
    onClose,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const { data: fields, isLoading } = useGetAvailableFields()
    const {
        selectedDynamicFields,
        setAvailableDynamicFields,
        toggleDynamicField,
    } = useColumnStore()

    // Update available dynamic fields when fields are loaded
    useEffect(() => {
        if (fields) {
            const dynamicFields = fields
                .filter((f) => f.source === 'DYNAMIC')
                .map((f) => f.name)
            setAvailableDynamicFields(dynamicFields)
        }
    }, [fields, setAvailableDynamicFields])

    if (!isOpen) return null

    const fixedFields = fields?.filter((f) => f.source === 'FIXED') || []
    const dynamicFields = fields?.filter((f) => f.source === 'DYNAMIC') || []

    return (
        <div
            className={cn(
                'fixed inset-0 z-50 flex items-center justify-center bg-black/50',
                !isOpen && 'hidden'
            )}
            onClick={onClose}
        >
            <div
                className={cn(
                    'bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col',
                    isDark && 'dark'
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Select Columns
                    </h2>
                    <Button variant="ghost" onClick={onClose}>
                        ✕
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="text-center py-8 text-gray-500">
                            Loading fields...
                        </div>
                    ) : (
                        <>
                            {/* Fixed Fields */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Fixed Fields
                                </h3>
                                <div className="space-y-2">
                                    {fixedFields.map((field) => (
                                        <div
                                            key={field.name}
                                            className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                                        >
                                            <span className="text-sm text-gray-900 dark:text-white flex-1">
                                                {field.name}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {field.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dynamic Fields */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Dynamic Fields
                                </h3>
                                {dynamicFields.length === 0 ? (
                                    <div className="text-sm text-gray-500 dark:text-gray-400 py-4">
                                        No dynamic fields available
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {dynamicFields.map((field) => {
                                            const isSelected =
                                                selectedDynamicFields.includes(
                                                    field.name
                                                )
                                            return (
                                                <div
                                                    key={field.name}
                                                    className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                                                    onClick={() =>
                                                        toggleDynamicField(
                                                            field.name
                                                        )
                                                    }
                                                >
                                                    <CheckboxIcon
                                                        checked={isSelected}
                                                        isDark={isDark}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-sm text-gray-900 dark:text-white flex-1">
                                                        {field.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {field.type}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onClose}>Apply</Button>
                </div>
            </div>
        </div>
    )
}
