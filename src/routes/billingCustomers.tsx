import { createRoute } from '@tanstack/react-router'
import CustomersPage from '../modules/billing/pages/CustomersPage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/billing/customers',
        component: CustomersPage,
        getParentRoute: () => parentRoute,
    })

