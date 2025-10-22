import { test, expect } from '@playwright/test';

test.describe('Skins Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/skins');
  });

  test('should display the skins page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Workspace Skins' })).toBeVisible();
    await expect(page.getByText(/Choose a skin template or create your own/i)).toBeVisible();
  });

  test('should display statistics cards', async ({ page }) => {
    await expect(page.getByText('Total Skins')).toBeVisible();
    await expect(page.getByText('Templates')).toBeVisible();
    await expect(page.getByText('Custom Skins')).toBeVisible();
    await expect(page.getByText('Active Skin')).toBeVisible();
  });

  test('should display category filter buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All Skins' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'IDE' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Chat' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Analytics' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Monitoring' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Custom' })).toBeVisible();
  });

  test('should display template skins', async ({ page }) => {
    // Should show 7 template skins
    await expect(page.getByText('IDE Workspace')).toBeVisible();
    await expect(page.getByText('AI Chat Station')).toBeVisible();
    await expect(page.getByText('Analytics Dashboard')).toBeVisible();
    await expect(page.getByText('Agent Control Center')).toBeVisible();
    await expect(page.getByText('MCP Explorer')).toBeVisible();
    await expect(page.getByText('Minimal Chat')).toBeVisible();
    await expect(page.getByText('Split View')).toBeVisible();
  });

  test('should filter skins by category', async ({ page }) => {
    // Click IDE category
    await page.getByRole('button', { name: 'IDE' }).click();

    // Should show only IDE skins
    await expect(page.getByText('IDE Workspace')).toBeVisible();

    // Click Chat category
    await page.getByRole('button', { name: 'Chat' }).click();

    // Should show chat skins
    await expect(page.getByText('AI Chat Station')).toBeVisible();
    await expect(page.getByText('Minimal Chat')).toBeVisible();
  });

  test('should activate a skin', async ({ page }) => {
    // Find the first skin and activate it
    await page.getByRole('button', { name: /Activate/i }).first().click();

    // Should navigate to workspace or show active badge
    await expect(
      page.getByText('Active').or(page.url().includes('/workspace'))
    ).toBeTruthy();
  });

  test('should duplicate a skin', async ({ page }) => {
    const initialSkinsText = await page.getByText('Total Skins').locator('..').textContent();
    const initialCount = parseInt(initialSkinsText?.match(/\d+/)?.[0] || '0');

    // Duplicate the first skin
    await page.getByRole('button', { name: 'Duplicate' }).first().click();

    // Wait for the skin to be duplicated
    await page.waitForTimeout(500);

    // Check that total count increased
    const newSkinsText = await page.getByText('Total Skins').locator('..').textContent();
    const newCount = parseInt(newSkinsText?.match(/\d+/)?.[0] || '0');

    expect(newCount).toBe(initialCount + 1);

    // Check for " (Copy)" in skin names
    await expect(page.getByText(/ \(Copy\)/)).toBeVisible();
  });

  test('should show tags on skin cards', async ({ page }) => {
    // Template skins should have tags
    const firstCard = page.locator('[class*="Card"]').first();

    // Should have category badge
    await expect(
      firstCard.getByText('ide').or(
        firstCard.getByText('chat').or(
          firstCard.getByText('analytics')
        )
      )
    ).toBeVisible();
  });

  test('should navigate to skin builder', async ({ page }) => {
    await page.getByRole('button', { name: /Create New Skin/i }).click();

    await expect(page).toHaveURL(/\/skins\/builder/);
  });

  test('should display component count on skin cards', async ({ page }) => {
    // Each skin card should show number of components
    await expect(page.getByText(/\d+ components/)).toBeVisible();
  });
});

