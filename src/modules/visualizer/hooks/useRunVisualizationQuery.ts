/**
 * useRunVisualizationQuery.ts
 * Debounced query execution hook.
 * No JSX. Pure data hook.
 */
import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { VisualizerQueryRequest, VisualizerQueryResult } from '../types'
import { apiClient } from '@/services/api'

async function executeQuery(
    req: VisualizerQueryRequest
): Promise<VisualizerQueryResult> {
    const json = await apiClient.post('/api/visualizer/query', req)
    return json.data as VisualizerQueryResult
}

/**
 * Serializes the query request to a stable string for query key hashing.
 * If the string changes, react-query re-fetches.
 */
function serializeRequest(req: VisualizerQueryRequest): string {
    return JSON.stringify(req)
}

interface UseRunVisualizationQueryOptions {
    enabled?: boolean
    /** Debounce ms before re-fetching after config change. Default 600ms */
    debounceMs?: number
}

export function useRunVisualizationQuery(
    request: VisualizerQueryRequest,
    options: UseRunVisualizationQueryOptions = {}
) {
    const { enabled = true, debounceMs = 600 } = options

    // Debounce: only update the "committed" request after the debounce window
    const [debouncedReq, setDebouncedReq] =
        useState<VisualizerQueryRequest>(request)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const serialized = serializeRequest(request)

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            setDebouncedReq(request)
        }, debounceMs)
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [serialized, debounceMs, request])

    const queryKey = ['visualizer', 'query', serializeRequest(debouncedReq)]

    const query = useQuery({
        queryKey,
        queryFn: () => executeQuery(debouncedReq),
        enabled: enabled && debouncedReq.filters.rules.length > 0,
        staleTime: 30 * 1000, // 30 seconds
        gcTime: 5 * 60 * 1000,
        retry: 1,
    })

    const isEmpty =
        !query.isLoading && !query.isError && (query.data?.rowCount ?? 0) === 0

    return {
        ...query,
        isEmpty,
        isFetching: query.isFetching,
    }
}
