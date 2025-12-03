/**
 * Login Route
 * Custom login page matching Figma design
 */

import { createRoute } from '@tanstack/react-router'
import type { RootRoute } from '@tanstack/react-router'
import { LoginPage } from '../modules/auth'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/login',
        component: LoginPage,
        getParentRoute: () => parentRoute,
    })

