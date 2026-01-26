// GraphQL types matching the backend schema

export enum FieldType {
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
    DATE = 'DATE',
    ARRAY = 'ARRAY',
}

export enum FieldSource {
    FIXED = 'FIXED',
    DYNAMIC = 'DYNAMIC',
}

export enum FilterOperator {
    EQ = 'EQ',
    NE = 'NE',
    IN = 'IN',
    NOT_IN = 'NOT_IN',
    CONTAINS = 'CONTAINS',
    GT = 'GT',
    GTE = 'GTE',
    LT = 'LT',
    LTE = 'LTE',
}

export enum CallerOrderField {
    CALL_TIMESTAMP = 'CALL_TIMESTAMP',
    DURATION = 'DURATION',
    CAMPAIGN = 'CAMPAIGN',
    PHONE_NUMBER = 'PHONE_NUMBER',
}

export enum OrderDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

export interface FieldDefinition {
    name: string
    type: FieldType
    source: FieldSource
    filterable: boolean
}

export interface DynamicFieldFilter {
    field: string
    operator: FilterOperator
    value: any
}

export interface CallerFilter {
    campaign?: Array<string>
    status?: Array<string>
    dateFrom?: string
    dateTo?: string
    durationMin?: number
    durationMax?: number
    search?: string
    dynamicFields?: Array<DynamicFieldFilter>
}

export interface CallerOrderBy {
    field: CallerOrderField
    direction: OrderDirection
}

export interface Caller {
    id: string
    callerId: string
    lastCall: string
    duration: string
    lifetimeRevenue: number
    campaign: string
    action: string
    status: Array<string>
    audioUrl?: string
    transcript?: string
    phoneNumber: string
    callTimestamp: string
    callLengthInSeconds: number
    attributes: Record<string, any>
    firstName?: string
    lastName?: string
    email?: string
    type?: string
    address?: string
    streetNumber?: string
    streetName?: string
    streetType?: string
    city?: string
    state?: string
    zip?: string
    revenue?: number
    ringbaCost?: number
    adCost?: number
    targetName?: string
}

export interface PageInfo {
    hasNextPage: boolean
    hasPreviousPage: boolean
    currentPage: number
    totalPages: number
    totalCount: number
}

export interface CallerEdge {
    node: Caller
}

export interface CallerConnection {
    edges: Array<CallerEdge>
    pageInfo: PageInfo
    totalCount: number
}

export interface FieldValue {
    value: any
    count: number
}

export interface FieldValueEdge {
    node: FieldValue
}

export interface FieldValueConnection {
    edges: Array<FieldValueEdge>
    pageInfo: PageInfo
}
