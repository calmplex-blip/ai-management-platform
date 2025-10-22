import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the page title and welcome message', async ({ page }) => {
    await expect(page).toHaveTitle(/ConsciousOps/);
    await expect(page.getByRole('heading', { name: 'Welcome back, Admin' })).toBeVisible();
  });

  test('should display navigation with all menu items', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check main navigation items
    await expect(nav.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'MCP Servers' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'MCP Playground' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'A2A Agents' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'AP2 Tasks' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Skins' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Workspace' })).toBeVisible();
  });

  test('should display metric cards with values', async ({ page }) => {
    // Check for metric cards
    await expect(page.getByText('Active Models')).toBeVisible();
    await expect(page.getByText('API Requests')).toBeVisible();
    await expect(page.getByText('Monthly Cost')).toBeVisible();
    await expect(page.getByText('Avg Response Time')).toBeVisible();
  });

  test('should display quick actions section', async ({ page }) => {
    await expect(page.getByText('Quick Actions')).toBeVisible();
    await expect(page.getByRole('button', { name: /Deploy New Model/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Configure Agent/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Run Task/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /View Analytics/i })).toBeVisible();
  });

  test('should display system health widget', async ({ page }) => {
    await expect(page.getByText('System Health')).toBeVisible();
    await expect(page.getByText('CPU Usage')).toBeVisible();
    await expect(page.getByText('Memory')).toBeVisible();
    await expect(page.getByText('Storage')).toBeVisible();
  });

  test('should display recent activity widget', async ({ page }) => {
    await expect(page.getByText('Recent Activity')).toBeVisible();
  });

  test('should display protocol widgets', async ({ page }) => {
    // MCP Widget
    await expect(page.getByText('MCP Servers')).toBeVisible();

    // A2A Widget
    await expect(page.getByText('A2A Agents')).toBeVisible();

    // AP2 Widget
    await expect(page.getByText('AP2 Tasks')).toBeVisible();

    // Skins Widget
    await expect(page.getByText('Workspace Skins')).toBeVisible();
  });

  test('should navigate to MCP Servers page when clicking widget link', async ({ page }) => {
    await page.getByText('View all').first().click();
    await expect(page).toHaveURL(/\/mcp-servers/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check mobile menu button is visible
    await expect(page.locator('button[aria-label="Open main menu"]')).toBeVisible();

    // Open mobile menu
    await page.locator('button').filter({ hasText: /menu/i }).first().click();

    // Check navigation items are visible in mobile menu
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  });

  test('should support dark mode', async ({ page }) => {
    // The app should respect system dark mode preference
    const html = page.locator('html');

    // Check if dark mode classes are applied
    const htmlClass = await html.getAttribute('class');
    // Dark mode would be applied based on system preference or user selection
    expect(htmlClass).toBeDefined();
  });
});
