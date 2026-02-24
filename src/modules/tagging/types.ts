export interface TagCount {
    tagId: number
    tagName: string
    tagValue: string
    tierNumber: number | null
    priority: string | null
    count: number
    percentOfTotal: number
}

export interface TagUsageStats {
    totalTaggedCalls: number
    tagCounts: TagCount[]
}

export interface TierTagCount {
    tierNumber: number
    tagCounts: TagCount[]
}

export interface PriorityTagCount {
    priority: string
    tagCounts: TagCount[]
}

export interface TaggingDashboard {
    totalTaggedCalls: number
    tagCounts: TagCount[]
    tagCountByTier: TierTagCount[]
    tagCountByPriority: PriorityTagCount[]
}
