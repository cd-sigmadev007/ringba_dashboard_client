import { createRoute } from '@tanstack/react-router'
import VisualizerPage from '../modules/visualizer/pages/VisualizerPage'
import type { RootRoute } from '@tanstack/react-router'

export default (parentRoute: RootRoute) =>
    createRoute({
        path: '/visualizer',
        component: VisualizerPage,
        getParentRoute: () => parentRoute,
    })
