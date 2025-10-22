import { Page, expect } from '@playwright/test';

/**
 * Test utilities and helpers for E2E tests
 */

/**
 * Wait for navigation to complete
 */
export async function waitForNavigation(page: Page, url: string | RegExp) {
  await page.waitForURL(url, { waitUntil: 'networkidle' });
}

/**
 * Clear localStorage for a fresh test state
 */
export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

/**
 * Get localStorage data
 */
export async function getLocalStorageItem(page: Page, key: string): Promise<string | null> {
  return await page.evaluate((k) => localStorage.getItem(k), key);
}

/**
 * Set localStorage data
 */
export async function setLocalStorageItem(page: Page, key: string, value: string) {
  await page.evaluate(
    ({ k, v }) => localStorage.setItem(k, v),
    { k: key, v: value }
  );
}

/**
 * Fill form and submit
 */
export async function fillFormAndSubmit(
  page: Page,
  fields: Record<string, string>,
  submitButtonText: string | RegExp
) {
  for (const [label, value] of Object.entries(fields)) {
    await page.getByLabel(new RegExp(label, 'i')).fill(value);
  }

  await page.getByRole('button', { name: submitButtonText }).click();
}

/**
 * Wait for element to disappear
 */
export async function waitForDisappear(page: Page, selector: string) {
  await page.waitForSelector(selector, { state: 'hidden' });
}

/**
 * Take screenshot with name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `e2e/screenshots/${name}.png`, fullPage: true });
}

/**
 * Check if element exists (without throwing)
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { timeout: 1000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Add MCP server helper
 */
export async function addMCPServer(
  page: Page,
  name: string,
  transportType: 'sse' | 'websocket' | 'stdio',
  url: string
) {
  await page.goto('/mcp-servers');
  await page.getByRole('button', { name: /Add Server/i }).click();

  await page.getByLabel(/Server Name/i).fill(name);
  await page.getByLabel(/Transport Type/i).selectOption(transportType);
  await page.getByLabel(/URL|Command/i).fill(url);

  await page.getByRole('button', { name: /Add Server$/i }).click();

  // Wait for server to appear
  await expect(page.getByText(name)).toBeVisible();
}

/**
 * Add A2A agent helper
 */
export async function addA2AAgent(
  page: Page,
  name: string,
  provider: string,
  capabilities?: Array<{ name: string; description: string }>
) {
  await page.goto('/a2a-agents');
  await page.getByRole('button', { name: /Add Agent/i }).click();

  await page.getByLabel(/Agent Name/i).fill(name);
  await page.getByLabel(/Provider/i).fill(provider);

  // Add capabilities if provided
  if (capabilities) {
    for (const capability of capabilities) {
      await page.getByLabel(/Capability Name/i).fill(capability.name);
      await page.getByLabel(/Capability Description/i).fill(capability.description);
      await page.getByRole('button', { name: /^\+$/i }).click();
    }
  }

  await page.getByRole('button', { name: /Add Agent$/i }).click();

  await expect(page.getByText(name)).toBeVisible();
}

/**
 * Create AP2 task helper
 */
export async function createAP2Task(
  page: Page,
  name: string,
  agentId: string,
  actions?: Array<{ name: string; type: string }>
) {
  await page.goto('/ap2-tasks');
  await page.getByRole('button', { name: /Create Task/i }).click();

  await page.getByLabel(/Task Name/i).fill(name);
  await page.getByLabel(/Agent ID/i).fill(agentId);

  // Add actions if provided
  if (actions) {
    for (const action of actions) {
      await page.getByLabel(/Action Name/i).fill(action.name);
      await page.getByLabel(/Action Type/i).selectOption(action.type);
      await page.getByRole('button', { name: /Add Action/i }).click();
    }
  }

  await page.getByRole('button', { name: /Create Task$/i }).click();

  await expect(page.getByText(name)).toBeVisible();
}

/**
 * Activate skin helper
 */
export async function activateSkin(page: Page, skinName: string) {
  await page.goto('/skins');

  const skinCard = page.getByText(skinName).locator('..');
  await skinCard.getByRole('button', { name: /Activate/i }).click();
}

/**
 * Create custom skin helper
 */
export async function createCustomSkin(
  page: Page,
  name: string,
  description: string,
  components: string[]
) {
  await page.goto('/skins/builder');

  // Fill basic info
  await page.getByLabel(/Skin Name/i).fill(name);
  await page.getByLabel(/Description/i).fill(description);

  // Switch to components tab
  await page.getByRole('button', { name: 'components' }).click();

  // Add components
  for (const componentName of components) {
    await page.getByText(componentName).click();
    await page.waitForTimeout(200);
  }

  // Save
  await page.getByRole('button', { name: /Save Skin/i }).click();

  await expect(page).toHaveURL(/\/skins$/);
  await expect(page.getByText(name)).toBeVisible();
}

/**
 * Check for dark mode
 */
export async function isDarkMode(page: Page): Promise<boolean> {
  const htmlClass = await page.locator('html').getAttribute('class');
  return htmlClass?.includes('dark') || false;
}

/**
 * Toggle mobile menu
 */
export async function toggleMobileMenu(page: Page) {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.locator('button').filter({ hasText: /menu/i }).first().click();
}

/**
 * Wait for modal to open
 */
export async function waitForModal(page: Page, modalTitle: string | RegExp) {
  await expect(page.getByRole('heading', { name: modalTitle })).toBeVisible();
}

/**
 * Close modal
 */
export async function closeModal(page: Page) {
  // Try clicking cancel button first
  const cancelButton = page.getByRole('button', { name: /Cancel|Close/i });

  if (await cancelButton.isVisible()) {
    await cancelButton.click();
  } else {
    // Try pressing Escape
    await page.keyboard.press('Escape');
  }
}

/**
 * Check if page is responsive
 */
export async function testResponsiveness(page: Page) {
  const viewports = [
    { width: 375, height: 667, name: 'Mobile' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1920, height: 1080, name: 'Desktop' },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForTimeout(500);

    // Page should still be functional
    const isVisible = await page.locator('body').isVisible();
    expect(isVisible).toBe(true);
  }
}

/**
 * Get statistics value
 */
export async function getStatValue(page: Page, statName: string): Promise<number> {
  const statElement = page.getByText(statName).locator('..');
  const text = await statElement.textContent();

  const match = text?.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Verify navigation links
 */
export async function verifyNavigationLinks(page: Page, links: string[]) {
  const nav = page.locator('nav');

  for (const link of links) {
    await expect(nav.getByRole('link', { name: link })).toBeVisible();
  }
}

/**
 * Check for accessibility violations (basic)
 */
export async function checkAccessibility(page: Page) {
  // Check for basic accessibility features
  const hasMainLandmark = await elementExists(page, 'main');
  const hasNavLandmark = await elementExists(page, 'nav');

  expect(hasMainLandmark || hasNavLandmark).toBe(true);
}
