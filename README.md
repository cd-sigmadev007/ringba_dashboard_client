# Ringba - Call Analytics Platform

A modern call analytics platform built with React, TypeScript, and a modular architecture.

## 🏗️ Architecture Overview

This project follows a **modular architecture** pattern where each feature is organized as an independent module. This approach promotes maintainability, reusability, and scalability.

### 📁 Project Structure

```
ringba/
├── src/
│   ├── assets/                 # Global assets (SVG icons, images)
│   ├── components/             # Shared UI components
│   │   ├── common/            # Common components (Search, Tooltip)
│   │   └── ui/                # UI library components
│   ├── layout/                # App layout components
│   ├── lib/                   # Utilities, hooks, types
│   ├── modules/               # Feature modules (independent)
│   │   └── caller-analysis/   # Example module
│   ├── routes/                # Route definitions
│   ├── store/                 # Global state management
│   └── styles/                # Global styles
└── ...
```

## 🧩 Module Architecture

Each module follows a consistent structure for maintainability and developer experience:

### Module Structure Template

```
modules/[module-name]/
├── components/        # Reusable UI components specific to this module
├── containers/        # Container components (business logic)
├── hooks/            # Custom hooks for state and logic
├── pages/            # Page-level components
├── data/             # Mock data, constants, API calls
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
└── index.ts          # Module exports
```

### 📋 Example: Caller Analysis Module

```
modules/caller-analysis/
├── components/
│   ├── StatusBadge.tsx      # Status indicator component
│   ├── CampaignIcons.tsx    # Campaign type indicators
│   ├── FilterPills.tsx      # Applied filter pills
│   ├── FiltersSection.tsx   # Filter controls section
│   └── index.ts
├── containers/
│   ├── CallerAnalysisContainer.tsx  # Main container
│   └── index.ts
├── hooks/
│   ├── useCallerAnalysis.ts         # State management hook
│   ├── useTableColumns.tsx          # Table configuration hook
│   └── index.ts
├── pages/
│   ├── CallerAnalysisPage.tsx       # Page component with routing
│   └── index.ts
├── data/
│   └── mockData.ts                  # Call data and filter options
├── utils/
│   └── filterUtils.ts               # Filtering logic functions
├── types/
│   └── index.ts                     # Module-specific types
└── index.ts                         # Main module exports
```

## 🎯 Module Guidelines

### 1. **Component Organization**

- **Components**: Reusable UI components with single responsibility
- **Containers**: Business logic and state management
- **Pages**: Route-level components that compose containers

### 2. **State Management**

- Use custom hooks for complex state logic
- Keep state close to where it's used
- Extract reusable logic into custom hooks

### 3. **Type Safety**

- Define module-specific types in `types/index.ts`
- Export types for external consumption
- Use TypeScript strictly throughout

### 4. **Data Layer**

- Keep mock data and constants in `data/`
- Separate API calls and data fetching logic
- Export data for testing and development

### 5. **Utilities**

- Pure functions for business logic
- No side effects in utility functions
- Comprehensive unit test coverage

## 🚀 Getting Started

### Adding a New Module

1. **Create module directory structure**:
   ```bash
   mkdir -p src/modules/[module-name]/{components,containers,hooks,pages,data,utils,types}
   ```

2. **Create index files**:
   ```bash
   touch src/modules/[module-name]/{components,containers,hooks,pages}/index.ts
   touch src/modules/[module-name]/index.ts
   ```

3. **Follow the established patterns**:
   - Use the caller-analysis module as a reference
   - Maintain consistent naming conventions
   - Export everything through index files

### Development Workflow

1. **Start with types**: Define your data structures
2. **Create utilities**: Pure functions for business logic
3. **Build components**: Start with simple UI components
4. **Add state management**: Custom hooks for complex logic
5. **Compose containers**: Combine components with business logic
6. **Create pages**: Route-level components

## 🧪 Testing Strategy

### Component Testing
- Test components in isolation
- Mock external dependencies
- Focus on user interactions

### Hook Testing
- Test custom hooks with `@testing-library/react-hooks`
- Verify state changes and side effects
- Mock external dependencies

### Utility Testing
- Unit test pure functions
- Test edge cases and error handling
- Maintain high coverage

## 📦 Dependencies

### Core Dependencies
- **React 18**: UI library
- **TypeScript**: Type safety
- **TanStack Router**: Routing
- **TanStack Table**: Data tables
- **Tailwind CSS**: Styling
- **Day.js**: Date manipulation
- **Zustand**: State management

### Development Dependencies
- **Vite**: Build tool
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 🎨 Styling Guidelines

- Use Tailwind CSS for styling
- Maintain consistent color schemes
- Support dark/light themes
- Follow responsive design principles

## 🔄 State Management

- **Global State**: Zustand for app-wide state (theme, user)
- **Local State**: React hooks for component state
- **Server State**: TanStack Query for data fetching

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint consistency
- Touch-friendly interfaces
- Accessible design patterns

## 🚦 Code Quality

- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier for consistent formatting
- **Type Checking**: Strict TypeScript configuration
- **Code Reviews**: Required for all changes

## 📈 Performance

- **Code Splitting**: Lazy loading for routes
- **Memoization**: React.memo and useMemo where appropriate
- **Bundle Analysis**: Regular bundle size monitoring
- **Lighthouse Scores**: Maintain high performance scores

## 🔐 Security

- **Type Safety**: Prevent runtime errors
- **Input Validation**: Validate all user inputs
- **Dependency Updates**: Regular security updates
- **Code Reviews**: Security-focused reviews

## 📚 Documentation

- **Component Documentation**: JSDoc for complex components
- **Type Documentation**: Comprehensive type definitions
- **README Updates**: Keep documentation current
- **Code Comments**: Explain complex business logic

## 🤝 Contributing

1. Follow the modular architecture patterns
2. Maintain consistent code style
3. Add comprehensive tests
4. Update documentation
5. Follow semantic versioning

## 📝 License

This project is proprietary and confidential.

---

**Happy Coding! 🚀**