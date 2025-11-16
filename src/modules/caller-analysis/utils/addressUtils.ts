/**
 * Address Utilities
 * Utility functions for building addresses from parts
 */

import type { CallData } from '../types'

/**
 * Builds address string from CallData parts
 * Handles street number, street name, street type, city, state, zip
 * Filters out 'NA' values and empty strings
 * @param callerData - CallData object with address fields
 * @returns Formatted address string or fallback value
 */
export function buildAddressFromCallData(callerData: CallData): string {
    const parts: Array<string> = []

    // Add street number
    if (
        callerData.streetNumber &&
        callerData.streetNumber !== 'NA' &&
        callerData.streetNumber.trim()
    ) {
        parts.push(callerData.streetNumber.trim())
    }

    // Add street name
    if (
        callerData.streetName &&
        callerData.streetName !== 'NA' &&
        callerData.streetName.trim()
    ) {
        parts.push(callerData.streetName.trim())
    }

    // Add street type
    if (
        callerData.streetType &&
        callerData.streetType !== 'NA' &&
        callerData.streetType.trim()
    ) {
        parts.push(callerData.streetType.trim())
    }

    // Join street parts
    const street = parts.length > 0 ? parts.join(' ') : null

    // Build full address
    const addressParts: Array<string> = []
    if (street) addressParts.push(street)
    if (callerData.city && callerData.city !== 'NA' && callerData.city.trim()) {
        addressParts.push(callerData.city.trim())
    }
    if (
        callerData.state &&
        callerData.state !== 'NA' &&
        callerData.state.trim()
    ) {
        addressParts.push(callerData.state.trim())
    }
    if (callerData.zip && callerData.zip !== 'NA' && callerData.zip.trim()) {
        addressParts.push(callerData.zip.trim())
    }

    return addressParts.length > 0
        ? addressParts.join(', ')
        : callerData.address || '-'
}
