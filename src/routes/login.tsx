import { createRoute } from '@tanstack/react-router'
import LoginPage from '../modules/auth/pages/LoginPage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/login',
        component: LoginPage,
        getParentRoute: () => parentRoute,
    })
