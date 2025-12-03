/**
 * usePasswordChange Hook
 * Handles password change (for reset flow)
 */

import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { authApi } from '../services/authApi'
import type { ResetPasswordRequest } from '../types'

export function usePasswordChange() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const changePassword = async (data: ResetPasswordRequest) => {
        setIsLoading(true)
        setError(null)

        try {
            await authApi.resetPassword(data)
            // Navigate to success page
            navigate({ to: '/password-changed' })
        } catch (err: any) {
            const errorMessage =
                err.message || 'Failed to reset password. Please try again.'
            setError(errorMessage)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return {
        changePassword,
        isLoading,
        error,
    }
}
