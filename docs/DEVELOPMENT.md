# Development Guide

This guide covers everything you need to know to contribute to ConsciousOps, from setting up your development environment to submitting pull requests.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Code Style](#code-style)
- [State Management](#state-management)
- [Adding New Features](#adding-new-features)
- [Testing](#testing)
- [Building and Deployment](#building-and-deployment)
- [Contributing](#contributing)

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18.17 or later
- **npm** 9.0 or later
- **Git** 2.0 or later
- **Code Editor** (VS Code recommended)

### Initial Setup

1. **Clone the repository:**
```bash
git clone https://github.com/your-org/ai-management-platform.git
cd ai-management-platform
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open in browser:**
Navigate to http://localhost:3000

### VS Code Setup

Recommended VS Code extensions:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["className\\s*=\\s*['\"]([^'\"]*)['\"]", "([^'\"]*)"]
  ]
}
```

## Development Workflow

### Branch Strategy

We follow a Git Flow workflow:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature-name
```

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat(mcp): add STDIO transport support"
git commit -m "fix(a2a): resolve message routing issue"
git commit -m "docs(api): update integration guide"
git commit -m "refactor(ap2): simplify action execution logic"
```

### Pull Request Process

1. **Create PR from feature branch to main**
2. **Fill out PR template:**
   - Description of changes
   - Related issues
   - Testing performed
   - Screenshots (if UI changes)
3. **Request review from maintainers**
4. **Address review comments**
5. **Merge after approval**

## Project Structure

```
ai-management-platform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Dashboard page
│   │   ├── globals.css         # Global styles
│   │   ├── mcp-servers/        # MCP management page
│   │   ├── mcp-playground/     # MCP playground page
│   │   ├── a2a-agents/         # A2A management page
│   │   └── ap2-tasks/          # AP2 management page
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # UI primitives
│   │   │   ├── Card.tsx
│   │   │   ├── Button.tsx
│   │   │   └── Badge.tsx
│   │   ├── dashboard/          # Dashboard widgets
│   │   ├── mcp/                # MCP components
│   │   ├── mcp-ui/             # MCP playground components
│   │   ├── a2a/                # A2A components
│   │   ├── ap2/                # AP2 components
│   │   └── Navigation.tsx      # Main navigation
│   │
│   ├── lib/                    # Core logic
│   │   ├── mcp-client.ts       # MCP client manager
│   │   ├── mcp-store.ts        # MCP state
│   │   ├── a2a-manager.ts      # A2A manager
│   │   ├── a2a-store.ts        # A2A state
│   │   ├── ap2-manager.ts      # AP2 manager
│   │   └── ap2-store.ts        # AP2 state
│   │
│   └── types/                  # TypeScript types
│       ├── mcp.ts              # MCP types
│       ├── a2a.ts              # A2A types
│       └── ap2.ts              # AP2 types
│
├── public/                     # Static assets
├── docs/                       # Documentation
├── .next/                      # Next.js build output
├── node_modules/               # Dependencies
│
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind config
├── next.config.mjs             # Next.js config
├── eslint.config.mjs           # ESLint config
└── README.md                   # Project README
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `MCPServerCard.tsx`)
- **Pages**: lowercase (e.g., `mcp-servers/page.tsx`)
- **Utilities**: camelCase (e.g., `mcp-client.ts`)
- **Types**: PascalCase (e.g., `MCPServerConfig`)
- **Stores**: kebab-case with store suffix (e.g., `mcp-store.ts`)

## Code Style

### TypeScript

We use TypeScript strict mode. All code must be fully typed.

**Good:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): User | undefined {
  // Implementation
}
```

**Bad:**
```typescript
function getUser(id: any): any {
  // Implementation
}
```

### React Components

Use functional components with TypeScript:

```typescript
import React from 'react';

interface MyComponentProps {
  title: string;
  description?: string;
  onAction?: () => void;
}

export function MyComponent({
  title,
  description,
  onAction
}: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
}
```

### Hooks

Follow React hooks best practices:

```typescript
import { useState, useEffect, useCallback } from 'react';

function MyComponent() {
  // State
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(false);

  // Memoized callbacks
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.fetchData();
      setData(result);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effects
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <div>{/* Render */}</div>;
}
```

### Styling with Tailwind

Use Tailwind utility classes:

```tsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
    Title
  </h2>
  <p className="text-gray-600 dark:text-gray-400">
    Description
  </p>
</div>
```

**Best Practices:**
- Use semantic color names (e.g., `bg-gray-100` not `bg-gray-1`)
- Always include dark mode variants
- Use consistent spacing scale (4, 6, 8)
- Group related classes together

### ESLint Rules

Our ESLint configuration enforces:

- No unused variables
- No console.log in production
- React hooks rules
- TypeScript strict checks
- Import ordering

Fix linting issues:
```bash
npm run lint
```

## State Management

We use Zustand for state management with localStorage persistence.

### Creating a Store

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MyState {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
}

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item]
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        }))
    }),
    {
      name: 'my-store' // localStorage key
    }
  )
);
```

### Using a Store

```typescript
import { useMyStore } from '@/lib/my-store';

