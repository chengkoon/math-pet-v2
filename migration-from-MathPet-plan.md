# MathPet Frontend Migration Plan: Vite → Next.js

## Executive Summary

This plan outlines the migration of MathPet repo from Vite + React Router to Next.js 15 with modern development practices. The migration will maintain all existing functionality while implementing stricter code standards, improved performance, and better developer experience. The migrated repo is this repo - math-pet-v2.

## 📊 Migration Progress

### ✅ Phase 1: Foundation Setup (Week 1) - **COMPLETED**
- ✅ Next.js Project Structure - All directories created
- ✅ Dependencies Migration - All packages installed
- ✅ TypeScript Configuration - Strict mode enabled
- ✅ ESLint Configuration - Enhanced rules applied
- ✅ Prettier Configuration - Code formatting setup
- ✅ Tailwind CSS v4 - Custom theme configured
- ✅ Development Scripts - All npm scripts added
- ✅ Quality Assurance - Build, lint, format all passing

### 🔄 Phase 2: Core Configuration (Week 1-2) - **IN PROGRESS**
- 🔄 Advanced TypeScript Configuration
- 🔄 Enhanced ESLint Rules
- 🔄 Development Tooling Setup
- 🔄 Git Hooks & Automation

### ⏳ Phase 3: Architecture Migration (Week 2-3) - **PENDING**
### ⏳ Phase 4: Component Migration (Week 3-5) - **PENDING**
### ⏳ Phase 5: Modern Development Practices (Week 4-6) - **PENDING**
### ⏳ Phase 6: Feature-by-Feature Migration (Week 5-8) - **PENDING**
### ⏳ Phase 7: Performance & Accessibility (Week 8-9) - **PENDING**
### ⏳ Phase 8: Advanced Features (Week 9-10) - **PENDING**
### ⏳ Phase 9: Testing & Quality Assurance (Week 10-11) - **PENDING**
### ⏳ Phase 10: Deployment & Migration (Week 11-12) - **PENDING**

## Migration Strategy

### ✅ Phase 1: Foundation Setup (Week 1) - **COMPLETED**

#### ✅ 1.1 Next.js Project Structure - **COMPLETED**

```
math-pet-v2/
├── src/
│   ├── app/                    # Next.js App Router ✅
│   │   ├── (auth)/            # Route groups for auth pages ⏳
│   │   │   ├── auth/          # Sign in/up pages ⏳
│   │   │   └── layout.tsx     # Auth-specific layout ⏳
│   │   ├── (dashboard)/       # Protected dashboard routes ⏳
│   │   │   ├── home/          # Dashboard home ⏳
│   │   │   ├── practice/      # Practice sessions ⏳
│   │   │   ├── packs/         # Exam packs ⏳
│   │   │   └── layout.tsx     # Dashboard layout ⏳
│   │   ├── globals.css        # Global styles ✅
│   │   ├── layout.tsx         # Root layout ✅
│   │   ├── page.tsx           # Landing page ✅
│   │   ├── loading.tsx        # Global loading UI ⏳
│   │   ├── error.tsx          # Global error UI ⏳
│   │   └── not-found.tsx      # 404 page ⏳
│   ├── components/            # Reusable components ✅
│   │   ├── ui/               # Base UI components (atoms) ✅
│   │   ├── features/         # Feature-specific components ✅
│   │   ├── layouts/          # Layout components ✅
│   │   └── providers/        # Context providers ✅
│   ├── hooks/                # Custom hooks ✅
│   ├── lib/                  # Utilities and configurations ✅
│   │   ├── api/             # API utilities ⏳
│   │   ├── auth/            # Authentication utilities ⏳
│   │   ├── validation/      # Zod schemas ⏳
│   │   └── utils.ts         # General utilities ✅
│   ├── store/               # Zustand stores ✅
│   ├── types/               # UI-specific type definitions ✅
│   └── styles/              # Additional stylesheets ✅
├── public/                  # Static assets ✅
├── tests/                   # Testing files ✅
│   ├── e2e/                # Playwright tests ✅
│   └── __mocks__/          # Test mocks ✅
└── docs/                   # Documentation ✅
```

#### ✅ 1.2 Dependencies Migration - **COMPLETED**

