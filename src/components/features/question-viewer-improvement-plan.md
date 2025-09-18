# QuestionViewer.tsx - Critical Improvement Plan

## 🚨 **CRITICAL CODE REVIEW FINDINGS**

**Component Status**: `QuestionViewer.tsx` - **NEEDS IMMEDIATE REFACTORING**
**Standards Compliance Score**: **6/10**
**Priority Level**: **HIGH** - Contains production-breaking patterns

---

## 📋 **CRITICAL VIOLATIONS IDENTIFIED**

### 1. **🔥 URGENT: useEffect Anti-Pattern - Infinite Loop Risk**

**Issue Location**: Lines 60-75
**Severity**: **CRITICAL** - Can break production

```tsx
// ❌ CURRENT PROBLEMATIC CODE
useEffect(() => {
  if (session?.questionAttempts) {
    const statuses: Record<number, QuestionStatus> = {};
    session.questionAttempts.forEach((attempt) => {
      // ❌ forEach function reference
      if (attempt.questionIndex !== undefined) {
        statuses[attempt.questionIndex] = 'answered';
      }
    });
    setQuestionStatuses(statuses);
  }
}, [session?.questionAttempts]); // ❌ Array dependency can cause infinite loops
```

**Standards Violated**:

- "NEVER include function references in useEffect dependencies"
- "Only include primitive dependencies in useEffect"

**Fix Required**:

```tsx
// ✅ CORRECT PATTERN
useEffect(() => {
  if (session?.questionAttempts) {
    const statuses: Record<number, QuestionStatus> = {};
    // Use for...of loop to avoid function reference issues
    for (const attempt of session.questionAttempts) {
      if (attempt.questionIndex !== undefined) {
        statuses[attempt.questionIndex] = 'answered';
      }
    }
    setQuestionStatuses(statuses);
  }
}, [session?.questionAttempts?.length]); // ✅ Depend on primitive length
```

### 2. **📦 Component Size Violation - Monolithic Architecture**

**Issue**: 600+ lines in single component
**Standards Violated**: "Single-responsibility components", "Atomic design principles"

**Current Structure Problems**:

- Question rendering logic mixed with navigation
- Mobile/desktop UI logic intertwined
- Session management mixed with question display
- Mutation handling spread throughout component

### 3. **🔍 Type Safety Gaps**

**Issues Found**:

```tsx
// ❌ Loose typing that can cause runtime errors
currentQuestion?.question?.id || 0; // Should handle undefined properly
selectedAnswers[currentQuestionIndex]?.toString() || ''; // Unsafe casting

// ❌ Non-descriptive union types
Record<number, string | number>; // Should be more specific
```

---

## 🎯 **REFACTORING PLAN - PHASE BREAKDOWN**

### **Phase 1: URGENT (Fix Immediately)** ✅ **COMPLETED**

_Timeline: 1-2 hours_ - **DONE**

#### 1.1 Fix useEffect Dependencies ✅

- [x] Replace `forEach` with `for...of` loops
- [x] Change array dependencies to use stable stringified keys
- [x] Add proper dependency tracking with useMemo

#### 1.2 Extract Mutation Logic ✅

- [x] Move all API calls to custom hooks (`useQuestionMutations.ts`)
- [x] Separate business logic from UI rendering
- [x] Add proper error boundaries (`QuestionViewerErrorBoundary.tsx`)

**🎉 PHASE 1 RESULTS:**

- ✅ Fixed critical infinite loop risks
- ✅ Improved type safety with proper interfaces
- ✅ Extracted mutation logic to `useQuestionMutations` hook
- ✅ Added comprehensive error boundary with HOC pattern
- ✅ All ESLint/TypeScript errors resolved
- ✅ Better separation of concerns following coding standards

**📁 FILES CREATED/MODIFIED:**

- ✅ `/src/hooks/useQuestionMutations.ts` - NEW: Custom hook for API mutations
- ✅ `/src/components/features/QuestionViewerErrorBoundary.tsx` - NEW: Error boundary component
- ✅ `/src/components/features/QuestionViewer.tsx` - IMPROVED: Fixed useEffect, types, extracted mutations

### **Phase 2: HIGH PRIORITY (This Week)**

_Timeline: 1-2 days_

#### 2.1 Component Decomposition

Break into atomic components following your standards:

