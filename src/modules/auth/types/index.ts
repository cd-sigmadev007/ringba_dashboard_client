/**
 * Auth Module Types
 */

export interface LoginCredentials {
    email: string
    password: string
}

export interface ForgotPasswordRequest {
    email: string
}

export interface ResetPasswordRequest {
    token: string
    password: string
}

export interface ChangePasswordRequest {
    oldPassword: string
    newPassword: string
}

export interface PasswordValidationResult {
    isValid: boolean
    errors: Array<string>
    strength: 'weak' | 'medium' | 'strong'
    checks: {
        minLength: boolean
        hasLowercase: boolean
        hasUppercase: boolean
        hasNumber: boolean
        hasSpecialChar: boolean
    }
}

export interface AuthError {
    message: string
    code?: string
}
