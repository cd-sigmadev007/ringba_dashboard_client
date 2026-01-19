import { createRoute } from '@tanstack/react-router'
import LoginOtpPage from '../modules/auth/pages/LoginOtpPage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/login-otp',
        component: LoginOtpPage,
        getParentRoute: () => parentRoute,
    })
