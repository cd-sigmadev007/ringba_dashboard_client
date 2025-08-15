import React from 'react'
import { createRoute } from '@tanstack/react-router'
import type { RootRoute } from '@tanstack/react-router'
import { CallerAnalysisContainer } from '@/modules'

const CallerAnalysisPage: React.FC = () => {
    return <CallerAnalysisContainer />
}

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/caller-analysis',
        component: CallerAnalysisPage,
        getParentRoute: () => parentRoute,
    })

export { CallerAnalysisPage }
