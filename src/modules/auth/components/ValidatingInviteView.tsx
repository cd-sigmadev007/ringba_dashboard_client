import React from 'react'
import { AuthCard } from './AuthCard'

export const ValidatingInviteView: React.FC = () => {
    return (
        <AuthCard>
            <div className="p-6 sm:p-8 text-center text-[#A1A5B7]">
                Validating invitation...
            </div>
        </AuthCard>
    )
}
