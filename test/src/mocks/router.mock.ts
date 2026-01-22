import { vi } from 'vitest'

/**
 * Mock TanStack Router for testing
 */
export const mockRouter = {
    navigate: vi.fn(),
    state: {
        location: {
            pathname: '/',
            search: {},
            hash: '',
        },
    },
}

export const mockUseNavigate = () => vi.fn()
export const mockUseLocation = () => ({
    pathname: '/',
    search: {},
    hash: '',
})

export const mockUseParams = () => ({})
