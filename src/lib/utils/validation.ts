/**
 * Validation utilities for form fields and data
 */

/**
 * Validates an email address
 * @param email - Email to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validates a wallet address (basic format check)
 * @param address - Address to validate
 * @returns Boolean indicating if address format is valid
 */
export function isValidWalletAddress(address: string): boolean {
    // Basic Ethereum address validation (0x followed by 40 hex characters)
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
    return ethAddressRegex.test(address)
}

/**
 * Validates a URL
 * @param url - URL to validate
 * @returns Boolean indicating if URL is valid
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

/**
 * Validates a phone number (basic format)
 * @param phone - Phone number to validate
 * @returns Boolean indicating if phone number is valid
 */
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[1-9]\d{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ''))
}

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns Object with validation results
 */
export function validatePassword(password: string): {
    isValid: boolean
    errors: Array<string>
    strength: 'weak' | 'medium' | 'strong'
} {
    const errors: Array<string> = []
    let score = 0

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long')
    } else {
        score += 1
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter')
    } else {
        score += 1
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter')
    } else {
        score += 1
    }

    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number')
    } else {
        score += 1
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character')
    } else {
        score += 1
    }

    let strength: 'weak' | 'medium' | 'strong' = 'weak'
    if (score >= 4) strength = 'strong'
    else if (score >= 2) strength = 'medium'

    return {
        isValid: errors.length === 0,
        errors,
        strength,
    }
}

/**
 * Validates required field
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns Error message or null if valid
 */
export function validateRequired(value: any, fieldName: string): string | null {
    if (value === null || value === undefined || value === '') {
        return `${fieldName} is required`
    }
    return null
}

/**
 * Validates minimum length
 * @param value - Value to validate
 * @param minLength - Minimum length required
 * @param fieldName - Name of the field for error message
 * @returns Error message or null if valid
 */
export function validateMinLength(
    value: string,
    minLength: number,
    fieldName: string
): string | null {
    if (value.length < minLength) {
        return `${fieldName} must be at least ${minLength} characters long`
    }
    return null
}

/**
 * Validates maximum length
 * @param value - Value to validate
 * @param maxLength - Maximum length allowed
 * @param fieldName - Name of the field for error message
 * @returns Error message or null if valid
 */
export function validateMaxLength(
    value: string,
    maxLength: number,
    fieldName: string
): string | null {
    if (value.length > maxLength) {
        return `${fieldName} must not exceed ${maxLength} characters`
    }
    return null
}

/**
 * Validates numeric value
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns Error message or null if valid
 */
export function validateNumeric(
    value: string,
    fieldName: string
): string | null {
    if (isNaN(Number(value))) {
        return `${fieldName} must be a valid number`
    }
    return null
}

/**
 * Validates minimum value
 * @param value - Value to validate
 * @param minValue - Minimum value required
 * @param fieldName - Name of the field for error message
 * @returns Error message or null if valid
 */
export function validateMinValue(
    value: number,
    minValue: number,
    fieldName: string
): string | null {
    if (value < minValue) {
        return `${fieldName} must be at least ${minValue}`
    }
    return null
}

/**
 * Validates maximum value
 * @param value - Value to validate
 * @param maxValue - Maximum value allowed
 * @param fieldName - Name of the field for error message
 * @returns Error message or null if valid
 */
export function validateMaxValue(
    value: number,
    maxValue: number,
    fieldName: string
): string | null {
    if (value > maxValue) {
        return `${fieldName} must not exceed ${maxValue}`
    }
    return null
}
