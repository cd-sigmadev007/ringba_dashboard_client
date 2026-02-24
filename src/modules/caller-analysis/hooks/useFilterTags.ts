import { useMemo } from 'react'
import type { SelectOption } from '@/components/ui/FilterSelect'
import { useTagDefinitionsStore } from '../store/tagDefinitionsStore'

/** Uses tag definitions from Zustand store (single fetch, shared with table + modals) */
export function useFilterTags() {
    const tagMap = useTagDefinitionsStore((s) => s.tagMap)
    const isLoadingTags = useTagDefinitionsStore((s) => s.isLoading)

    const statusOptions: Array<SelectOption> = useMemo(() => {
        return Array.from(tagMap.keys())
            .filter((name) => name && name.trim() !== '')
            .map((tagName) => ({ title: tagName, value: tagName }))
    }, [tagMap])

    return { statusOptions, isLoadingTags }
}
