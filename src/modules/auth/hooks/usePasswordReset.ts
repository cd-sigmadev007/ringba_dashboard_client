/**
 * usePasswordReset Hook
 * Handles forgot password flow
 */

import { useState } from 'react'
import { authApi } from '../services/authApi'
import type { ForgotPasswordRequest } from '../types'

export function usePasswordReset() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const requestPasswordReset = async (data: ForgotPasswordRequest) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            await authApi.forgotPassword(data)
            setSuccess(true)
        } catch (err: any) {
            const errorMessage =
                err.message ||
                'Failed to send password reset email. Please try again.'
            setError(errorMessage)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return {
        requestPasswordReset,
        isLoading,
        error,
        success,
    }
}