**✅ New Dependencies Installed:**
```json
{
  "dependencies": {
    "next": "15.5.2", ✅
    "react": "19.1.0", ✅
    "react-dom": "19.1.0", ✅
    "@chengkoon/mathpet-api-types": "^1.0.337", ✅
    "@tanstack/react-query": "^5.79.0", ✅
    "zustand": "^5.0.5", ✅
    "axios": "^1.9.0", ✅
    "zod": "^3.23.8", ✅
    "class-variance-authority": "^0.7.1", ✅
    "clsx": "^2.1.1", ✅
    "tailwind-merge": "^3.3.1", ✅
    "date-fns": "^4.1.0", ✅
    "konva": "^9.3.22", ✅
    "react-konva": "^19.0.7", ✅
    "lucide-react": "^0.541.0", ✅
    "tailwindcss-animate": "^1.0.7" ✅
  },
  "devDependencies": {
    "@types/node": "^22.15.3", ✅
    "@types/react": "^19.1.11", ✅
    "@types/react-dom": "^19.1.7", ✅
    "typescript": "^5.5.3", ✅
    "eslint": "^9.9.1", ✅
    "eslint-config-next": "15.5.2", ✅
    "@typescript-eslint/eslint-plugin": "^8.3.0", ✅
    "@typescript-eslint/parser": "^8.3.0", ✅
    "prettier": "^3.6.2", ✅
    "eslint-config-prettier": "^10.1.8", ✅
    "eslint-plugin-prettier": "^5.5.4", ✅
    "tailwindcss": "^4.0.0", ✅
    "@tailwindcss/postcss": "^4.0.0", ✅
    "postcss": "^8.4.35", ✅
    "autoprefixer": "^10.4.18", ✅
    "vitest": "^2.0.5", ✅
    "@testing-library/react": "^16.0.1", ✅
    "@testing-library/jest-dom": "^6.6.3", ✅
    "@playwright/test": "^1.55.0", ✅
    "@storybook/react": "^8.4.7", ✅
    "@storybook/nextjs": "^8.4.7", ✅
    "husky": "^9.1.6", ✅
    "lint-staged": "^15.2.10", ✅
    "@commitlint/cli": "^19.5.0", ✅
    "@commitlint/config-conventional": "^19.5.0" ✅
  }
}
```

**✅ Dependencies Removed:**
- `vite` and related plugins ✅
- `react-router-dom` (replaced by Next.js App Router) ✅
- `@vitejs/plugin-react` ✅

### Phase 2: Core Configuration (Week 1-2)

#### 🔄 2.1 TypeScript Configuration - **COMPLETED**
```json
// tsconfig.json ✅
{
  "compilerOptions": {
    "strict": true, ✅
    "noUncheckedIndexedAccess": true, ✅
    "exactOptionalPropertyTypes": true, ✅
    "noImplicitReturns": true, ✅
    "noFallthroughCasesInSwitch": true, ✅
    "noUncheckedSideEffectImports": true, ✅
    "target": "ES2017", ✅
    "lib": ["dom", "dom.iterable", "ES6"], ✅
    "allowJs": true, ✅
    "skipLibCheck": true, ✅
    "esModuleInterop": true, ✅
    "allowSyntheticDefaultImports": true, ✅
    "moduleResolution": "bundler", ✅
    "resolveJsonModule": true, ✅
    "isolatedModules": true, ✅
    "noEmit": true, ✅
    "jsx": "preserve", ✅
    "incremental": true, ✅
    "plugins": [{"name": "next"}], ✅
    "baseUrl": ".", ✅
    "paths": {
      "@/*": ["./src/*"] ✅
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"], ✅
  "exclude": ["node_modules"] ✅
}
```

#### 🔄 2.2 ESLint Configuration - **COMPLETED**
```js
// eslint.config.mjs ✅
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

export default [
  ...compat.extends(
    'next/core-web-vitals', ✅
    'prettier' ✅
  ),
  {
    files: ['**/*.{js,jsx,ts,tsx}'], ✅
    rules: {
      'prefer-const': 'error', ✅
      'no-var': 'error', ✅
    },
  },
];
```

#### 🔄 2.3 Prettier Configuration - **COMPLETED**
```js
// prettier.config.mjs ✅
export default {
  semi: true, ✅
  singleQuote: true, ✅
  tabWidth: 2, ✅
  trailingComma: 'es5', ✅
  printWidth: 80, ✅
  bracketSpacing: true, ✅
  arrowParens: 'always', ✅
  endOfLine: 'lf', ✅
  plugins: ['prettier-plugin-tailwindcss'], ✅
  overrides: [
    {
      files: '*.md',
      options: {
        parser: 'markdown',
      },
    },
  ],
}
```

