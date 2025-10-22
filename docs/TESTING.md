# Testing Guide

Comprehensive E2E testing for ConsciousOps using Playwright.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Test Utilities](#test-utilities)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

ConsciousOps uses [Playwright](https://playwright.dev/) for end-to-end testing. Our test suite covers:

- **Dashboard functionality**
- **MCP server management and playground**
- **A2A agent management**
- **AP2 task creation and execution**
- **Skin system (creation, customization, workspace)**
- **Integration flows across features**
- **Mobile responsiveness**
- **State persistence**

### Test Coverage

- **8 test files** with 100+ test cases
- **Feature tests**: Individual page functionality
- **Integration tests**: Complete user workflows
- **Utilities**: Reusable helper functions
- **Multi-browser**: Chrome, Firefox, Safari, Mobile

## Setup

### Prerequisites

- Node.js 18.17+
- npm 9.0+

### Installation

Tests are set up automatically when you install dependencies:

```bash
npm install
```

This installs:
- `@playwright/test` - Test framework
- Browsers (Chromium, Firefox, WebKit)

### Install Browsers

If browsers aren't installed automatically:

```bash
npx playwright install
```

### Install Specific Browsers

```bash
# Chrome only
npx playwright install chromium

# Firefox only
npx playwright install firefox

# Safari only
npx playwright install webkit
```

## Running Tests

### All Tests

```bash
npm test
```

### Specific Test File

```bash
# Dashboard tests
npx playwright test e2e/dashboard.spec.ts

# MCP tests
npx playwright test e2e/mcp.spec.ts

# Skin system tests
npx playwright test e2e/skins.spec.ts

# Integration tests
npx playwright test e2e/integration.spec.ts
```

### Specific Test

```bash
# Run a single test by name
npx playwright test -g "should display the page title"
```

### Watch Mode

```bash
# Run tests in watch mode (re-run on file changes)
npx playwright test --watch
```

### UI Mode

```bash
# Run tests with interactive UI
npx playwright test --ui
```

### Debug Mode

```bash
# Run tests in debug mode with inspector
npx playwright test --debug
```

### Headed Mode

```bash
# Run tests with browser visible
npx playwright test --headed
```

### Specific Browser

```bash
# Chrome only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# Mobile Chrome
npx playwright test --project="Mobile Chrome"
```

### Parallel Execution

```bash
# Run tests in parallel with 4 workers
npx playwright test --workers=4
```

### Generate Reports

```bash
# Run tests and generate HTML report
npx playwright test

# Show report
npx playwright show-report
```

## Test Structure

```
e2e/
├── dashboard.spec.ts      # Dashboard page tests
├── mcp.spec.ts           # MCP servers and playground tests
├── a2a.spec.ts           # A2A agents tests
├── ap2.spec.ts           # AP2 tasks tests
├── skins.spec.ts         # Skin system tests (comprehensive)
├── integration.spec.ts   # Integration and workflow tests
└── helpers/
    └── test-utils.ts     # Reusable test utilities
```

### Test File Organization

Each test file follows this structure:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/feature-page');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
    await expect(page.getByText('Expected Text')).toBeVisible();
  });
});
```

## Writing Tests

### Basic Test

```typescript
import { test, expect } from '@playwright/test';

