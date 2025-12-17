import { apiClient } from '@/services/api'

export type ApiKeyType = 'assembly_ai' | 'ai_model' | 'ringba'

export interface ApiKeyDto {
    id: string
    organization_id: string
    key_type: ApiKeyType
    api_key: string
    is_active: boolean
    created_at: string
    updated_at: string
    created_by: string | null
}

export interface CreateApiKeyRequest {
    key_type: ApiKeyType
    api_key: string
    is_active?: boolean
}

export interface UpdateApiKeyStatusRequest {
    is_active: boolean
}

export const apiKeysApi = {
    /**
     * Get all API keys for the current organization
     */
    async getApiKeys(keyType?: ApiKeyType): Promise<Array<ApiKeyDto>> {
        const params = keyType ? `?key_type=${keyType}` : ''
        const res = await apiClient.get<{
            success: boolean
            data: Array<ApiKeyDto>
        }>(`/api/org-admin/api-keys${params}`)
        // The backend returns { success: true, data: [...] }
        // apiClient.get returns response.data, so res is { success: true, data: [...] }
        // We need to return res.data which is the array
        if (Array.isArray(res)) {
            return res
        }
        return res?.data || []
    },

    /**
     * Create or update an API key
     */
    async createApiKey(input: CreateApiKeyRequest): Promise<ApiKeyDto> {
        const res = await apiClient.post<{
            success: boolean
            data: ApiKeyDto
        }>('/api/org-admin/api-keys', input)
        return res.data
    },

    /**
     * Update API key active status
     */
    async updateApiKeyStatus(
        id: string,
        isActive: boolean
    ): Promise<ApiKeyDto> {
        const res = await apiClient.put<{
            success: boolean
            data: ApiKeyDto
        }>(`/api/org-admin/api-keys/${id}/status`, {
            is_active: isActive,
        })
        return res.data
    },

    /**
     * Delete an API key
     */
    async deleteApiKey(id: string): Promise<void> {
        await apiClient.delete<{
            success: boolean
            message?: string
        }>(`/api/org-admin/api-keys/${id}`)
    },
}
