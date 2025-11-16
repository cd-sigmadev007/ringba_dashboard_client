import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useCampaignStore } from '../store/campaignStore'
import type { CampaignDto } from '../services/campaignApi'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import clsx from 'clsx'

const CreateEditCampaignPage: React.FC = () => {
    const navigate = useNavigate()
    const params = useParams({ strict: false }) as { campaignId?: string }
    const campaignId = params?.campaignId
    const { campaigns, createCampaign, updateCampaign, fetchCampaigns } = useCampaignStore()
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const isEditMode = !!campaignId && campaignId !== 'new'
    const campaign = isEditMode ? campaigns.find((c) => c.id === campaignId) : null

    const [name, setName] = useState(campaign?.name ?? '')
    const [campaignIdValue, setCampaignIdValue] = useState<string>(
        campaign?.campaign_id ?? ''
    )
    const [description, setDescription] = useState('')
    const [file, setFile] = useState<File | undefined>(undefined)
    const [preview, setPreview] = useState<string | undefined>(
        campaign?.logo_url ?? undefined
    )
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (campaign) {
            setName(campaign.name ?? '')
            setCampaignIdValue(campaign.campaign_id ?? '')
            setPreview(campaign.logo_url ?? undefined)
        }
    }, [campaign])

    const getApiBaseUrl = () => {
        const baseUrl =
            (import.meta as any).env?.VITE_API_BASE_URL ||
            'http://localhost:3001'
        return baseUrl.replace(/\/api$/, '').replace(/\/+$/, '')
    }

    const toAbsoluteLogoUrl = (logoUrl?: string | null) => {
        if (!logoUrl) return ''
        if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://'))
            return logoUrl
        const base = getApiBaseUrl()
        const path = logoUrl.startsWith('/') ? logoUrl : `/${logoUrl}`
        return `${base}${path}`
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        setFile(f)
        if (f) {
            const reader = new FileReader()
            reader.onload = () => setPreview(reader.result as string)
            reader.readAsDataURL(f)
        } else {
            setPreview(campaign?.logo_url ? toAbsoluteLogoUrl(campaign.logo_url) : undefined)
        }
    }

    const handleSubmit = async () => {
        setError(undefined)
        if (!name.trim()) {
            setError('Campaign name is required')
            return
        }
        setSubmitting(true)
        try {
            if (isEditMode && campaign?.id) {
                const updated = await updateCampaign(
                    campaign.id,
                    { name, campaign_id: campaignIdValue || null },
                    file
                )
                if (updated) {
                    await fetchCampaigns()
                    navigate({ to: '/organization/campaigns' })
                } else {
                    setError('Failed to update campaign')
                }
            } else {
                const created = await createCampaign(
                    { name, campaign_id: campaignIdValue || undefined },
                    file
                )
                if (created) {
                    await fetchCampaigns()
                    navigate({ to: '/organization/campaigns' })
                } else {
                    setError('Failed to create campaign')
                }
            }
        } catch (e: any) {
            setError(e?.message || 'An error occurred')
        } finally {
            setSubmitting(false)
        }
    }

    const handleBack = () => {
        navigate({ to: '/organization/campaigns' })
    }

    return (
        <div className={clsx('p-4 md:p-6 lg:p-8', isDark ? 'bg-[#001E3C]' : 'bg-white', 'min-h-screen')}>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header with back button */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={handleBack}
                        className={clsx(
                            'p-2 rounded-lg transition-colors',
                            isDark
                                ? 'hover:bg-[#0254A5] text-white'
                                : 'hover:bg-gray-100 text-gray-700'
                        )}
                        aria-label="Go back"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                        {isEditMode ? 'Edit Campaign' : 'New Campaign'}
                    </h1>
                </div>

                {/* Form */}
                <div className={clsx('space-y-6', isDark ? 'bg-[#002B57]' : 'bg-gray-50', 'p-6 rounded-lg')}>
                    {/* Campaign Logo */}
                    <div className="flex items-start gap-6">
                        <label className={clsx('text-sm font-medium min-w-[140px] pt-3', isDark ? 'text-white' : 'text-gray-700')}>
                            Campaign Logo
                        </label>
                        <div className="flex-1">
                            <div className="flex items-center gap-4">
                                <label
                                    className={clsx(
                                        'cursor-pointer flex items-center justify-center rounded-lg border-2 border-dashed transition-colors',
                                        isDark
                                            ? 'bg-[#001E3C] border-[#1B456F] hover:border-[#007FFF] text-white'
                                            : 'bg-white border-gray-300 hover:border-blue-500 text-gray-400',
                                        'w-24 h-24'
                                    )}
                                >
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Campaign logo"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <svg
                                            width="32"
                                            height="32"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onFileChange}
                                        className="hidden"
                                    />
                                </label>
                                {preview && (
                                    <button
                                        onClick={() => {
                                            setFile(undefined)
                                            setPreview(campaign?.logo_url ? toAbsoluteLogoUrl(campaign.logo_url) : undefined)
                                        }}
                                        className={clsx(
                                            'text-sm px-3 py-1 rounded',
                                            isDark
                                                ? 'text-red-400 hover:bg-[#1B456F]'
                                                : 'text-red-600 hover:bg-red-50'
                                        )}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Campaign Name */}
                    <div className="flex items-start gap-6">
                        <label className={clsx('text-sm font-medium min-w-[140px] pt-3', isDark ? 'text-white' : 'text-gray-700')}>
                            Campaign Name
                        </label>
                        <div className="flex-1">
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="New Pest Control"
                                className={isDark ? 'bg-[#001E3C] text-white' : ''}
                            />
                        </div>
                    </div>

                    {/* Campaign ID */}
                    <div className="flex items-start gap-6">
                        <label className={clsx('text-sm font-medium min-w-[140px] pt-3', isDark ? 'text-white' : 'text-gray-700')}>
                            Campaign ID
                        </label>
                        <div className="flex-1">
                            <Input
                                value={campaignIdValue}
                                onChange={(e) => setCampaignIdValue(e.target.value)}
                                placeholder="#3569DDBC"
                                className={isDark ? 'bg-[#001E3C] text-white' : ''}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex items-start gap-6">
                        <label className={clsx('text-sm font-medium min-w-[140px] pt-3', isDark ? 'text-white' : 'text-gray-700')}>
                            Description
                        </label>
                        <div className="flex-1">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="This is a sample description for the campaign. Here we can add anything about what the campaign does"
                                rows={6}
                                className={clsx(
                                    'w-full px-[15px] py-[10px] rounded-[7px] border border-transparent focus:outline-0 focus:border-[#007FFF] transition-all duration-100 ease-in placeholder:text-[#A1A5B7]',
                                    isDark
                                        ? 'bg-[#001E3C] text-white focus:bg-[#001E3C]'
                                        : 'bg-white text-[#3F4254] focus:bg-[#FFFFFF]'
                                )}
                            />
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="flex items-start gap-6">
                            <div className="min-w-[140px]"></div>
                            <div className="flex-1">
                                <p className={clsx('text-sm', isDark ? 'text-red-400' : 'text-red-600')}>
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Save Changes Button */}
                    <div className="flex items-start gap-6 pt-4">
                        <div className="min-w-[140px]"></div>
                        <div className="flex-1">
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting}
                                variant="primary"
                                className="min-w-[140px]"
                            >
                                {submitting
                                    ? isEditMode
                                        ? 'Saving...'
                                        : 'Creating...'
                                    : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateEditCampaignPage

