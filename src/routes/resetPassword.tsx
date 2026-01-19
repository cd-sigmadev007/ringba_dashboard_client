import { createRoute } from '@tanstack/react-router'
import ResetPasswordPage from '../modules/auth/pages/ResetPasswordPage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/reset-password',
        component: ResetPasswordPage,
        getParentRoute: () => parentRoute,
    })
