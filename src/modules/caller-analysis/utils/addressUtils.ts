/**
 * Address Utilities
 * Utility functions for building addresses from parts
 */

import type { CallData } from '../types'

/** Get string from CallData using camelCase or snake_case key (GraphQL uses snake_case) */
function getStr(data: CallData, camel: string, snake: string): string | null {
    const raw =
        (data as unknown as Record<string, unknown>)[camel] ??
        (data as unknown as Record<string, unknown>)[snake]
    if (raw == null || raw === '') return null
    const s = String(raw).trim()
    return s !== 'NA' ? s : null
}

/**
 * Builds address string from CallData parts
 * Handles street number, street name, street type, city, state, zip
 * Supports both camelCase (REST) and snake_case (GraphQL) field names
 * @param callerData - CallData object with address fields
 * @returns Formatted address string or fallback value
 */
export function buildAddressFromCallData(callerData: CallData): string {
    const streetNumber = getStr(callerData, 'streetNumber', 'street_number')
    const streetName = getStr(callerData, 'streetName', 'street_name')
    const streetType = getStr(callerData, 'streetType', 'street_type')
    const city = getStr(callerData, 'city', 'city')
    const state = getStr(callerData, 'state', 'state')
    const zip = getStr(callerData, 'zip', 'g_zip')

    const streetParts: Array<string> = []
    if (streetNumber) streetParts.push(streetNumber)
    if (streetName) streetParts.push(streetName)
    if (streetType) streetParts.push(streetType)
    const street = streetParts.length > 0 ? streetParts.join(' ') : null

    const addressParts: Array<string> = []
    if (street) addressParts.push(street)
    if (city) addressParts.push(city)
    if (state) addressParts.push(state)
    if (zip) addressParts.push(zip)

    return addressParts.length > 0
        ? addressParts.join(', ')
        : callerData.address || '-'
}
