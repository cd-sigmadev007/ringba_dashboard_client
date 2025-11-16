import { create } from 'zustand'

export interface OrgData {
    id: string
    name: string
    website?: string
    contactEmail?: string
    contactPhone?: string
    address1?: string
    address2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    billingEmail?: string
    taxId?: string
    timezone?: string
    logoUrl?: string
    apiKeyMasked?: string
}

interface OrgState {
    org: OrgData | null
    loading: boolean
    error: string | null
    fetchOrg: () => Promise<void>
    updateOrg: (partial: Partial<OrgData>) => Promise<void>
    rotateApiKey: () => Promise<void>
}

export const useOrgStore = create<OrgState>((set, get) => ({
    org: null,
    loading: false,
    error: null,

    fetchOrg: async () => {
        try {
            set({ loading: true, error: null })
            const res = await fetch('/api/org')
            if (!res.ok) throw new Error('Failed to load organization')
            const data: OrgData = await res.json()
            set({ org: data, loading: false })
        } catch (e: any) {
            set({
                loading: false,
                error: e?.message || 'Failed to load organization',
            })
        }
    },

    updateOrg: async (partial) => {
        const prev = get().org
        const optimistic = { ...(prev || {}), ...partial } as OrgData
        set({ org: optimistic })
        try {
            const res = await fetch('/api/org', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(partial),
            })
            if (!res.ok) throw new Error('Failed to update organization')
            const data: OrgData = await res.json()
            set({ org: data })
        } catch (e: any) {
            // rollback on error
            set({ org: prev, error: e?.message || 'Update failed' })
        }
    },

    rotateApiKey: async () => {
        try {
            const res = await fetch('/api/org/rotate-api-key', {
                method: 'POST',
            })
            if (!res.ok) throw new Error('Failed to rotate API key')
            const data: { apiKeyMasked: string } = await res.json()
            const current = get().org
            if (current)
                set({ org: { ...current, apiKeyMasked: data.apiKeyMasked } })
        } catch (e: any) {
            set({ error: e?.message || 'Rotate API key failed' })
        }
    },
}))
