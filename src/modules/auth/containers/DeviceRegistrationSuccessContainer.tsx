import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { DeviceRegistrationSuccessView } from '../components'

export const DeviceRegistrationSuccessContainer: React.FC = () => {
    const navigate = useNavigate()

    return (
        <DeviceRegistrationSuccessView
            onContinue={() => navigate({ to: '/caller-analysis' })}
        />
    )
}