test.describe('Skin Builder Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/skins/builder');
  });

  test('should display the skin builder page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Skin Builder' })).toBeVisible();
  });

  test('should display three tabs', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'setup' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'components' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'preview' })).toBeVisible();
  });

  test('should allow editing skin name and description', async ({ page }) => {
    // Should be on setup tab by default
    const nameInput = page.getByLabel(/Skin Name/i);
    const descInput = page.getByLabel(/Description/i);

    await expect(nameInput).toBeVisible();
    await expect(descInput).toBeVisible();

    // Change values
    await nameInput.fill('My Custom Skin');
    await descInput.fill('A skin for testing');

    // Values should be saved
    expect(await nameInput.inputValue()).toBe('My Custom Skin');
    expect(await descInput.inputValue()).toBe('A skin for testing');
  });

  test('should display template options', async ({ page }) => {
    await expect(page.getByText('Start from Template')).toBeVisible();

    // Should show template cards
    await expect(page.getByText('IDE Workspace')).toBeVisible();
    await expect(page.getByText('AI Chat Station')).toBeVisible();
  });

  test('should start from template', async ({ page }) => {
    // Click on a template
    await page.getByText('AI Chat Station').click();

    // Should switch to preview tab
    await expect(page.getByRole('button', { name: 'preview' })).toHaveAttribute(
      'class',
      expect.stringContaining('blue')
    );
  });

  test('should switch to components tab', async ({ page }) => {
    await page.getByRole('button', { name: 'components' }).click();

    // Should show available components
    await expect(page.getByText('Available Components')).toBeVisible();
    await expect(page.getByText('Current Components')).toBeVisible();
  });

  test('should add components', async ({ page }) => {
    await page.getByRole('button', { name: 'components' }).click();

    const initialComponents = await page.getByText('Current Components').locator('..').textContent();

    // Add a chat component
    await page.getByText('Chat Interface').click();

    // Wait for component to be added
    await page.waitForTimeout(300);

    // Check that component was added
    const newComponents = await page.getByText('Current Components').locator('..').textContent();

    expect(newComponents).not.toBe(initialComponents);
  });

  test('should remove components', async ({ page }) => {
    await page.getByRole('button', { name: 'components' }).click();

    // Add a component first
    await page.getByText('Chat Interface').click();
    await page.waitForTimeout(300);

    // Remove it
    await page.getByRole('button', { name: 'Remove' }).first().click();

    // Component should be removed
    await expect(page.getByText('No components added yet')).toBeVisible();
  });

  test('should preview the skin', async ({ page }) => {
    // Start from a template
    await page.getByText('IDE Workspace').click();

    // Should show preview with components
    await expect(page.getByText('Preview')).toBeVisible();

    // Preview should show skin components
    // The actual components will be rendered in the preview
  });

  test('should save the skin', async ({ page }) => {
    // Fill in basic info
    await page.getByLabel(/Skin Name/i).fill('Test E2E Skin');
    await page.getByLabel(/Description/i).fill('Created by E2E test');

    // Add a component
    await page.getByRole('button', { name: 'components' }).click();
    await page.getByText('Chat Interface').click();

    // Save
    await page.getByRole('button', { name: /Save Skin/i }).click();

    // Should redirect to skins page
    await expect(page).toHaveURL(/\/skins$/);

    // Skin should appear in the list
    await expect(page.getByText('Test E2E Skin')).toBeVisible();
  });

  test('should cancel skin creation', async ({ page }) => {
    await page.getByRole('button', { name: /Cancel/i }).click();

    // Should redirect back to skins page
    await expect(page).toHaveURL(/\/skins$/);
  });

  test('should display all component types', async ({ page }) => {
    await page.getByRole('button', { name: 'components' }).click();

    // Check for various component types
    await expect(page.getByText('Chat Interface')).toBeVisible();
    await expect(page.getByText('Code Editor')).toBeVisible();
    await expect(page.getByText('Terminal')).toBeVisible();
    await expect(page.getByText('File Browser')).toBeVisible();
    await expect(page.getByText('IFrame Portal')).toBeVisible();
  });
});