```
QuestionViewer/
├── QuestionViewer.tsx           # Main orchestrator (< 150 lines)
├── QuestionContent/
│   ├── QuestionContent.tsx      # Question display logic
│   ├── McqOptions.tsx          # Multiple choice rendering
│   └── ShortAnswerInput.tsx    # Short answer form
├── QuestionNavigation/
│   ├── QuestionNavigation.tsx  # Next/Previous controls
│   └── QuestionActions.tsx     # Flag/Clear/Bookmark
├── QuestionPalette/
│   ├── QuestionPalette.tsx     # Desktop sidebar
│   └── MobileQuestionPalette.tsx # Mobile bottom sheet
└── hooks/
    ├── useQuestionState.ts     # Local question state
    └── useQuestionNavigation.ts # Navigation logic
```

#### 2.2 Improve Type Safety

```typescript
// ✅ Proper type definitions
interface QuestionAnswers {
  mcq: Record<number, number>; // Question index -> Option index
  shortAnswer: Record<number, string>; // Question index -> Answer text
}

interface QuestionStatuses {
  [questionIndex: number]: 'unanswered' | 'answered' | 'flagged';
}

interface QuestionViewerState {
  currentQuestionIndex: number;
  answers: QuestionAnswers;
  statuses: QuestionStatuses;
  showMobilePalette: boolean;
}
```

### **Phase 3: MEDIUM PRIORITY (Next Week)**

_Timeline: 2-3 days_

#### 3.1 Performance Optimization

- [ ] Add proper memoization with `useMemo` and `useCallback`
- [ ] Implement virtual scrolling for question palette
- [ ] Add skeleton loading states
- [ ] Optimize re-renders

#### 3.2 Accessibility Improvements

- [ ] Add proper ARIA labels
- [ ] Implement keyboard navigation
- [ ] Add focus management
- [ ] Test with screen readers

#### 3.3 Mobile UX Enhancement

- [ ] Improve mobile question palette UX
- [ ] Add gesture navigation
- [ ] Optimize touch interactions
- [ ] Better responsive breakpoints

---

## 🔧 **DETAILED COMPONENT ARCHITECTURE**

### **New QuestionViewer.tsx (Main Orchestrator)**

_Target: < 150 lines_

```tsx
'use client';

export default function QuestionViewer({
  sessionId,
  onComplete,
}: QuestionViewerProps) {
  // Only high-level state and orchestration
  const { session, question, isLoading, error } =
    useQuestionViewerData(sessionId);
  const { currentIndex, answers, statuses, navigation } =
    useQuestionViewerState(session);

  if (isLoading) return <QuestionViewerSkeleton />;
  if (error) return <QuestionViewerError error={error} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <QuestionViewerHeader session={session} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <QuestionContent
              question={question}
              answer={answers[currentIndex]}
              onAnswerChange={navigation.updateAnswer}
            />
            <QuestionNavigation
              currentIndex={currentIndex}
              totalQuestions={session.totalQuestions}
              onNavigate={navigation.goToQuestion}
              onNext={navigation.nextQuestion}
              onPrevious={navigation.previousQuestion}
            />
          </div>

          <div className="hidden lg:block">
            <QuestionPalette
              session={session}
              currentIndex={currentIndex}
              statuses={statuses}
              onNavigate={navigation.goToQuestion}
              onComplete={onComplete}
            />
          </div>
        </div>
      </div>

      <MobileQuestionPalette
        session={session}
        currentIndex={currentIndex}
        statuses={statuses}
        onNavigate={navigation.goToQuestion}
        onComplete={onComplete}
      />
    </div>
  );
}
```

### **Custom Hooks Architecture**

#### `useQuestionViewerData.ts`

```typescript
export const useQuestionViewerData = (sessionId: string) => {
  const session = usePracticeSession(sessionId);
  const question = usePracticeSessionQuestion(sessionId, currentIndex);

  return {
    session: session.data,
    question: question.data,
    isLoading: session.isLoading || question.isLoading,
    error: session.error || question.error,
  };
};
```

#### `useQuestionViewerState.ts`

