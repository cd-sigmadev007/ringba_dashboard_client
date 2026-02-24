/**
 * ChartSkeletons
 *
 * Reusable SVG-based skeleton loaders for charts and stat cards.
 * All colours use exact design-system tokens to match TableLoader.tsx:
 *   dark  → #132F4C
 *   light → #ECECEC
 * All skeletons are animated with `animate-pulse` and occupy the same
 * container dimensions as the real component they replace.
 */

import React from 'react'
import clsx from 'clsx'
import { useThemeStore } from '@/store/themeStore'

// ---------------------------------------------------------------------------
// Internal primitive
// ---------------------------------------------------------------------------

interface SkeletonRectProps {
    width?: number | string
    height?: number | string
    className?: string
    style?: React.CSSProperties
}

const SkeletonRect: React.FC<SkeletonRectProps & { fill: string }> = ({
    width,
    height,
    className,
    style,
    fill,
}) => (
    <div
        className={clsx('animate-pulse rounded-lg', className)}
        style={{ width, height, background: fill, ...style }}
    />
)

// ---------------------------------------------------------------------------
// Bar-chart skeleton
// 10 bars at varying heights, x-axis, y-axis ticks.
// Default height: 320px (matches standard chart height).
// ---------------------------------------------------------------------------

export interface BarChartSkeletonProps {
    /** SVG viewBox height. Matches the height of the real chart. Default 320. */
    height?: number
}

export const BarChartSkeleton: React.FC<BarChartSkeletonProps> = ({ height = 320 }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const fill = isDark ? '#132F4C' : '#ECECEC'
    const axisColor = isDark ? '#1B456F' : '#E2E8F0'

    const barHeights = [60, 100, 140, 90, 180, 120, 75, 200, 110, 55]
    // Scale bar heights proportionally if a different container height is used
    const scale = height / 320

    return (
        <svg
            width="100%"
            height={height}
            viewBox={`0 0 500 ${height}`}
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-pulse"
        >
            {/* Y-axis line */}
            <line
                x1="48" y1={Math.round(16 * scale)}
                x2="48" y2={Math.round(258 * scale)}
                stroke={axisColor} strokeWidth="1"
            />
            {/* X-axis line */}
            <line
                x1="48" y1={Math.round(258 * scale)}
                x2="492" y2={Math.round(258 * scale)}
                stroke={axisColor} strokeWidth="1"
            />

            {/* Y-axis tick placeholders */}
            {[0, 60, 120, 180, 240].map((offset, i) => (
                <rect
                    key={i}
                    x={8}
                    y={Math.round((16 + offset) * scale - 5)}
                    width={32} height={8} rx={3}
                    fill={fill}
                />
            ))}

            {/* Bars */}
            {barHeights.map((h, i) => {
                const bh = Math.round(h * scale)
                const x = 60 + i * 44
                const y = Math.round(258 * scale) - bh
                return (
                    <g key={i}>
                        <rect x={x} y={y} width={28} height={bh} rx={4} fill={fill} />
                        {/* X-axis label */}
                        <rect
                            x={x - 2} y={Math.round(258 * scale) + 8}
                            width={32} height={7} rx={3} fill={fill}
                        />
                    </g>
                )
            })}

            {/* Title placeholder */}
            <rect x={180} y={6} width={140} height={10} rx={4} fill={fill} />
        </svg>
    )
}

// ---------------------------------------------------------------------------
// Pie / donut-chart skeleton
// Donut ring + legend chips.
// Default height: 320px.
// ---------------------------------------------------------------------------

export interface PieChartSkeletonProps {
    height?: number
}

export const PieChartSkeleton: React.FC<PieChartSkeletonProps> = ({ height = 320 }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const fill = isDark ? '#132F4C' : '#ECECEC'
    const ringFill = isDark ? '#1B456F' : '#D1D5DB'

    return (
        <svg
            width="100%"
            height={height}
            viewBox="0 0 400 320"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-pulse"
        >
            {/* Title */}
            <rect x={130} y={10} width={140} height={10} rx={4} fill={fill} />

            {/* Donut ring */}
            <circle cx={200} cy={155} r={90} fill="none" stroke={ringFill} strokeWidth={38} />
            <circle
                cx={200} cy={155} r={90} fill="none"
                stroke={fill} strokeWidth={38}
                strokeDasharray="120 450" strokeDashoffset={0}
            />
            <circle
                cx={200} cy={155} r={90} fill="none"
                stroke={ringFill} strokeWidth={36}
                strokeDasharray="80 450" strokeDashoffset={-130}
            />

            {/* Legend chips */}
            {[0, 1, 2, 3].map((i) => (
                <g key={i} transform={`translate(${50 + i * 80}, 295)`}>
                    <rect x={0} y={0} width={12} height={12} rx={3} fill={fill} />
                    <rect x={16} y={2} width={48} height={8} rx={3} fill={fill} />
                </g>
            ))}
        </svg>
    )
}

// ---------------------------------------------------------------------------
// Stat card skeleton — label line + value line
// ---------------------------------------------------------------------------

export const StatCardSkeleton: React.FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const fill = isDark ? '#132F4C' : '#ECECEC'

    return (
        <div className="proposals-card rounded-[10px] border p-5 flex flex-col gap-2 inline-flex">
            <SkeletonRect fill={fill} width={120} height={12} />
            <SkeletonRect fill={fill} width={80} height={24} />
        </div>
    )
}
