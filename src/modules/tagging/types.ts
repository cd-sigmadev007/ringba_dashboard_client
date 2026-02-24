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
    tagCounts: Array<TagCount>
}

export interface TierTagCount {
    tierNumber: number
    tagCounts: Array<TagCount>
}

export interface PriorityTagCount {
    priority: string
    tagCounts: Array<TagCount>
}

export interface TaggingDashboard {
    totalTaggedCalls: number
    tagCounts: Array<TagCount>
    tagCountByTier: Array<TierTagCount>
    tagCountByPriority: Array<PriorityTagCount>
}
