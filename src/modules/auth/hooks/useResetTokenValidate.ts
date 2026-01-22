import { useEffect, useState } from 'react'
import { authApi } from '../services/authApi'

/**
 * Validates a password reset token from the URL search (?token=...).
 * Returns tokenValid: null (loading) | true | false.
 */
export function useResetTokenValidate() {
    const token =
        typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('token') || ''
            : ''

    const [tokenValid, setTokenValid] = useState<boolean | null>(null)

    useEffect(() => {
        if (!token) {
            setTokenValid(false)
            return
        }
        authApi
            .validateResetToken(token)
            .then(() => setTokenValid(true))
            .catch(() => setTokenValid(false))
    }, [token])

    return { token, tokenValid }
}
