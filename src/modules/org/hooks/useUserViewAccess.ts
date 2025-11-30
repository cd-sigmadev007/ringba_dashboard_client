/**
 * useUserViewAccess Hook
 * Manages user view access state and operations
 */

import { useState } from 'react'
import toast from 'react-hot-toast'
import { usersApi } from '../services/usersApi'
import type { DateRange, SelectRangeEventHandler } from 'react-day-picker'
import type { Preset } from '@/components/ui/TimeFilter/types'
import { useClickOutside } from '@/lib/hooks/useClickOutside'
import {
    calculatePresetDateRange,
    formatDateRange,
} from '@/components/ui/TimeFilter/utils'

interface UseUserViewAccessProps {
    userId: string | null
    onSuccess?: () => void
    onClose?: () => void
}

export function useUserViewAccess({
    userId,
    onSuccess,
    onClose,
}: UseUserViewAccessProps) {
    // View access state
    const [isFullAccess, setIsFullAccess] = useState(true)
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
    const [loadingViewAccess, setLoadingViewAccess] = useState(false)
    const [savingViewAccess, setSavingViewAccess] = useState(false)

    // Date picker state
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [activePreset, setActivePreset] = useState<string | null>(null)
    const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(
        undefined
    )

    // Click outside handler for date picker
    const datePickerRef = useClickOutside<HTMLDivElement>(() => {
        if (showDatePicker) {
            setShowDatePicker(false)
            setTempDateRange(dateRange) // Reset to original value
        }
    })

    // Load view access
    const loadViewAccess = async () => {
        if (!userId) return
        setLoadingViewAccess(true)
        try {
            const access = await usersApi.getUserViewAccess(userId)
            if (access) {
                setIsFullAccess(access.access_type === 'full')
                if (
                    access.access_type === 'date_specific' &&
                    access.date_from &&
                    access.date_to
                ) {
                    setDateRange({
                        from: new Date(access.date_from),
                        to: new Date(access.date_to),
                    })
                } else {
                    setDateRange(undefined)
                }
            } else {
                setIsFullAccess(true)
                setDateRange(undefined)
            }
        } catch (error: any) {
            console.error('Failed to load view access:', error)
            // Don't show toast on load error - just use defaults
        } finally {
            setLoadingViewAccess(false)
        }
    }

    // Save full access
    const saveFullAccess = async () => {
        if (!userId) return
        await usersApi.setUserViewAccess(userId, 'full')
        toast.success('View access updated to full access')
    }

    // Save date-specific access
    const saveDateSpecificAccess = async (dateFrom: string, dateTo: string) => {
        if (!userId) return
        await usersApi.setUserViewAccess(
            userId,
            'date_specific',
            dateFrom,
            dateTo
        )
        toast.success('View access updated to date-specific access')
    }

    // Validate date range
    const validateDateRange = (): boolean => {
        if (!dateRange || !dateRange.from || !dateRange.to) {
            toast.error('Please select a date range')
            return false
        }
        return true
    }

    // Core save logic
    const saveViewAccess = async (): Promise<boolean> => {
        if (!userId) return false

        if (isFullAccess) {
            await saveFullAccess()
        } else {
            if (!validateDateRange()) {
                return false
            }
            // At this point, dateRange is guaranteed to have from and to due to validateDateRange
            if (!dateRange || !dateRange.from || !dateRange.to) {
                return false
            }
            // Format dates as YYYY-MM-DD strings
            const dateFrom = dateRange.from.toISOString().split('T')[0]
            const dateTo = dateRange.to.toISOString().split('T')[0]
            await saveDateSpecificAccess(dateFrom, dateTo)
        }
        return true
    }

    // Main save handler with validation
    const handleSaveViewAccess = async (): Promise<boolean> => {
        if (!userId) return false
        setSavingViewAccess(true)
        try {
            const success = await saveViewAccess()
            if (success) {
                onSuccess?.()
                onClose?.()
            }
            return success
        } catch (error: any) {
            console.error('Error saving view access:', error)
            toast.error(error?.message || 'Failed to update view access')
            return false
        } finally {
            setSavingViewAccess(false)
        }
    }

    // Date picker handlers
    const handleOpenDatePicker = () => {
        setTempDateRange(dateRange)
        setShowDatePicker(true)
    }

    const handlePresetClick = (preset: Preset) => {
        const { from, to } = calculatePresetDateRange(preset)
        setTempDateRange({ from, to })
        setActivePreset(preset.label)
    }

    const handleDateSelect: SelectRangeEventHandler = (rng) => {
        setTempDateRange(rng)
        setActivePreset('Custom')
    }

    const handleClearDateRange = () => {
        setTempDateRange(undefined)
        setActivePreset(null)
    }

    const handleDoneDateRange = () => {
        if (tempDateRange?.from && tempDateRange.to) {
            setDateRange({
                from: tempDateRange.from,
                to: tempDateRange.to,
            })
        } else {
            setDateRange(undefined)
        }
        setShowDatePicker(false)
    }

    const handleToggleFullAccess = () => {
        setIsFullAccess(!isFullAccess)
        if (!isFullAccess) {
            setDateRange(undefined)
        }
    }

    return {
        // State
        isFullAccess,
        dateRange,
        loadingViewAccess,
        savingViewAccess,
        showDatePicker,
        activePreset,
        tempDateRange,
        datePickerRef,

        // Actions
        loadViewAccess,
        handleSaveViewAccess,
        handleToggleFullAccess,
        handleOpenDatePicker,
        handlePresetClick,
        handleDateSelect,
        handleClearDateRange,
        handleDoneDateRange,

        // Utils
        formatDateRange,
    }
}
