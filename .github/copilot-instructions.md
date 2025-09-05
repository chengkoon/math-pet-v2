# GitHub Copilot Instructions for math-pet-v2 Frontend

Code Quality & Architecture:
* TypeScript-first - Strict typing, no any types, proper interfaces
* Component-driven - Reusable, single-responsibility components
* DRY yet readable - Abstract smartly but prioritize clarity
* Consistent patterns - Standardized folder structure, naming conventions
* Clean imports - Use absolute paths (@/components), organized import order

Performance & UX:
* Mobile-first responsive - Works seamlessly on all device sizes
* Core Web Vitals optimized - Fast LCP, minimal CLS, good FID
* Lazy loading - Code splitting, image optimization, route-based chunks
* Accessibility-first - WCAG compliance, semantic HTML, keyboard navigation
* Progressive enhancement - Works without JS, enhances with it

Developer Experience:
* Modern testing stack - Vitest for faster, ESM-native testing over Jest
* Comprehensive test coverage - Unit, integration, E2E across the application
* Hot reload friendly - Fast development feedback loop
* Lint & format on save - ESLint, Prettier, consistent code style
* Type-safe APIs - Proper data fetching with validation (Zod)
* Git hooks - Pre-commit linting, testing, conventional commits

Modern Best Practices:
* Server-first thinking - Leverage SSR/SSG when beneficial
* Error boundaries - Graceful error handling and recovery
* Loading states - Skeleton screens, optimistic updates
* SEO optimized - Meta tags, structured data, social sharing
* Bundle size conscious - Tree shaking, analyze bundle impact

Maintainability:
* Self-documenting code - Clear variable/function names, minimal comments
* Storybook ready - Components work in isolation
* Environment agnostic - Easy local dev, staging, production deploys
* Monorepo friendly - If applicable, clean package boundaries