/**
 * VisualizerContainer.tsx
 * Orchestrates all query builder hooks and renders the layout.
 * Layout: fixed left sidebar (builder) + main content area (chart + viz controls)
 */
import React, { useMemo, useState } from 'react'
import clsx from 'clsx'

import { useVisualizerSchema } from '../hooks/useVisualizerSchema'
import { useFilterBuilder } from '../hooks/useFilterBuilder'
import { useAggregationBuilder } from '../hooks/useAggregationBuilder'
import { useVisualizationConfig } from '../hooks/useVisualizationConfig'
import { useRunVisualizationQuery } from '../hooks/useRunVisualizationQuery'

import { FilterGroupPanel } from '../components/FilterGroupPanel'
import { AggregationBuilder } from '../components/AggregationBuilder'
import { VisualizationSelector } from '../components/VisualizationSelector'
import { VisualizationConfigPanel } from '../components/VisualizationConfigPanel'
import { ChartRenderer } from '../components/ChartRenderer'
import { TableRenderer } from '../components/TableRenderer'

import type { VisualizerQueryRequest } from '../types'
import { useThemeStore } from '@/store/themeStore'

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
const SkeletonRect = ({ className }: { className?: string }) => (
    <div
        className={clsx('animate-pulse rounded-lg', className)}
        style={{ background: 'rgba(100,130,170,0.08)' }}
    />
)

const PreviewSkeleton = () => (
    <div className="space-y-4 p-8">
        <SkeletonRect className="h-5 w-1/4" />
        <SkeletonRect className="h-56 w-full" />
        <div className="grid grid-cols-3 gap-3">
            <SkeletonRect className="h-4" />
            <SkeletonRect className="h-4" />
            <SkeletonRect className="h-4" />
        </div>
    </div>
)

// ---------------------------------------------------------------------------
// Collapsible sidebar section
// ---------------------------------------------------------------------------
interface SectionProps {
    title: string
    icon: React.ReactNode
    children: React.ReactNode
    isDark: boolean
    defaultOpen?: boolean
    badge?: number
}

const SidebarSection: React.FC<SectionProps> = ({
    title,
    icon,
    children,
    isDark,
    defaultOpen = true,
    badge,
}) => {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div
            className={clsx(
                'rounded-xl border',
                isDark ? 'border-[#1E3A5F]' : 'border-gray-200'
            )}
        >
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={clsx(
                    'flex items-center gap-2.5 w-full px-4 py-3 text-left transition-colors rounded-xl',
                    open && 'rounded-b-none',
                    isDark
                        ? 'bg-[#0D2137] hover:bg-[#1E3A5F]/40'
                        : 'bg-gray-50 hover:bg-gray-100'
                )}
            >
                <span className={isDark ? 'text-[#4A6080]' : 'text-gray-400'}>
                    {icon}
                </span>
                <span
                    className={clsx(
                        'text-xs font-semibold uppercase tracking-widest flex-1',
                        isDark ? 'text-[#B0C4DE]' : 'text-gray-600'
                    )}
                >
                    {title}
                </span>
                {badge !== undefined && badge > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                        {badge}
                    </span>
                )}
                <svg
                    className={clsx(
                        'w-4 h-4 transition-transform flex-shrink-0',
                        open && 'rotate-180',
                        isDark ? 'text-[#4A6080]' : 'text-gray-400'
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>
            {open && (
                <div
                    className={clsx(
                        'p-4 border-t rounded-b-xl',
                        isDark
                            ? 'bg-[#071426] border-[#1E3A5F]'
                            : 'bg-white border-gray-100'
                    )}
                >
                    {children}
                </div>
            )}
        </div>
    )
}

