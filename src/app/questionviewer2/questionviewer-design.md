# QuestionViewer Component Description

## Overview

A comprehensive exam-taking interface built with React/Next.js that simulates a digital version of traditional paper-based exams. The component handles both multiple-choice questions (MCQ) and short-answer questions with full navigation and progress tracking.

## Core Features

### Question Display

- Shows question text with proper typography and responsive sizing
- Displays question metadata: question number, marks allocated, question type badges
- Progress bar showing completion percentage through the exam
- Flag/unflag functionality for marking questions to review later

### Answer Input Systems

- **MCQ**: Radio button options with proper labeling (1), (2), (3), (4)
- **Short Answer**: Text area for written responses + optional working space section
- Real-time answer state management and validation
- Visual feedback for selected/answered questions

### Navigation System

- Previous/Next buttons with disabled states at boundaries
- Question palette with grid layout showing all questions (1-30)
- Direct navigation: click any question number to jump immediately
- Visual status indicators: answered (green), flagged (orange), current (blue), unanswered (gray)

### Exam Management

- Header with exam title, question counter, and countdown timer
- Section information display (e.g., "Section A: Questions 1-20, 20 marks")
- Clear answer and bookmark functionality
- Submit exam button

## Technical Implementation

### Responsive Design

- **Desktop**: Traditional sidebar layout with question palette always visible
- **Mobile**: Full-screen overlay modal for question palette, accessed via "Menu" button
- Mobile-optimized spacing, text sizes, and touch targets
- Header adapts with truncated titles and smaller controls

### State Management

- Uses React useState for local state (current question, answers, flags, timer)
- Follows the project's coding standards: Zustand for client state, TanStack Query for server state
- TypeScript strict typing with proper interfaces

### UI Components

- Built with shadcn/ui components (Card, Button, Badge, Progress, Separator)
- Tailwind CSS v4 syntax for styling
- Dark mode support via next-themes
- Accessibility features with proper labels and keyboard navigation

### Data Structure

- Matches exact database schema provided by user
- Question objects with components array for MCQ options
- Proper question type differentiation (questionTypeId: 1 = MCQ, 3 = Short Answer)
- Mock data includes 30 questions with realistic content

## Key User Interactions

1. **Answer Selection**: Click radio buttons for MCQ or type in textarea for short answers
2. **Navigation**: Use Previous/Next buttons or click question numbers in palette
3. **Question Management**: Flag questions for review, bookmark important ones
4. **Mobile Navigation**: Tap "Menu" to open question palette modal, select question, modal auto-closes
5. **Progress Tracking**: Visual indicators show answered/flagged/current question status

## Mobile-Specific Enhancements

- Question palette hidden by default to maximize question reading space
- Full-screen modal overlay for navigation (modern mobile app pattern)
- Touch-optimized button sizes and spacing
- Condensed header with essential information only
- Text truncation and wrapping to prevent UI overflow

## Code Structure

```typescript
// Key state management
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | number>>({});
const [questionStatuses, setQuestionStatuses] = useState<Record<number, QuestionStatus>>({});
const [showQuestionPalette, setShowQuestionPalette] = useState(false);

// Question data structure matches database schema
{
  questionIndex: number,
  question: {
    id: number,
    questionTypeId: number, // 1 = MCQ, 3 = Short Answer
    questionText: string,
    marks: number,
    // ... other database fields
  },
  components: Array<{
    componentType: "MCQ_OPTION",
    componentOrder: number,
    contentText: string,
    // ... other component fields
  }>
}
```

## File Location

- **Path**: `src/app/questionviewer/page.tsx`
- **Access**: `localhost:3000/questionviewer`
- **Dependencies**: shadcn/ui components, Tailwind CSS v4, TypeScript

## Visual Layout

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Header: [Title] [Timer] [Question Palette Button]          │
├─────────────────────────────────────┬───────────────────────┤
│ Main Question Area                  │ Question Palette      │
│ ┌─────────────────────────────────┐ │ ┌─────────────────────┐ │
│ │ Question 1 | 1 mark | MCQ       │ │ │ Section Info        │ │
│ │ [Progress Bar]                  │ │ │ Questions 1-20      │ │
│ └─────────────────────────────────┘ │ │ 20 marks            │ │
│                                     │ │                     │ │
│ Question Text Here...               │ │ [Question Grid]     │ │
│                                     │ │ 1  2  3  4  5       │ │
│ (1) Option A                        │ │ 6  7  8  9  10      │ │
│ (2) Option B                        │ │ 11 12 13 14 15      │ │
│ (3) Option C                        │ │ ...                 │ │
│ (4) Option D                        │ │                     │ │
│                                     │ │ [Legend]            │ │
│ [Previous] [Clear] [Bookmark] [Next]│ │ [Submit Exam]       │ │
└─────────────────────────────────────┴───────────────────────┘
```

### Mobile Layout

```
┌─────────────────────────────────────┐
│ Header: [Title] [Timer] [Menu]      │
├─────────────────────────────────────┤
│ Main Question Area (Full Width)     │
│ ┌─────────────────────────────────┐ │
│ │ Q1 | 1 mark | MCQ | [Flag]     │ │
│ │ [Progress Bar]                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Question Text Here...               │
│                                     │
│ (1) Option A                        │
│ (2) Option B                        │
│ (3) Option C                        │
│ (4) Option D                        │
│                                     │
│ [<] [Clear] [Bookmark] [>]          │
└─────────────────────────────────────┘

Modal Overlay (when Menu tapped):
┌─────────────────────────────────────┐
│ ████████████████████████████████████│
│ ██                              ██  │
│ ██  Question Overview    [X]    ██  │
│ ██                              ██  │
│ ██  Section A: Questions 1-20   ██  │
│ ██  20 marks                    ██  │
│ ██                              ██  │
│ ██  [Question Grid 6x5]         ██  │
│ ██  1  2  3  4  5  6            ██  │
│ ██  7  8  9  10 11 12           ██  │
│ ██  ...                         ██  │
│ ██                              ██  │
│ ██  [Submit Exam]               ██  │
│ ██                              ██  │
│ ████████████████████████████████████│
└─────────────────────────────────────┘
```

---

_The component provides a realistic digital exam experience that closely mimics physical exam papers while leveraging digital advantages like instant navigation and progress tracking._
