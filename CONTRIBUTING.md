# Contributing to ConsciousOps

First off, thank you for considering contributing to ConsciousOps! It's people like you that make ConsciousOps such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected
- **Include screenshots** if relevant
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful** to most users
- **List any similar features** in other applications if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the development setup** instructions below
3. **Make your changes** following our coding standards
4. **Add tests** for any new functionality
5. **Ensure all tests pass** (`npm test`)
6. **Update documentation** as needed
7. **Write a clear commit message** following our commit conventions
8. **Submit a pull request** with a comprehensive description

## Development Setup

### Prerequisites

- Node.js 18.17 or higher
- npm 9.0 or higher
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/ai-management-platform.git
cd ai-management-platform

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Project Structure

```
ai-management-platform/
├── src/
│   ├── app/              # Next.js pages (App Router)
│   ├── components/       # React components
│   ├── lib/              # Business logic & stores
│   └── types/            # TypeScript definitions
├── e2e/                  # Playwright E2E tests
├── docs/                 # Documentation
└── public/               # Static assets
```

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm test           # Run E2E tests
npm run test:ui    # Run tests in UI mode
npm run test:debug # Debug tests
```

## Coding Standards

### TypeScript

- **Use strict TypeScript** - No `any` types allowed
- **Define interfaces** for all data structures
- **Use type inference** where appropriate
- **Export types** from `src/types/` directory

### React

- **Use functional components** with hooks
- **Follow the hooks rules** (no conditional hooks)
- **Use meaningful component names** in PascalCase
- **Keep components focused** - Single responsibility
- **Extract reusable logic** into custom hooks

### Styling

- **Use Tailwind CSS** utility classes
- **Follow mobile-first** responsive design
- **Use semantic HTML** elements
- **Ensure accessibility** (ARIA labels, keyboard navigation)
- **Support dark mode** where applicable

### File Naming

- **Components**: PascalCase (e.g., `ChatComponent.tsx`)
- **Utilities**: camelCase (e.g., `skin-store.ts`)
- **Types**: camelCase (e.g., `mcp.ts`)
- **Tests**: kebab-case with `.spec.ts` (e.g., `dashboard.spec.ts`)

### Code Organization

- **One component per file** (except small helper components)
- **Group related files** in directories
- **Export from index files** for cleaner imports
- **Keep files under 300 lines** when possible

## Testing Requirements

### Writing Tests

All new features must include E2E tests:

```typescript
// e2e/your-feature.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Your Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-feature');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
    await expect(page.getByText('Expected Text')).toBeVisible();
  });
});
```

### Test Coverage

- **Feature tests** - Test individual page functionality
- **Integration tests** - Test complete user workflows
- **Responsive tests** - Test mobile and desktop views
- **Persistence tests** - Test localStorage and state management

### Running Tests

```bash
# All tests
npm test

# Specific test file
npx playwright test e2e/your-feature.spec.ts

# Watch mode
npx playwright test --ui

# Debug mode
npm run test:debug
```

## Documentation

### Updating Documentation

When adding new features, update the relevant documentation:

- **README.md** - Add feature to overview
- **Feature docs** - Create or update in `docs/` directory
- **Code comments** - Add JSDoc comments for complex functions
- **CHANGELOG.md** - Add entry for your changes

### Documentation Style

- **Use clear, concise language**
- **Include code examples** for complex features
- **Add visual aids** (diagrams, screenshots) when helpful
- **Keep it up to date** - Update docs when code changes

## Commit Message Guidelines

We follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat(skins): add new grid layout option

Add support for 4-column grid layouts in skin builder.
Users can now create more complex workspace layouts.

Closes #123
```

```
fix(mcp): resolve WebSocket connection timeout

WebSocket connections were timing out after 30 seconds.
Increased timeout to 60 seconds and added retry logic.

Fixes #456
```

## Pull Request Process

1. **Create a feature branch** from `main`
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** following the coding standards

3. **Test your changes**
   ```bash
   npm run build  # Ensure it builds
   npm test       # Run all tests
   npm run lint   # Check code style
   ```

4. **Commit your changes** using conventional commits
   ```bash
   git add .
   git commit -m "feat(scope): your message"
   ```

5. **Push to your fork**
   ```bash
   git push origin feat/your-feature-name
   ```

6. **Open a Pull Request** on GitHub with:
   - Clear title following conventional commits
   - Detailed description of changes
   - Screenshots for UI changes
   - Reference to related issues
   - Confirmation that tests pass

7. **Respond to feedback** from maintainers

8. **Once approved**, your PR will be merged!

## Review Process

### What We Look For

- **Code quality** - Clean, readable, maintainable code
- **Tests** - Comprehensive test coverage
- **Documentation** - Updated docs for new features
- **Performance** - No unnecessary re-renders or heavy operations
- **Accessibility** - Keyboard navigation, ARIA labels
- **Mobile support** - Responsive design

### Timeline

- **Initial review** - Within 3-5 business days
- **Follow-up reviews** - Within 1-2 business days
- **Merge** - After approval and passing CI

## Getting Help

### Resources

- **Documentation** - Check the [docs/](docs/) directory
- **Examples** - Look at existing features for patterns
- **Testing Guide** - See [docs/TESTING.md](docs/TESTING.md)
- **Development Guide** - See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)

### Questions?

- **Search existing issues** - Your question may already be answered
- **Open a discussion** - Use GitHub Discussions for questions
- **Join our community** - [Add community links if applicable]

## Recognition

Contributors are recognized in several ways:

- **Contributors list** - Added to README.md
- **Release notes** - Mentioned in CHANGELOG.md
- **GitHub insights** - Visible in repository contributors

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions to open source make projects like ConsciousOps possible. We appreciate your time and effort!

---

**Happy Contributing! 🚀**