test('page loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ConsciousOps/);
});
```

### Testing Navigation

```typescript
test('navigates to skins page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Skins' }).click();
  await expect(page).toHaveURL(/\/skins/);
});
```

### Testing Forms

```typescript
test('creates new item', async ({ page }) => {
  await page.goto('/items');

  // Open modal
  await page.getByRole('button', { name: /Add Item/i }).click();

  // Fill form
  await page.getByLabel(/Name/i).fill('Test Item');
  await page.getByLabel(/Description/i).fill('Description');

  // Submit
  await page.getByRole('button', { name: /Add$/i }).click();

  // Verify
  await expect(page.getByText('Test Item')).toBeVisible();
});
```

### Testing Modals

```typescript
test('opens and closes modal', async ({ page }) => {
  await page.goto('/');

  // Open modal
  await page.getByRole('button', { name: 'Open' }).click();
  await expect(page.getByRole('heading', { name: 'Modal Title' })).toBeVisible();

  // Close modal
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('heading', { name: 'Modal Title' })).not.toBeVisible();
});
```

### Testing State Changes

```typescript
test('updates status', async ({ page }) => {
  await page.goto('/items');

  // Initial state
  await expect(page.getByText('Pending')).toBeVisible();

  // Trigger state change
  await page.getByRole('button', { name: 'Activate' }).click();

  // Verify new state
  await expect(page.getByText('Active')).toBeVisible();
});
```

### Testing Responsive Design

```typescript
test('works on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });

  await page.goto('/');

  // Mobile menu button should be visible
  await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
});
```

### Testing localStorage

```typescript
test('persists data in localStorage', async ({ page }) => {
  await page.goto('/');

  // Get localStorage data
  const data = await page.evaluate(() => {
    return localStorage.getItem('my-store');
  });

  expect(data).toBeTruthy();
});
```

## Test Utilities

We provide helper functions in `e2e/helpers/test-utils.ts`:

### Form Helpers

```typescript
import { fillFormAndSubmit } from './helpers/test-utils';

await fillFormAndSubmit(
  page,
  {
    'Server Name': 'My Server',
    'URL': 'http://example.com'
  },
  /Add Server$/
);
```

### Storage Helpers

```typescript
import { clearLocalStorage, getLocalStorageItem } from './helpers/test-utils';

// Clear storage
await clearLocalStorage(page);

// Get item
const value = await getLocalStorageItem(page, 'skin-store');
```

### Feature-Specific Helpers

```typescript
import { addMCPServer, addA2AAgent, createAP2Task } from './helpers/test-utils';

// Add MCP server
await addMCPServer(page, 'Test Server', 'sse', 'http://test.com/sse');

// Add A2A agent
await addA2AAgent(page, 'agent-1', 'Provider', [
  { name: 'capability', description: 'Does something' }
]);

// Create AP2 task
await createAP2Task(page, 'My Task', 'agent-1', [
  { name: 'action', type: 'execute' }
]);
```

### Skin Helpers

```typescript
import { activateSkin, createCustomSkin } from './helpers/test-utils';

// Activate existing skin
await activateSkin(page, 'IDE Workspace');

// Create custom skin
await createCustomSkin(
  page,
  'My Skin',
  'Description',
  ['Chat Interface', 'Terminal']
);
```

## Best Practices

### 1. Use Descriptive Test Names

**Good:**
```typescript
test('should display error message when form submission fails', async ({ page }) => {
  // ...
});
```

**Bad:**
```typescript
test('test 1', async ({ page }) => {
  // ...
});
```

### 2. Isolate Tests

Each test should be independent:

```typescript
test.beforeEach(async ({ page }) => {
  // Reset state before each test
  await page.goto('/');
  await clearLocalStorage(page);
});
```

### 3. Use Explicit Waits

```typescript
// Good - explicit wait for element
await expect(page.getByText('Loaded')).toBeVisible();

// Avoid - arbitrary timeout
await page.waitForTimeout(5000);
```

### 4. Use Semantic Selectors

**Priority order:**
1. Role: `getByRole('button', { name: 'Submit' })`
2. Label: `getByLabel('Email')`
3. Text: `getByText('Welcome')`
4. Test ID: `getByTestId('submit-button')`
5. CSS: `locator('.submit-btn')` (last resort)

### 5. Group Related Tests

```typescript
test.describe('User Authentication', () => {
  test('logs in successfully', async ({ page }) => {
    // ...
  });

  test('shows error for invalid credentials', async ({ page }) => {
    // ...
  });
});
```

### 6. Clean Up After Tests

```typescript
test.afterEach(async ({ page }) => {
  // Clean up created data
  await clearLocalStorage(page);
});
```

### 7. Handle Flaky Tests

```typescript
// Add retries for specific tests
test('flaky test', async ({ page }) => {
  test.setTimeout(30000); // Increase timeout
  // ...
});

