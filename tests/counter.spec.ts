import { test, expect } from '@playwright/test';

test.describe('Counter functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should display initial counter value', async ({ page }) => {
    // Check that the counter displays the initial value (should be 0)
    const counterValue = page.locator('div.text-6xl.font-bold.text-blue-600');
    await expect(counterValue).toBeVisible();

    // Get the initial counter value
    const initialValue = await counterValue.textContent();
    expect(initialValue).toBeTruthy();
  });

  test('should increment counter when plus button is clicked', async ({
    page,
  }) => {
    // Reset counter first to ensure clean state
    const resetButton = page.locator('button.bg-gray-500');
    await resetButton.click();

    // Get the counter value after reset
    const counterValue = page.locator('div.text-6xl.font-bold.text-blue-600');
    await expect(counterValue).toHaveText('0');

    // Find and click the increment button (green button with Plus icon)
    const incrementButton = page.locator('button.bg-green-500');
    await incrementButton.click();

    // Verify the counter has increased to 1
    await expect(counterValue).toHaveText('1');

    // Verify the status changes to "Positive"
    const statusBadge = page.locator('span').filter({ hasText: 'Positive' });
    await expect(statusBadge).toBeVisible();
  });

  test('should decrement counter when minus button is clicked', async ({
    page,
  }) => {
    // Reset counter first to ensure clean state
    const resetButton = page.locator('button.bg-gray-500');
    await resetButton.click();

    // Get the counter value after reset
    const counterValue = page.locator('div.text-6xl.font-bold.text-blue-600');
    await expect(counterValue).toHaveText('0');

    // Find and click the decrement button (red button with Minus icon)
    const decrementButton = page.locator('button.bg-red-500');
    await decrementButton.click();

    // Verify the counter has decreased to -1
    await expect(counterValue).toHaveText('-1');

    // Verify the status changes to "Negative"
    const statusBadge = page.locator('span').filter({ hasText: 'Negative' });
    await expect(statusBadge).toBeVisible();
  });

  test('should increment multiple times correctly', async ({ page }) => {
    // Reset counter first to ensure clean state
    const resetButton = page.locator('button.bg-gray-500');
    await resetButton.click();

    const counterValue = page.locator('div.text-6xl.font-bold.text-blue-600');
    await expect(counterValue).toHaveText('0');

    // Click increment button 3 times
    const incrementButton = page.locator('button.bg-green-500');

    for (let i = 1; i <= 3; i++) {
      await incrementButton.click();
      await expect(counterValue).toHaveText(i.toString());
    }
  });

  test('should decrement multiple times correctly', async ({ page }) => {
    // Reset counter first to ensure clean state
    const resetButton = page.locator('button.bg-gray-500');
    await resetButton.click();

    const counterValue = page.locator('div.text-6xl.font-bold.text-blue-600');
    await expect(counterValue).toHaveText('0');

    // Click decrement button 3 times
    const decrementButton = page.locator('button.bg-red-500');

    for (let i = 1; i <= 3; i++) {
      await decrementButton.click();
      await expect(counterValue).toHaveText((-i).toString());
    }
  });

  test('should handle mixed increment and decrement operations', async ({
    page,
  }) => {
    // Reset counter first to ensure clean state
    const resetButton = page.locator('button.bg-gray-500');
    await resetButton.click();

    const counterValue = page.locator('div.text-6xl.font-bold.text-blue-600');
    await expect(counterValue).toHaveText('0');

    const incrementButton = page.locator('button.bg-green-500');
    const decrementButton = page.locator('button.bg-red-500');

    // Increment twice
    await incrementButton.click();
    await incrementButton.click();
    await expect(counterValue).toHaveText('2');

    // Decrement once
    await decrementButton.click();
    await expect(counterValue).toHaveText('1');

    // Decrement twice more
    await decrementButton.click();
    await decrementButton.click();
    await expect(counterValue).toHaveText('-1');
  });

  test('should display correct status badges', async ({ page }) => {
    const counterValue = page.locator('div.text-6xl.font-bold.text-blue-600');
    const incrementButton = page.locator('button.bg-green-500');
    const decrementButton = page.locator('button.bg-red-500');
    const resetButton = page.locator('button.bg-gray-500');

    // Reset to ensure we start at 0
    await resetButton.click();
    await expect(counterValue).toHaveText('0');

    // Check Zero status
    const zeroStatus = page.locator('span').filter({ hasText: 'Zero' });
    await expect(zeroStatus).toBeVisible();

    // Increment to positive
    await incrementButton.click();
    const positiveStatus = page.locator('span').filter({ hasText: 'Positive' });
    await expect(positiveStatus).toBeVisible();

    // Go back to zero and then negative
    await decrementButton.click();
    await expect(zeroStatus).toBeVisible();

    await decrementButton.click();
    const negativeStatus = page.locator('span').filter({ hasText: 'Negative' });
    await expect(negativeStatus).toBeVisible();
  });

  test('should have proper button styling and accessibility', async ({
    page,
  }) => {
    // Check that increment button has green styling
    const incrementButton = page.locator('button.bg-green-500');
    await expect(incrementButton).toHaveClass(/bg-green-500/);

    // Check that decrement button has red styling
    const decrementButton = page.locator('button.bg-red-500');
    await expect(decrementButton).toHaveClass(/bg-red-500/);

    // Verify buttons are clickable
    await expect(incrementButton).toBeEnabled();
    await expect(decrementButton).toBeEnabled();
  });

  test('should reset counter when reset button is clicked', async ({
    page,
  }) => {
    const counterValue = page.locator('div.text-6xl.font-bold.text-blue-600');
    const incrementButton = page.locator('button.bg-green-500');
    const resetButton = page.locator('button.bg-gray-500');

    // Increment a few times
    await incrementButton.click();
    await incrementButton.click();
    await incrementButton.click();

    // Verify counter is not zero
    const currentValue = parseInt((await counterValue.textContent()) || '0');
    expect(currentValue).not.toBe(0);

    // Click reset
    await resetButton.click();

    // Verify counter is back to 0
    await expect(counterValue).toHaveText('0');

    // Verify status shows "Zero"
    const zeroStatus = page.locator('span').filter({ hasText: 'Zero' });
    await expect(zeroStatus).toBeVisible();
  });
});
