import { createRoute } from '@tanstack/react-router'
import type { RootRoute } from '@tanstack/react-router'
import { CallerAnalysisContainerReal } from '@/modules/caller-analysis/components'

export default (parentRoute: RootRoute) =>
  createRoute({
    path: '/caller-analysis-real',
    component: CallerAnalysisContainerReal,
    getParentRoute: () => parentRoute,
  })
