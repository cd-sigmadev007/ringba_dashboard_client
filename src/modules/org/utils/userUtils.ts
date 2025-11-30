/**
 * User Utility Functions
 * Reusable utility functions for user-related operations
 */

/**
 * Get API base URL from environment
 */
export function getApiBaseUrl(): string {
    const baseUrl =
        (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001'
    return baseUrl.replace(/\/api$/, '').replace(/\/+$/, '')
}

/**
 * Convert relative logo URL to absolute URL
 */
export function toAbsoluteLogoUrl(logoUrl?: string | null): string {
    if (!logoUrl) return ''
    if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://'))
        return logoUrl
    const base = getApiBaseUrl()
    const path = logoUrl.startsWith('/') ? logoUrl : `/${logoUrl}`
    return `${base}${path}`
}

/**
 * Get display label for user role
 */
export function getRoleLabel(role: string): string {
    if (role === 'super_admin') return 'Super Admin'
    if (role === 'media_buyer') return 'Media Buyer'
    return role
}

/**
 * Get display label for invitation status
 */
export function getInvitationStatusLabel(status?: string | null): string {
    if (!status) return 'NA'
    if (status === 'send') return 'Sent'
    if (status === 'accepted') return 'Accepted'
    if (status === 'expired') return 'Expired'
    return status
}

/**
 * Get color class for invitation status
 */
export function getInvitationStatusColor(
    status?: string | null,
    isDark: boolean = false
): string {
    if (!status) return isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
    if (status === 'send') return 'text-yellow-500'
    if (status === 'accepted') return 'text-green-500'
    if (status === 'expired') return 'text-red-500'
    return isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
}
