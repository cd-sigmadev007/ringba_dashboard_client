import { apiClient } from '@/services/api'

export interface UserDto {
    id: string
    auth0_user_id: string | null
    email: string
    role: 'super_admin' | 'org_admin' | 'user'
    org_id: string | null
    created_at: string
    created_by: string | null
    invitation_status?: 'send' | 'accepted' | 'expired' | null
    logo_url?: string | null
}

export interface CreateUserRequest {
    email: string
    name?: string
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
}
