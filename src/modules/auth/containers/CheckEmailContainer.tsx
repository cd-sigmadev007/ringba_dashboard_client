import React from 'react'
import { CheckEmailView } from '../components'

export const CheckEmailContainer: React.FC = () => {
    const email =
        typeof window !== 'undefined'
            ? sessionStorage.getItem('forgotPasswordEmail') || ''
            : ''
    return <CheckEmailView email={email} />
}
