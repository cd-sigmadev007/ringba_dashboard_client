/**
 * useVisualizerSchema.ts
 * Fetches and caches the field catalogue from the server.
 * No JSX. Pure data hook.
 */
import { useQuery } from '@tanstack/react-query'
import type { VisualizerSchema } from '../types'

const BASE_URL =
    (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001')
        .replace(/\/$/, '')

async function fetchSchema(): Promise<VisualizerSchema> {
    const res = await fetch(`${BASE_URL}/api/visualizer/schema`, {
        credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to fetch visualizer schema')
    const json = await res.json()
    return json.data as VisualizerSchema
}

export function useVisualizerSchema() {
    return useQuery({
        queryKey: ['visualizer', 'schema'],
        queryFn: fetchSchema,
        // Schema never changes at runtime — cache indefinitely
        staleTime: Infinity,
        gcTime: Infinity,
    })
}
