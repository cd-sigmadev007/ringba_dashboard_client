import React from 'react'
import clsx from 'clsx'
import OrgHeader from '../components/OrgHeader'
import OrgProfileForm from '../components/OrgForm'

const OrgProfilePage: React.FC = () => {
    const handleSave = () => {
        console.log('Save changes')
    }
    return (
        <div className={clsx('p-4 md:p-6 lg:p-8')}>
            <OrgHeader />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Left column: forms */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-5 md:p-6">
                        <OrgProfileForm onSave={handleSave} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrgProfilePage
