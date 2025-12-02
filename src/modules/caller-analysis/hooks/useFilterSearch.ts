import { useMemo } from 'react'

export function useFilterSearch<T extends { title: string }>(
    items: Array<T>,
    searchQuery: string
) {
    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items
        const query = searchQuery.toLowerCase()
        return items.filter((item) => item.title.toLowerCase().includes(query))
    }, [items, searchQuery])

    return filteredItems
}

export function useFilterCategorySearch(searchQuery: string) {
    const shouldShowFilter = (filterName: string) => {
        if (!searchQuery.trim()) return true
        return filterName.toLowerCase().includes(searchQuery.toLowerCase())
    }

    const shouldShowSection = (
        sectionName: string,
        filterList: Array<string>
    ) => {
        if (!searchQuery.trim()) return true
        return (
            sectionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            filterList.some((f) =>
                f.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    }

    return { shouldShowFilter, shouldShowSection }
}
