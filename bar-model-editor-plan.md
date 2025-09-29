# Implementation Plan: Hybrid Interactive Bar Model Editor

**Target Users:** Primary school students (ages 6-12)  
**Approach:** Direct canvas interaction + contextual action controls  
**Complexity:** Medium  
**Estimated Timeline:** 2-3 weeks (incremental)

---

## 📋 Overview

This plan implements a child-friendly bar model editor where students:

1. **Click to select** bars or brackets on the canvas
2. **See contextual actions** appear based on what they selected
3. **Perform operations** through simple, clear buttons
4. **Get immediate visual feedback** on the canvas

---

## 🎯 Core Principles

1. **Click-first interaction** - No complex gestures or drag-and-drop initially
2. **Context-sensitive UI** - Only show relevant actions
3. **Immediate feedback** - No backend latency, instant canvas updates
4. **Forgiving UX** - Easy undo, clear error states
5. **Progressive complexity** - Start simple, add features incrementally

---

## 🏗️ Architecture Changes

### State Structure Extensions

**Current state (BarModelCreator.tsx):**

```typescript
interface BarModel {
  bars: Bar[];
  // brackets will be added
}
```

**New state additions:**

```typescript
interface BarModel {
  bars: Bar[];
  brackets: Bracket[]; // NEW
}

interface Bracket {
  id: string;
  label: string; // e.g., "6450 g"
  barIds: string[]; // which bars this bracket spans
  position: 'top' | 'right'; // bracket position
}

interface SelectionState {
  type: 'bar' | 'bracket' | null;
  ids: string[]; // selected element IDs
}
```

### Component Hierarchy

```
BarModelCreator.tsx (main container)
├── BarModelCanvas.tsx (Konva canvas - read-only display)
│   ├── BarShape.tsx (individual bar with selection state)
│   ├── BracketShape.tsx (bracket visualization)
│   └── SelectionHighlight.tsx (visual selection indicator)
├── ContextualActionPanel.tsx (context-aware buttons)
│   ├── NoSelectionActions.tsx
│   ├── BarSelectionActions.tsx
│   └── BracketSelectionActions.tsx
└── EditDialog.tsx (modal for editing labels/values)
```

---

## 📝 Implementation Phases

### **Phase 1: Selection System (Week 1, Days 1-3)**

**Goal:** Enable clicking and selecting bars on canvas

#### Tasks:

1. **Add selection state to BarModelCreator**

   ```typescript
   const [selection, setSelection] = useState<SelectionState>({
     type: null,
     ids: [],
   });
   ```

2. **Make bars clickable in BarShape.tsx**
   - Add `onClick` handler to Konva `Rect`
   - Highlight selected bars with border/shadow
   - Single-click toggles selection
   - Shift+click for multi-select (optional, later)

3. **Add visual selection indicator**
   - Selected bars: blue border (2px) + subtle glow
   - Use Konva `Stroke` and `ShadowBlur`

4. **Click empty canvas to deselect**
   - Add onClick to Stage background
   - Clear selection state

**Acceptance Criteria:**

- ✅ Click bar → bar gets blue border
- ✅ Click another bar → first deselects, second selects
- ✅ Click empty space → all deselect
- ✅ Visual feedback is immediate (<50ms)

**Files to modify:**

- `src/components/BarModelCreator.tsx` (add selection state)
- `src/components/BarShape.tsx` (add click handlers, selection styling)

---

### **Phase 2: Contextual Action Panel (Week 1, Days 4-5)**

**Goal:** Show relevant action buttons based on selection

#### Tasks:

1. **Create ContextualActionPanel component**

   ```typescript
   interface ContextualActionPanelProps {
     selection: SelectionState;
     onAction: (action: ActionType, payload?: any) => void;
   }
   ```

