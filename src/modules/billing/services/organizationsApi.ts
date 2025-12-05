/**
 * Billing Organizations API Service
 */

import type { Organization } from '../types'
import type {
    CreateOrganizationRequest,
    UpdateOrganizationRequest,
} from '@/modules/dashboard/services/adminApi'
import {
    createOrganization,
    deleteOrganization,
    getOrganizations,
    updateOrganization,
} from '@/modules/dashboard/services/adminApi'

// Re-export types for convenience
export type {
    Organization,
    CreateOrganizationRequest,
    UpdateOrganizationRequest,
}

/**
 * Get all organizations
 */
export async function fetchOrganizations(): Promise<Array<Organization>> {
    const response = await getOrganizations()
    return response.data
}

/**
 * Create a new organization
 */
export async function createOrg(
    data: CreateOrganizationRequest
): Promise<Organization> {
    const response = await createOrganization(data)
    return response.data
}

/**
 * Update an organization
 */
export async function updateOrg(
    id: string,
    data: UpdateOrganizationRequest
): Promise<Organization> {
    const response = await updateOrganization(id, data)
    return response.data
}

/**
 * Delete an organization
 */
export async function deleteOrg(id: string): Promise<void> {
    await deleteOrganization(id)
}