// ---------------------------------------------------------------------------
// Container
// ---------------------------------------------------------------------------
export const VisualizerContainer: React.FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const { data: schema, isLoading: schemaLoading } = useVisualizerSchema()
    const filterHook = useFilterBuilder()
    const aggHook = useAggregationBuilder()
    const vizHook = useVisualizationConfig(
        aggHook.aggregations,
        aggHook.groupBy
    )

    const queryRequest: VisualizerQueryRequest = useMemo(
        () => ({
            includeTagJoin: true,
            filters: filterHook.root,
            groupBy: aggHook.groupBy,
            aggregations: aggHook.aggregations,
            sort: [],
            limit: 500,
        }),
        [filterHook.root, aggHook.groupBy, aggHook.aggregations]
    )

    const {
        data: queryResult,
        isLoading: queryLoading,
        isFetching,
        isError,
        error,
        isEmpty,
    } = useRunVisualizationQuery(queryRequest, { enabled: true })

    const colOptions = useMemo(() => {
        if (queryResult)
            return queryResult.columns.map((c) => ({ key: c, label: c }))
        return aggHook.aggregations.map((a) => ({
            key: a.alias,
            label: a.alias,
        }))
    }, [queryResult, aggHook.aggregations])

    const fields = schema?.fields ?? []
    const activeFilterCount = filterHook.root.rules.length
    const activeAggCount = aggHook.aggregations.length + aggHook.groupBy.length

    // Icons
    const FilterIcon = (
        <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
            />
        </svg>
    )
    const GroupIcon = (
        <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
        </svg>
    )

    return (
        <div
            className="flex gap-5 h-full min-h-0"
            style={{ alignItems: 'flex-start' }}
        >
            {/* ---------------------------------------------------------------- */}
            {/* LEFT SIDEBAR — Query Builder                                      */}
            {/* ---------------------------------------------------------------- */}
            <aside
                className="flex flex-col gap-3 overflow-y-auto flex-shrink-0"
                style={{ width: 320, maxHeight: 'calc(100vh - 170px)' }}
            >
                <SidebarSection
                    title="Filters"
                    icon={FilterIcon}
                    isDark={isDark}
                    defaultOpen={true}
                    badge={activeFilterCount}
                >
                    {schemaLoading ? (
                        <div className="space-y-3">
                            <SkeletonRect className="h-9 w-full" />
                            <SkeletonRect className="h-9 w-full" />
                        </div>
                    ) : (
                        <FilterGroupPanel
                            group={filterHook.root}
                            fields={fields}
                            schema={schema}
                            onAddRule={filterHook.addRule}
                            onAddGroup={filterHook.addGroup}
                            onRemoveNode={filterHook.removeNode}
                            onUpdateRule={filterHook.updateRule}
                            onToggleLogic={filterHook.toggleLogic}
                        />
                    )}
                </SidebarSection>

                <SidebarSection
                    title="Group By & Metrics"
                    icon={GroupIcon}
                    isDark={isDark}
                    defaultOpen={true}
                    badge={activeAggCount}
                >
                    {schemaLoading ? (
                        <div className="space-y-3">
                            <SkeletonRect className="h-9 w-full" />
                            <SkeletonRect className="h-9 w-full" />
                        </div>
                    ) : (
                        <AggregationBuilder
                            fields={fields}
                            groupBy={aggHook.groupBy}
                            aggregations={aggHook.aggregations}
                            onAddGroupBy={aggHook.addGroupBy}
                            onRemoveGroupBy={aggHook.removeGroupBy}
                            onAddAggregation={aggHook.addAggregation}
                            onRemoveAggregation={aggHook.removeAggregation}
                        />
                    )}
                </SidebarSection>

                {/* Reset all */}
                {(!filterHook.isEmpty ||
                    aggHook.hasAggregations ||
                    aggHook.groupBy.length > 0) && (
                    <button
                        type="button"
                        onClick={() => {
                            filterHook.reset()
                            aggHook.reset()
                            vizHook.reset()
                        }}
                        className={clsx(
                            'flex items-center justify-center gap-2 text-xs py-2.5 rounded-xl border transition-colors',
                            isDark
                                ? 'border-red-800/60 text-red-400 hover:bg-red-900/20'
                                : 'border-red-200 text-red-500 hover:bg-red-50'
                        )}
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Reset all
                    </button>
                )}
            </aside>

            {/* ---------------------------------------------------------------- */}
            {/* MAIN AREA — Chart + Viz Controls                                  */}
            {/* ---------------------------------------------------------------- */}
            <div className="flex-1 min-w-0 flex flex-col gap-3">
                {/* Chart type selector row + status bar */}
                <div
                    className={clsx(
                        'flex items-center gap-3 px-4 py-3 rounded-xl border',
                        isDark
                            ? 'bg-[#0D2137] border-[#1E3A5F]'
                            : 'bg-white border-gray-200'
                    )}
                >
                    <span
                        className={clsx(
                            'text-xs font-semibold uppercase tracking-widest shrink-0 mr-1',
                            isDark ? 'text-[#4A6080]' : 'text-gray-400'
                        )}
                    >
                        Chart
                    </span>
                    <div className="flex-1 min-w-0">
                        <VisualizationSelector
                            value={vizHook.config.type}
                            onChange={vizHook.setType}
                        />
                    </div>
                    <div
                        className={clsx(
                            'shrink-0 text-xs border-l pl-4',
                            isDark
                                ? 'border-[#1E3A5F] text-[#4A6080]'
                                : 'border-gray-200 text-gray-400'
                        )}
                    >
                        {queryLoading || isFetching ? (
                            <span className="flex items-center gap-1.5">
                                <span className="animate-pulse text-blue-400">
                                    ●
                                </span>{' '}
                                Running…
                            </span>
                        ) : queryResult ? (
                            `${queryResult.rowCount.toLocaleString()} rows · ${queryResult.executionMs}ms${queryResult.truncated ? ' (capped)' : ''}`
                        ) : (
                            'No query yet'
                        )}
                    </div>
                </div>

                {/* Preview card */}
                <div
                    className={clsx(
                        'rounded-xl border overflow-hidden flex-1',
                        isDark
                            ? 'bg-[#071426] border-[#1E3A5F]'
                            : 'bg-white border-gray-200'
                    )}
                    style={{ minHeight: 360 }}
                >
                    {queryLoading ? (
                        <PreviewSkeleton />
                    ) : isError ? (
                        <div className="p-10 text-center">
                            <p className="text-red-400 text-sm font-medium mb-1">
                                Query error
                            </p>
                            <p
                                className={clsx(
                                    'text-xs',
                                    isDark ? 'text-[#4A6080]' : 'text-gray-400'
                                )}
                            >
                                {error?.message ?? 'Unknown error'}
                            </p>
                        </div>
                    ) : isEmpty || !queryResult ? (
                        <div className="p-16 flex flex-col items-center gap-4">
                            <svg
                                className={clsx(
                                    'w-12 h-12',
                                    isDark ? 'text-[#1E3A5F]' : 'text-gray-200'
                                )}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.25}
                                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5l2 2h5a2 2 0 012 2v9a2 2 0 01-2 2z"
                                />
                            </svg>
                            <div className="text-center">
                                <p
                                    className={clsx(
                                        'text-sm font-medium mb-1',
                                        isDark
                                            ? 'text-[#B0C4DE]'
                                            : 'text-gray-600'
                                    )}
                                >
                                    {filterHook.isEmpty
                                        ? 'Add a filter to run the query'
                                        : 'No data matches your filters'}
                                </p>
                                <p
                                    className={clsx(
                                        'text-xs',
                                        isDark
                                            ? 'text-[#4A6080]'
                                            : 'text-gray-400'
                                    )}
                                >
                                    Use the sidebar on the left to build your
                                    query
                                </p>
                            </div>
                        </div>
                    ) : vizHook.config.type === 'table' ? (
                        <TableRenderer result={queryResult} />
                    ) : (
                        <div className="p-5">
                            <ChartRenderer
                                result={queryResult}
                                config={vizHook.config}
                            />
                        </div>
                    )}
                </div>

                {/* Axis config — only shown when not table mode */}
                {vizHook.config.type !== 'table' && (
                    <div
                        className={clsx(
                            'rounded-xl border p-4',
                            isDark
                                ? 'bg-[#0D2137] border-[#1E3A5F]'
                                : 'bg-white border-gray-200'
                        )}
                    >
                        <p
                            className={clsx(
                                'text-xs font-semibold uppercase tracking-widest mb-3',
                                isDark ? 'text-[#4A6080]' : 'text-gray-400'
                            )}
                        >
                            Axis Configuration
                        </p>
                        <VisualizationConfigPanel
                            config={vizHook.config}
                            columns={colOptions}
                            onSetXField={vizHook.setXField}
                            onSetYFields={vizHook.setYFields}
                            onSetSeriesField={vizHook.setSeriesField}
                            onSetValueFormat={vizHook.setValueFormat}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