#### 🔄 2.4 Tailwind CSS v4 Configuration - **COMPLETED**
```js
// tailwind.config.js ✅
export default {
  darkMode: 'class', ✅
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', ✅
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', ✅
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}', ✅
  ],
  theme: {
    container: {
      center: true, ✅
      padding: '2rem', ✅
      screens: {
        '2xl': '1400px', ✅
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'], ✅
        mono: ['var(--font-geist-mono)', 'monospace'], ✅
      },
      colors: {
        teal: {
          50: '#f0fdfa', ✅
          500: '#14b8a6', ✅
          600: '#0d9488', ✅
          700: '#0f766e', ✅
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out', ✅
        floatUp: 'floatUp 2s ease-in-out infinite', ✅
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' }, ✅
          '100%': { opacity: '1', transform: 'translateY(0)' }, ✅
        },
        floatUp: {
          '0%, 100%': { transform: 'translateY(0px)' }, ✅
          '50%': { transform: 'translateY(-10px)' }, ✅
        },
      },
    },
  },
  plugins: [], ✅
};
```

### Phase 3: Architecture Migration (Week 2-3)

#### 3.1 Router Migration Plan

**From React Router to Next.js App Router:**

| Current Route                        | New Route                                       | Migration Notes                                |
| ------------------------------------ | ----------------------------------------------- | ---------------------------------------------- |
| `/`                                  | `/`                                             | Landing page - convert to server component     |
| `/auth`                              | `/auth`                                         | Auth page - client component for form handling |
| `/home`                              | `/dashboard/home`                               | Protected route with layout                    |
| `/practice`                          | `/dashboard/practice`                           | Protected route                                |
| `/practice/session/:sessionId`       | `/dashboard/practice/session/[sessionId]`       | Dynamic route                                  |
| `/practice/topic-session/:sessionId` | `/dashboard/practice/topic-session/[sessionId]` | Dynamic route                                  |
| `/packs/:id`                         | `/dashboard/packs/[id]`                         | Dynamic route                                  |
| `/test`                              | `/dashboard/test`                               | Protected route                                |
| `/testtest`                          | `/dashboard/testtest`                           | Protected route                                |

#### 3.2 State Management Strategy

**Keep Zustand but enhance with:**

- Type-safe store definitions
- Middleware for persistence (where needed)
- Devtools integration
- Store slicing for better organization

```typescript
// Example enhanced store pattern
interface AppStore {
  // State
  user: User | null;
  theme: 'light' | 'dark';

  // Actions with proper typing
  setUser: (user: User | null) => void;
  toggleTheme: () => void;

  // Async actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Implementation
      }),
      {
        name: 'mathpet-store',
        partialize: (state) => ({ theme: state.theme }), // Only persist theme
      }
    )
  )
);
```

#### 3.3 API Layer Enhancement

**Upgrade API utilities with:**

- Zod validation for all API responses
- Type-safe error handling
- Automatic retry logic
- Request deduplication
- Better TypeScript integration

```typescript
// Example enhanced API pattern
import { z } from 'zod';

const PracticeSessionSchema = z.object({
  id: z.string(),
  status: z.enum(['ACTIVE', 'COMPLETED']),
  // ... other fields
});

export async function getSession(sessionId: string) {
  const response = await apiClient.get(`/api/practice-sessions/${sessionId}`);
  return PracticeSessionSchema.parse(response.data);
}
```

### Phase 4: Component Migration (Week 3-5)

#### 4.1 Component Architecture Improvements

**Atomic Design Implementation:**

```
src/components/
├── ui/                    # Atoms - Basic UI elements
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── skeleton.tsx
│   └── toast.tsx
├── forms/                 # Molecules - Form components
│   ├── login-form.tsx
│   ├── signup-form.tsx
│   └── answer-form.tsx
├── features/              # Organisms - Feature components
│   ├── question/
│   │   ├── question-header.tsx
│   │   ├── question-text.tsx
│   │   ├── answer-input.tsx
│   │   ├── answer-feedback.tsx
│   │   └── question-component.tsx
│   ├── auth/
│   │   ├── auth-container.tsx
│   │   ├── auth-header.tsx
│   │   └── demo-login.tsx
│   └── navigation/
│       ├── navbar.tsx
│       ├── sidebar.tsx
│       └── footer.tsx
├── layouts/               # Templates
│   ├── auth-layout.tsx
│   ├── dashboard-layout.tsx
│   └── landing-layout.tsx
└── providers/             # Context providers
    ├── auth-provider.tsx
    ├── toast-provider.tsx
    ├── query-provider.tsx
    └── theme-provider.tsx
```

