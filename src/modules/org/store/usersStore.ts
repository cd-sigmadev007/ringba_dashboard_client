import { create } from 'zustand'
import toast from 'react-hot-toast'
import { usersApi } from '../services/usersApi'
import type { CreateUserRequest, UserDto } from '../services/usersApi'

interface UsersState {
    users: Array<UserDto>
    loading: boolean
    error?: string
    fetchUsers: () => Promise<void>
    createUser: (data: CreateUserRequest) => Promise<UserDto | null>
    deleteUser: (id: string) => Promise<boolean>
}

export const useUsersStore = create<UsersState>((set, get) => ({
    users: [],
    loading: false,
    error: undefined,
    async fetchUsers() {
        try {
            set({ loading: true, error: undefined })
            const list = await usersApi.fetchUsers()
            set({ users: list, loading: false })
        } catch (e: any) {
            console.error('Error fetching users:', e)
            const errorMessage =
                e?.message || e?.details?.message || 'Failed to fetch users'
            set({
                error: errorMessage,
                loading: false,
            })
            toast.error(errorMessage)
            throw e
        }
    },
    async createUser(data) {
        try {
            set({ loading: true, error: undefined })
            const created = await usersApi.createUser(data)
            set({ users: [created, ...get().users], loading: false })
            return created
        } catch (e: any) {
            set({
                error: e?.message || 'Failed to create user',
                loading: false,
            })
            return null
        }
    },
    deleteUser(id) {
        try {
            set({ loading: true, error: undefined })
            // TODO: Add delete endpoint to backend
            // await usersApi.deleteUser(id)
            set({
                users: get().users.filter((u) => u.id !== id),
                loading: false,
            })
            return Promise.resolve(true)
        } catch (e: any) {
            set({
                error: e?.message || 'Failed to delete user',
                loading: false,
            })
            return Promise.resolve(false)
        }
    },
}))
