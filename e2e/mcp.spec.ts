import { test, expect } from '@playwright/test';

test.describe('MCP Servers Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mcp-servers');
  });

  test('should display the MCP servers page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'MCP Servers' })).toBeVisible();
    await expect(page.getByText(/Manage your Model Context Protocol servers/i)).toBeVisible();
  });

  test('should display statistics cards', async ({ page }) => {
    await expect(page.getByText('Total Servers')).toBeVisible();
    await expect(page.getByText('Connected')).toBeVisible();
    await expect(page.getByText('Tools Available')).toBeVisible();
    await expect(page.getByText('Resources')).toBeVisible();
  });

  test('should open add server modal', async ({ page }) => {
    await page.getByRole('button', { name: /Add Server/i }).click();
    await expect(page.getByRole('heading', { name: /Add MCP Server/i })).toBeVisible();

    // Check form fields
    await expect(page.getByLabel(/Server Name/i)).toBeVisible();
    await expect(page.getByLabel(/Description/i)).toBeVisible();
    await expect(page.getByLabel(/Transport Type/i)).toBeVisible();
  });

  test('should add a new MCP server', async ({ page }) => {
    await page.getByRole('button', { name: /Add Server/i }).click();

    // Fill in the form
    await page.getByLabel(/Server Name/i).fill('Test MCP Server');
    await page.getByLabel(/Description/i).fill('A test server for E2E tests');
    await page.getByLabel(/Transport Type/i).selectOption('sse');
    await page.getByLabel(/URL/i).fill('http://localhost:8080/sse');

    // Submit the form
    await page.getByRole('button', { name: /Add Server$/i }).click();

    // Check that the server appears in the list
    await expect(page.getByText('Test MCP Server')).toBeVisible();
  });

  test('should close modal when clicking cancel', async ({ page }) => {
    await page.getByRole('button', { name: /Add Server/i }).click();
    await page.getByRole('button', { name: /Cancel/i }).click();

    // Modal should be closed
    await expect(page.getByRole('heading', { name: /Add MCP Server/i })).not.toBeVisible();
  });

  test('should display transport type badges correctly', async ({ page }) => {
    await page.getByRole('button', { name: /Add Server/i }).click();

    // Add SSE server
    await page.getByLabel(/Server Name/i).fill('SSE Server');
    await page.getByLabel(/Transport Type/i).selectOption('sse');
    await page.getByLabel(/URL/i).fill('http://localhost:8080/sse');
    await page.getByRole('button', { name: /Add Server$/i }).click();

    // Check SSE badge
    await expect(page.getByText('SSE').first()).toBeVisible();
  });
});

test.describe('MCP Playground Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mcp-playground');
  });

  test('should display the MCP playground page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'MCP Playground' })).toBeVisible();
  });

  test('should display tabs for Tools, Resources, and Prompts', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Tools' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Resources' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Prompts' })).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    // Click on Resources tab
    await page.getByRole('button', { name: 'Resources' }).click();
    await expect(page.getByText(/Browse MCP resources/i)).toBeVisible();

    // Click on Prompts tab
    await page.getByRole('button', { name: 'Prompts' }).click();
    await expect(page.getByText(/Execute MCP prompts/i)).toBeVisible();

    // Click back to Tools tab
    await page.getByRole('button', { name: 'Tools' }).click();
    await expect(page.getByText(/Execute MCP tools/i)).toBeVisible();
  });

  test('should display server selection dropdown', async ({ page }) => {
    // Check for server selection
    await expect(page.getByText(/Select MCP Server/i).or(page.getByText(/No servers/i))).toBeVisible();
  });
});
