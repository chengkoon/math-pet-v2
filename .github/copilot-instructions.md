# GitHub Copilot Instructions for math-pet-v2 Frontend

## 🚨 CRITICAL: Project Tech Stack Overview

**ALWAYS CHECK THIS FIRST** to avoid implementation u-turns and wrong assumptions:

### Core Framework & Versions
- **Next.js 15.5.2** (latest) with App Router architecture
- **React 19.1.0** (latest stable)
- **TypeScript 5.x** with strict configuration
- **Tailwind CSS v4.x** ⚠️ (Uses new `@import 'tailwindcss'` syntax, NOT `@tailwind base/components/utilities`)
- **Turbopack** enabled for dev/build (faster bundling)

### State & Data Management
- **Zustand 5.x** for global state management
- **TanStack Query 5.x** for server state and caching
- **Axios** for HTTP requests
- **@chengkoon/mathpet-api-types** for backend type definitions

### Styling & Theming
- **Tailwind CSS v4** ⚠️ Important differences:
  - Uses `@import 'tailwindcss'` (not `@tailwind` directives)
  - Use `darkMode: 'class'` for next-themes compatibility
  - NO CSS variables system - use standard Tailwind dark: prefixes
- **next-themes** for theme switching (light/dark/system)
- **lucide-react** for icons
- **class-variance-authority** + **clsx** + **tailwind-merge** for conditional styling

### Development & Testing Stack
- **ESLint 9.x** with flat config (eslint.config.mjs)
- **Prettier 3.x** with Tailwind plugin for class sorting
- **Playwright** for E2E testing (not Jest/Vitest for E2E)
- **Vitest** available but not configured yet
- **Husky** for git hooks (not configured yet)
- **Conventional commits** setup (commitlint installed but not configured)

### Build & Deployment
- **Turbopack** for fast development and builds
- Standard Next.js production build process
- TypeScript strict mode with enhanced checks

---

## 🎯 Implementation Guidelines

### 1. Tailwind CSS v4 - CRITICAL DIFFERENCES

**❌ DON'T USE (v3 syntax):**
```css
@tailwind base;
@tailwind components; 
@tailwind utilities;
```

**✅ DO USE (v4 syntax):**
```css
@import 'tailwindcss';
```

**❌ DON'T USE complex CSS variables:**
```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}
```

**✅ DO USE standard Tailwind classes:**
```tsx
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
```

### 2. Next-themes Integration

**✅ Correct Setup:**
```tsx
// layout.tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>

// tailwind.config.js
export default {
  darkMode: 'class', // NOT 'selector' or 'media'
  // ...
}
```

### 3. API Types - ALWAYS USE PUBLISHED PACKAGE

**✅ FIRST PRIORITY - Use published types:**
```tsx
import { PagedPaperQuestionResponse } from '@chengkoon/mathpet-api-types';
```

**❌ DON'T CREATE if already exists in published package**

**✅ ONLY CREATE local types for UI-specific needs:**
```tsx
// src/types/ui.ts - UI-only types
interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
}
```

### 4. Component Architecture

**✅ Atomic Design Pattern:**
```
src/components/
├── ui/           # Atoms (buttons, inputs)
├── features/     # Molecules (form fields, cards)  
├── layouts/      # Organisms (navigation, sections)
└── providers/    # Context providers
```

**✅ File Naming:**
```
ComponentName.tsx     # PascalCase for components
useCustomHook.ts      # camelCase for hooks
types.ts              # lowercase for utilities
```

### 5. State Management Patterns

**✅ Zustand Store Pattern:**
```tsx
export const useAppStore = create<AppStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

**✅ TanStack Query Pattern:**
```tsx
export const useQuestions = (page = 0) => {
  return useQuery({
    queryKey: ['questions', page],
    queryFn: () => questionsApi.getStudentQuestions(page),
  });
};
```

### 6. Anti-Patterns Prevention

**❌ NEVER do these (causes infinite loops):**
```tsx
const { showToast } = useToast();
const { storeFunction } = useStore();

