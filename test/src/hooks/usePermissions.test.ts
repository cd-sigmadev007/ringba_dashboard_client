import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuth } from '@/contexts/AuthContext'

vi.mock('@/contexts/AuthContext', () => ({
    useAuth: vi.fn(),
}))

describe('usePermissions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return loading state when auth is loading', () => {
        vi.mocked(useAuth).mockReturnValue({
            user: null,
            loading: true,
        } as any)

        const { result } = renderHook(() => usePermissions())

        expect(result.current.isLoading).toBe(true)
        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.role).toBe(null)
    })

    it('should return permissions for authenticated user', () => {
        vi.mocked(useAuth).mockReturnValue({
            user: {
                id: '1',
                email: 'test@example.com',
                role: 'super_admin',
                orgId: 'org-1',
                campaignIds: ['campaign-1', 'campaign-2'],
            },
            loading: false,
        } as any)

        const { result } = renderHook(() => usePermissions())

        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.role).toBe('super_admin')
        expect(result.current.org_id).toBe('org-1')
        expect(result.current.campaign_ids).toEqual(['campaign-1', 'campaign-2'])
    })

    it('should return empty state for unauthenticated user', () => {
        vi.mocked(useAuth).mockReturnValue({
            user: null,
            loading: false,
        } as any)

        const { result } = renderHook(() => usePermissions())

        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.role).toBe(null)
        expect(result.current.org_id).toBe(null)
        expect(result.current.campaign_ids).toEqual([])
    })

    it('should handle user without campaignIds', () => {
        vi.mocked(useAuth).mockReturnValue({
            user: {
                id: '1',
                email: 'test@example.com',
                role: 'media_buyer',
                orgId: 'org-1',
                campaignIds: null,
            },
            loading: false,
        } as any)

        const { result } = renderHook(() => usePermissions())

        expect(result.current.campaign_ids).toEqual([])
    })
})
