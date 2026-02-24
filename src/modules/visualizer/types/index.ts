/**
 * ============================================================
 * READ-ONLY MODULE
 * This module is a read-only analytics visual layer.
 * It must never modify, migrate, enrich, cache, or persist
 * database structures or records.
 * ============================================================
 */

export type FieldSource = 'call_analysis_v2' | 'tag_definitions' | 'call_tags'
export type FieldType =
    | 'text'
    | 'numeric'
    | 'boolean'
    | 'timestamp'
    | 'enum'
    | 'jsonb'

export interface FieldDef {
    key: string
    label: string
    source: FieldSource
    type: FieldType
    groupable: boolean
    aggregatable: boolean
    filterable: boolean
    enumValues?: Array<string>
}

export type Operator =
    | 'eq'
    | 'ne'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'contains'
    | 'not_contains'
    | 'starts_with'
    | 'ends_with'
    | 'in'
    | 'not_in'
    | 'is_null'
    | 'is_not_null'
    | 'between'
    | 'date_preset'
    | 'contains_key'

export interface FilterRule {
    id: string
    type: 'rule'
    field: string
    operator: Operator
    value: any
}

export interface FilterGroup {
    id: string
    type: 'group'
    logic: 'AND' | 'OR'
    rules: Array<FilterNode>
}

export type FilterNode = FilterRule | FilterGroup

export type AggFn = 'count' | 'count_distinct' | 'sum' | 'avg' | 'min' | 'max'

export interface AggDef {
    id: string
    fn: AggFn
    field: string
    alias: string
}

export interface SortDef {
    field: string
    direction: 'asc' | 'desc'
}

export interface VisualizerQueryRequest {
    includeTagJoin?: boolean
    filters: FilterGroup
    groupBy: Array<string>
    aggregations: Array<AggDef>
    sort: Array<SortDef>
    limit: number
}

export interface VisualizerQueryResult {
    columns: Array<string>
    rows: Array<Record<string, any>>
    rowCount: number
    truncated: boolean
    executionMs: number
}

export type VizType =
    | 'table'
    | 'bar'
    | 'stacked_bar'
    | 'line'
    | 'area'
    | 'donut'

export interface ColorRule {
    field: string
    value: any
    color: string
}

export interface VizConfig {
    type: VizType
    xField?: string
    yFields?: Array<string>
    seriesField?: string
    labelField?: string
    tooltipFields?: Array<string>
    colorRules?: Array<ColorRule>
    valueFormat?: 'number' | 'percent'
}

export interface VisualizerSchema {
    fields: Array<FieldDef>
    datePresets: Array<string>
    allowedOperators: Record<FieldType, Array<Operator>>
    aggregationFns: Array<AggFn>
}

// ---------------------------------------------------------------------------
// Source display helpers
// ---------------------------------------------------------------------------

export const SOURCE_LABELS: Record<FieldSource, string> = {
    call_analysis_v2: 'Call Analysis',
    tag_definitions: 'Tag Definitions',
    call_tags: 'Call Tags',
}

export const SOURCE_COLORS: Record<FieldSource, string> = {
    call_analysis_v2: 'blue',
    tag_definitions: 'purple',
    call_tags: 'teal',
}

export const VIZ_LABELS: Record<VizType, string> = {
    table: 'Table',
    bar: 'Bar Chart',
    stacked_bar: 'Stacked Bar',
    line: 'Line Chart',
    area: 'Area Chart',
    donut: 'Donut / Pie',
}

export const AGG_LABELS: Record<AggFn, string> = {
    count: 'Count',
    count_distinct: 'Count Distinct',
    sum: 'Sum',
    avg: 'Average',
    min: 'Min',
    max: 'Max',
}

export const OPERATOR_LABELS: Record<Operator, string> = {
    eq: '= equals',
    ne: '≠ not equals',
    gt: '> greater than',
    gte: '≥ greater or equal',
    lt: '< less than',
    lte: '≤ less or equal',
    contains: 'contains',
    not_contains: 'does not contain',
    starts_with: 'starts with',
    ends_with: 'ends with',
    in: 'is one of',
    not_in: 'is not one of',
    is_null: 'is empty',
    is_not_null: 'is not empty',
    between: 'is between',
    date_preset: 'date preset',
    contains_key: 'has key',
}

export const DATE_PRESET_LABELS: Record<string, string> = {
    today: 'Today',
    yesterday: 'Yesterday',
    last_7_days: 'Last 7 days',
    last_30_days: 'Last 30 days',
    this_month: 'This month',
    this_year: 'This year',
}
