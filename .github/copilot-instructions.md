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
- **Zustand 5.x** for client state management (UI state, user preferences, temporary data)
- **TanStack Query 5.x** for server state management (API calls, caching, synchronization)
- **Axios** for HTTP requests
- **React Hook Form + Zod** for form handling with validation
- **@chengkoon/mathpet-api-types** for backend type definitions

### UI Components & Styling
- **Tailwind CSS v4** ⚠️ Important differences:
  - Uses `@import 'tailwindcss'` (not `@tailwind` directives)
  - Use `darkMode: 'class'` for next-themes compatibility
  - NO CSS variables system - use standard Tailwind dark: prefixes
- **next-themes** for theme switching (light/dark/system)
- **lucide-react** for icons
- **class-variance-authority** + **clsx** + **tailwind-merge** for conditional styling
- **shadcn/ui** available (copy-paste component system built on Radix UI)
- **Radix UI** or **Headless UI** for accessible primitives (when using shadcn/ui)

### Testing Strategy
- **Playwright** for both E2E and component testing (unified testing approach)
- **Vitest** for unit testing (preferred over Jest for modern ESM-native testing)
- Test files in `/tests/` directory

### Development & Quality Tools
- **ESLint 9.x** with flat config (eslint.config.mjs)
- **Prettier 3.x** with Tailwind plugin for class sorting
- **Husky** for git hooks (not configured yet)
- **Conventional commits** setup (commitlint installed but not configured)

### Build & Deployment
- **Turbopack** for fast development and builds
- Standard Next.js production build process
- TypeScript strict mode with enhanced checks

---

## 🎯 Implementation Guidelines

### 1. State Management Separation - CRITICAL UNDERSTANDING

**✅ Use Zustand for CLIENT STATE:**
```tsx
// src/store/useAppStore.ts
export const useAppStore = create<AppStore>((set) => ({
  sidebarOpen: false,
  theme: 'dark',
  userPreferences: {},
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }))
}));
```

**✅ Use TanStack Query for SERVER STATE:**
```tsx
// src/hooks/useQuestions.ts
export const useQuestions = (page = 0) => {
  return useQuery({
    queryKey: ['questions', page],
    queryFn: () => questionsApi.getStudentQuestions(page),
  });
};
```

**❌ DON'T mix server data in Zustand or client state in TanStack Query**

### 2. Tailwind CSS v4 - CRITICAL DIFFERENCES

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

### 3. Next.js Middleware for Authentication

**✅ Use Next.js Middleware for route protection:**
```tsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}
```

### 4. Next-themes Integration

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

### 5. API Types - ALWAYS USE PUBLISHED PACKAGE

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

### 6. Component Architecture

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

### 7. shadcn/ui Integration - CRITICAL PRIORITY

**🚨 ALWAYS USE shadcn/ui COMPONENTS FIRST - DO NOT CREATE CUSTOM UI COMPONENTS**

**✅ COMPLETE LIST of Available shadcn/ui Components (as of 2025):**

**Basic UI Elements:**
- `accordion` - Collapsible content sections
- `alert` - Alert messages and notifications
- `alert-dialog` - Modal dialogs for confirmations
- `avatar` - User profile pictures and initials
- `badge` - Small status indicators and labels
- `breadcrumb` - Navigation breadcrumbs
- `button` - Interactive buttons with variants
- `card` - Content containers with optional header/footer
- `separator` - Visual dividers between content
- `skeleton` - Loading placeholders
- `typography` - Text styling utilities

**Form Components:**
- `checkbox` - Checkboxes for multiple selections
- `form` - React Hook Form integration
- `input` - Text input fields
- `input-otp` - One-time password input
- `label` - Form field labels
- `radio-group` - Radio button groups
- `select` - Dropdown select menus
- `slider` - Range sliders
- `switch` - Toggle switches
- `textarea` - Multi-line text input
- `toggle` - Toggle buttons
- `toggle-group` - Toggle button groups

**Navigation & Menus:**
- `combobox` - Searchable select component
- `command` - Command palette interface
- `context-menu` - Right-click context menus
- `dropdown-menu` - Dropdown action menus
- `hover-card` - Content shown on hover
- `menubar` - Application menu bar
- `navigation-menu` - Complex navigation with dropdowns
- `pagination` - Page navigation controls
- `sidebar` - Application sidebar navigation
- `tabs` - Tabbed content interface

**Overlays & Modals:**
- `dialog` - Modal dialogs
- `drawer` - Slide-out panels
- `popover` - Floating content containers
- `sheet` - Sliding panels from screen edges
- `tooltip` - Helpful text on hover

**Data Display:**
- `aspect-ratio` - Maintain aspect ratios
- `calendar` - Date selection calendar
- `carousel` - Image/content carousels
- `chart` - Data visualization charts
- `collapsible` - Collapsible content areas
- `data-table` - Feature-rich data tables
- `date-picker` - Date selection input
- `progress` - Progress indicators
- `resizable` - Resizable panels
- `scroll-area` - Custom scrollable areas
- `table` - Basic data tables

**Notifications:**
- `sonner` - **PREFERRED** toast notifications (modern)
- `toast` - **DEPRECATED** - use Sonner instead

