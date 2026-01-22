import { vi } from 'vitest'
import { createMockUser } from '../utils'
import type { AuthUser } from '@/contexts/AuthContext'

/**
 * Mock auth context for testing
 */
export function createMockAuthContext(overrides?: Partial<AuthUser>) {
    const user = createMockUser(overrides)

    return {
        user,
        accessToken: 'mock-token',
        loading: false,
        error: null,
        pendingLogin: null,
        login: vi.fn().mockResolvedValue({}),
        verifyLoginOtp: vi.fn().mockResolvedValue(undefined),
        requestInviteOtp: vi.fn().mockResolvedValue(undefined),
        setPassword: vi.fn().mockResolvedValue(undefined),
        logout: vi.fn().mockResolvedValue(undefined),
        getAccessToken: vi.fn().mockReturnValue('mock-token'),
        refresh: vi.fn().mockResolvedValue('mock-token'),
        refetchMe: vi.fn().mockResolvedValue(undefined),
        clearError: vi.fn(),
    }
}
