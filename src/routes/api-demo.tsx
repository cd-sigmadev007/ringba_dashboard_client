import { createRoute } from '@tanstack/react-router'
import type { RootRoute } from '@tanstack/react-router'
import { ApiDataDemo } from '@/modules/caller-analysis/components'

function ApiDemoPage() {
  return (
    <div className="m-6">
     <ApiDataDemo />
    </div>
  )
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: '/api-demo',
    component: ApiDemoPage,
    getParentRoute: () => parentRoute,
  })
