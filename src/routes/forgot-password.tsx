/**
 * Forgot Password Route
 */

import { createRoute } from '@tanstack/react-router'
import type { RootRoute } from '@tanstack/react-router'
import { ForgotPasswordPage } from '../modules/auth'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/forgot-password',
        component: ForgotPasswordPage,
        getParentRoute: () => parentRoute,
    })

