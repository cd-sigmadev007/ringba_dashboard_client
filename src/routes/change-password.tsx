/**
 * Change Password Route
 * Handles password reset with token from email
 */

import { createRoute } from '@tanstack/react-router'
import type { RootRoute } from '@tanstack/react-router'
import { ChangePasswordPage } from '../modules/auth'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/change-password',
        component: ChangePasswordPage,
        validateSearch: (search: Record<string, unknown>) => {
            return {
                token: (search.token as string) || '',
            }
        },
        getParentRoute: () => parentRoute,
    })

