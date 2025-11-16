import { useEffect, useState } from 'react'
import type { CampaignDto } from '../services/campaignApi'

interface UseCampaignFormProps {
    campaign?: CampaignDto | null
    isEditMode: boolean
}

export function useCampaignForm({
    campaign,
    isEditMode,
}: UseCampaignFormProps) {
    const [name, setName] = useState(campaign?.name ?? '')
    const [campaignId, setCampaignId] = useState(campaign?.campaign_id ?? '')
    const [description, setDescription] = useState(campaign?.description ?? '')
    const [file, setFile] = useState<File | undefined>(undefined)
    const [preview, setPreview] = useState<string | undefined>(undefined)

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

    useEffect(() => {
        if (campaign) {
            setName(campaign.name)
            setCampaignId(campaign.campaign_id || '')
            setDescription(campaign.description || '')
            setPreview(
                campaign.logo_url
                    ? toAbsoluteLogoUrl(campaign.logo_url)
                    : undefined
            )
            setFile(undefined)
        } else if (!isEditMode) {
            // Reset form for new campaign
            setName('')
            setCampaignId('')
            setDescription('')
            setPreview(undefined)
            setFile(undefined)
        }
    }, [campaign, isEditMode])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        setFile(f)
        if (f) {
            const reader = new FileReader()
            reader.onload = () => setPreview(reader.result as string)
            reader.readAsDataURL(f)
        } else {
            setPreview(
                campaign?.logo_url
                    ? toAbsoluteLogoUrl(campaign.logo_url)
                    : undefined
            )
        }
    }

    const handleRemoveLogo = () => {
        setFile(undefined)
        setPreview(
            campaign?.logo_url
                ? toAbsoluteLogoUrl(campaign.logo_url)
                : undefined
        )
    }

    const reset = () => {
        setName('')
        setCampaignId('')
        setDescription('')
        setFile(undefined)
        setPreview(undefined)
    }

    return {
        formState: {
            name,
            campaignId,
            description,
            file,
            preview,
        },
        handlers: {
            setName,
            setCampaignId,
            setDescription,
            handleFileChange,
            handleRemoveLogo,
            reset,
        },
    }
}
