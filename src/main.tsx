import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import TableDemo from './routes/demo.table.tsx'
import TanStackQueryDemo from './routes/demo.tanstack-query.tsx'
import CallerAnalysis from './routes/caller-analysis.tsx'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

import './styles.css'
import './styles/index.css';
import './styles/card.css';
import './styles/buttons.css';
import './styles/input.css';
import './styles/table.css';
import './styles/pagination.css';

import reportWebVitals from './reportWebVitals.ts'

import App from './App.tsx'
import RootLayout from './routes/root-layout.tsx'

// Initialize theme on app startup
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.classList.add(savedTheme === 'dark' ? 'theme-dark' : 'theme-light');

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  TableDemo(rootRoute),
  TanStackQueryDemo(rootRoute),
  CallerAnalysis(rootRoute),
])

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <RouterProvider router={router} />
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
