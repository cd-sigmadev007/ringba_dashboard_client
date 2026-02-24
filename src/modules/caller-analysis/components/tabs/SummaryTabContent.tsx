import React, { useMemo } from 'react'
import clsx from 'clsx'
import type { ColumnDef } from '@tanstack/react-table'
import type { CallData } from '../../types'
import { useThemeStore } from '@/store/themeStore'
import { useCallAnalysisV2, useCallTagsForCall } from '../../graphql/hooks'
import { Table } from '@/components/ui'

export interface SummaryTabContentProps {
    callerData: CallData
    ringbaRowId: string | undefined
    className?: string
}

interface CallTagRow {
    tagId: number
    tagName: string
    tagValue: string
    priority: string | null
    tierNumber: number | null
    colorCode: string | null
    confidence: number | null
}

const PRIORITY_ORDER = ['Highest', 'High', 'Medium', 'Lower', 'Low']

export const SummaryTabContent: React.FC<SummaryTabContentProps> = ({
    callerData,
    ringbaRowId,
    className,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const { data: analysis, isLoading: analysisLoading } = useCallAnalysisV2(
        ringbaRowId,
        true
    )
    const { data: tags, isLoading: tagsLoading } = useCallTagsForCall(
        ringbaRowId,
        true
    )

    const tableData = useMemo(() => {
        if (!tags || tags.length === 0) return []
        const sorted = [...tags].sort((a, b) => {
            const tierA = a.tierNumber ?? 0
            const tierB = b.tierNumber ?? 0
            if (tierA !== tierB) return tierA - tierB
            const aIdx = PRIORITY_ORDER.indexOf(a.priority ?? '')
            const bIdx = PRIORITY_ORDER.indexOf(b.priority ?? '')
            if (aIdx >= 0 && bIdx >= 0) return aIdx - bIdx
            if (aIdx >= 0) return -1
            if (bIdx >= 0) return 1
            return (a.priority ?? '').localeCompare(b.priority ?? '')
        })
        return sorted as CallTagRow[]
    }, [tags])

    const columns = useMemo<Array<ColumnDef<CallTagRow>>>(
        () => [
            {
                accessorKey: 'tierNumber',
                header: 'TIER',
                cell: ({ getValue }) => {
                    const v = getValue() as number | null
                    return (
                        <span className={clsx('font-medium', isDark ? 'text-[#94A3B8]' : 'text-slate-600')}>
                            {v ?? '-'}
                        </span>
                    )
                },
            },
            {
                accessorKey: 'tagName',
                header: 'TAG',
                cell: ({ row }) => {
                    const tag = row.original
                    const color = tag.colorCode
                    return (
                        <span
                            className={clsx(
                                'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                                !color && (isDark ? 'bg-slate-700' : 'bg-slate-200')
                            )}
                            style={
                                color
                                    ? {
                                        backgroundColor: `${color}20`,
                                        color: color,
                                        border: `1px solid ${color}`,
                                    }
                                    : undefined
                            }
                        >
                            {tag.tagName}
                        </span>
                    )
                },
            },
            {
                accessorKey: 'tagValue',
                header: 'VALUE',
                cell: ({ getValue }) => (
                    <span className={clsx('text-sm', isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]')}>
                        {(getValue() as string) || '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'priority',
                header: 'PRIORITY',
                cell: ({ getValue }) => (
                    <span className={clsx('text-sm', isDark ? 'text-[#94A3B8]' : 'text-slate-600')}>
                        {(getValue() as string) || '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'confidence',
                header: 'CONFIDENCE',
                cell: ({ getValue }) => {
                    const c = getValue() as number | null
                    if (c == null) return <span>-</span>
                    const pct = Math.round(c * 100)
                    const color =
                        pct >= 80
                            ? 'text-green-600 dark:text-green-400'
                            : pct >= 50
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-red-600 dark:text-red-400'
                    return <span className={clsx('text-sm font-medium', color)}>{pct}%</span>
                },
            },
        ],
        [isDark]
    )

    const valueClass = clsx('text-sm', isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]')
    const labelClass = clsx(
        'text-xs font-semibold uppercase tracking-wide',
        isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'
    )
    const cardBg = clsx(
        'rounded-md border p-3',
        isDark ? 'border-[#1B456F]' : 'border-slate-200'
    )

    const summaryText = callerData.summary || 'No summary available'
    const confidenceColor =
        analysis?.confidenceScore != null
            ? analysis.confidenceScore < 0.5
                ? 'bg-red-500'
                : analysis.confidenceScore < 0.8
                    ? 'bg-amber-500'
                    : 'bg-green-500'
            : 'bg-slate-300 dark:bg-slate-600'

    return (
        <div className={clsx(className, 'py-4 space-y-8 overflow-y-auto')}>
            {/* Primary Summary */}
            <section>
                <h3 className={clsx(labelClass, 'mb-2')}>Call Summary</h3>
                <p className={clsx(valueClass, 'whitespace-pre-wrap break-words leading-relaxed')}>
                    {summaryText}
                </p>
            </section>

            {/* Analysis Loading State */}
            {(analysisLoading || tagsLoading) && (
                <div className="animate-pulse space-y-4 pt-4 border-t border-slate-200 dark:border-[#1B456F]">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                    <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                </div>
            )}

            {/* Merged Analysis Content */}
            {!analysisLoading && (analysis || (tags && tags.length > 0)) && (
                <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-[#1B456F]">
                    {analysis && (
                        <section className="space-y-4">
                            <h3 className={clsx(labelClass)}>Extended Analysis</h3>

                            {analysis.disputeRecommendation && analysis.disputeRecommendation !== 'NONE' && (
                                <div className={clsx(
                                    'p-4 rounded-lg border',
                                    isDark ? 'bg-red-950/20 border-red-800/40 text-red-200' : 'bg-red-50 border-red-200 text-red-800'
                                )}>
                                    <p className="text-xs font-bold uppercase mb-1">Dispute Recommendation</p>
                                    <p className="font-semibold">{analysis.disputeRecommendation}</p>
                                    {analysis.disputeRecommendationReason && (
                                        <p className="mt-2 text-sm opacity-90">{analysis.disputeRecommendationReason}</p>
                                    )}
                                </div>
                            )}

                            {analysis.confidenceScore != null && (
                                <div className={cardBg}>
                                    <p className={clsx(labelClass, 'mb-2')}>
                                        AI Confidence: {Math.round(analysis.confidenceScore * 100)}%
                                    </p>
                                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={clsx('h-full rounded-full transition-all', confidenceColor)}
                                            style={{ width: `${Math.min(100, analysis.confidenceScore * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-3">
                                {analysis.currentRevenue != null && (
                                    <div className={clsx('px-3 py-1.5 rounded-md text-sm font-medium border', isDark ? 'bg-[#1e3a5f]/30 border-[#1B456F]' : 'bg-slate-100 border-slate-200')}>
                                        Revenue: <span className="text-blue-500 font-bold">${Number(analysis.currentRevenue).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className={clsx(
                                    'px-3 py-1.5 rounded-md text-sm font-medium border',
                                    analysis.currentBilledStatus
                                        ? isDark ? 'bg-green-900/20 border-green-800/40 text-green-300' : 'bg-green-50 border-green-200 text-green-800'
                                        : isDark ? 'bg-[#1e3a5f]/30 border-[#1B456F]' : 'bg-slate-100 border-slate-200'
                                )}>
                                    {analysis.currentBilledStatus ? 'Billed' : 'Not Billed'}
                                </div>
                            </div>
                        </section>
                    )}

                    {tags && tags.length > 0 && (
                        <section className="space-y-4">
                            <h3 className={clsx(labelClass)}>Tags</h3>
                            <div className="rounded-lg border border-slate-200 dark:border-[#1B456F] overflow-hidden">
                                <Table<CallTagRow>
                                    data={tableData}
                                    columns={columns}
                                    showHeader={true}
                                    pagination={false}
                                    size="small"
                                    className="border-0 shadow-none"
                                />
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    )
}

export default SummaryTabContent
