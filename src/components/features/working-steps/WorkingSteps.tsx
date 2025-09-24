'use client';

import { useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';

interface WorkingStepsProps {
  steps: string[];
  onChange: (steps: string[]) => void;
  disabled?: boolean;
}

/**
 * WorkingSteps - Component for managing multiple working steps
 * Allows users to add/remove individual steps for backend array submission
 * Each step is validated and indexed properly for LLM evaluation
 */
const WorkingSteps = ({
  steps,
  onChange,
  disabled = false,
}: WorkingStepsProps) => {
  // ✅ PERFORMANCE: Memoize validation to avoid recalculation
  const validSteps = useMemo(() => {
    // Ensure we always have at least one step
    return steps.length === 0 ? [''] : steps;
  }, [steps]);

  // Handle individual step text change
  const handleStepChange = useCallback(
    (stepIndex: number, value: string) => {
      const newSteps = [...validSteps];
      newSteps[stepIndex] = value;
      onChange(newSteps);
    },
    [validSteps, onChange]
  );

  // Add a new step
  const handleAddStep = useCallback(() => {
    const newSteps = [...validSteps, ''];
    onChange(newSteps);
  }, [validSteps, onChange]);

  // Remove a step (prevent removing if it's the only one)
  const handleRemoveStep = useCallback(
    (stepIndex: number) => {
      if (validSteps.length <= 1) return; // Always keep at least one step

      const newSteps = validSteps.filter((_, index) => index !== stepIndex);
      onChange(newSteps);
    },
    [validSteps, onChange]
  );

  // ✅ PERFORMANCE: Memoize whether we can remove steps
  const canRemoveSteps = useMemo(
    () => validSteps.length > 1,
    [validSteps.length]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Working Steps:
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddStep}
          disabled={disabled}
          className="flex items-center space-x-1"
        >
          <Plus className="h-3 w-3" />
          <span className="hidden sm:inline">Add Step</span>
        </Button>
      </div>

      <div className="space-y-3">
        {validSteps.map((step, index) => (
          <div key={index} className="group relative">
            <div className="flex items-start space-x-2">
              {/* Step number indicator */}
              <div className="mt-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                {index + 1}
              </div>

              {/* Step textarea */}
              <div className="flex-1">
                <Textarea
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  placeholder={`Step ${index + 1}: Describe your working step...`}
                  className="min-h-20 resize-none"
                  disabled={disabled}
                  aria-label={`Working step ${index + 1}`}
                />
              </div>

              {/* Remove button */}
              {canRemoveSteps && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveStep(index)}
                  disabled={disabled}
                  className="mt-2 h-8 w-8 flex-shrink-0 p-0 text-red-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                  aria-label={`Remove step ${index + 1}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Help text */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Add clear, sequential working steps. Each step will be evaluated
        separately for partial marks.
      </p>
    </div>
  );
};

export { WorkingSteps };
export default WorkingSteps;
