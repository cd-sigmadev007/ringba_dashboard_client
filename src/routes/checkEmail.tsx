import { createRoute } from '@tanstack/react-router'
import CheckEmailPage from '../modules/auth/pages/CheckEmailPage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/check-email',
        component: CheckEmailPage,
        getParentRoute: () => parentRoute,
    })