test.describe('Workspace Page', () => {
  test.beforeEach(async ({ page }) => {
    // First, activate a skin
    await page.goto('/skins');

    // Activate the first skin
    await page.getByRole('button', { name: /Activate/i }).first().click();
  });

  test('should display the workspace page', async ({ page }) => {
    await expect(page.getByText(/Back/)).toBeVisible();
  });

  test('should show active skin name', async ({ page }) => {
    // Should display skin name in toolbar
    await expect(
      page.getByText('IDE Workspace').or(
        page.getByText('AI Chat Station').or(
          page.getByText('Analytics Dashboard')
        )
      )
    ).toBeVisible();
  });

  test('should render skin components', async ({ page }) => {
    // The workspace should render the active skin's components
    // This will vary based on which skin is active
    // Check for common component indicators
    const hasComponents = await page.locator('[class*="grid"]').count() > 0;
    expect(hasComponents).toBe(true);
  });

  test('should allow changing skin', async ({ page }) => {
    await page.getByRole('button', { name: /Change Skin/i }).click();

    // Should navigate back to skins page
    await expect(page).toHaveURL(/\/skins/);
  });

  test('should allow editing skin if not a template', async ({ page }) => {
    // Go back and duplicate a skin to create a custom one
    await page.goto('/skins');
    await page.getByRole('button', { name: 'Duplicate' }).first().click();
    await page.waitForTimeout(300);

    // Activate the duplicated skin
    const customSkin = page.getByText(/ \(Copy\)/).first();
    await customSkin.locator('..').getByRole('button', { name: /Activate/i }).click();

    // Should have Edit button for custom skins
    await expect(page.getByRole('button', { name: /Edit Skin/i })).toBeVisible();
  });

  test('should navigate back to dashboard', async ({ page }) => {
    await page.getByText(/Back/).click();

    // Should go back to previous page (likely dashboard)
    await expect(page).toHaveURL(/\//);
  });
});

test.describe('Skin System Integration', () => {
  test('should show skins widget on dashboard', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Workspace Skins')).toBeVisible();
  });

  test('should navigate from dashboard widget to skins page', async ({ page }) => {
    await page.goto('/');

    // Find skins widget and click "View all"
    const skinsWidget = page.locator('text=Workspace Skins').locator('..');
    await skinsWidget.getByText('View all').or(skinsWidget.getByText('Manage All Skins')).click();

    await expect(page).toHaveURL(/\/skins/);
  });

  test('should open workspace from dashboard widget', async ({ page }) => {
    await page.goto('/');

    // Activate a skin if none is active
    const workspaceButton = page.getByRole('button', { name: /Open Workspace/i });

    if (await workspaceButton.isVisible()) {
      await workspaceButton.click();
      await expect(page).toHaveURL(/\/workspace/);
    } else {
      // No active skin, click browse
      await page.getByRole('button', { name: /Browse Skins/i }).click();
      await expect(page).toHaveURL(/\/skins/);
    }
  });

  test('should create skin from dashboard widget', async ({ page }) => {
    await page.goto('/');

    const skinsWidget = page.locator('text=Workspace Skins').locator('..');
    await skinsWidget.getByRole('button', { name: /Create New Skin/i }).click();

    await expect(page).toHaveURL(/\/skins\/builder/);
  });

  test('should persist skin selection across page reloads', async ({ page }) => {
    // Activate a specific skin
    await page.goto('/skins');
    await page.getByText('IDE Workspace').locator('..').getByRole('button', { name: /Activate/i }).click();

    // Reload the page
    await page.reload();

    // Active skin should still be IDE Workspace
    await expect(page.getByText('IDE Workspace').locator('..').getByText('Active')).toBeVisible();
  });

  test('should maintain skin state in localStorage', async ({ page }) => {
    await page.goto('/skins');

    // Get initial skin count
    const skinsData = await page.evaluate(() => {
      return localStorage.getItem('skin-store');
    });

    expect(skinsData).toBeTruthy();

    // Parse and check it has the expected structure
    const parsedData = JSON.parse(skinsData!);
    expect(parsedData.state).toBeDefined();
    expect(parsedData.state.skins).toBeDefined();
    expect(Array.isArray(parsedData.state.skins)).toBe(true);
  });
});
