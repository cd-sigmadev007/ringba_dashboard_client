/**
 * usePasswordValidation Hook
 * Provides real-time password validation feedback
 */

import { useMemo } from 'react'
import {
    
    validatePasswordWithChecks
} from '../validation/passwordSchemas'
import type {PasswordValidationResult} from '../validation/passwordSchemas';

export function usePasswordValidation(password: string) {
    const validation = useMemo<PasswordValidationResult>(() => {
        return validatePasswordWithChecks(password)
    }, [password])

    return validation
}
