/**
 * Password Validation Schemas
 * Uses existing validatePassword from lib/utils/validation.ts
 */

import { validatePassword } from '@/lib/utils/validation'

export interface PasswordValidationResult {
    isValid: boolean
    errors: string[]
    strength: 'weak' | 'medium' | 'strong'
    checks: {
        minLength: boolean
        hasLowercase: boolean
        hasUppercase: boolean
        hasNumber: boolean
        hasSpecialChar: boolean
    }
}

/**
 * Validate password and return detailed results
 */
export function validatePasswordWithChecks(password: string): PasswordValidationResult {
    const result = validatePassword(password)
    
    return {
        isValid: result.isValid,
        errors: result.errors,
        strength: result.strength,
        checks: {
            minLength: password.length >= 8,
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        },
    }
}

