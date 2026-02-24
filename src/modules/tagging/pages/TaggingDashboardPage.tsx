import React, { useMemo, useState } from 'react'
import clsx from 'clsx'
import type { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import ReactECharts from 'echarts-for-react'
import { useThemeStore } from '@/store/themeStore'
import { useTaggingDashboard } from '../hooks/useTaggingStats'
import { useAuth } from '@/contexts/AuthContext'
import { TimeFilter, Table } from '@/components/ui'
import { BarChartSkeleton, PieChartSkeleton } from '@/components/ui/ChartSkeletons'
import type { TagCount } from '../types'

const defaultFrom = dayjs().subtract(30, 'day').startOf('day').toDate()
const defaultTo = dayjs().endOf('day').toDate()

type TierTableRow = TagCount & { groupTier: number }
type PriorityTableRow = TagCount & { groupPriority: string }
// Priority groups in semantic display order
const PRIORITY_ORDER: Record<string, number> = {
    highest: 0,
    high: 1,
    medium: 2,
    low: 3,
}
const priorityRank = (p: string) => PRIORITY_ORDER[p?.toLowerCase()] ?? 99


// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const TaggingDashboardPage: React.FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    // Include auth loading so skeletons appear from the very first render,
    // before the query is enabled (react-query returns isLoading=false for
    // disabled queries, which causes empty ECharts shapes to flash briefly).
    const { loading: authLoading } = useAuth()

    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date } | undefined>({
        from: defaultFrom,
        to: defaultTo,
    })

    const dateFrom = dateRange?.from?.toISOString()
    const dateTo = dateRange?.to?.toISOString()

    // Single unified query — avoids 3 parallel waterfall requests
    const { data, isLoading: queryLoading, isFetching, isError } = useTaggingDashboard(dateFrom, dateTo)
    // Show skeletons while auth OR the query itself is in flight
    const isLoading = authLoading || queryLoading || isFetching

    // -----------------------------------------------------------------------
    // Derived table data
    // -----------------------------------------------------------------------

    const tierTableData = useMemo<TierTableRow[]>(() => {
        if (!data?.tagCountByTier?.length) return []
        // Groups: ascending tier number; within each group: count desc
        return [...data.tagCountByTier]
            .sort((a, b) => a.tierNumber - b.tierNumber)
            .flatMap(({ tierNumber, tagCounts }) =>
                [...tagCounts]
                    .sort((a, b) => b.count - a.count)
                    .map((tc) => ({ ...tc, groupTier: tierNumber }))
            )
    }, [data])

    const priorityTableData = useMemo<PriorityTableRow[]>(() => {
        if (!data?.tagCountByPriority?.length) return []
        // Groups: Highest → High → Medium → Low → unknown; within each group: count desc
        return [...data.tagCountByPriority]
            .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority))
            .flatMap(({ priority, tagCounts }) =>
                [...tagCounts]
                    .sort((a, b) => b.count - a.count)
                    .map((tc) => ({ ...tc, groupPriority: priority }))
            )
    }, [data])

    // Pre-sorted by count desc so tables default to highest-usage tags first
    const allTagsData = useMemo(
        () => [...(data?.tagCounts ?? [])].sort((a, b) => b.count - a.count),
        [data]
    )

    // -----------------------------------------------------------------------
    // Chart data
    // -----------------------------------------------------------------------

    const topTagsForChart = useMemo(() => {
        const list = data?.tagCounts ?? []
        return [...list].sort((a, b) => b.count - a.count).slice(0, 10)
    }, [data])

    const tierChartData = useMemo(() => {
        if (!data?.tagCountByTier?.length) return []
        return data.tagCountByTier
            .map(({ tierNumber, tagCounts }) => ({
                name: `Tier ${tierNumber}`,
                value: tagCounts.reduce((sum, tc) => sum + tc.count, 0),
            }))
            .sort((a, b) => b.value - a.value)
    }, [data])

    const priorityChartData = useMemo(() => {
        if (!data?.tagCountByPriority?.length) return []
        return data.tagCountByPriority.map(({ priority, tagCounts }) => ({
            name: priority,
            value: tagCounts.reduce((sum, tc) => sum + tc.count, 0),
        }))
    }, [data])

    // -----------------------------------------------------------------------
    // ECharts options — design-system colours throughout
    // -----------------------------------------------------------------------

    const primaryText = isDark ? '#F5F8FA' : '#3F4254'
    const secondaryText = isDark ? '#A1A5B7' : '#5E6278'
    const axisLine = isDark ? '#1B456F' : '#ECECEC'
    const splitLine = isDark ? '#1B456F' : '#E2E8F0'

    const chartBaseOptions = useMemo(
        () => ({
            backgroundColor: 'transparent',
            textStyle: { fontFamily: 'Poppins, sans-serif', color: secondaryText },
        }),
        [secondaryText]
    )

    const barChartOption = useMemo(
        () => ({
            ...chartBaseOptions,
            title: {
                text: 'Top 10 Tags by Usage',
                left: 'center',
                textStyle: { color: primaryText, fontSize: 14, fontFamily: 'Poppins, sans-serif' },
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: (params: any[]) => {
                    const p = params[0]
                    const fullName = topTagsForChart[p.dataIndex]?.tagName ?? p.name
                    return `${fullName}<br/><b>${p.value.toLocaleString()}</b>`
                },
            },
            grid: { left: 16, right: 24, top: 44, bottom: 8, containLabel: true },
            // Horizontal bar: xAxis is value, yAxis is category
            xAxis: {
                type: 'value',
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { lineStyle: { color: splitLine } },
                axisLabel: { color: secondaryText, fontFamily: 'Poppins, sans-serif', fontSize: 11 },
            },
            yAxis: {
                type: 'category',
                // Reverse so highest bar is at the top
                data: [...topTagsForChart].reverse().map((t) =>
                    t.tagName.length > 22 ? t.tagName.slice(0, 21) + '…' : t.tagName
                ),
                axisLine: { lineStyle: { color: axisLine } },
                axisTick: { show: false },
                axisLabel: {
                    color: secondaryText,
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 11,
                    width: 150,
                    overflow: 'truncate',
                },
            },
            series: [
                {
                    type: 'bar',
                    data: [...topTagsForChart].reverse().map((t) => t.count),
                    barMaxWidth: 22,
                    itemStyle: {
                        borderRadius: [0, 4, 4, 0],
                        color: {
                            type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
                            colorStops: [
                                { offset: 0, color: '#0254A5' },
                                { offset: 1, color: '#007FFF' },
                            ],
                        },
                    },
                    emphasis: {
                        itemStyle: {
                            color: {
                                type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
                                colorStops: [
                                    { offset: 0, color: '#007FFF' },
                                    { offset: 1, color: '#42A0FF' },
                                ],
                            },
                        },
                    },
                    label: {
                        show: true,
                        position: 'right',
                        color: secondaryText,
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: 11,
                        formatter: (p: any) => p.value.toLocaleString(),
                    },
                },
            ],
        }),
        [chartBaseOptions, topTagsForChart, primaryText, secondaryText, axisLine, splitLine]
    )

    const pieChartOption = useMemo(
        () => ({
            ...chartBaseOptions,
            title: {
                text: 'Tags by Tier',
                left: 'center',
                textStyle: { color: primaryText, fontSize: 14, fontFamily: 'Poppins, sans-serif' },
            },
            tooltip: { trigger: 'item' },
            legend: {
                orient: 'horizontal',
                bottom: 0,
                textStyle: { color: secondaryText, fontFamily: 'Poppins, sans-serif' },
            },
            series: [
                {
                    type: 'pie',
                    radius: ['42%', '68%'],
                    center: ['50%', '48%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderColor: isDark ? '#001E3C' : '#ffffff',
                        borderWidth: 2,
                        borderRadius: 4,
                    },
                    // Labels hidden — tooltip + legend carry the information cleanly
                    label: { show: false },
                    labelLine: { show: false },
                    emphasis: {
                        label: { show: false },
                        scale: true,
                        scaleSize: 6,
                    },
                    data: tierChartData,
                    color: ['#007FFF', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
                        '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'],
                },
            ],
        }),
        [chartBaseOptions, tierChartData, isDark, primaryText, secondaryText]
    )

    const priorityBarOption = useMemo(
        () => ({
            ...chartBaseOptions,
            title: {
                text: 'Tags by Priority',
                left: 'center',
                textStyle: { color: primaryText, fontSize: 14, fontFamily: 'Poppins, sans-serif' },
            },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: { left: '3%', right: '4%', bottom: '3%', top: 44, containLabel: true },
            xAxis: {
                type: 'category',
                data: priorityChartData.map((p) => p.name),
                axisLine: { lineStyle: { color: axisLine } },
                axisLabel: { color: secondaryText, fontFamily: 'Poppins, sans-serif' },
            },
            yAxis: {
                type: 'value',
                axisLine: { show: false },
                splitLine: { lineStyle: { color: splitLine } },
                axisLabel: { color: secondaryText, fontFamily: 'Poppins, sans-serif' },
            },
            series: [
                {
                    type: 'bar',
                    data: priorityChartData.map((p) => p.value),
                    barMaxWidth: 48,
                    itemStyle: {
                        borderRadius: [4, 4, 0, 0],
                        color: {
                            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: '#10b981' },
                                { offset: 1, color: '#059669' },
                            ],
                        },
                    },
                },
            ],
        }),
        [chartBaseOptions, priorityChartData, primaryText, secondaryText, axisLine, splitLine]
    )

    // -----------------------------------------------------------------------
    // Column definitions — design-system colours, no slate-*
    // -----------------------------------------------------------------------

    const tierColumns = useMemo<Array<ColumnDef<TierTableRow>>>(
        () => [
            {
                accessorKey: 'groupTier',
                header: 'TIER',
                cell: ({ getValue }) => (
                    <span className={clsx('font-medium', isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]')}>
                        {getValue() as number}
                    </span>
                ),
            },
            {
                accessorKey: 'tagName',
                header: 'TAG',
                cell: ({ getValue }) => (
                    <span className={clsx('font-medium', isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]')}>
                        {(getValue() as string) || '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'priority',
                header: 'PRIORITY',
                cell: ({ getValue }) => (
                    <span className={clsx('text-sm', isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]')}>
                        {(getValue() as string) || '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'count',
                header: 'COUNT',
                cell: ({ getValue }) => (
                    <span className={clsx('font-medium', isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]')}>
                        {(getValue() as number).toLocaleString()}
                    </span>
                ),
            },
            {
                accessorKey: 'percentOfTotal',
                header: '%',
                cell: ({ getValue }) => (
                    <span className={clsx('text-sm', isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]')}>
                        {((getValue() as number) ?? 0).toFixed(1)}%
                    </span>
                ),
            },
        ],
        [isDark]
    )

    const priorityColumns = useMemo<Array<ColumnDef<PriorityTableRow>>>(
        () => [
            {
                accessorKey: 'groupPriority',
                header: 'PRIORITY',
                cell: ({ getValue }) => (
                    <span className={clsx('font-medium', isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]')}>
                        {(getValue() as string) || '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'tagName',
                header: 'TAG',
                cell: ({ getValue }) => (
                    <span className={clsx('font-medium', isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]')}>
                        {(getValue() as string) || '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'tierNumber',
                header: 'TIER',
                cell: ({ getValue }) => (
                    <span className={clsx('text-sm', isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]')}>
                        {(getValue() as number | null) ?? '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'count',
                header: 'COUNT',
                cell: ({ getValue }) => (
                    <span className={clsx('font-medium', isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]')}>
                        {(getValue() as number).toLocaleString()}
                    </span>
                ),
            },
            {
                accessorKey: 'percentOfTotal',
                header: '%',
                cell: ({ getValue }) => (
                    <span className={clsx('text-sm', isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]')}>
                        {((getValue() as number) ?? 0).toFixed(1)}%
                    </span>
                ),
            },
        ],
        [isDark]
    )

    const allTagsColumns = useMemo<Array<ColumnDef<TagCount>>>(
        () => [
            {
                accessorKey: 'tagName',
                header: 'TAG',
                cell: ({ getValue }) => (
                    <span className={clsx('font-medium', isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]')}>
                        {(getValue() as string) || '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'tierNumber',
                header: 'TIER',
                cell: ({ getValue }) => (
                    <span className={clsx('text-sm', isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]')}>
                        {(getValue() as number | null) ?? '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'priority',
                header: 'PRIORITY',
                cell: ({ getValue }) => (
                    <span className={clsx('text-sm', isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]')}>
                        {(getValue() as string) || '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'count',
                header: 'COUNT',
                cell: ({ getValue }) => (
                    <span className={clsx('font-medium', isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]')}>
                        {(getValue() as number).toLocaleString()}
                    </span>
                ),
            },
            {
                accessorKey: 'percentOfTotal',
                header: '%',
                cell: ({ getValue }) => (
                    <span className={clsx('text-sm', isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]')}>
                        {((getValue() as number) ?? 0).toFixed(1)}%
                    </span>
                ),
            },
        ],
        [isDark]
    )

    // -----------------------------------------------------------------------
    // Derived empty + error flags
    // -----------------------------------------------------------------------

    const isEmpty =
        !isLoading &&
        !isError &&
        (data?.tagCounts?.length ?? 0) === 0 &&
        !data?.tagCountByTier?.length &&
        !data?.tagCountByPriority?.length

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------

    return (
        <div className="min-h-screen content relative">
            <div className="p-3 sm:p-4 lg:p-8">
                {/* ── Page Header ──────────────────────────────────────── */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        {/* Left: title */}
                        <div>
                            <h1
                                className={clsx(
                                    'text-xl sm:text-2xl font-bold mb-0.5',
                                    isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                                )}
                            >
                                Tagging Dashboard
                            </h1>
                            <p
                                className={clsx(
                                    'text-xs sm:text-sm',
                                    isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                                )}
                            >
                                Tag usage statistics
                            </p>
                        </div>

                        {/* Right: compact date-picker input */}
                        <div className="shrink-0">
                            <TimeFilter value={dateRange} onChange={setDateRange} />
                        </div>
                    </div>
                </div>

                {/* ── Error Banner ──────────────────────────────────────── */}
                {isError && (
                    <div
                        className={clsx(
                            'proposals-card rounded-[10px] border p-6 mb-6 text-center',
                            isDark
                                ? 'border-[#f64e60]/40 bg-[#f64e60]/10'
                                : 'border-[#ffe2e5] bg-[#ffe2e5]'
                        )}
                    >
                        <p
                            className={clsx(
                                'text-sm font-medium',
                                isDark ? 'text-[#f64e60]' : 'text-[#f64e60]'
                            )}
                        >
                            Failed to load tag statistics. Please try again.
                        </p>
                    </div>
                )}



                {/* ── Charts (or skeletons) ─────────────────────────────── */}
                {!isError && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Bar chart — Top 10 Tags */}
                        <div className="proposals-card rounded-[10px] border p-4">
                            {isLoading ? (
                                <BarChartSkeleton />
                            ) : (
                                <ReactECharts
                                    option={barChartOption}
                                    style={{ height: 320 }}
                                    opts={{ renderer: 'canvas' }}
                                    notMerge
                                />
                            )}
                        </div>

                        {/* Pie chart — Tags by Tier */}
                        <div className="proposals-card rounded-[10px] border p-4">
                            {isLoading ? (
                                <PieChartSkeleton />
                            ) : (
                                <ReactECharts
                                    option={pieChartOption}
                                    style={{ height: 320 }}
                                    opts={{ renderer: 'canvas' }}
                                    notMerge
                                />
                            )}
                        </div>

                        {/* Bar chart — Tags by Priority (full width) */}
                        <div className="proposals-card rounded-[10px] border p-4 lg:col-span-2">
                            {isLoading ? (
                                <BarChartSkeleton />
                            ) : (
                                <ReactECharts
                                    option={priorityBarOption}
                                    style={{ height: 280 }}
                                    opts={{ renderer: 'canvas' }}
                                    notMerge
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* ── Empty State ───────────────────────────────────────── */}
                {isEmpty && (
                    <div className="proposals-card rounded-[10px] border p-10 text-center mb-8">
                        <p
                            className={clsx(
                                'text-base font-medium mb-1',
                                isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                            )}
                        >
                            No tag data available
                        </p>
                        <p className={clsx('text-sm', isDark ? 'text-[#7E8299]' : 'text-[#A1A5B7]')}>
                            Try selecting a different date range.
                        </p>
                    </div>
                )}

                {/* ── Tables ───────────────────────────────────────────── */}
                {!isError && (
                    <div className="space-y-8">
                        {/* Tag Usage by Tier */}
                        <section>
                            <h2
                                className={clsx(
                                    'text-base font-semibold mb-3',
                                    isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                                )}
                            >
                                Tag Usage by Tier
                            </h2>
                            <Table<TierTableRow>
                                data={tierTableData}
                                columns={tierColumns}
                                showHeader={true}
                                loading={isLoading}
                                pagination={tierTableData.length > 20}
                                pageSize={20}
                                size="small"
                                enableStickyColumns={false}
                                emptyMessage="No tier data available"
                                getRowId={(row) => `tier-${row.groupTier}-${row.tagId}`}
                            />
                        </section>

                        {/* Tag Usage by Priority */}
                        <section>
                            <h2
                                className={clsx(
                                    'text-base font-semibold mb-3',
                                    isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                                )}
                            >
                                Tag Usage by Priority
                            </h2>
                            <Table<PriorityTableRow>
                                data={priorityTableData}
                                columns={priorityColumns}
                                showHeader={true}
                                loading={isLoading}
                                pagination={priorityTableData.length > 20}
                                pageSize={20}
                                size="small"
                                enableStickyColumns={false}
                                emptyMessage="No priority data available"
                                getRowId={(row) => `priority-${row.groupPriority}-${row.tagId}`}
                            />
                        </section>

                        {/* All Tags Summary */}
                        <section>
                            <h2
                                className={clsx(
                                    'text-base font-semibold mb-3',
                                    isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
                                )}
                            >
                                All Tags Summary
                            </h2>
                            <Table<TagCount>
                                data={allTagsData}
                                columns={allTagsColumns}
                                showHeader={true}
                                loading={isLoading}
                                pagination={allTagsData.length > 20}
                                pageSize={20}
                                size="small"
                                enableStickyColumns={false}
                                emptyMessage="No tags found"
                                getRowId={(row) => `tag-${row.tagId}`}
                            />
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TaggingDashboardPage
