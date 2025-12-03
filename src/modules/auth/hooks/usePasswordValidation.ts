/**
 * usePasswordValidation Hook
 * Provides real-time password validation feedback
 */

import { useState, useMemo } from 'react'
import { validatePasswordWithChecks, type PasswordValidationResult } from '../validation/passwordSchemas'

export function usePasswordValidation(password: string) {
    const validation = useMemo<PasswordValidationResult>(() => {
        return validatePasswordWithChecks(password)
    }, [password])

    return validation
}

