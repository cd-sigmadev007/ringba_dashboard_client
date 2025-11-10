import { useCallback, useMemo, useState } from 'react'
import type { PaginatedApiResponse } from '@/services/api'

// Pagination Configuration
export const PAGINATION_CONFIG = {
    DEFAULT_PAGE_SIZE: 100,
    MAX_PAGE_SIZE: 1000,
    MIN_PAGE_SIZE: 10,
} as const

// Pagination State
export interface PaginationState {
    currentPage: number
    pageSize: number
    totalRecords: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
    isLoading: boolean
    loadedPages: Set<number>
}

// Smart Pagination Hook
export function useSmartPagination<T = any>(
    initialPageSize: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE
) {
    // Pagination state
    const [paginationState, setPaginationState] = useState<PaginationState>({
        currentPage: 1,
        pageSize: initialPageSize,
        totalRecords: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
        isLoading: false,
        loadedPages: new Set(), // Start with no pages loaded
    })

    // Data cache for loaded pages
    const [dataCache, setDataCache] = useState<Map<number, Array<T>>>(new Map())

    // Update pagination state from API response
    const updatePaginationState = useCallback(
        (response: PaginatedApiResponse<T>) => {
            const { pagination } = response
            console.log('📊 updatePaginationState called with:', response)

            setPaginationState((prev) => {
                const newState = {
                    ...prev,
                    totalRecords: pagination.total,
                    totalPages: pagination.totalPages,
                    hasNext:
                        pagination.hasNext ??
                        pagination.page < pagination.totalPages,
                    hasPrev: pagination.hasPrev ?? pagination.page > 1,
                    isLoading: false,
                }
                console.log('📊 New pagination state:', newState)
                return newState
            })
        },
        []
    )

    // Load a specific page
    const loadPage = useCallback(
        async (
            page: number,
            fetchFunction: (
                page: number,
                limit: number
            ) => Promise<PaginatedApiResponse<T>>
        ) => {
            console.log('📄 loadPage called:', {
                page,
                hasPage: paginationState.loadedPages.has(page),
            })

            // Check if page is already loaded
            if (paginationState.loadedPages.has(page)) {
                console.log('📄 Page already loaded, just switching to it')
                setPaginationState((prev) => ({
                    ...prev,
                    currentPage: page,
                }))
                return
            }

            console.log('📄 Loading new page...')
            // Set loading state
            setPaginationState((prev) => ({
                ...prev,
                isLoading: true,
            }))

            try {
                // Fetch the page data
                const response = await fetchFunction(
                    page,
                    paginationState.pageSize
                )
                console.log('📄 Fetched data:', response)

                // Cache the data
                setDataCache((prev) => new Map(prev.set(page, response.data)))

                // Update pagination state
                updatePaginationState(response)

                // Add page to loaded pages
                setPaginationState((prev) => ({
                    ...prev,
                    currentPage: page,
                    loadedPages: new Set([...prev.loadedPages, page]),
                }))
                console.log('📄 Page loaded successfully')
            } catch (error) {
                console.error('📄 Error loading page:', error)
                // Handle error
                setPaginationState((prev) => ({
                    ...prev,
                    isLoading: false,
                }))
                throw error
            }
        },
        [
            paginationState.loadedPages,
            paginationState.pageSize,
            updatePaginationState,
        ]
    )

    // Load next page
    const loadNextPage = useCallback(
        async (
            fetchFunction: (
                page: number,
                limit: number
            ) => Promise<PaginatedApiResponse<T>>
        ) => {
            if (paginationState.hasNext && !paginationState.isLoading) {
                const nextPage = paginationState.currentPage + 1
                await loadPage(nextPage, fetchFunction)
            }
        },
        [
            paginationState.hasNext,
            paginationState.isLoading,
            paginationState.currentPage,
            loadPage,
        ]
    )

    // Load previous page
    const loadPrevPage = useCallback(
        async (
            fetchFunction: (
                page: number,
                limit: number
            ) => Promise<PaginatedApiResponse<T>>
        ) => {
            if (paginationState.hasPrev && !paginationState.isLoading) {
                const prevPage = paginationState.currentPage - 1
                await loadPage(prevPage, fetchFunction)
            }
        },
        [
            paginationState.hasPrev,
            paginationState.isLoading,
            paginationState.currentPage,
            loadPage,
        ]
    )

    // Jump to specific page
    const jumpToPage = useCallback(
        async (
            page: number,
            fetchFunction: (
                page: number,
                limit: number
            ) => Promise<PaginatedApiResponse<T>>
        ) => {
            if (
                page >= 1 &&
                page <= paginationState.totalPages &&
                page !== paginationState.currentPage
            ) {
                await loadPage(page, fetchFunction)
            }
        },
        [paginationState.totalPages, paginationState.currentPage, loadPage]
    )

    // Change page size
    const changePageSize = useCallback(
        (newPageSize: number) => {
            // Validate page size
            const validPageSize = Math.max(
                PAGINATION_CONFIG.MIN_PAGE_SIZE,
                Math.min(newPageSize, PAGINATION_CONFIG.MAX_PAGE_SIZE)
            )

            if (validPageSize !== paginationState.pageSize) {
                // Clear cache and reset to first page when changing page size
                setDataCache(new Map())
                setPaginationState((prev) => ({
                    ...prev,
                    pageSize: validPageSize,
                    currentPage: 1,
                    loadedPages: new Set([1]),
                    totalPages: 0,
                    totalRecords: 0,
                }))
            }
        },
        [paginationState.pageSize]
    )

    // Get current page data
    const currentPageData = useMemo(() => {
        return dataCache.get(paginationState.currentPage) || []
    }, [dataCache, paginationState.currentPage])

    // Get all loaded data
    const allLoadedData = useMemo(() => {
        const allData: Array<T> = []
        paginationState.loadedPages.forEach((page) => {
            const pageData = dataCache.get(page)
            if (pageData) {
                allData.push(...pageData)
            }
        })
        return allData
    }, [dataCache, paginationState.loadedPages])

    // Check if a page is loaded
    const isPageLoaded = useCallback(
        (page: number) => {
            return paginationState.loadedPages.has(page)
        },
        [paginationState.loadedPages]
    )

    // Get page data (returns cached data or empty array)
    const getPageData = useCallback(
        (page: number) => {
            return dataCache.get(page) || []
        },
        [dataCache]
    )

    // Reset pagination
    const resetPagination = useCallback(() => {
        setDataCache(new Map())
        setPaginationState((prev) => ({
            ...prev,
            currentPage: 1,
            loadedPages: new Set([1]),
            totalPages: 0,
            totalRecords: 0,
        }))
    }, [])

    return {
        // State
        paginationState,

        // Data
        currentPageData,
        allLoadedData,

        // Actions
        loadPage,
        loadNextPage,
        loadPrevPage,
        jumpToPage,
        changePageSize,
        resetPagination,

        // Utilities
        isPageLoaded,
        getPageData,

        // Computed values
        canLoadNext: paginationState.hasNext && !paginationState.isLoading,
        canLoadPrev: paginationState.hasPrev && !paginationState.isLoading,
        isCurrentPageLoaded: paginationState.loadedPages.has(
            paginationState.currentPage
        ),
    }
}
