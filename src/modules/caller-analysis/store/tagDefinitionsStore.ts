import { create } from 'zustand'
import { Priority } from '../types/priority.types'
import type { StatusItem } from '../types/priority.types'
import { callerAnalysisApi } from '@/services/api/callerAnalysis'

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
    statusToStatusItems: (status: Array<string>) => Array<StatusItem>
    /** Build priority rows { highest, high, medium, low } from status */
    statusToPriorityRows: (status: Array<string>) => {
        highest: Array<StatusItem>
        high: Array<StatusItem>
        medium: Array<StatusItem>
        low: Array<StatusItem>
    }
}

const stringToPriority = (p: string): Priority => {
    const s = (p ?? '').trim()
    if (s === 'Highest') return Priority.HIGHEST
    if (s === 'High') return Priority.HIGH
    if (s === 'Medium') return Priority.MEDIUM
    return Priority.LOW
}

export const useTagDefinitionsStore = create<TagDefinitionsState>(
    (set, get) => ({
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

        statusToStatusItems: (status: Array<string>): Array<StatusItem> => {
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
            status: Array<string>
        ): {
            highest: Array<StatusItem>
            high: Array<StatusItem>
            medium: Array<StatusItem>
            low: Array<StatusItem>
        } => {
            const items = get().statusToStatusItems(status)
            const highest: Array<StatusItem> = []
            const high: Array<StatusItem> = []
            const medium: Array<StatusItem> = []
            const low: Array<StatusItem> = []
            for (const item of items) {
                if (item.priority === Priority.HIGHEST) highest.push(item)
                else if (item.priority === Priority.HIGH) high.push(item)
                else if (item.priority === Priority.MEDIUM) medium.push(item)
                else low.push(item)
            }
            return { highest, high, medium, low }
        },
    })
)
