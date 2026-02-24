import { useQuery } from '@tanstack/react-query'
import {
    GET_TAG_USAGE_STATS_QUERY,
    GET_TAG_COUNT_BY_TIER_QUERY,
    GET_TAG_COUNT_BY_PRIORITY_QUERY,
    GET_TAGGING_DASHBOARD_QUERY,
} from '@/modules/caller-analysis/graphql/queries'
import { graphqlClient } from '@/lib/graphql/client'
import { useAuth } from '@/contexts/AuthContext'
import type {
    TagUsageStats,
    TierTagCount,
    PriorityTagCount,
    TaggingDashboard,
} from '../types'

export function useTagUsageStats(dateFrom?: string, dateTo?: string) {
    const { user, loading: authLoading } = useAuth()
    const isAuthenticated = !!user && !authLoading

    return useQuery({
        queryKey: ['graphql', 'tagUsageStats', dateFrom, dateTo],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                tagUsageStats: TagUsageStats
            }>(GET_TAG_USAGE_STATS_QUERY, { dateFrom, dateTo })
            return data.tagUsageStats
        },
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
}

export function useTagCountByTier(dateFrom?: string, dateTo?: string) {
    const { user, loading: authLoading } = useAuth()
    const isAuthenticated = !!user && !authLoading

    return useQuery({
        queryKey: ['graphql', 'tagCountByTier', dateFrom, dateTo],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                tagCountByTier: TierTagCount[]
            }>(GET_TAG_COUNT_BY_TIER_QUERY, { dateFrom, dateTo })
            return data.tagCountByTier
        },
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
}

export function useTagCountByPriority(dateFrom?: string, dateTo?: string) {
    const { user, loading: authLoading } = useAuth()
    const isAuthenticated = !!user && !authLoading

    return useQuery({
        queryKey: ['graphql', 'tagCountByPriority', dateFrom, dateTo],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                tagCountByPriority: PriorityTagCount[]
            }>(GET_TAG_COUNT_BY_PRIORITY_QUERY, { dateFrom, dateTo })
            return data.tagCountByPriority
        },
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
}

/** Unified tagging dashboard - single query, avoids N+1, tag names resolved */
export function useTaggingDashboard(dateFrom?: string, dateTo?: string) {
    const { user, loading: authLoading } = useAuth()
    const isAuthenticated = !!user && !authLoading

    return useQuery({
        queryKey: ['graphql', 'taggingDashboard', dateFrom, dateTo],
        queryFn: async () => {
            const data = await graphqlClient.request<{
                taggingDashboard: TaggingDashboard
            }>(GET_TAGGING_DASHBOARD_QUERY, { dateFrom, dateTo })
            return data.taggingDashboard
        },
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
}
