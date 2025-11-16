import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import Button from '@/components/ui/Button'

interface CampaignFormHeaderProps {
    isEditMode: boolean
}

export const CampaignFormHeader: React.FC<CampaignFormHeaderProps> = ({
    isEditMode,
}) => {
    const navigate = useNavigate()

    const handleBack = () => {
        navigate({ to: '/organization/campaigns' })
    }

    return (
        <div className="flex items-center py-6 mb-6">
            <Button
                variant="ghost"
                onClick={handleBack}
                className="border-none hover:bg-transparent"
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
            </Button>
            <h1 className="text-xl font-semibold">
                {isEditMode ? 'Edit Campaign' : 'New Campaign'}
            </h1>
        </div>
    )
}
