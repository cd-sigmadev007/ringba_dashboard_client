import { createRoute } from '@tanstack/react-router'
import PasswordChangedPage from '../modules/auth/pages/PasswordChangedPage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/password-changed',
        component: PasswordChangedPage,
        getParentRoute: () => parentRoute,
    })
