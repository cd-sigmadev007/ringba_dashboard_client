import React from 'react'
import clsx from 'clsx'
import OrgHeader from '../components/OrgHeader'
import OrgProfileForm from '../components/OrgForm'
import { ApiKeysTab } from '../components/ApiKeysTab'
import type { TabItem } from '@/components/ui/Tabs'
import { Tabs } from '@/components/ui/Tabs'

const OrgProfilePage: React.FC = () => {
    const handleSave = () => {
        console.log('Save changes')
    }

    const tabs: Array<TabItem> = [
        {
            id: 'general',
            label: 'General',
            content: (
                <div className="p-5 md:p-6">
                    <OrgProfileForm onSave={handleSave} />
                </div>
            ),
        },
        {
            id: 'api-keys',
            label: 'API keys',
            content: (
                <div className="p-5 md:p-6">
                    <ApiKeysTab />
                </div>
            ),
        },
    ]

    return (
        <div className={clsx('p-4 md:p-6 lg:p-8')}>
            <OrgHeader />

            <div className="flex flex-col gap-[24px] items-start mt-6 w-full">
                <Tabs
                    tabs={tabs}
                    defaultActiveTab="general"
                    tabsClassName={clsx('border-b border-[#1B456F] w-full')}
                />
            </div>
        </div>
    )
}

export default OrgProfilePage
