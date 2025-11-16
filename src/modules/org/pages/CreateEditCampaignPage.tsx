import React, { useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import clsx from 'clsx'
import { useCampaignStore } from '../store/campaignStore'
import { useCampaignForm } from '../hooks/useCampaignForm'
import { useCampaignSubmit } from '../hooks/useCampaignSubmit'
import { CampaignFormHeader } from '../components/CampaignFormHeader'
import { CampaignFormField } from '../components/CampaignFormField'
import { CampaignLogoUpload } from '../components/CampaignLogoUpload'
import TextArea from '@/components/ui/TextArea'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const CreateEditCampaignPage: React.FC = () => {
    const params = useParams({ strict: false })
    const campaignId = params.campaignId
    const { campaigns, fetchCampaigns } = useCampaignStore()

    const isEditMode = !!campaignId && campaignId !== 'new'
    const campaign = isEditMode
        ? campaigns.find((c) => c.id === campaignId)
        : null

    const { formState, handlers } = useCampaignForm({
        campaign,
        isEditMode,
    })

    const { handleSubmit, submitting, error } = useCampaignSubmit({
        isEditMode,
        campaignId,
    })

    useEffect(() => {
        if (isEditMode && !campaign) {
            fetchCampaigns()
        }
    }, [isEditMode, campaign, fetchCampaigns])

    const onSubmit = async () => {
        await handleSubmit(
            {
                name: formState.name,
                campaignId: formState.campaignId,
                description: formState.description,
            },
            formState.file
        )
    }

    return (
        <div className={clsx('p-4 md:p-6 lg:p-8 space-y-4')}>
            <CampaignFormHeader isEditMode={isEditMode} />

            {/* Form */}
            <div className="space-y-6 max-w-4xl">
                {/* Campaign Logo */}
                <CampaignFormField label="Campaign Logo">
                    <CampaignLogoUpload
                        preview={formState.preview}
                        onFileChange={handlers.handleFileChange}
                        onRemove={
                            formState.preview
                                ? handlers.handleRemoveLogo
                                : undefined
                        }
                    />
                </CampaignFormField>

                {/* Campaign Name */}
                <CampaignFormField
                    label="Campaign Name"
                    error={error && !formState.name.trim() ? error : undefined}
                >
                    <Input
                        value={formState.name}
                        onChange={(e) => handlers.setName(e.target.value)}
                        placeholder="New Pest Control"
                    />
                </CampaignFormField>

                {/* Campaign ID */}
                <CampaignFormField label="Campaign ID">
                    <Input
                        value={formState.campaignId}
                        onChange={(e) => handlers.setCampaignId(e.target.value)}
                        placeholder="#3569DDBC"
                    />
                </CampaignFormField>

                {/* Description */}
                <CampaignFormField label="Description">
                    <TextArea
                        value={formState.description}
                        onChange={(e) =>
                            handlers.setDescription(e.target.value)
                        }
                        placeholder="This is a sample description for the campaign. Here we can add anything about what the campaign does"
                        rows={6}
                    />
                </CampaignFormField>

                {/* Error message */}
                {error && (
                    <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6">
                        <div className="hidden md:block md:min-w-[140px]"></div>
                        <div className="flex-1">
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* Save Changes Button */}
                <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6 pt-4">
                    <div className="hidden md:block md:min-w-[140px]"></div>
                    <div className="flex-1 w-full md:w-auto">
                        <Button
                            onClick={onSubmit}
                            disabled={submitting}
                            variant="primary"
                            className="w-full md:w-auto md:min-w-[140px]"
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
    )
}

export default CreateEditCampaignPage
