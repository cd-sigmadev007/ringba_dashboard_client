import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import toast from 'react-hot-toast'
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
        try {
            await verifyLoginOtp({ email, otp, remember })
            try {
                sessionStorage.removeItem('loginOtpEmail')
                sessionStorage.removeItem('loginRemember')
            } catch (_) {}
            toast.success('Login successful')
            navigate({ to: '/device-registration-success' })
        } catch (err: any) {
            const errorMessage =
                error ||
                err?.message ||
                'Invalid verification code. Please try again.'
            toast.error(errorMessage)
        }
    }

    const handleResend = async () => {
        try {
            await authApi.requestOtp(email, 'login')
            toast.success('Verification code sent to your email')
        } catch (err: any) {
            toast.error('Failed to send verification code. Please try again.')
        }
    }

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
            clearError={clearError}
        />
    )
}
