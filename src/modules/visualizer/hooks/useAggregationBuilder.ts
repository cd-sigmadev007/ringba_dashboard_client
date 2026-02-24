/**
 * useAggregationBuilder.ts
 * Manages group-by fields and aggregation definitions.
 * No JSX. Pure state hook.
 */
import { useCallback, useState } from 'react'
import type { AggDef, AggFn } from '../types'

let _aggCounter = 0
const uid = () =>
    `agg_${++_aggCounter}_${Math.random().toString(36).slice(2, 7)}`

export function useAggregationBuilder() {
    const [groupBy, setGroupBy] = useState<Array<string>>([])
    const [aggregations, setAggregations] = useState<Array<AggDef>>([])

    const addGroupBy = useCallback((field: string) => {
        setGroupBy((prev) => (prev.includes(field) ? prev : [...prev, field]))
    }, [])

    const removeGroupBy = useCallback((field: string) => {
        setGroupBy((prev) => prev.filter((f) => f !== field))
    }, [])

    const reorderGroupBy = useCallback((from: number, to: number) => {
        setGroupBy((prev) => {
            const next = [...prev]
            const [moved] = next.splice(from, 1)
            next.splice(to, 0, moved)
            return next
        })
    }, [])

    const addAggregation = useCallback((fn: AggFn, field: string) => {
        const alias = `${fn}_${field.replace(/\./g, '_')}`
        setAggregations((prev) => {
            if (prev.some((a) => a.field === field && a.fn === fn)) return prev
            return [...prev, { id: uid(), fn, field, alias }]
        })
    }, [])

    const removeAggregation = useCallback((id: string) => {
        setAggregations((prev) => prev.filter((a) => a.id !== id))
    }, [])

    const updateAggAlias = useCallback((id: string, alias: string) => {
        setAggregations((prev) =>
            prev.map((a) => (a.id === id ? { ...a, alias } : a))
        )
    }, [])

    const reset = useCallback(() => {
        setGroupBy([])
        setAggregations([])
    }, [])

    const hasAggregations = aggregations.length > 0

    return {
        groupBy,
        aggregations,
        hasAggregations,
        addGroupBy,
        removeGroupBy,
        reorderGroupBy,
        addAggregation,
        removeAggregation,
        updateAggAlias,
        reset,
    }
}
