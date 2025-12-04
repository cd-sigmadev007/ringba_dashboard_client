/**
 * Billing Organizations API Service
 */

import {
    getOrganizations,
    createOrganization,
    updateOrganization,
    type Organization as AdminOrganization,
    type CreateOrganizationRequest,
    type UpdateOrganizationRequest,
    type OrganizationsResponse,
    type CreateOrganizationResponse,
} from '@/modules/dashboard/services/adminApi'
import type { Organization } from '../types'

// Re-export types for convenience
export type { Organization, CreateOrganizationRequest, UpdateOrganizationRequest }

/**
 * Get all organizations
 */
export async function fetchOrganizations(): Promise<Organization[]> {
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

