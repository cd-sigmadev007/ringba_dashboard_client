import { create } from 'zustand'
import { callerAnalysisApi } from '@/services/api/callerAnalysis'
import { Priority } from '../types/priority.types'
import type { StatusItem } from '../types/priority.types'

export interface TagDefinition {
    tag_name: string
    priority: string
}

interface TagDefinitionsState {
    /** Map of tag_name -> priority string (Highest, High, Medium, Low) */
    tagMap: Map<string, string>
    isLoading: boolean
    error: Error | null
    lastFetched: number | null
    /** Fetch tag definitions from API; call on caller analysis mount */
    fetch: () => Promise<void>
    /** Build StatusItem[] from status (tag names) using stored definitions */
    statusToStatusItems: (status: string[]) => StatusItem[]
    /** Build priority rows { highest, high, medium, low } from status */
    statusToPriorityRows: (
        status: string[]
    ) => {
        highest: StatusItem[]
        high: StatusItem[]
        medium: StatusItem[]
        low: StatusItem[]
    }
}

const stringToPriority = (p: string): Priority => {
    const s = (p ?? '').trim()
    if (s === 'Highest') return Priority.HIGHEST
    if (s === 'High') return Priority.HIGH
    if (s === 'Medium') return Priority.MEDIUM
    return Priority.LOW
}

export const useTagDefinitionsStore = create<TagDefinitionsState>((set, get) => ({
    tagMap: new Map(),
    isLoading: false,
    error: null,
    lastFetched: null,

    fetch: async () => {
        set({ isLoading: true, error: null })
        try {
            const tags = await callerAnalysisApi.getTags()
            const map = new Map<string, string>()
            for (const t of tags ?? []) {
                if (t?.tag_name) {
                    map.set(t.tag_name, t.priority ?? 'Low')
                }
            }
            set({
                tagMap: map,
                isLoading: false,
                error: null,
                lastFetched: Date.now(),
            })
        } catch (err) {
            set({
                isLoading: false,
                error: err instanceof Error ? err : new Error(String(err)),
            })
        }
    },

    statusToStatusItems: (status: string[]): StatusItem[] => {
        const { tagMap } = get()
        const arr = Array.isArray(status)
            ? status.filter((s) => s && String(s).trim() !== '')
            : []
        const unique = Array.from(new Set(arr))
        return unique.map((name, idx) => {
            const priorityStr = tagMap.get(name) ?? 'Low'
            return {
                id: `tag-${idx}`,
                title: name,
                priority: stringToPriority(priorityStr),
            }
        })
    },

    statusToPriorityRows: (
        status: string[]
    ): {
        highest: StatusItem[]
        high: StatusItem[]
        medium: StatusItem[]
        low: StatusItem[]
    } => {
        const items = get().statusToStatusItems(status)
        const highest: StatusItem[] = []
        const high: StatusItem[] = []
        const medium: StatusItem[] = []
        const low: StatusItem[] = []
        for (const item of items) {
            if (item.priority === Priority.HIGHEST) highest.push(item)
            else if (item.priority === Priority.HIGH) high.push(item)
            else if (item.priority === Priority.MEDIUM) medium.push(item)
            else low.push(item)
        }
        return { highest, high, medium, low }
    },
}))
