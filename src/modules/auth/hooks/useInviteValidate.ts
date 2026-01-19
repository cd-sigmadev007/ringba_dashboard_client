import { useEffect, useState } from 'react'
import { authApi } from '../services/authApi'

/**
 * Validates an invite token from the URL path and returns email when valid.
 * /invite/:token
 */
export function useInviteValidate() {
    const token =
        typeof window !== 'undefined'
            ? (window.location.pathname.match(/^\/invite\/([^/]+)/)?.[1] ?? '')
            : ''

    const [validating, setValidating] = useState(true)
    const [invalid, setInvalid] = useState(false)
    const [email, setEmail] = useState('')

    useEffect(() => {
        if (!token) {
            setValidating(false)
            setInvalid(true)
            return
        }
        authApi
            .validateInvite(token)
            .then((data) => {
                setEmail(data?.email ?? '')
                setValidating(false)
            })
            .catch(() => {
                setValidating(false)
                setInvalid(true)
            })
    }, [token])

    return { token, validating, invalid, email }
}
