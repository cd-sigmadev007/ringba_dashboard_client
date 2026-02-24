/**
 * useVisualizationConfig.ts
 * Manages chart type and axis configuration.
 * No JSX. Pure state hook.
 */
import { useCallback, useEffect, useState } from 'react'
import type { AggDef, VizConfig, VizType } from '../types'

const DEFAULTS: VizConfig = { type: 'table' }

export function useVisualizationConfig(
    aggregations: Array<AggDef>,
    groupBy: Array<string>
) {
    const [config, setConfig] = useState<VizConfig>(DEFAULTS)

    // Auto-suggest axis mappings when aggregations / groupBy change
    useEffect(() => {
        const firstGroup = groupBy[0]
        const firstAgg = aggregations[0]?.alias
        if (!firstGroup && !firstAgg) return

        setConfig((prev) => {
            const next: VizConfig = { ...prev }
            if (firstGroup && !prev.xField) next.xField = firstGroup
            if (firstAgg && (!prev.yFields || prev.yFields.length === 0))
                next.yFields = [firstAgg]
            return next
        })
    }, [groupBy, aggregations])

    const setType = useCallback((type: VizType) => {
        setConfig((prev) => ({ ...prev, type }))
    }, [])

    const setXField = useCallback((field: string) => {
        setConfig((prev) => ({ ...prev, xField: field }))
    }, [])

    const setYFields = useCallback((fields: Array<string>) => {
        setConfig((prev) => ({ ...prev, yFields: fields }))
    }, [])

    const setSeriesField = useCallback((field: string) => {
        setConfig((prev) => ({ ...prev, seriesField: field }))
    }, [])

    const setValueFormat = useCallback((fmt: VizConfig['valueFormat']) => {
        setConfig((prev) => ({ ...prev, valueFormat: fmt }))
    }, [])

    const setKpiField = useCallback((field: string) => {
        setConfig((prev) => ({ ...prev, kpiField: field }))
    }, [])

    const reset = useCallback(() => setConfig(DEFAULTS), [])

    return {
        config,
        setType,
        setXField,
        setYFields,
        setSeriesField,
        setValueFormat,
        setKpiField,
        reset,
    }
}
