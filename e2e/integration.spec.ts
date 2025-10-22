import { test, expect } from '@playwright/test';
import {
  addMCPServer,
  addA2AAgent,
  createAP2Task,
  activateSkin,
  createCustomSkin,
  clearLocalStorage,
} from './helpers/test-utils';

test.describe('Integration Tests - Complete User Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Start with clean state
    await page.goto('/');
    await clearLocalStorage(page);
    await page.reload();
  });

  test('Complete workflow: Setup environment and create custom workspace', async ({ page }) => {
    // 1. Add MCP Server
    await addMCPServer(page, 'Production MCP', 'sse', 'http://prod.example.com/sse');

    // Verify server was added
    await page.goto('/mcp-servers');
    await expect(page.getByText('Production MCP')).toBeVisible();

    // 2. Add A2A Agent
    await addA2AAgent(page, 'data-processor', 'Custom', [
      { name: 'process_data', description: 'Process data files' },
      { name: 'validate_data', description: 'Validate data integrity' },
    ]);

    // Verify agent was added
    await page.goto('/a2a-agents');
    await expect(page.getByText('data-processor')).toBeVisible();

    // 3. Create AP2 Task
    await createAP2Task(page, 'Data Pipeline', 'data-processor', [
      { name: 'fetch_data', type: 'query' },
      { name: 'process_data', type: 'execute' },
      { name: 'validate_result', type: 'observe' },
    ]);

    // Verify task was created
    await page.goto('/ap2-tasks');
    await expect(page.getByText('Data Pipeline')).toBeVisible();

    // 4. Create custom workspace skin
    await createCustomSkin(
      page,
      'My Data Workspace',
      'Custom workspace for data processing',
      ['Chat Interface', 'Terminal', 'File Browser']
    );

    // Verify skin was created
    await expect(page.getByText('My Data Workspace')).toBeVisible();

    // 5. Activate the custom skin
    await activateSkin(page, 'My Data Workspace');

    // Verify workspace loads with the custom skin
    await expect(page).toHaveURL(/\/workspace/);
  });

  test('Skin workflow: Create, customize, and use workspace', async ({ page }) => {
    // 1. Start from template
    await page.goto('/skins');
    await page.getByText('IDE Workspace').click();

    // Should navigate to workspace
    await expect(page).toHaveURL(/\/workspace/);

    // 2. Go back and duplicate the skin
    await page.goto('/skins');
    await page.getByText('IDE Workspace').locator('..').getByRole('button', { name: 'Duplicate' }).click();

    await page.waitForTimeout(300);

    // 3. Edit the duplicated skin
    const copySkin = page.getByText(/IDE Workspace \(Copy\)/);
    await expect(copySkin).toBeVisible();

    // 4. Activate the copy
    await copySkin.locator('..').getByRole('button', { name: /Activate/i }).click();

    // 5. Verify it's active and accessible
    await expect(page).toHaveURL(/\/workspace/);

    // 6. Return to dashboard
    await page.getByText('Back').click();

    // 7. Verify skin widget shows active skin
    await page.goto('/');
    await expect(page.getByText('IDE Workspace (Copy)')).toBeVisible();
  });

  test('Multi-protocol workflow: MCP -> A2A -> AP2', async ({ page }) => {
    // 1. Set up MCP server with tools
    await addMCPServer(page, 'API Server', 'sse', 'http://api.example.com/sse');

    // 2. Create agent that uses MCP tools
    await addA2AAgent(page, 'api-agent', 'Custom', [
      { name: 'call_api', description: 'Call external API' },
    ]);

    // 3. Create task that delegates to agent
    await createAP2Task(page, 'API Integration Task', 'api-agent', [
      { name: 'prepare_request', type: 'plan' },
      { name: 'delegate_to_agent', type: 'delegate' },
      { name: 'verify_response', type: 'observe' },
    ]);

    // 4. Execute the task
    await page.goto('/ap2-tasks');
    await page.getByText('API Integration Task').locator('..').getByRole('button', { name: /Execute/i }).click();

    // Wait for execution to start
    await expect(
      page.getByText('Running').or(page.getByText('Completed'))
    ).toBeVisible({ timeout: 5000 });

    // 5. Check task in workspace monitoring skin
    await activateSkin(page, 'Agent Control Center');

    // Workspace should load
    await expect(page).toHaveURL(/\/workspace/);
  });

  test('Dashboard to deep feature workflow', async ({ page }) => {
    // 1. Start at dashboard
    await page.goto('/');

    // 2. Click on MCP widget
    await page.getByText('MCP Servers').locator('..').getByText('View all').click();

    // Should navigate to MCP page
    await expect(page).toHaveURL(/\/mcp-servers/);

    // 3. Add a server
    await page.getByRole('button', { name: /Add Server/i }).click();
    await page.getByLabel(/Server Name/i).fill('Widget Server');
    await page.getByLabel(/Transport Type/i).selectOption('sse');
    await page.getByLabel(/URL/i).fill('http://widget.example.com/sse');
    await page.getByRole('button', { name: /Add Server$/i }).click();

    // 4. Navigate to playground
    await page.getByRole('link', { name: 'MCP Playground' }).click();

    await expect(page).toHaveURL(/\/mcp-playground/);

    // 5. Return to dashboard via navigation
    await page.getByRole('link', { name: 'Dashboard' }).click();

    await expect(page).toHaveURL(/\/$/);

    // 6. Verify server count updated
    // The MCP widget should reflect the new server
    const mcpWidget = page.getByText('MCP Servers').locator('..');
    await expect(mcpWidget).toContainText(/\d+/);
  });

  test('Mobile responsive workflow', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // 1. Navigate on mobile
    await page.goto('/');

    // 2. Open mobile menu
    await page.locator('button').filter({ hasText: /menu/i }).first().click();

    // 3. Navigate to skins
    await page.getByRole('link', { name: 'Skins' }).click();

    await expect(page).toHaveURL(/\/skins/);

    // 4. Skins should be responsive
    await expect(page.getByRole('heading', { name: 'Workspace Skins' })).toBeVisible();

    // 5. Activate a skin
    await page.getByRole('button', { name: /Activate/i }).first().click();

    // 6. Workspace should work on mobile
    await expect(page).toHaveURL(/\/workspace/);
  });

  test('State persistence across sessions', async ({ page }) => {
    // 1. Add some data
    await addMCPServer(page, 'Persistent Server', 'sse', 'http://persist.example.com/sse');
    await addA2AAgent(page, 'persistent-agent', 'Test');

    // 2. Activate a skin
    await activateSkin(page, 'Minimal Chat');

    // 3. Get localStorage state
    const skinStore = await page.evaluate(() => localStorage.getItem('skin-store'));
    const mcpStore = await page.evaluate(() => localStorage.getItem('mcp-store'));
    const a2aStore = await page.evaluate(() => localStorage.getItem('a2a-store'));

    expect(skinStore).toBeTruthy();
    expect(mcpStore).toBeTruthy();
    expect(a2aStore).toBeTruthy();

    // 4. Reload the page
    await page.reload();

    // 5. Verify data persisted
    await page.goto('/mcp-servers');
    await expect(page.getByText('Persistent Server')).toBeVisible();

    await page.goto('/a2a-agents');
    await expect(page.getByText('persistent-agent')).toBeVisible();

    await page.goto('/skins');
    await expect(page.getByText('Minimal Chat').locator('..').getByText('Active')).toBeVisible();
  });

  test('Error recovery workflow', async ({ page }) => {
    // 1. Try to create task without required fields
    await page.goto('/ap2-tasks');
    await page.getByRole('button', { name: /Create Task/i }).click();

    // Submit without filling fields
    await page.getByRole('button', { name: /Create Task$/i }).click();

    // Should still be on modal (validation should prevent submission)
    await expect(page.getByRole('heading', { name: /Create AP2 Task/i })).toBeVisible();

    // 2. Fill correctly and submit
    await page.getByLabel(/Task Name/i).fill('Recovery Task');
    await page.getByLabel(/Agent ID/i).fill('agent');
    await page.getByRole('button', { name: /Create Task$/i }).click();

    // Task should be created
    await expect(page.getByText('Recovery Task')).toBeVisible();
  });

  test('Cross-navigation workflow', async ({ page }) => {
    // Test navigation between all major pages
    const pages = [
      { path: '/', heading: 'Welcome back, Admin' },
      { path: '/mcp-servers', heading: 'MCP Servers' },
      { path: '/mcp-playground', heading: 'MCP Playground' },
      { path: '/a2a-agents', heading: 'A2A Agents' },
      { path: '/ap2-tasks', heading: 'AP2 Tasks' },
      { path: '/skins', heading: 'Workspace Skins' },
    ];

    for (const pageInfo of pages) {
      await page.goto(pageInfo.path);
      await expect(page.getByText(pageInfo.heading)).toBeVisible();
    }

    // All pages should be accessible
  });

  test('Complete skin customization workflow', async ({ page }) => {
    // 1. Create skin from scratch
    await page.goto('/skins/builder');

    // 2. Set basic info
    await page.getByLabel(/Skin Name/i).fill('Complete Custom Skin');
    await page.getByLabel(/Description/i).fill('Fully customized workspace');
    await page.getByLabel(/Category/i).selectOption('custom');

    // 3. Add multiple components
    await page.getByRole('button', { name: 'components' }).click();

    const components = ['Chat Interface', 'Code Editor', 'Terminal', 'File Browser'];

    for (const component of components) {
      await page.getByText(component).click();
      await page.waitForTimeout(200);
    }

    // 4. Preview
    await page.getByRole('button', { name: 'preview' }).click();

    // Should show preview
    await expect(page.getByText('Preview')).toBeVisible();

    // 5. Save
    await page.getByRole('button', { name: /Save Skin/i }).click();

    // 6. Activate
    await activateSkin(page, 'Complete Custom Skin');

    // 7. Verify in workspace
    await expect(page).toHaveURL(/\/workspace/);

    // 8. Verify accessible from dashboard
    await page.goto('/');
    const skinsWidget = page.getByText('Workspace Skins').locator('..');
    await expect(skinsWidget.getByText('Complete Custom Skin')).toBeVisible();
  });
});
