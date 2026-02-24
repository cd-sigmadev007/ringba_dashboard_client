/**
 * TableRenderer.tsx
 * Renders query results as a sortable table using native HTML
 * (kept simple — the main Table component expects ColumnDef[] which
 * we can't pre-declare for dynamic columns).
 */
import React, { useMemo, useState } from 'react'
import clsx from 'clsx'
import type { VisualizerQueryResult } from '../types'
import { useThemeStore } from '@/store/themeStore'

interface Props {
    result: VisualizerQueryResult
}

export const TableRenderer: React.FC<Props> = ({ result }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const [sortKey, setSortKey] = useState<string | null>(null)
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

    const handleSort = (col: string) => {
        if (sortKey === col) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortKey(col)
            setSortDir('asc')
        }
    }

    const sorted = useMemo(() => {
        if (!sortKey) return result.rows
        return [...result.rows].sort((a, b) => {
            const av = a[sortKey]
            const bv = b[sortKey]
            if (av === null || av === undefined) return 1
            if (bv === null || bv === undefined) return -1
            if (typeof av === 'number' && typeof bv === 'number') {
                return sortDir === 'asc' ? av - bv : bv - av
            }
            const as = String(av)
            const bs = String(bv)
            return sortDir === 'asc'
                ? as.localeCompare(bs)
                : bs.localeCompare(as)
        })
    }, [result.rows, sortKey, sortDir])

    if (!result.columns.length) return null

    const thCls = clsx(
        'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none whitespace-nowrap',
        isDark
            ? 'text-[#4A6080] hover:text-[#B0C4DE]'
            : 'text-gray-500 hover:text-gray-700'
    )
    const tdCls = clsx(
        'px-4 py-2.5 text-sm font-mono whitespace-nowrap border-b',
        isDark
            ? 'border-[#1E3A5F] text-[#B0C4DE]'
            : 'border-gray-100 text-gray-700'
    )

    return (
        <div
            className="overflow-auto rounded-xl border"
            style={{ maxHeight: 460 }}
        >
            <table
                className={clsx(
                    'w-full text-sm border-collapse',
                    isDark ? 'bg-[#0A1929]' : 'bg-white'
                )}
            >
                <thead
                    className={clsx(
                        'sticky top-0 z-10',
                        isDark ? 'bg-[#0D2137]' : 'bg-gray-50'
                    )}
                >
                    <tr>
                        {result.columns.map((col) => (
                            <th
                                key={col}
                                className={thCls}
                                onClick={() => handleSort(col)}
                            >
                                <span className="flex items-center gap-1">
                                    {col}
                                    {sortKey === col && (
                                        <svg
                                            className="w-3 h-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d={
                                                    sortDir === 'asc'
                                                        ? 'M5 15l7-7 7 7'
                                                        : 'M19 9l-7 7-7-7'
                                                }
                                            />
                                        </svg>
                                    )}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sorted.map((row, ri) => (
                        <tr
                            key={ri}
                            className={clsx(
                                'transition-colors',
                                isDark
                                    ? 'hover:bg-[#1E3A5F]/40'
                                    : 'hover:bg-gray-50'
                            )}
                        >
                            {result.columns.map((col) => {
                                const v = row[col]
                                const display =
                                    v === null || v === undefined
                                        ? '—'
                                        : typeof v === 'object'
                                          ? JSON.stringify(v)
                                          : String(v)
                                return (
                                    <td
                                        key={col}
                                        className={tdCls}
                                        title={display}
                                    >
                                        <span className="block max-w-xs truncate">
                                            {display}
                                        </span>
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
