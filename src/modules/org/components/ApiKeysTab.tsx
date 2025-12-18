import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { apiKeysApi } from '../services/apiKeysApi'
import type { ApiKeyType } from '../services/apiKeysApi'
import { useThemeStore } from '@/store/themeStore'
import { useIsMobileOrTablet } from '@/lib/hooks/useMediaQuery'
import { usePermissions } from '@/hooks/usePermissions'
import { apiClient } from '@/services/api'
import { CopyIcon, DeleteIcon, EyeIcon, EyeOffIcon } from '@/assets/svg'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface ApiKey {
    id: string
    key: string
    maskedKey: string
    isActive: boolean
    type: 'assembly_ai' | 'ai_model' | 'ringba'
}

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    return (
        <p
            className={clsx(
                'text-[14px] w-[220px] shrink-0',
                isDark ? 'text-white' : 'text-[#3F4254]'
            )}
        >
            {children}
        </p>
    )
}

export const ApiKeysTab: React.FC = () => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const isMobileOrTablet = useIsMobileOrTablet()
    const { isAuthenticated, isLoading: authLoading, role } = usePermissions()

    // Access control: Only super_admin and org_admin can access
    const canAccess = role === 'super_admin' || role === 'org_admin'

    const [newKeys, setNewKeys] = useState<Record<string, string>>({
        assembly_ai: '',
        ai_model: '',
        ringba: '',
    })
    const [focusedInputs, setFocusedInputs] = useState<Set<string>>(new Set())
    const [apiKeys, setApiKeys] = useState<Array<ApiKey>>([])
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState<Record<string, boolean>>({})

    // Fetch API keys when authenticated and has access
    useEffect(() => {
        // Only fetch API keys when authentication is ready, user is authenticated, and has access
        if (!authLoading && isAuthenticated && canAccess) {
            // Check if apiClient is initialized, if not wait a bit and retry
            if (apiClient.isAuthInitialized()) {
                fetchApiKeys()
            } else {
                // Wait for apiClient to be initialized (max 2 seconds)
                const maxAttempts = 20
                let attempts = 0
                const checkAuth = setInterval(() => {
                    attempts++
                    if (
                        apiClient.isAuthInitialized() ||
                        attempts >= maxAttempts
                    ) {
                        clearInterval(checkAuth)
                        if (apiClient.isAuthInitialized()) {
                            fetchApiKeys()
                        } else {
                            console.error(
                                'ApiClient not initialized after waiting'
                            )
                        }
                    }
                }, 100)
                return () => clearInterval(checkAuth)
            }
        }
    }, [isAuthenticated, authLoading, canAccess])

    const fetchApiKeys = async () => {
        try {
            setLoading(true)
            const keys = await apiKeysApi.getApiKeys()
            console.log('Fetched API keys:', keys)
            const mappedKeys: Array<ApiKey> = keys.map((key) => ({
                id: key.id,
                key: key.api_key,
                maskedKey: maskApiKey(key.api_key),
                isActive: key.is_active,
                type: key.key_type,
            }))
            console.log('Mapped API keys:', mappedKeys)
            setApiKeys(mappedKeys)
        } catch (error: any) {
            console.error('Error fetching API keys:', error)
            toast.error(error?.message || 'Failed to fetch API keys')
        } finally {
            setLoading(false)
        }
    }

    const handleSaveKey = async (type: ApiKeyType) => {
        const keyValue = newKeys[type]
        if (!keyValue.trim()) {
            toast.error('Please enter an API key')
            return
        }

        try {
            setSaving((prev) => ({ ...prev, [type]: true }))
            await apiKeysApi.createApiKey({
                key_type: type,
                api_key: keyValue.trim(),
                is_active: true,
            })
            toast.success('API key saved successfully')
            setNewKeys((prev) => ({ ...prev, [type]: '' }))
            setFocusedInputs((prev) => {
                const next = new Set(prev)
                next.delete(type)
                return next
            })
            await fetchApiKeys()
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save API key')
        } finally {
            setSaving((prev) => ({ ...prev, [type]: false }))
        }
    }

    const maskApiKey = (key: string): string => {
        if (key.length <= 20) {
            return '•'.repeat(key.length)
        }
        const start = key.substring(0, 12)
        const end = key.substring(key.length - 5)
        const masked = '•'.repeat(key.length - 17)
        return `${start}${masked}${end}`
    }

    const handleCopy = (key: string) => {
        navigator.clipboard.writeText(key)
        toast.success('API key copied to clipboard')
    }

    const handleDelete = async (id: string, showConfirm = true) => {
        if (
            showConfirm &&
            !window.confirm('Are you sure you want to delete this API key?')
        ) {
            return
        }

        try {
            await apiKeysApi.deleteApiKey(id)
            toast.success('API key deleted successfully')
            setVisibleKeys((prev) => {
                const next = new Set(prev)
                next.delete(id)
                return next
            })
            await fetchApiKeys()
        } catch (error: any) {
            toast.error(error?.message || 'Failed to delete API key')
        }
    }

    const toggleVisibility = (id: string) => {
        setVisibleKeys((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    const renderApiKeySection = (
        title: string,
        type: ApiKeyType,
        keys: Array<ApiKey>
    ) => {
        const sectionKeys = keys.filter((k) => k.type === type)
        const showSaveButton =
            focusedInputs.has(type) || newKeys[type].trim().length > 0

        return (
            <div className="flex flex-col gap-[24px] items-start w-full">
                <div className="flex gap-[10px] items-start w-full">
                    <Label>{title}</Label>
                    <div className="flex flex-col gap-[24px] items-start justify-center flex-1">
                        {/* Add new key input with save button */}
                        <div
                            className={clsx(
                                'flex items-start max-lg:w-full',
                                isMobileOrTablet
                                    ? 'flex-col gap-[10px]'
                                    : 'flex-row gap-[5px]'
                            )}
                        >
                            <Input
                                placeholder="Enter API Key"
                                className={clsx(
                                    'w-full',
                                    !isMobileOrTablet && 'lg:w-[440px]'
                                )}
                                value={newKeys[type]}
                                onChange={(e) =>
                                    setNewKeys((prev) => ({
                                        ...prev,
                                        [type]: e.target.value,
                                    }))
                                }
                                onFocus={() => {
                                    setFocusedInputs((prev) =>
                                        new Set(prev).add(type)
                                    )
                                }}
                                onBlur={() => {
                                    // Keep save button visible if there's a value
                                    if (!newKeys[type].trim()) {
                                        setFocusedInputs((prev) => {
                                            const next = new Set(prev)
                                            next.delete(type)
                                            return next
                                        })
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSaveKey(type)
                                    }
                                }}
                                shadow={false}
                            />
                            {showSaveButton && (
                                <Button
                                    variant="secondary"
                                    onClick={() => handleSaveKey(type)}
                                    className="max-lg:w-full"
                                    disabled={
                                        saving[type] || !newKeys[type].trim()
                                    }
                                >
                                    <span className="text-[14px] font-medium">
                                        {saving[type] ? 'Saving...' : 'Save'}
                                    </span>
                                </Button>
                            )}
                        </div>

                        {/* Existing keys */}
                        {sectionKeys.map((apiKey) => (
                            <div
                                key={apiKey.id}
                                className="flex gap-[10px] items-start"
                            >
                                <div className="flex flex-col gap-[4px] items-start justify-center w-[440px]">
                                    <p
                                        className={clsx(
                                            'text-[14px]',
                                            isDark
                                                ? 'text-[#F0F5FF]'
                                                : 'text-[#3F4254]'
                                        )}
                                    >
                                        {visibleKeys.has(apiKey.id)
                                            ? apiKey.key
                                            : apiKey.maskedKey}
                                    </p>
                                    <div className="flex gap-[8px] items-center">
                                        <div
                                            className={clsx(
                                                'size-[7px] rounded-full',
                                                apiKey.isActive
                                                    ? 'bg-[#50AF95]'
                                                    : 'bg-[#A1A5B7]'
                                            )}
                                        />
                                        <p
                                            className={clsx(
                                                'text-[14px]',
                                                apiKey.isActive
                                                    ? 'text-[#50AF95]'
                                                    : 'text-[#A1A5B7]'
                                            )}
                                        >
                                            {apiKey.isActive
                                                ? 'Active'
                                                : 'Inactive'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => toggleVisibility(apiKey.id)}
                                    className={clsx(
                                        'p-1 min-w-0 w-[25px] h-[25px] flex items-center justify-center',
                                        isDark
                                            ? 'border border-[#0254A5] hover:bg-[#0254A5]/20'
                                            : 'border border-[#0254A5] hover:bg-[#0254A5]/10'
                                    )}
                                    title={
                                        visibleKeys.has(apiKey.id)
                                            ? 'Hide'
                                            : 'Show'
                                    }
                                >
                                    {visibleKeys.has(apiKey.id) ? (
                                        <EyeOffIcon className="w-[17px] h-[8px]" />
                                    ) : (
                                        <EyeIcon className="w-[17px] h-[13px]" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleCopy(apiKey.key)}
                                    className={clsx(
                                        'p-1 min-w-0 w-[25px] h-[25px] flex items-center justify-center',
                                        isDark
                                            ? 'border border-[#0254A5] hover:bg-[#0254A5]/20'
                                            : 'border border-[#0254A5] hover:bg-[#0254A5]/10'
                                    )}
                                    title="Copy"
                                >
                                    <CopyIcon className="w-[17px] h-[13px]" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleDelete(apiKey.id)}
                                    className={clsx(
                                        'p-1 min-w-0 w-[25px] h-[25px] flex items-center justify-center',
                                        isDark
                                            ? 'border border-[#0254A5] hover:bg-[#0254A5]/20'
                                            : 'border border-[#0254A5] hover:bg-[#0254A5]/10'
                                    )}
                                    title="Delete"
                                >
                                    <DeleteIcon className="w-[20px] h-[20px]" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Divider */}
                <div
                    className={clsx(
                        'h-[1px] w-full',
                        isDark ? 'bg-[#1B456F]' : 'bg-[#E1E5E9]'
                    )}
                />
            </div>
        )
    }

    const assemblyKeys = apiKeys.filter((k) => k.type === 'assembly_ai')
    const aiModelKeys = apiKeys.filter((k) => k.type === 'ai_model')
    const ringbaKeys = apiKeys.filter((k) => k.type === 'ringba')

    // Show access denied if user doesn't have required role
    if (!authLoading && isAuthenticated && !canAccess) {
        return (
            <div className="flex items-center justify-center w-full py-8">
                <p
                    className={clsx(
                        'text-sm',
                        isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                    )}
                >
                    You don't have permission to access API keys. Only Super
                    Admin and Org Admin can manage API keys.
                </p>
            </div>
        )
    }

    if (loading || authLoading) {
        return (
            <div className="flex items-center justify-center w-full py-8">
                <p
                    className={clsx(
                        'text-sm',
                        isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                    )}
                >
                    Loading API keys...
                </p>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center w-full py-8">
                <p
                    className={clsx(
                        'text-sm',
                        isDark ? 'text-[#A1A5B7]' : 'text-[#5E6278]'
                    )}
                >
                    Please log in to access API keys.
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-[24px] items-start w-full">
            {renderApiKeySection(
                'Assembly AI Keys',
                'assembly_ai',
                assemblyKeys
            )}
            {renderApiKeySection('AI Model Keys', 'ai_model', aiModelKeys)}
            {renderApiKeySection('Ringba API Keys', 'ringba', ringbaKeys)}
        </div>
    )
}
