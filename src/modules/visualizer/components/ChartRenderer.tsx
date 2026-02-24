/**
 * ChartRenderer.tsx
 * Routes to the correct ECharts configuration based on VizConfig.type.
 */
import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import clsx from 'clsx'
import type { VisualizerQueryResult, VizConfig } from '../types'
import { useThemeStore } from '@/store/themeStore'

interface Props {
    result: VisualizerQueryResult
    config: VizConfig
}

function formatValue(val: any, fmt: VizConfig['valueFormat']): string {
    const n = Number(val)
    if (isNaN(n)) return String(val ?? '')
    if (fmt === 'percent') return `${n.toFixed(1)}%`
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(
        n
    )
}

const PALETTE = [
    '#007FFF',
    '#6C63FF',
    '#00D4AA',
    '#FFB347',
    '#FF6B6B',
    '#4ECDC4',
    '#A8E063',
    '#F7B731',
]

export const ChartRenderer: React.FC<Props> = ({ result, config }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const axisLine = isDark ? '#1E3A5F' : '#E5E7EB'
    const labelColor = isDark ? '#94A3B8' : '#6B7280'

    const xData = useMemo(
        () =>
            config.xField
                ? result.rows.map((r) => String(r[config.xField!] ?? ''))
                : [],
        [result.rows, config.xField]
    )

    const ySeries = useMemo(
        () =>
            (config.yFields ?? []).map((yKey, i) => ({
                name: yKey,
                data: result.rows.map((r) => Number(r[yKey] ?? 0)),
                color: PALETTE[i % PALETTE.length],
            })),
        [result.rows, config.yFields]
    )

    const { type, valueFormat } = config

    // -------------------------------------------------------------------------
    // Donut / Pie
    // -------------------------------------------------------------------------
    if (type === 'donut') {
        const labelKey = config.xField ?? result.columns[0]
        const valueKey = (config.yFields ?? [])[0] ?? result.columns[1]
        const pieData = result.rows.map((r, i) => ({
            name: String(r[labelKey] ?? ''),
            value: Number(r[valueKey] ?? 0),
            itemStyle: { color: PALETTE[i % PALETTE.length] },
        }))
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: (p: any) =>
                    `${p.name}: ${formatValue(p.value, valueFormat)} (${p.percent}%)`,
            },
            legend: {
                bottom: 0,
                textStyle: {
                    color: labelColor,
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 11,
                },
            },
            series: [
                {
                    type: 'pie',
                    radius: ['42%', '68%'],
                    center: ['50%', '46%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderColor: isDark ? '#001E3C' : '#ffffff',
                        borderWidth: 2,
                        borderRadius: 4,
                    },
                    label: { show: false },
                    labelLine: { show: false },
                    emphasis: {
                        scale: true,
                        scaleSize: 5,
                        label: { show: false },
                    },
                    data: pieData,
                },
            ],
        }
        return (
            <ReactECharts
                option={option}
                style={{ height: 340 }}
                opts={{ renderer: 'canvas' }}
                notMerge
            />
        )
    }

    // -------------------------------------------------------------------------
    // Bar / Stacked Bar
    // -------------------------------------------------------------------------
    if (type === 'bar' || type === 'stacked_bar') {
        const isHorizontal = xData.some((d) => d.length > 12)
        const stack = type === 'stacked_bar' ? 'total' : undefined
        const option = {
            backgroundColor: 'transparent',
            grid: {
                left: isHorizontal ? 140 : 48,
                right: 24,
                top: 24,
                bottom: 40,
                containLabel: !isHorizontal,
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: Array<any>) =>
                    params
                        .map(
                            (p: any) =>
                                `${p.seriesName}: ${formatValue(p.value, valueFormat)}`
                        )
                        .join('<br/>'),
            },
            legend:
                ySeries.length > 1
                    ? { top: 0, textStyle: { color: labelColor } }
                    : undefined,
            ...(isHorizontal
                ? {
                      yAxis: {
                          type: 'category',
                          data: xData,
                          axisLine: { lineStyle: { color: axisLine } },
                          axisLabel: {
                              color: labelColor,
                              width: 130,
                              overflow: 'truncate',
                              fontSize: 11,
                          },
                      },
                      xAxis: {
                          type: 'value',
                          axisLine: { lineStyle: { color: axisLine } },
                          splitLine: { lineStyle: { color: axisLine } },
                          axisLabel: { color: labelColor },
                      },
                  }
                : {
                      xAxis: {
                          type: 'category',
                          data: xData,
                          axisLine: { lineStyle: { color: axisLine } },
                          axisLabel: {
                              color: labelColor,
                              rotate: xData.some((d) => d.length > 8) ? 30 : 0,
                          },
                      },
                      yAxis: {
                          type: 'value',
                          axisLine: { lineStyle: { color: axisLine } },
                          splitLine: { lineStyle: { color: axisLine } },
                          axisLabel: { color: labelColor },
                      },
                  }),
            series: ySeries.map((s) => ({
                name: s.name,
                type: 'bar',
                stack,
                data: s.data,
                itemStyle: {
                    color: s.color,
                    borderRadius: isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
                },
                barMaxWidth: isHorizontal ? 20 : 48,
                emphasis: { itemStyle: { opacity: 0.85 } },
            })),
        }
        return (
            <ReactECharts
                option={option}
                style={{ height: 360 }}
                opts={{ renderer: 'canvas' }}
                notMerge
            />
        )
    }

    // -------------------------------------------------------------------------
    // Line / Area
    // -------------------------------------------------------------------------
    if (type === 'line' || type === 'area') {
        const option = {
            backgroundColor: 'transparent',
            grid: { left: 48, right: 24, top: 24, bottom: 40 },
            tooltip: { trigger: 'axis' },
            legend:
                ySeries.length > 1
                    ? { top: 0, textStyle: { color: labelColor } }
                    : undefined,
            xAxis: {
                type: 'category',
                data: xData,
                axisLine: { lineStyle: { color: axisLine } },
                axisLabel: { color: labelColor },
            },
            yAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: axisLine } },
                splitLine: { lineStyle: { color: axisLine } },
                axisLabel: { color: labelColor },
            },
            series: ySeries.map((s) => ({
                name: s.name,
                type: 'line',
                data: s.data,
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                lineStyle: { color: s.color, width: 2 },
                itemStyle: { color: s.color },
                areaStyle:
                    type === 'area'
                        ? { color: s.color, opacity: 0.15 }
                        : undefined,
            })),
        }
        return (
            <ReactECharts
                option={option}
                style={{ height: 360 }}
                opts={{ renderer: 'canvas' }}
                notMerge
            />
        )
    }

    return (
        <p
            className={clsx(
                'p-8 text-center text-sm',
                isDark ? 'text-[#4A6080]' : 'text-gray-400'
            )}
        >
            Unsupported chart type
        </p>
    )
}
