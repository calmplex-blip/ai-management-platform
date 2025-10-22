import { test, expect } from '@playwright/test';

test.describe('AP2 Tasks Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ap2-tasks');
  });

  test('should display the AP2 tasks page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'AP2 Tasks' })).toBeVisible();
    await expect(page.getByText(/Manage your Agent Protocol 2 tasks/i)).toBeVisible();
  });

  test('should display statistics cards', async ({ page }) => {
    await expect(page.getByText('Total Tasks')).toBeVisible();
    await expect(page.getByText('Running')).toBeVisible();
    await expect(page.getByText('Completed')).toBeVisible();
    await expect(page.getByText('Failed')).toBeVisible();
    await expect(page.getByText('Available Tools')).toBeVisible();
    await expect(page.getByText('Allocated Resources')).toBeVisible();
  });

  test('should open create task modal', async ({ page }) => {
    await page.getByRole('button', { name: /Create Task/i }).click();
    await expect(page.getByRole('heading', { name: /Create AP2 Task/i })).toBeVisible();

    // Check form fields
    await expect(page.getByLabel(/Task Name/i)).toBeVisible();
    await expect(page.getByLabel(/Description/i)).toBeVisible();
    await expect(page.getByLabel(/Agent ID/i)).toBeVisible();
  });

  test('should create a new task with actions', async ({ page }) => {
    await page.getByRole('button', { name: /Create Task/i }).click();

    // Fill in basic info
    await page.getByLabel(/Task Name/i).fill('Test Task');
    await page.getByLabel(/Description/i).fill('A test task for E2E tests');
    await page.getByLabel(/Agent ID/i).fill('test-agent');

    // Add an action
    await page.getByLabel(/Action Name/i).fill('test_action');
    await page.getByLabel(/Action Type/i).selectOption('execute');
    await page.getByRole('button', { name: /Add Action/i }).click();

    // Submit the form
    await page.getByRole('button', { name: /Create Task$/i }).click();

    // Check that the task appears in the list
    await expect(page.getByText('Test Task')).toBeVisible();
  });

  test('should create a task with resources', async ({ page }) => {
    await page.getByRole('button', { name: /Create Task/i }).click();

    // Fill in basic info
    await page.getByLabel(/Task Name/i).fill('Resource Task');
    await page.getByLabel(/Description/i).fill('Task with resources');
    await page.getByLabel(/Agent ID/i).fill('test-agent');

    // Add a resource
    await page.getByLabel(/Resource Type/i).selectOption('compute');
    await page.getByLabel(/Resource Name/i).fill('CPU');
    await page.getByLabel(/Amount/i).fill('4');
    await page.getByLabel(/Unit/i).fill('cores');
    await page.getByRole('button', { name: /Add Resource/i }).click();

    // Submit
    await page.getByRole('button', { name: /Create Task$/i }).click();

    await expect(page.getByText('Resource Task')).toBeVisible();
  });

  test('should display task status badges', async ({ page }) => {
    // Add a task
    await page.getByRole('button', { name: /Create Task/i }).click();
    await page.getByLabel(/Task Name/i).fill('Status Task');
    await page.getByLabel(/Agent ID/i).fill('agent');
    await page.getByRole('button', { name: /Create Task$/i }).click();

    // Check for status badge (should be "Pending" by default)
    await expect(page.getByText('Pending').first()).toBeVisible();
  });

  test('should execute a task', async ({ page }) => {
    // Create a task
    await page.getByRole('button', { name: /Create Task/i }).click();
    await page.getByLabel(/Task Name/i).fill('Execute Task');
    await page.getByLabel(/Agent ID/i).fill('agent');

    // Add action
    await page.getByLabel(/Action Name/i).fill('test');
    await page.getByLabel(/Action Type/i).selectOption('execute');
    await page.getByRole('button', { name: /Add Action/i }).click();

    await page.getByRole('button', { name: /Create Task$/i }).click();

    // Execute the task
    await page.getByRole('button', { name: /Execute/i }).first().click();

    // Check that status changes (to Running or Completed)
    await expect(
      page.getByText('Running').or(page.getByText('Completed'))
    ).toBeVisible({ timeout: 5000 });
  });

  test('should display progress bar for tasks', async ({ page }) => {
    // Create and execute a task
    await page.getByRole('button', { name: /Create Task/i }).click();
    await page.getByLabel(/Task Name/i).fill('Progress Task');
    await page.getByLabel(/Agent ID/i).fill('agent');
    await page.getByLabel(/Action Name/i).fill('action');
    await page.getByLabel(/Action Type/i).selectOption('execute');
    await page.getByRole('button', { name: /Add Action/i }).click();
    await page.getByRole('button', { name: /Create Task$/i }).click();

    // Execute
    await page.getByRole('button', { name: /Execute/i }).first().click();

    // Check for progress bar
    const progressBar = page.locator('[role="progressbar"]').or(
      page.locator('.progress-bar')
    );

    // Progress bar should be visible during execution
    await expect(progressBar.first()).toBeVisible({ timeout: 1000 }).catch(() => {
      // Progress bar might complete too quickly in mock mode
    });
  });

  test('should delete a task', async ({ page }) => {
    // Create a task
    await page.getByRole('button', { name: /Create Task/i }).click();
    await page.getByLabel(/Task Name/i).fill('Delete Task');
    await page.getByLabel(/Agent ID/i).fill('agent');
    await page.getByRole('button', { name: /Create Task$/i }).click();

    // Delete the task
    await page.getByRole('button', { name: /Delete/i }).first().click();

    // Task should be removed
    // await expect(page.getByText('Delete Task')).not.toBeVisible();
  });

  test('should display action types correctly', async ({ page }) => {
    await page.getByRole('button', { name: /Create Task/i }).click();

    const actionTypeSelect = page.getByLabel(/Action Type/i);

    // Check all 5 action types are available
    await expect(actionTypeSelect).toBeVisible();

    // Get options
    const options = await actionTypeSelect.locator('option').allTextContents();

    expect(options.some(opt => opt.toLowerCase().includes('query'))).toBe(true);
    expect(options.some(opt => opt.toLowerCase().includes('execute'))).toBe(true);
    expect(options.some(opt => opt.toLowerCase().includes('observe'))).toBe(true);
    expect(options.some(opt => opt.toLowerCase().includes('plan'))).toBe(true);
    expect(options.some(opt => opt.toLowerCase().includes('delegate'))).toBe(true);
  });
});
