import { createRoute } from '@tanstack/react-router'
import UsersPage from '../modules/org/pages/UsersPage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/organization/users',
        component: UsersPage,
        getParentRoute: () => parentRoute,
    })