```typescript
export const useQuestionViewerState = (session?: PracticeSessionResponse) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswers>({
    mcq: {},
    shortAnswer: {},
  });
  const [statuses, setStatuses] = useState<QuestionStatuses>({});

  // ✅ FIXED: Proper useEffect dependencies
  useEffect(() => {
    if (session?.currentQuestionIndex !== undefined) {
      setCurrentIndex(session.currentQuestionIndex);
    }
  }, [session?.currentQuestionIndex]);

  // ✅ FIXED: Use primitive dependencies
  useEffect(() => {
    if (session?.questionAttempts) {
      const newStatuses: QuestionStatuses = {};
      for (const attempt of session.questionAttempts) {
        if (attempt.questionIndex !== undefined) {
          newStatuses[attempt.questionIndex] = 'answered';
        }
      }
      setStatuses(newStatuses);
    }
  }, [session?.questionAttempts?.length]); // ✅ Primitive dependency

  // Navigation functions with useCallback for stability
  const navigation = useMemo(
    () => ({
      goToQuestion: useCallback((index: number) => setCurrentIndex(index), []),
      nextQuestion: useCallback(() => {
        if (currentIndex < (session?.totalQuestions ?? 0) - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      }, [currentIndex, session?.totalQuestions]),
      // ... other navigation methods
    }),
    [currentIndex, session?.totalQuestions]
  );

  return { currentIndex, answers, statuses, navigation };
};
```

---

## 🧪 **TESTING STRATEGY**

### Unit Tests Required

- [ ] `useQuestionViewerState` hook testing
- [ ] `useQuestionViewerData` hook testing
- [ ] Individual component testing
- [ ] Navigation logic testing

### Integration Tests

- [ ] Full question flow testing
- [ ] Mobile palette interactions
- [ ] Answer submission flow
- [ ] Error handling scenarios

### E2E Tests with Playwright

- [ ] Complete question session flow
- [ ] Mobile responsiveness testing
- [ ] Accessibility compliance testing

---

## 📊 **SUCCESS METRICS**

### Code Quality Improvements

- [ ] **Bundle size reduction**: Target 30% smaller chunks
- [ ] **Component count**: 1 monolithic → 8+ focused components
- [ ] **Lines per component**: < 150 lines each
- [ ] **useEffect violations**: 0 infinite loop risks

### Performance Improvements

- [ ] **Initial render time**: < 100ms
- [ ] **Navigation response**: < 16ms (60 FPS)
- [ ] **Mobile scroll performance**: 60 FPS maintained
- [ ] **Memory usage**: No memory leaks on navigation

### Standards Compliance

- [ ] **TypeScript strict mode**: 100% compliance
- [ ] **ESLint violations**: 0 errors, 0 warnings
- [ ] **Accessibility**: WCAG AA compliance
- [ ] **Mobile UX**: Touch-friendly interactions

---

## ⚡ **IMPLEMENTATION PRIORITIES**

### **DO FIRST (Today)**

1. Fix useEffect infinite loop risks
2. Extract mutation logic to custom hooks
3. Add proper error boundaries

### **DO THIS WEEK**

1. Break component into atomic pieces
2. Improve type safety
3. Add comprehensive testing

### **DO NEXT WEEK**

1. Performance optimization
2. Accessibility improvements
3. Mobile UX enhancements

---

## 🔄 **MIGRATION STRATEGY**

### Step-by-Step Approach

1. **Create new components in parallel** (don't break existing)
2. **Test each component individually**
3. **Gradually replace sections** of the main component
4. **Maintain backward compatibility** during transition
5. **Remove old code** only after full verification

### Rollback Plan

- Keep original `QuestionViewer.tsx` as `QuestionViewerLegacy.tsx`
- Feature flag new components
- Easy switch between old/new implementations

---

## 📝 **CHECKLIST FOR COMPLETION**

### Code Quality

- [ ] All useEffect dependencies follow standards
- [ ] No components > 150 lines
- [ ] 100% TypeScript strict compliance
- [ ] Zero ESLint violations
- [ ] Proper error handling

### Performance

- [ ] All components properly memoized
- [ ] No unnecessary re-renders
- [ ] Smooth 60 FPS interactions
- [ ] Optimized bundle size

### User Experience

- [ ] Mobile-first responsive design
- [ ] Accessibility compliant
- [ ] Smooth animations
- [ ] Proper loading states

### Testing

- [ ] Unit tests for all components
- [ ] Integration tests for flows
- [ ] E2E tests with Playwright
- [ ] Performance regression tests

---

**Final Note**: This refactoring is **critical for production stability**. The current useEffect patterns pose a real risk of infinite loops that could crash the application or cause performance issues. Priority should be given to the Phase 1 urgent fixes before any feature development continues.
