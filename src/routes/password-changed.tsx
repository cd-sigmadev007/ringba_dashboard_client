/**
 * Password Changed Route
 * Success page after password reset
 */

import { createRoute } from '@tanstack/react-router'
import { PasswordChangedPage } from '../modules/auth'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/password-changed',
        component: PasswordChangedPage,
        getParentRoute: () => parentRoute,
    })