function MyComponent() {
  const { items, addItem, removeItem } = useMyStore();

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => removeItem(item.id)}>
            Delete
          </button>
        </div>
      ))}

      <button onClick={() => addItem({ id: '1', name: 'New' })}>
        Add Item
      </button>
    </div>
  );
}
```

## Adding New Features

### Adding a New Page

1. **Create page directory:**
```bash
mkdir -p src/app/my-page
```

2. **Create page.tsx:**
```typescript
// src/app/my-page/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Page',
  description: 'Description of my page'
};

export default function MyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Page</h1>
        {/* Page content */}
      </main>
    </div>
  );
}
```

3. **Add to navigation:**
```typescript
// src/components/Navigation.tsx
const navItems = [
  // ...existing items
  { name: 'My Page', href: '/my-page' }
];
```

### Adding a New Component

1. **Create component file:**
```bash
mkdir -p src/components/my-feature
touch src/components/my-feature/MyComponent.tsx
```

2. **Implement component:**
```typescript
// src/components/my-feature/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  // Props
}

export function MyComponent(props: MyComponentProps) {
  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

3. **Export from index (optional):**
```typescript
// src/components/my-feature/index.ts
export { MyComponent } from './MyComponent';
```

### Adding a New Protocol Integration

1. **Create types:**
```typescript
// src/types/my-protocol.ts
export interface MyProtocolConfig {
  id: string;
  name: string;
  // ...
}
```

2. **Create manager:**
```typescript
// src/lib/my-protocol-manager.ts
class MyProtocolManager {
  // Implementation
}

export const myProtocolManager = new MyProtocolManager();
```

3. **Create store:**
```typescript
// src/lib/my-protocol-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMyProtocolStore = create()(
  persist(
    (set) => ({
      // State and actions
    }),
    { name: 'my-protocol-store' }
  )
);
```

4. **Create components:**
```bash
mkdir -p src/components/my-protocol
# Add components
```

5. **Create page:**
```bash
mkdir -p src/app/my-protocol
# Add page.tsx
```

6. **Update documentation:**
```bash
touch docs/MY-PROTOCOL.md
# Document the integration
```

## Testing

### Unit Tests

We use Jest and React Testing Library.

**Install testing dependencies:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

**Create test file:**
```typescript
// src/components/ui/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click Me</Button>);

    fireEvent.click(screen.getByText('Click Me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
```

**Run tests:**
```bash
npm test
```

### Integration Tests

Test component interactions:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MCPServerCard } from '../MCPServerCard';

describe('MCPServerCard', () => {
  const mockServer = {
    id: '1',
    name: 'Test Server',
    url: 'http://localhost:8080',
    transportType: 'sse' as const,
    status: 'disconnected' as const
  };

  it('connects to server', async () => {
    const onConnect = jest.fn();
    render(<MCPServerCard server={mockServer} onConnect={onConnect} />);

    fireEvent.click(screen.getByText('Connect'));

    await waitFor(() => {
      expect(onConnect).toHaveBeenCalledWith(mockServer);
    });
  });
});
```

### Manual Testing

Before submitting a PR:

1. **Test all affected pages**
2. **Test in both light and dark mode**
3. **Test responsive behavior** (mobile, tablet, desktop)
4. **Test browser compatibility** (Chrome, Firefox, Safari)
5. **Check console for errors**
6. **Test with mock data**

## Building and Deployment

### Development Build

```bash
npm run dev
```

Runs on http://localhost:3000 with hot reload.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Build Output

Next.js generates:
- `.next/` - Build output
- `out/` - Static export (if configured)

### Environment Variables

Create `.env.local` for local development:

```env
# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3001

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# External services
NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:8080
```

**Important**: Never commit `.env.local` to version control.

### Deployment Platforms

**Vercel** (Recommended):
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Docker**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t consciousops .
docker run -p 3000:3000 consciousops
```

## Contributing

### Contribution Checklist

Before submitting a PR:

- [ ] Code follows style guidelines
- [ ] TypeScript types are complete
- [ ] Components support dark mode
- [ ] Responsive design tested
- [ ] No console.log or debug code
- [ ] ESLint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Manual testing completed
- [ ] Documentation updated
- [ ] Commit messages follow convention

### Code Review Guidelines

When reviewing PRs:

1. **Functionality** - Does it work as intended?
2. **Code Quality** - Is it clean and maintainable?
3. **Performance** - Are there any bottlenecks?
4. **Security** - Are there any vulnerabilities?
5. **Testing** - Are there adequate tests?
6. **Documentation** - Is it well documented?
7. **Style** - Does it follow conventions?

### Getting Help

- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Documentation**: Check the docs/ directory
- **Code Examples**: Look at existing implementations

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [MCP Specification](https://modelcontextprotocol.io/)
- [Component Library](./COMPONENTS.md)
- [API Integration Guide](./API-INTEGRATION.md)

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
