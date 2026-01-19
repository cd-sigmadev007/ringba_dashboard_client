import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { authApi } from '../services/authApi'
import { LoginOtpForm } from '../components'
import { useAuth } from '@/contexts/AuthContext'

export const LoginOtpContainer: React.FC = () => {
    const navigate = useNavigate()
    const { verifyLoginOtp, logout, error, clearError } = useAuth()

    const email =
        (typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('email')
            : null) ||
        (typeof window !== 'undefined'
            ? sessionStorage.getItem('loginOtpEmail')
            : null) ||
        ''

    const remember =
        typeof window !== 'undefined' &&
        sessionStorage.getItem('loginRemember') === 'true'

    const handleSubmit = async (otp: string) => {
        await verifyLoginOtp({ email, otp, remember })
        try {
            sessionStorage.removeItem('loginOtpEmail')
            sessionStorage.removeItem('loginRemember')
        } catch (_) {}
        navigate({ to: '/device-registration-success' })
    }

    const handleResend = () => authApi.requestOtp(email, 'login')

    const handleLogout = async () => {
        try {
            sessionStorage.removeItem('loginOtpEmail')
            sessionStorage.removeItem('loginRemember')
        } catch (_) {}
        await logout()
        navigate({ to: '/login' })
    }

    return (
        <LoginOtpForm
            email={email}
            onSubmit={handleSubmit}
            onResend={handleResend}
            onLogout={handleLogout}
            error={error}
            clearError={clearError}
        />
    )
}