2. **Implement action sets:**

   **No selection:**
   - `+ Add Bar` (primary action)
   - `+ Add Bracket` (disabled, hint: "Select bars first")

   **Single bar selected:**
   - `✏️ Edit Bar` (opens dialog)
   - `🗑️ Delete Bar`
   - `🔼 Move Up` (if not first)
   - `🔽 Move Down` (if not last)

   **Multiple bars selected:**
   - `+ Add Bracket` (primary)
   - `🗑️ Delete Selected`

   **Bracket selected:**
   - `✏️ Edit Total`
   - `+ Add Bar to Bracket`
   - `− Remove Bar from Bracket`
   - `🗑️ Delete Bracket`

3. **Style panel for primary students**
   - Large touch-friendly buttons (min 48px height)
   - Clear icons from lucide-react
   - High contrast text
   - Tooltips for hover (desktop)

**Acceptance Criteria:**

- ✅ Panel shows different buttons based on selection
- ✅ Disabled states are clear
- ✅ Buttons are large and touch-friendly
- ✅ Icons are intuitive

**New files:**

- `src/components/ContextualActionPanel.tsx`

---

### **Phase 3: Basic Bar Operations (Week 2, Days 1-2)**

**Goal:** Implement Add, Delete, Edit bar functionality

#### Tasks:

1. **Add Bar action**

   ```typescript
   const handleAddBar = () => {
     const newBar: Bar = {
       id: generateId(),
       label: `Bar ${bars.length + 1}`,
       value: 0,
       color: getNextColor(),
     };
     setBarModel({ ...barModel, bars: [...bars, newBar] });
   };
   ```

2. **Delete Bar action**
   - Remove bar from `bars` array
   - Update any brackets that reference this bar
   - Show confirmation for deletion? (consider skip for simplicity)

3. **Edit Bar dialog**
   - shadcn/ui Dialog component
   - Form with React Hook Form + Zod
   - Fields: Label (text), Value (number, optional)
   - Color picker (optional, could be auto-assigned)

4. **Move Up/Down actions**
   - Swap bar positions in array
   - Update canvas immediately

**Acceptance Criteria:**

- ✅ Click "Add Bar" → new bar appears at bottom
- ✅ Click bar + "Delete" → bar removed
- ✅ Click bar + "Edit" → dialog opens with current values
- ✅ Submit dialog → bar updates on canvas
- ✅ Move up/down reorders bars

**Files to modify:**

- `src/components/BarModelCreator.tsx` (add action handlers)
- Create: `src/components/EditBarDialog.tsx`

---

### **Phase 4: Bracket System (Week 2, Days 3-5)**

**Goal:** Add brackets to group bars with totals

#### Tasks:

1. **Add Bracket data structure**

   ```typescript
   interface Bracket {
     id: string;
     label: string;
     barIds: string[];
     position: 'top' | 'right';
   }
   ```

2. **Implement BracketShape component**
   - Konva `Line` for bracket path
   - Konva `Text` for label
   - Calculate bracket span based on barIds
   - Make brackets clickable for selection

3. **Add Bracket action**
   - Only enabled when 2+ bars selected
   - Opens dialog: "What's the total?" (text input)
   - Creates bracket spanning selected bars
   - Default position: 'right'

4. **Edit/Delete Bracket**
   - Click bracket → shows in selection
   - "Edit Total" opens dialog
   - "Delete Bracket" removes from model

5. **Bracket visual design**
   - Right brackets: `⎸` shape
   - Top brackets: `⎺` shape (future)
   - Label positioned outside bracket
   - Match bar model educational conventions

**Acceptance Criteria:**

- ✅ Select 2 bars + "Add Bracket" → bracket appears
- ✅ Bracket correctly spans selected bars
- ✅ Click bracket → bracket selected (different color)
- ✅ Edit bracket label updates immediately
- ✅ Delete bracket removes it cleanly

**New files:**

- `src/components/BracketShape.tsx`
- `src/components/EditBracketDialog.tsx`

**Files to modify:**

- `src/components/BarModelCanvas.tsx` (render brackets)
- `src/components/BarModelCreator.tsx` (bracket actions)

---

### **Phase 5: Polish & UX Enhancements (Week 3)**

**Goal:** Make it production-ready for students

