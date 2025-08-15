# Ringba Project Structure

This document outlines the modern TypeScript project structure implemented for the Ringba application.

## 📁 Directory Structure

```
src/
├── components/           # React components organized by type
│   ├── ui/              # Base UI components (Button, Input, Modal)
│   ├── common/          # Common/shared components (Search, etc.)
│   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   └── index.ts         # Component barrel exports
├── lib/                 # Shared utilities and configurations
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── hooks/           # Custom React hooks
│   ├── constants/       # Application constants
│   └── index.ts         # Library barrel exports
├── store/               # State management (Zustand stores)
├── assets/              # Static assets
│   ├── icons/           # SVG icons
│   └── images/          # Image files
├── styles/              # Global styles and CSS files
├── routes/              # Application routes (TanStack Router)
├── features/            # Feature-specific components and logic
├── pages/               # Page components
└── providers/           # React context providers
```

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**

- **UI Components**: Pure, reusable components in `components/ui/`
- **Business Logic**: Feature-specific logic in `features/`
- **Utilities**: Pure functions in `lib/utils/`
- **State Management**: Centralized stores in `store/`

### 2. **TypeScript-First Approach**

- Strict TypeScript configuration with latest standards
- Comprehensive type definitions in `lib/types/`
- Type-safe component props with proper interfaces
- Path mapping for clean imports using `@/` prefix

### 3. **Modern React Patterns**

- Functional components with hooks
- forwardRef for proper component composition
- Compound components pattern for complex UI elements
- Custom hooks for shared logic

### 4. **Design System Approach**

- Consistent component variants using `class-variance-authority`
- Design tokens and constants in `lib/constants/`
- Reusable utility functions with `tailwind-merge`

## 🧩 Component Structure

### UI Components (`components/ui/`)

Base UI components following atomic design principles:

```typescript
// Example: Button component
interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
    loading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}
```

**Features:**

- **Variants**: Using `class-variance-authority` for type-safe styling variants
- **Composition**: Support for `asChild` prop using Radix UI Slot
- **Accessibility**: Built-in ARIA attributes and keyboard navigation
- **Loading States**: Integrated loading spinners and disabled states

### Common Components (`components/common/`)

Shared components that combine multiple UI elements:

```typescript
// Example: Search component
interface SearchProps {
    isWhite?: boolean
    className?: string
    placeholder?: string
    onSearch?: (query: string) => void
}
```

## 🛠️ Utility Libraries

### Type Definitions (`lib/types/`)

Comprehensive TypeScript types:

```typescript
// Base component interface
interface BaseComponent {
    className?: string
    children?: React.ReactNode
}

// Theme types
type Theme = 'light' | 'dark'

// API response types
interface ApiResponse<T = any> {
    data: T
    message?: string
    status: 'success' | 'error'
}
```

### Utility Functions (`lib/utils/`)

Reusable utility functions:

- **`cn()`**: Tailwind CSS class merging with `clsx` and `tailwind-merge`
- **Format utilities**: Address formatting, number formatting, date formatting
- **Validation utilities**: Email, URL, password validation
- **General utilities**: Debounce, throttle, deep clone, etc.

### Custom Hooks (`lib/hooks/`)

Reusable React hooks:

- **`useLocalStorage()`**: Type-safe localStorage management
- **`useDebounce()`**: Debouncing values and callbacks
- **`useClickOutside()`**: Click outside detection for modals/dropdowns

## 🎨 Styling Strategy

### CSS Architecture

- **Global styles**: Base styles and theme variables in `styles/index.css`
- **Component styles**: Tailwind utility classes with variants
- **Theme system**: CSS custom properties for dark/light mode

### Theme Implementation

```typescript
// Theme store with persistence
const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'light',
            toggleTheme: () => {
                /* implementation */
            },
            setTheme: (theme) => {
                /* implementation */
            },
        }),
        { name: 'ringba-theme' }
    )
)
```

## 📦 Import Strategy

### Path Mapping

```json
{
    "paths": {
        "@/*": ["./src/*"],
        "@/components/*": ["./src/components/*"],
        "@/lib/*": ["./src/lib/*"],
        "@/store/*": ["./src/store/*"]
    }
}
```

### Barrel Exports

```typescript
// components/index.ts
export * from './ui'
export * from './common'

// lib/index.ts
export * from './types'
export * from './utils'
export * from './hooks'
export * from './constants'
```

## 🔧 Development Workflow

### Scripts

```json
{
    "dev": "vite --port 3000",
    "build": "vite build && tsc",
    "lint": "eslint",
    "format": "prettier",
    "check": "prettier --write . && eslint --fix"
}
```

### Code Quality

- **ESLint**: Strict linting rules with TanStack config
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict mode with comprehensive type checking

## 🚀 Best Practices

### Component Development

1. **Start with types**: Define interfaces before implementation
2. **Use variants**: Leverage `class-variance-authority` for styling
3. **Compose components**: Use `asChild` pattern for flexibility
4. **Document props**: Comprehensive JSDoc comments

### State Management

1. **Keep stores focused**: Single responsibility principle
2. **Use persistence**: Zustand persist middleware for user preferences
3. **Type everything**: Strict TypeScript interfaces for store state

### Performance

1. **Lazy loading**: Dynamic imports for route-based code splitting
2. **Memoization**: React.memo and useMemo for expensive operations
3. **Debouncing**: Custom hooks for API calls and search

### Accessibility

1. **Semantic HTML**: Proper HTML elements and ARIA attributes
2. **Keyboard navigation**: Tab order and keyboard event handling
3. **Screen readers**: Descriptive labels and announcements

## 📚 Dependencies

### Core Libraries

- **React 19**: Latest React with new features
- **TypeScript 5.7**: Latest TypeScript with strict configuration
- **TanStack Router**: Type-safe routing
- **Zustand**: Lightweight state management
- **Tailwind CSS 4**: Utility-first CSS framework

### Development Tools

- **Vite**: Fast build tool and dev server
- **ESLint**: Code linting with TanStack config
- **Prettier**: Code formatting
- **Vitest**: Testing framework

### Component Libraries

- **class-variance-authority**: Type-safe variant generation
- **@radix-ui/react-slot**: Component composition
- **clsx**: Conditional class name utility
- **tailwind-merge**: Tailwind CSS class merging

This structure provides a solid foundation for scalable React application development with modern TypeScript patterns and best practices.
