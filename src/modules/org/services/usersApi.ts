import { apiClient } from '@/services/api'

export interface UserDto {
    id: string
    auth0_user_id: string | null
    email: string
    role: 'super_admin' | 'org_admin' | 'media_buyer'
    org_id: string | null
    created_at: string
    created_by: string | null
    invitation_status?: 'send' | 'accepted' | 'expired' | null
    logo_url?: string | null
    first_name?: string | null
    last_name?: string | null
    profile_picture_url?: string | null
}

export interface CreateUserRequest {
    email: string
    name?: string
    first_name?: string
    last_name?: string
    org_id?: string | null
    invitation_status?: 'send' | 'accepted' | 'expired'
}

export const usersApi = {
    async fetchUsers(): Promise<Array<UserDto>> {
        const res = await apiClient.get<{
            success: boolean
            data: Array<UserDto>
        }>('/api/org-admin/users')
        return res.data
    },

    async createUser(input: CreateUserRequest): Promise<UserDto> {
        const res = await apiClient.post<{
            success: boolean
            data: UserDto
        }>('/api/org-admin/users', {
            email: input.email,
            invitation_status: input.invitation_status || 'send',
            org_id: input.org_id,
            first_name: input.first_name,
            last_name: input.last_name,
        })
        return res.data
    },

    async getUserById(id: string): Promise<UserDto> {
        const res = await apiClient.get<{
            success: boolean
            data: UserDto
        }>(`/api/org-admin/users/${id}`)
        return res.data
    },

    async deleteUser(userId: string): Promise<void> {
        await apiClient.delete<{
            success: boolean
            message?: string
        }>(`/api/users/${userId}`)
    },

    async getUserViewAccess(userId: string): Promise<{
        id: string
        user_id: string
        access_type: 'full' | 'date_specific'
        date_from: string | null
        date_to: string | null
        created_at: string
        updated_at: string
    } | null> {
        const res = await apiClient.get<{
            success: boolean
            data: {
                id: string
                user_id: string
                access_type: 'full' | 'date_specific'
                date_from: string | null
                date_to: string | null
                created_at: string
                updated_at: string
            } | null
        }>(`/api/users/${userId}/view-access`)
        return res.data
    },

    async setUserViewAccess(
        userId: string,
        accessType: 'full' | 'date_specific',
        dateFrom?: string,
        dateTo?: string
    ): Promise<{
        id: string
        user_id: string
        access_type: 'full' | 'date_specific'
        date_from: string | null
        date_to: string | null
        created_at: string
        updated_at: string
    }> {
        const res = await apiClient.post<{
            success: boolean
            data: {
                id: string
                user_id: string
                access_type: 'full' | 'date_specific'
                date_from: string | null
                date_to: string | null
                created_at: string
                updated_at: string
            }
        }>(`/api/users/${userId}/view-access`, {
            access_type: accessType,
            date_from: dateFrom,
            date_to: dateTo,
        })
        return res.data
    },

    async deleteUserViewAccess(userId: string): Promise<void> {
        await apiClient.delete<{
            success: boolean
            message?: string
        }>(`/api/users/${userId}/view-access`)
    },

    async getUserCampaigns(userId: string): Promise<
        Array<{
            id: string
            name: string
            org_id: string
            created_at: string
            created_by: string | null
            campaign_id?: string | null
            logo_url?: string | null
            description?: string | null
        }>
    > {
        const res = await apiClient.get<{
            success: boolean
            data: Array<{
                id: string
                name: string
                org_id: string
                created_at: string
                created_by: string | null
                campaign_id?: string | null
                logo_url?: string | null
                description?: string | null
            }>
        }>(`/api/org-admin/users/${userId}/campaigns`)
        return res.data
    },

    async assignCampaignToUser(
        userId: string,
        campaignId: string
    ): Promise<void> {
        await apiClient.post<{
            success: boolean
            message?: string
        }>(`/api/org-admin/users/${userId}/campaigns`, {
            campaign_id: campaignId,
        })
    },

    async removeCampaignFromUser(
        userId: string,
        campaignId: string
    ): Promise<void> {
        await apiClient.delete<{
            success: boolean
            message?: string
        }>(`/api/org-admin/users/${userId}/campaigns/${campaignId}`)
    },
}
