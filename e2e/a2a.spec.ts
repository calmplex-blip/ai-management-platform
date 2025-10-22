import { test, expect } from '@playwright/test';

test.describe('A2A Agents Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/a2a-agents');
  });

  test('should display the A2A agents page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'A2A Agents' })).toBeVisible();
    await expect(page.getByText(/Manage your Agent-to-Agent network/i)).toBeVisible();
  });

  test('should display statistics cards', async ({ page }) => {
    await expect(page.getByText('Total Agents')).toBeVisible();
    await expect(page.getByText('Active Agents')).toBeVisible();
    await expect(page.getByText('Messages Sent')).toBeVisible();
    await expect(page.getByText('Active Conversations')).toBeVisible();
  });

  test('should open add agent modal', async ({ page }) => {
    await page.getByRole('button', { name: /Add Agent/i }).click();
    await expect(page.getByRole('heading', { name: /Add A2A Agent/i })).toBeVisible();

    // Check form fields
    await expect(page.getByLabel(/Agent Name/i)).toBeVisible();
    await expect(page.getByLabel(/Description/i)).toBeVisible();
    await expect(page.getByLabel(/Provider/i)).toBeVisible();
  });

  test('should add a new agent', async ({ page }) => {
    await page.getByRole('button', { name: /Add Agent/i }).click();

    // Fill in the form
    await page.getByLabel(/Agent Name/i).fill('test-agent');
    await page.getByLabel(/Description/i).fill('A test agent for E2E tests');
    await page.getByLabel(/Provider/i).fill('Custom');
    await page.getByLabel(/Tags/i).fill('test, automation');

    // Add a capability
    await page.getByLabel(/Capability Name/i).fill('test_capability');
    await page.getByLabel(/Capability Description/i).fill('Test capability');
    await page.getByRole('button', { name: /^\+$/i }).click();

    // Submit the form
    await page.getByRole('button', { name: /Add Agent$/i }).click();

    // Check that the agent appears in the list
    await expect(page.getByText('test-agent')).toBeVisible();
  });

  test('should display agent status badges', async ({ page }) => {
    // Add an agent first
    await page.getByRole('button', { name: /Add Agent/i }).click();
    await page.getByLabel(/Agent Name/i).fill('status-test-agent');
    await page.getByLabel(/Provider/i).fill('Test');
    await page.getByRole('button', { name: /Add Agent$/i }).click();

    // Check for status badge (should be "Active" by default)
    await expect(page.getByText('Active').first()).toBeVisible();
  });

  test('should filter agents by search', async ({ page }) => {
    // Add multiple agents
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /Add Agent/i }).click();
      await page.getByLabel(/Agent Name/i).fill(`agent-${i}`);
      await page.getByLabel(/Provider/i).fill('Test');
      await page.getByRole('button', { name: /Add Agent$/i }).click();
      await page.waitForTimeout(100);
    }

    // Search functionality would be here if implemented
    // This is a placeholder for future search feature
  });

  test('should delete an agent', async ({ page }) => {
    // Add an agent
    await page.getByRole('button', { name: /Add Agent/i }).click();
    await page.getByLabel(/Agent Name/i).fill('delete-test-agent');
    await page.getByLabel(/Provider/i).fill('Test');
    await page.getByRole('button', { name: /Add Agent$/i }).click();

    // Wait for the agent to appear
    await expect(page.getByText('delete-test-agent')).toBeVisible();

    // Delete the agent
    await page.getByRole('button', { name: /Delete/i }).first().click();

    // Confirm deletion (if there's a confirmation dialog)
    // The agent should be removed from the list
  });

  test('should open send message modal', async ({ page }) => {
    // Add an agent first
    await page.getByRole('button', { name: /Add Agent/i }).click();
    await page.getByLabel(/Agent Name/i).fill('message-test-agent');
    await page.getByLabel(/Provider/i).fill('Test');
    await page.getByRole('button', { name: /Add Agent$/i }).click();

    // Click send message button
    await page.getByRole('button', { name: /Send Message/i }).first().click();

    // Check that send message modal is visible
    await expect(page.getByRole('heading', { name: /Send Message/i })).toBeVisible();
  });
});
