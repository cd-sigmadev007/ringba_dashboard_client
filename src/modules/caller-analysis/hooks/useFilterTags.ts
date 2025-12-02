import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import type { SelectOption } from '@/components/ui/FilterSelect'
import { callerAnalysisApi } from '@/services/api/callerAnalysis'
import { apiClient } from '@/services/api'

export function useFilterTags(isOpen: boolean) {
    const [statusOptions, setStatusOptions] = useState<Array<SelectOption>>([])
    const [isLoadingTags, setIsLoadingTags] = useState(true)
    const { isAuthenticated, isLoading: authLoading } = useAuth0()

    useEffect(() => {
        const fetchTagsInternal = async () => {
            try {
                setIsLoadingTags(true)
                const tags = await callerAnalysisApi.getTags()
                const options: Array<SelectOption> = tags.map(
                    (tag: { tag_name: string; priority: string }) => ({
                        title: tag.tag_name,
                        value: tag.tag_name,
                    })
                )
                setStatusOptions(options)
            } catch (error) {
                console.error('Failed to fetch tags:', error)
                setStatusOptions([])
            } finally {
                setIsLoadingTags(false)
            }
        }

        const fetchTags = () => {
            if (authLoading) {
                return
            }

            if (!isAuthenticated || !apiClient.isAuthInitialized()) {
                const maxAttempts = 20
                let attempts = 0
                const checkAuth = setInterval(() => {
                    attempts++
                    if (
                        apiClient.isAuthInitialized() ||
                        attempts >= maxAttempts
                    ) {
                        clearInterval(checkAuth)
                        if (apiClient.isAuthInitialized() && isAuthenticated) {
                            fetchTagsInternal()
                        } else {
                            setIsLoadingTags(false)
                        }
                    }
                }, 100)
                return () => clearInterval(checkAuth)
            }

            fetchTagsInternal()
        }

        fetchTags()
    }, [authLoading, isAuthenticated, isOpen])

    return { statusOptions, isLoadingTags }
}
