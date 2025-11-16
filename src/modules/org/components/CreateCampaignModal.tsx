import React, { useEffect, useState } from 'react'
import { useCampaignStore } from '../store/campaignStore'
import type { CampaignDto } from '../services/campaignApi'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface Props {
    open: boolean
    onClose: () => void
    campaign?: CampaignDto | null
}

const CreateCampaignModal: React.FC<Props> = ({ open, onClose, campaign }) => {
    const createCampaign = useCampaignStore((s) => s.createCampaign)
    const updateCampaign = useCampaignStore((s) => s.updateCampaign)
    const [name, setName] = useState(campaign?.name ?? '')
    const [campaignId, setCampaignId] = useState<string>(
        campaign?.campaign_id ?? ('' as any)
    )
    const [file, setFile] = useState<File | undefined>(undefined)
    const [preview, setPreview] = useState<string | undefined>(
        campaign?.logo_url ?? undefined
    )
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)

    useEffect(() => {
        setName(campaign?.name ?? '')
        setCampaignId((campaign?.campaign_id as any) ?? '')
        setPreview(campaign?.logo_url ?? undefined)
        setFile(undefined)
    }, [campaign, open])

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        setFile(f)
        if (f) {
            const reader = new FileReader()
            reader.onload = () => setPreview(reader.result as string)
            reader.readAsDataURL(f)
        } else {
            setPreview(undefined)
        }
    }

    const handleSubmit = async () => {
        setError(undefined)
        if (!name.trim()) {
            setError('Campaign name is required')
            return
        }
        setSubmitting(true)
        if (campaign?.id) {
            const updated = await updateCampaign(
                campaign.id,
                { name, campaign_id: campaignId || null },
                file
            )
            setSubmitting(false)
            if (updated) {
                onClose()
            }
        } else {
            const created = await createCampaign(
                { name, campaign_id: campaignId || undefined },
                file
            )
            setSubmitting(false)
            if (created) {
                onClose()
                setName('')
                setCampaignId('')
                setFile(undefined)
                setPreview(undefined)
            }
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={campaign ? 'Edit Campaign' : 'Create Campaign'}
            position="center"
            size="sm"
        >
            <div className="space-y-4 p-2">
                <Input
                    placeholder="Campaign Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    placeholder="Specific Campaign ID (for matching)"
                    value={campaignId}
                    onChange={(e) => setCampaignId(e.target.value)}
                />
                <div className="flex items-center gap-3">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="preview"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    )}
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={submitting}>
                        {submitting
                            ? campaign
                                ? 'Saving...'
                                : 'Creating...'
                            : campaign
                              ? 'Save'
                              : 'Create'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default CreateCampaignModal