#### Tasks:

1. **Undo/Redo system**
   - Implement history stack (Zustand store)
   - Max 20 states in history
   - Keyboard shortcuts: Cmd+Z, Cmd+Shift+Z
   - Undo/Redo buttons in UI

2. **Keyboard shortcuts**
   - Delete key → delete selected
   - Escape key → deselect all
   - Arrow keys → move selected bar up/down
   - Enter key → edit selected element

3. **Responsive design**
   - Canvas scales to container
   - Touch gestures work (tap = click)
   - Action panel stacks on mobile
   - Test on iPad/tablet

4. **Error prevention**
   - Can't delete last bar
   - Can't add bracket to single bar
   - Can't move bar beyond bounds
   - Clear error messages (child-friendly language)

5. **Empty state**
   - Nice illustration when no bars exist
   - "Add your first bar to get started!" prompt

6. **Loading states**
   - Skeleton for canvas while rendering
   - Button loading indicators

7. **Accessibility**
   - Keyboard navigation works fully
   - Screen reader labels for all actions
   - Focus indicators are clear
   - Color contrast meets WCAG AA

**Acceptance Criteria:**

- ✅ Undo/redo works reliably
- ✅ Keyboard shortcuts work
- ✅ Works smoothly on iPad touch
- ✅ No way to create invalid state
- ✅ Empty state is friendly and helpful
- ✅ Passes basic accessibility audit

---

## 🎨 Visual Design Specs

### Selection States

```
No selection:     Normal bar appearance
Bar selected:     Blue border (2px), shadow (blur: 8px, color: blue/30)
Bracket selected: Orange border (2px), shadow (blur: 8px, color: orange/30)
Hover:            Scale: 1.02, transition: 150ms
```

### Action Panel Layout

```
┌─────────────────────────────────────┐
│  ┌─────────┐  ┌─────────┐  ┌──────┐ │
│  │ + Add   │  │ ✏️ Edit  │  │ 🗑️ Del│ │
│  │   Bar   │  │   Bar   │  │      │ │
│  └─────────┘  └─────────┘  └──────┘ │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ + Add Bracket (Select 2+ bars)  ││ ← Disabled state
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘

Button specs:
- Height: 48px (touch-friendly)
- Border radius: 8px
- Icon size: 20px
- Font size: 16px (readable for children)
- Spacing: 12px gap between buttons
```

### Color Palette