// Or configure globally in playwright.config.ts
```

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npm test

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Docker

Run tests in Docker:

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "test"]
```

```bash
docker build -t consciousops-tests .
docker run consciousops-tests
```

## Troubleshooting

### Tests Fail Locally

**Problem**: Tests pass in CI but fail locally

**Solution**:
```bash
# Update browsers
npx playwright install

# Clear cache
rm -rf node_modules playwright-report
npm install
```

### Element Not Found

**Problem**: `Error: locator.click: Target closed`

**Solution**:
```typescript
// Add explicit wait
await page.waitForLoadState('networkidle');
await element.click();
```

### Timeout Errors

**Problem**: `Test timeout of 30000ms exceeded`

**Solution**:
```typescript
// Increase timeout for specific test
test('slow test', async ({ page }) => {
  test.setTimeout(60000);
  // ...
});

// Or globally in playwright.config.ts
export default defineConfig({
  timeout: 60000,
});
```

### Flaky Tests

**Problem**: Tests pass/fail intermittently

**Solution**:
```typescript
// Use auto-waiting assertions
await expect(page.getByText('Result')).toBeVisible();

// Add retry logic
await expect(async () => {
  const text = await page.textContent('.result');
  expect(text).toBe('Expected');
}).toPass();
```

### Storage Not Persisting

**Problem**: localStorage data not available

**Solution**:
```typescript
// Ensure page is loaded
await page.goto('/', { waitUntil: 'networkidle' });

// Set storage before navigation
await page.addInitScript(() => {
  localStorage.setItem('key', 'value');
});
```

### Screenshots for Debugging

```typescript
test('debug test', async ({ page }) => {
  await page.goto('/');

  // Take screenshot
  await page.screenshot({ path: 'debug-screenshot.png' });

  // Take full page screenshot
  await page.screenshot({ path: 'full-page.png', fullPage: true });
});
```

### Trace Viewer

```bash
# Run tests with tracing
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

## Test Coverage

Current test coverage:

| Feature | Tests | Coverage |
|---------|-------|----------|
| Dashboard | 12 | ✅ Complete |
| MCP Servers | 10 | ✅ Complete |
| MCP Playground | 6 | ✅ Complete |
| A2A Agents | 10 | ✅ Complete |
| AP2 Tasks | 12 | ✅ Complete |
| Skins Management | 15 | ✅ Complete |
| Skin Builder | 14 | ✅ Complete |
| Workspace | 8 | ✅ Complete |
| Integration | 11 | ✅ Complete |
| **Total** | **98** | **✅ Complete** |

## Performance Testing

### Measuring Page Load

```typescript
test('page loads quickly', async ({ page }) => {
  const startTime = Date.now();

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const loadTime = Date.now() - startTime;

  expect(loadTime).toBeLessThan(3000); // Should load in < 3s
});
```

### Measuring Interaction

```typescript
test('form submission is fast', async ({ page }) => {
  await page.goto('/items');

  const startTime = Date.now();

  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByLabel('Name').fill('Test');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Test')).toBeVisible();

  const duration = Date.now() - startTime;

  expect(duration).toBeLessThan(2000); // Should complete in < 2s
});
```

## Accessibility Testing

```typescript
import { injectAxe, checkA11y } from 'axe-playwright';

test('page is accessible', async ({ page }) => {
  await page.goto('/');

  await injectAxe(page);
  await checkA11y(page);
});
```

## Visual Regression Testing

```typescript
test('visual snapshot', async ({ page }) => {
  await page.goto('/');

  // Compare screenshot
  await expect(page).toHaveScreenshot('dashboard.png');
});
```

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Test Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Guide](https://playwright.dev/docs/ci)

## Contributing

When adding new features:

1. Write tests for new functionality
2. Run all tests locally before committing
3. Ensure tests pass in CI/CD
4. Update this documentation if needed

---

Happy testing! 🧪
