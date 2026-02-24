/**
 * useVisualizerSchema.ts
 * Fetches and caches the field catalogue from the server.
 * No JSX. Pure data hook.
 */
import { useQuery } from '@tanstack/react-query'
import type { VisualizerSchema } from '../types'
import { apiClient } from '@/services/api'

async function fetchSchema(): Promise<VisualizerSchema> {
    const json = await apiClient.get('/api/visualizer/schema')
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
