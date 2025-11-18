/**
 * Admin API Service
 * Handles API calls for super admin endpoints
 */

import type { ApiResponse } from '@/services/api'
import { apiClient } from '@/services/api'

export interface Organization {
    id: string
    name: string
    created_at: string
    created_by: string | null
}

export interface CreateOrganizationRequest {
    name: string
}

export interface OrganizationsResponse
    extends ApiResponse<Array<Organization>> {
    data: Array<Organization>
}

export interface CreateOrganizationResponse extends ApiResponse<Organization> {
    data: Organization
}

/**
 * Get all organizations
 */
export async function getOrganizations(): Promise<OrganizationsResponse> {
    return apiClient.get<OrganizationsResponse>('/admin/organizations')
    return apiClient.get<OrganizationsResponse>('/admin/organizations')
}

/**
 * Create a new organization
 */
export async function createOrganization(
    name: string
): Promise<CreateOrganizationResponse> {
    return apiClient.post<CreateOrganizationResponse>('/admin/organizations', {
        name,
    })
}

export interface User {
    id: string
    auth0_user_id: string
    email: string
    role: 'super_admin' | 'org_admin' | 'user'
    org_id: string | null
    created_at: string
    created_by: string | null
}

export interface UsersResponse extends ApiResponse<Array<User>> {
    data: Array<User>
}

export interface AssignUserToOrgRequest {
    org_id: string | null
}

export interface AssignUserRoleRequest {
    role: 'super_admin' | 'org_admin' | 'user'
    org_id?: string | null
}

/**
 * Get all users
 */
export async function getAllUsers(): Promise<UsersResponse> {
    return apiClient.get<UsersResponse>('/admin/users')
    return apiClient.get<UsersResponse>('/admin/users')
}

/**
 * Assign user to organization
 */
export async function assignUserToOrg(
    userId: string,
    orgId: string | null
): Promise<ApiResponse<User>> {
    return apiClient.patch<ApiResponse<User>>(
        `/admin/users/${userId}/assign-org`,
        `/admin/users/${userId}/assign-org`,
        { org_id: orgId || null }
    )
}

/**
 * Assign role to user
 */
export async function assignUserRole(
    userId: string,
    role: 'super_admin' | 'org_admin' | 'user',
    orgId?: string | null
): Promise<ApiResponse<User>> {
    return apiClient.patch<ApiResponse<User>>(
        `/admin/users/${userId}/assign-role`,
        `/admin/users/${userId}/assign-role`,
        { role, org_id: orgId }
    )
}

export interface AllowedEmail {
    id: string
    email: string
    created_at: string
    created_by: string | null
    notes: string | null
}

export interface AllowedEmailsResponse
    extends ApiResponse<Array<AllowedEmail>> {
    data: Array<AllowedEmail>
}

export interface CreateAllowedEmailRequest {
    email: string
    notes?: string
}

export interface CreateAllowedEmailResponse extends ApiResponse<AllowedEmail> {
    data: AllowedEmail
}

/**
 * Get all allowed emails
 */
export async function getAllowedEmails(): Promise<AllowedEmailsResponse> {
    return apiClient.get<AllowedEmailsResponse>('/admin/allowed-emails')
    return apiClient.get<AllowedEmailsResponse>('/admin/allowed-emails')
}

/**
 * Add email to allowlist
 */
export async function addAllowedEmail(
    email: string,
    notes?: string
): Promise<CreateAllowedEmailResponse> {
    return apiClient.post<CreateAllowedEmailResponse>('/admin/allowed-emails', {
        email,
        notes,
    })
}

/**
 * Remove email from allowlist
 */
export async function removeAllowedEmail(
    emailId: string
): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(
        `/admin/allowed-emails/${emailId}`
        `/admin/allowed-emails/${emailId}`
    )
}
