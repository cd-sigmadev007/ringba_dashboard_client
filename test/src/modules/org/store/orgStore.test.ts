import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { OrgData } from '@/modules/org/store/orgStore'
import { useOrgStore } from '@/modules/org/store/orgStore'

// Mock fetch
global.fetch = vi.fn()

describe('orgStore', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        useOrgStore.setState({
            org: null,
            loading: false,
            error: null,
        })
    })

    describe('fetchOrg', () => {
        it('should fetch and set organization data', async () => {
            const mockOrg: OrgData = {
                id: 'org-1',
                name: 'Test Org',
                website: 'https://example.com',
                contactEmail: 'test@example.com',
            }

            ;(global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockOrg,
            })

            await useOrgStore.getState().fetchOrg()

            expect(useOrgStore.getState().org).toEqual(mockOrg)
            expect(useOrgStore.getState().loading).toBe(false)
            expect(useOrgStore.getState().error).toBe(null)
        })

        it('should handle fetch errors', async () => {
            ;(global.fetch as any).mockResolvedValueOnce({
                ok: false,
            })

            await useOrgStore.getState().fetchOrg()

            expect(useOrgStore.getState().org).toBe(null)
            expect(useOrgStore.getState().loading).toBe(false)
            expect(useOrgStore.getState().error).toBe(
                'Failed to load organization'
            )
        })

        it('should set loading state during fetch', async () => {
            let resolveFetch: any
            const fetchPromise = new Promise((resolve) => {
                resolveFetch = resolve
            })
            ;(global.fetch as any).mockReturnValueOnce(fetchPromise)

            const fetchPromise2 = useOrgStore.getState().fetchOrg()
            expect(useOrgStore.getState().loading).toBe(true)

            resolveFetch({
                ok: true,
                json: async () => ({}),
            })
            await fetchPromise2

            expect(useOrgStore.getState().loading).toBe(false)
        })
    })

    describe('updateOrg', () => {
        it('should optimistically update org and then sync with server', async () => {
            const initialOrg: OrgData = {
                id: 'org-1',
                name: 'Initial Name',
            }
            useOrgStore.setState({ org: initialOrg })

            const updatedOrg: OrgData = {
                id: 'org-1',
                name: 'Updated Name',
            }

            ;(global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => updatedOrg,
            })

            await useOrgStore.getState().updateOrg({ name: 'Updated Name' })

            expect(useOrgStore.getState().org).toEqual(updatedOrg)
        })

        it('should rollback on update error', async () => {
            const initialOrg: OrgData = {
                id: 'org-1',
                name: 'Initial Name',
            }
            useOrgStore.setState({ org: initialOrg })
            ;(global.fetch as any).mockResolvedValueOnce({
                ok: false,
            })

            await useOrgStore.getState().updateOrg({ name: 'Updated Name' })

            // Should rollback to initial
            expect(useOrgStore.getState().org).toEqual(initialOrg)
            expect(useOrgStore.getState().error).toBeTruthy()
        })
    })

    describe('rotateApiKey', () => {
        it('should rotate API key and update org', async () => {
            const initialOrg: OrgData = {
                id: 'org-1',
                name: 'Test Org',
                apiKeyMasked: 'old-key',
            }
            useOrgStore.setState({ org: initialOrg })
            ;(global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ apiKeyMasked: 'new-key' }),
            })

            await useOrgStore.getState().rotateApiKey()

            expect(useOrgStore.getState().org?.apiKeyMasked).toBe('new-key')
        })

        it('should handle rotate API key errors', async () => {
            const initialOrg: OrgData = {
                id: 'org-1',
                name: 'Test Org',
            }
            useOrgStore.setState({ org: initialOrg })
            ;(global.fetch as any).mockResolvedValueOnce({
                ok: false,
            })

            await useOrgStore.getState().rotateApiKey()

            expect(useOrgStore.getState().error).toBeTruthy()
        })
    })
})