useEffect(() => {
  // Logic here
}, [showToast, storeFunction]); // ❌ Functions in dependencies
```

**✅ Correct approach:**
```tsx
useEffect(() => {
  if (condition) showToast('Message');
}, [condition]); // ✅ Only primitive dependencies
```

### 7. Testing Strategy

**✅ Current Setup:**
- **Playwright** for E2E testing (working)
- **Vitest** available for unit tests (not configured)
- Tests in `/tests/` directory

**✅ Playwright Test Pattern:**
```tsx
test('should work correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-testid="element"]')).toBeVisible();
});
```

---

## 🔧 Configuration Files Analysis & Improvements

### Current Config Status

**✅ Well Configured:**
- `package.json` - Good scripts, latest dependencies
- `tsconfig.json` - Strict TypeScript with good compiler options
- `next.config.ts` - Basic but functional
- `tailwind.config.js` - Now correctly simplified for v4
- `prettier.config.mjs` - Good formatting with Tailwind plugin
- `playwright.config.ts` - Comprehensive E2E setup

**⚠️ Needs Setup (Available but not configured):**
- `vitest.config.ts` - Missing (Vitest installed but no config)
- `.husky/` - Missing (Husky installed but no hooks)
- `commitlint.config.js` - Missing (Dependencies installed)
- `lint-staged.config.js` - Missing (Dependency installed)

### Recommended Missing Configurations

**1. Vitest Configuration (vitest.config.ts):**
```typescript
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
```

**2. Husky Git Hooks (.husky/pre-commit):**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx lint-staged
```

**3. Lint Staged (package.json addition):**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

**4. Commitlint (.commitlintrc.json):**
```json
{
  "extends": ["@commitlint/config-conventional"]
}
```

---

## 🚀 Development Workflow

### Before Making Changes:
1. **Check this file first** - understand the exact tech stack
2. **Verify Tailwind version** - use v4 syntax
3. **Check existing API types** - use published package first
4. **Follow established patterns** - don't reinvent

### During Development:
1. **Use TypeScript strictly** - no `any` types
2. **Follow Next.js App Router patterns**
3. **Use Zustand for client state**, **TanStack Query for server state**
4. **Standard Tailwind classes** - no CSS variables
5. **Test with Playwright** for E2E scenarios

### Key Commands:
```bash
npm run dev          # Development with Turbopack
npm run build        # Production build with Turbopack  
npm run lint         # ESLint check
npm run format       # Prettier formatting
npm run test:e2e     # Playwright E2E tests
npm run type-check   # TypeScript validation
```

---

## 📋 Quick Reference Checklist

**Before implementing any feature:**
- [ ] Using Tailwind v4 syntax (`@import 'tailwindcss'`)
- [ ] Checking `@chengkoon/mathpet-api-types` for existing types
- [ ] Using `darkMode: 'class'` for theming
- [ ] Following Zustand/TanStack Query patterns
- [ ] No function dependencies in useEffect
- [ ] TypeScript strict mode compliance
- [ ] Next.js App Router architecture

**This prevents u-turns and ensures consistent, modern code that works with your exact tech stack.**

---

Code Quality & Architecture:

- TypeScript-first - Strict typing, no any types, proper interfaces
- Component-driven - Reusable, single-responsibility components
- DRY yet readable - Abstract smartly but prioritize clarity
- Consistent patterns - Standardized folder structure, naming conventions
- Clean imports - Use absolute paths (@/components), organized import order

Performance & UX:

- Mobile-first responsive - Works seamlessly on all device sizes
- Core Web Vitals optimized - Fast LCP, minimal CLS, good FID
- Lazy loading - Code splitting, image optimization, route-based chunks
- Accessibility-first - WCAG compliance, semantic HTML, keyboard navigation
- Progressive enhancement - Works without JS, enhances with it

Developer Experience:

- Modern testing stack - Vitest for faster, ESM-native testing over Jest
- Comprehensive test coverage - Unit, integration, E2E across the application
- Hot reload friendly - Fast development feedback loop
- Lint & format on save - ESLint, Prettier, consistent code style
- Type-safe APIs - Proper data fetching with validation (Zod)
- Git hooks - Pre-commit linting, testing, conventional commits

Modern Best Practices:

- Server-first thinking - Leverage SSR/SSG when beneficial
- Error boundaries - Graceful error handling and recovery
- Loading states - Skeleton screens, optimistic updates
- SEO optimized - Meta tags, structured data, social sharing
- Bundle size conscious - Tree shaking, analyze bundle impact

Maintainability:

- Self-documenting code - Clear variable/function names, minimal comments
- Storybook ready - Components work in isolation
- Environment agnostic - Easy local dev, staging, production deploys
- Monorepo friendly - If applicable, clean package boundaries