```
Primary action:   Blue (#3B82F6)
Destructive:      Red (#EF4444)
Secondary:        Gray (#6B7280)
Selected:         Blue (#3B82F6) with 30% opacity shadow
Disabled:         Gray (#9CA3AF) with 50% opacity
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)

- [ ] Selection state updates correctly
- [ ] Action handlers modify state properly
- [ ] Bracket calculations span correct bars
- [ ] Undo/redo stack maintains correct history

### Component Tests (Playwright)

- [ ] Bar click selects the bar
- [ ] Multi-select works with shift+click
- [ ] Action buttons appear/disappear correctly
- [ ] Edit dialog opens and saves values
- [ ] Delete confirmation works

### E2E User Flows (Playwright)

```typescript
test('student creates comparison model', async ({ page }) => {
  // 1. Add 3 bars
  // 2. Label bars "Box A", "Box B", "Box C"
  // 3. Select bars 1 and 2
  // 4. Add bracket with total "6450 g"
  // 5. Verify visual result matches expected model
});
```

### Accessibility Tests

- [ ] Keyboard navigation completes all tasks
- [ ] Screen reader announces selections
- [ ] Focus indicators are visible
- [ ] Color contrast passes WCAG AA

---

## 📦 Data Model Example

**Final JSON structure for Example 1 (Comparison Model):**

```json
{
  "bars": [
    {
      "id": "bar1",
      "label": "Box A",
      "value": 770,
      "color": "#EF4444",
      "order": 0
    },
    {
      "id": "bar2",
      "label": "Box B",
      "value": 220,
      "color": "#3B82F6",
      "order": 1
    },
    {
      "id": "bar3",
      "label": "Box C",
      "value": 0,
      "color": "#10B981",
      "order": 2
    }
  ],
  "brackets": [
    {
      "id": "bracket1",
      "label": "6450 g",
      "barIds": ["bar1", "bar2", "bar3"],
      "position": "right"
    }
  ]
}
```

---

## 🚀 Deployment Checklist

**Before Phase 1 (Setup):**

- [ ] Review and understand current BarModelCreator code
- [ ] Set up Vitest config for unit tests
- [ ] Install shadcn/ui dialog component: `npx shadcn@latest add dialog`
- [ ] Create branch: `feature/bar-model-editor`

**After Each Phase:**

- [ ] Run tests: `npm run test`
- [ ] Manual QA on desktop and tablet
- [ ] Update this plan with learnings
- [ ] Commit with conventional commit message

**Before Production:**

- [ ] Full accessibility audit
- [ ] Performance check (60fps interactions)
- [ ] User testing with 2-3 students
- [ ] Teacher review of UX flow
- [ ] Documentation for teachers

---

## 🔄 Future Enhancements (Post-MVP)

**Phase 6: Advanced Features (Optional)**

- Drag-and-drop bar reordering
- Duplicate bar action
- Template system (common patterns)
- Top brackets for part-whole models
- Dotted lines for comparisons
- Export as image/PDF
- Collaborative editing (real-time)

**Phase 7: Smart Suggestions**

- "Did you mean to add a bracket here?" hints
- Auto-detect common model patterns
- Suggest missing labels/values

---

## 📚 Reference Documentation

**Key Technologies:**

- React Konva: https://konvajs.org/docs/react/
- shadcn/ui Dialog: https://ui.shadcn.com/docs/components/dialog
- React Hook Form: https://react-hook-form.com/
- Zustand: https://docs.pmnd.rs/zustand

**Design Inspiration:**

- Figma's selection model
- Google Slides' contextual toolbar
- Canva's beginner-friendly UI

**Accessibility:**

- WCAG 2.1 AA Guidelines
- Touch target size: min 44x44px (Apple), 48x48px (Android)

---

## ✅ Success Metrics

**Quantitative:**

- Selection response time: <50ms
- Action execution time: <100ms
- Zero invalid states possible
- 100% keyboard navigable
- WCAG AA compliant

**Qualitative:**

- Students can create comparison model in <2 minutes
- Zero confusion about what actions are available
- Teachers report "students figured it out without help"
- Positive feedback from user testing

---

## 🤔 Open Questions & Decisions

1. **Should we allow multiple bars to be selected with Shift+Click initially?**
   - Decision: YES, but in Phase 5 (polish) not Phase 1
   - Reason: Multi-select is crucial for brackets, but add basic features first

2. **Should delete actions require confirmation?**
   - Decision: NO confirmation, rely on undo instead
   - Reason: Reduces friction, undo is better UX for kids

3. **What happens when a bar in a bracket is deleted?**
   - Decision: Delete the bracket too OR update bracket to remaining bars
   - Lean towards: Delete bracket, show notification "Bracket removed because Bar X was deleted"

4. **Max number of bars?**
   - Decision: Soft limit of 8 bars (most primary school problems need ≤5)
   - Hard limit: 12 bars (prevent performance issues)

5. **Should we auto-save to backend?**
   - Decision: Not in MVP, keep state client-side only
   - Future: Add autosave with debouncing

---

## 💡 Tips for Implementation

1. **Start with hardcoded data:** Before connecting to state, render static bars and test selection
2. **Console.log everything:** Log selection state changes, action calls—helps debug immediately
3. **Mobile-first testing:** Test on iPad/tablet early, not just desktop
4. **Pair with a teacher:** Show work-in-progress to a teacher for feedback
5. **Watch students use it:** Nothing beats seeing a 8-year-old actually try your UI

---

**Author:** Claude Sonnet 4  
**Date:** September 29, 2025  
**Version:** 1.0  
**Status:** Ready for Implementation
