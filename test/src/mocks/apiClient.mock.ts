import { vi } from 'vitest'
import type { AxiosInstance } from 'axios'

/**
 * Mock API client for testing
 */
export function createMockApiClient() {
    const mockGet = vi.fn()
    const mockPost = vi.fn()
    const mockPut = vi.fn()
    const mockDelete = vi.fn()
    const mockPatch = vi.fn()

    const mockClient = {
        get: mockGet,
        post: mockPost,
        put: mockPut,
        delete: mockDelete,
        patch: mockPatch,
        defaults: {
            headers: {
                common: {},
            },
        },
        interceptors: {
            request: {
                use: vi.fn(),
                eject: vi.fn(),
            },
            response: {
                use: vi.fn(),
                eject: vi.fn(),
            },
        },
    } as unknown as AxiosInstance

    return {
        mockClient,
        mockGet,
        mockPost,
        mockPut,
        mockDelete,
        mockPatch,
    }
}

/**
 * Mock API client module
 */
export const mockApiClient = createMockApiClient()
