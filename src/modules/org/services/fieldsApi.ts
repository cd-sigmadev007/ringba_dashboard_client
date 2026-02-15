import { apiClient } from '@/services/api'

export interface CallDataField {
    field_name: string
    display_name: string
    hidden: boolean
}

export interface UpdateFieldRequest {
    display_name?: string | null
    hidden?: boolean
}

export const fieldsApi = {
    /**
     * Get all call data fields (includeHidden=true for management view)
     */
    async getFields(includeHidden = true): Promise<Array<CallDataField>> {
        const params = includeHidden ? '?includeHidden=true' : ''
        const res = await apiClient.get<{
            success: boolean
            data: Array<CallDataField>
        }>(`/api/org-admin/fields${params}`)
        return res?.data ?? []
    },

    /**
     * Update a field (display_name, hidden)
     */
    async updateField(
        fieldName: string,
        input: UpdateFieldRequest
    ): Promise<CallDataField> {
        const encoded = encodeURIComponent(fieldName)
        const res = await apiClient.put<{
            success: boolean
            data: CallDataField
        }>(`/api/org-admin/fields/${encoded}`, input)
        return res.data
    },

    /**
     * Delete a field (removes from registry)
     */
    async deleteField(fieldName: string): Promise<void> {
        const encoded = encodeURIComponent(fieldName)
        await apiClient.delete<{ success: boolean }>(
            `/api/org-admin/fields/${encoded}`
        )
    },
}
