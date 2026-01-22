import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useResetTokenValidate } from '../hooks'
import { authApi } from '../services/authApi'
import { ResetPasswordForm } from '../components'

export const ResetPasswordContainer: React.FC = () => {
    const navigate = useNavigate()
    const { token, tokenValid } = useResetTokenValidate()

    const handleSubmit = async (newPassword: string) => {
        await authApi.resetPassword(token, newPassword)
        navigate({ to: '/password-changed' })
    }

    return <ResetPasswordForm tokenValid={tokenValid} onSubmit={handleSubmit} />
}