**❌ NEVER CREATE custom UI components if shadcn/ui equivalent exists:**
```tsx
// ❌ DON'T DO THIS - create custom toast
function CustomToast() { /* custom implementation */ }

// ✅ DO THIS - use shadcn/ui
import { toast } from 'sonner';
toast.success('Message');
```

# Always check available components first
npx shadcn@latest add --help

# Install the component you need
npx shadcn@latest add [component-name]

# Use Sonner for toasts (toast component is deprecated)
npx shadcn@latest add sonner

**✅ shadcn/ui is copy-paste, not npm install - components go in src/components/ui/**

✅ Integration with project patterns:

shadcn/ui components work seamlessly with Tailwind CSS v4
Built on Radix UI for accessibility compliance
TypeScript-first with proper interfaces
Supports dark mode via next-themes automatically

⚠️ ONLY create custom components for:

Business logic components (features/)
Layout components (layouts/)
Components that combine multiple shadcn/ui components
Project-specific functionality not covered by shadcn/ui

### 8. Anti-Patterns Prevention

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

### 9. Testing Strategy with Playwright

**✅ Use Playwright for comprehensive testing:**
```tsx
// tests/e2e/homepage.spec.ts
test('should toggle theme correctly', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="theme-toggle"]');
  await expect(page.locator('html')).toHaveClass(/dark/);
});

// tests/component/counter.spec.ts - Component testing
test('counter increments correctly', async ({ mount }) => {
  const component = await mount(<Counter />);
  await component.click('[data-testid="increment"]');
  await expect(component.locator('[data-testid="count"]')).toHaveText('1');
});
```

**✅ Prefer Playwright over Jest/Vitest for E2E and component testing**

---

## 🔧 Configuration Files Analysis & Improvements

### Current Config Status

**✅ Well Configured:**
- `package.json` - Good scripts with Turbopack, latest dependencies
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
4. **Understand state separation** - client vs server state
5. **Follow established patterns** - don't reinvent

### During Development:
1. **Use TypeScript strictly** - no `any` types
2. **Follow Next.js App Router patterns**
3. **Separate concerns**: Zustand for client state, TanStack Query for server state
4. **Standard Tailwind classes** - no CSS variables
5. **Test with Playwright** for both E2E and component scenarios
6. **Use Next.js middleware** for authentication and route protection

### Key Commands:
```bash
npm run dev          # Development with Turbopack
npm run build        # Production build with Turbopack  
npm run lint         # ESLint check
npm run format       # Prettier formatting
npm run test         # Playwright tests (E2E + component)
npm run test:ui      # Playwright UI mode
npm run type-check   # TypeScript validation
```

---

## 📋 Frontend Repository Goals & Standards

### Code Quality & Architecture:
- **TypeScript-first** - Strict typing, no `any` types, proper interfaces
- **Component-driven** - Reusable, single-responsibility components
- **DRY yet readable** - Abstract smartly but prioritize clarity
- **Consistent patterns** - Standardized folder structure, naming conventions
- **Clean imports** - Use absolute paths (`@/components`), organized import order

### Performance & UX:
- **Mobile-first responsive** - Works seamlessly on all device sizes
- **Core Web Vitals optimized** - Fast LCP, minimal CLS, good FID
- **Lazy loading** - Code splitting, image optimization, route-based chunks
- **Accessibility-first** - WCAG compliance, semantic HTML, keyboard navigation
- **Progressive enhancement** - Works without JS, enhances with it

### Developer Experience:
- **Modern testing stack** - Playwright for comprehensive testing, Vitest for unit tests
- **Comprehensive test coverage** - Unit, integration, E2E across the application
- **Hot reload friendly** - Fast development feedback loop with Turbopack
- **Lint & format on save** - ESLint, Prettier, consistent code style
- **Type-safe APIs** - Proper data fetching with validation (Zod)
- **Git hooks** - Pre-commit linting, testing, conventional commits

### Modern Best Practices:
- **Server-first thinking** - Leverage SSR/SSG when beneficial
- **Error boundaries** - Graceful error handling and recovery
- **Loading states** - Skeleton screens, optimistic updates
- **SEO optimized** - Meta tags, structured data, social sharing
- **Bundle size conscious** - Tree shaking, analyze bundle impact

### Maintainability:
- **Self-documenting code** - Clear variable/function names, minimal comments
- **Storybook ready** - Components work in isolation
- **Environment agnostic** - Easy local dev, staging, production deploys
- **Monorepo friendly** - If applicable, clean package boundaries

---

## 📋 Quick Reference Checklist

**Before implementing any feature:**
- [ ] Using Tailwind v4 syntax (`@import 'tailwindcss'`)
- [ ] Checking `@chengkoon/mathpet-api-types` for existing types
- [ ] Using `darkMode: 'class'` for theming
- [ ] Separating client state (Zustand) from server state (TanStack Query)
- [ ] No function dependencies in useEffect
- [ ] TypeScript strict mode compliance
- [ ] Next.js App Router architecture
- [ ] Playwright for testing over Jest
- [ ] Using Next.js middleware for auth when needed
- [ ] Using shadcn/ui components before creating custom UI components
- [ ] Checking shadcn/ui registry for available components first

**This prevents u-turns and ensures consistent, modern code that works with your exact tech stack.**