#### 4.2 Component Standards

**Every component must include:**

- Strict TypeScript interfaces
- ForwardRef where applicable
- Proper accessibility attributes
- Loading and error states
- Responsive design
- Performance optimizations

**Example enhanced component:**

```typescript
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
export { Button, buttonVariants };
```

### Phase 5: Modern Development Practices (Week 4-6)

#### 5.1 Testing Strategy

**Testing Stack:**

- **Unit Testing:** Vitest + Testing Library
- **Integration Testing:** Testing Library + MSW
- **E2E Testing:** Playwright
- **Component Testing:** Storybook

**Test Organization:**

```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── button.test.tsx
│   │   └── button.stories.tsx
└── __tests__/
    ├── pages/
    ├── hooks/
    └── utils/
```

**Vitest Configuration:**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### 5.2 Git Hooks and Automation

**Husky + Lint-staged Setup:**

```json
// package.json scripts
{
  "scripts": {
    "prepare": "husky",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "build": "next build",
    "analyze": "ANALYZE=true next build"
  }
}
```

**Pre-commit hooks:**

```json
// .husky/pre-commit
#!/usr/bin/env sh
npx lint-staged
```

**Lint-staged configuration:**

```json
// .lintstagedrc
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    "vitest related --run --passWithNoTests"
  ],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

#### 5.3 Bundle Analysis and Performance

**Webpack Bundle Analyzer:**

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ['lucide-react'],
  },

  // Bundle analysis
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(
        new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
      return config;
    },
  }),

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
  ],
};

export default nextConfig;
```

### Phase 6: Feature-by-Feature Migration (Week 5-8)

#### 6.1 Authentication System Migration

**Current:** Context-based with React Router
**Target:** Next.js middleware + enhanced context

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  // Protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  // Redirect authenticated users from auth page
  if (request.nextUrl.pathname.startsWith('/auth') && token) {
    return NextResponse.redirect(new URL('/dashboard/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
```

#### 6.2 Page Migration Priority

**Phase 6a: Core Pages (Week 5)**

1. **Landing Page** → Server Component with SEO optimization
2. **Auth Page** → Client Component with form validation
3. **Dashboard Layout** → Shared layout with navigation

**Phase 6b: Practice Features (Week 6)**

1. **Questions Page** → Practice question listing
2. **Practice Session Page** → Individual practice sessions
3. **Pack Detail Page** → Exam pack details

**Phase 6c: Additional Features (Week 7-8)**

1. **Test Pages** → Test functionality
2. **Home/Dashboard** → User dashboard
3. **Error Handling** → 404, 500, error boundaries

#### 6.3 Data Fetching Migration

**From React Query to Next.js + React Query Hybrid:**

- Server Components for initial data loading
- Client Components for interactive features
- React Query for client-side caching and mutations

```typescript
// app/dashboard/practice/page.tsx (Server Component)
import { Suspense } from 'react';
import { PracticeList } from '@/components/features/practice/practice-list';
import { PracticeListSkeleton } from '@/components/features/practice/practice-skeleton';

export default async function PracticePage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Practice Questions</h1>
      <Suspense fallback={<PracticeListSkeleton />}>
        <PracticeList />
      </Suspense>
    </div>
  );
}

// components/features/practice/practice-list.tsx (Client Component)
'use client';

import { useQuery } from '@tanstack/react-query';
import { practiceApi } from '@/lib/api/practice';

export function PracticeList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['practice-questions'],
    queryFn: practiceApi.getQuestions,
  });

  // Component implementation
}
```

### Phase 7: Performance & Accessibility (Week 8-9)

#### 7.1 Core Web Vitals Optimization

**LCP (Largest Contentful Paint) < 2.5s**

- Optimize images with Next.js Image component
- Preload critical resources
- Server-side rendering for above-the-fold content

**CLS (Cumulative Layout Shift) < 0.1**

- Define dimensions for dynamic content
- Use skeleton loaders
- Avoid layout shifts in animations

**INP (Interaction to Next Paint) < 200ms**

- Optimize event handlers
- Use React.memo and useMemo strategically
- Implement proper loading states

#### 7.2 Accessibility Enhancements

**WCAG 2.1 AA Compliance:**

- Semantic HTML structure
- Proper heading hierarchy
- Color contrast ratios > 4.5:1
- Keyboard navigation support
- Screen reader optimization
- Focus management

```typescript
// Example accessible component
export function AccessibleButton({
  children,
  variant = 'primary',
  disabled = false,
  'aria-label': ariaLabel,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant }), {
        'opacity-50 cursor-not-allowed': disabled,
      })}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Phase 8: Advanced Features (Week 9-10)

#### 8.1 SEO Optimization

**Metadata API Implementation:**

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: '%s | MathPet',
    default: 'MathPet - Making Math Fun for Primary School Students',
  },
  description:
    'Interactive math learning platform with virtual pets for Singapore primary school students.',
  keywords: [
    'math',
    'education',
    'Singapore',
    'primary school',
    'gamified learning',
  ],
  authors: [{ name: 'MathPet Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: 'https://mathpet.com',
    siteName: 'MathPet',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MathPet - Making Math Fun',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@mathpet',
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

#### 8.2 Progressive Web App Features

**PWA Configuration:**

- Service worker for offline functionality
- App manifest for installation
- Background sync for practice sessions
- Push notifications for reminders

#### 8.3 Monitoring and Analytics

**Performance Monitoring:**

- Web Vitals tracking
- Error boundary reporting
- User session analytics
- Bundle size monitoring

### Phase 9: Testing & Quality Assurance (Week 10-11)

#### 9.1 Comprehensive Testing Strategy

**Unit Tests (80% coverage minimum):**

- All utility functions
- Custom hooks
- Component logic
- Store actions

**Integration Tests:**

- User authentication flows
- Practice session workflows
- API integrations
- Form submissions

**E2E Tests:**

- Critical user journeys
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility testing

#### 9.2 Code Quality Gates

**Pre-deployment Checklist:**

- [ ] TypeScript strict mode passes
- [ ] ESLint with no errors
- [ ] Prettier formatting applied
- [ ] All tests passing
- [ ] Bundle size under threshold
- [ ] Lighthouse score > 90
- [ ] No accessibility violations

### Phase 10: Deployment & Migration (Week 11-12)

#### 10.1 Environment Setup

**Development → Staging → Production Pipeline:**

```typescript
// Environment-specific configurations
const config = {
  development: {
    apiUrl: 'http://localhost:8080',
    logLevel: 'debug',
    enableDevtools: true,
  },
  staging: {
    apiUrl: 'https://api-staging.mathpet.com',
    logLevel: 'info',
    enableDevtools: true,
  },
  production: {
    apiUrl: 'https://api.mathpet.com',
    logLevel: 'error',
    enableDevtools: false,
  },
};
```

#### 10.2 Migration Strategy

**Blue-Green Deployment:**

1. Deploy math-pet-v2 to new environment
2. Run parallel testing with subset of users
3. Gradually increase traffic to v2
4. Monitor performance and user experience
5. Complete migration when stable

## Key Migration Considerations

### ✅ Phase 1 Accomplishments
- **Project Structure**: Complete Next.js 15 foundation with App Router
- **Dependencies**: All modern packages installed and configured
- **TypeScript**: Strict mode enabled with enhanced type checking
- **Code Quality**: ESLint, Prettier, and formatting all configured
- **Build System**: Next.js build, type-check, lint, and format all passing
- **Development Ready**: All scripts and tooling ready for development

### 🎯 Next Steps - Phase 2 Focus
- **Advanced TypeScript**: Implement remaining strict TypeScript rules
- **Enhanced ESLint**: Add TypeScript-specific linting rules
- **Git Automation**: Set up Husky, lint-staged, and commit hooks
- **Testing Infrastructure**: Configure Vitest and testing utilities
- **Development Tools**: Set up Storybook and additional dev tooling

### 📈 Migration Metrics
- **Phase 1**: 100% Complete ✅
- **Overall Progress**: ~8% Complete
- **Time Spent**: Week 1 ✅
- **Quality Gates**: All passing ✅

To be continued...
