# Component Library

ConsciousOps provides a comprehensive library of reusable React components designed for building AI management interfaces. All components support dark mode and are fully TypeScript typed.

## Table of Contents

- [UI Primitives](#ui-primitives)
- [Dashboard Components](#dashboard-components)
- [MCP Components](#mcp-components)
- [MCP UI Components](#mcp-ui-components)
- [A2A Components](#a2a-components)
- [AP2 Components](#ap2-components)
- [Layout Components](#layout-components)
- [Styling Guide](#styling-guide)

## UI Primitives

### Card

Located in `src/components/ui/Card.tsx`

A flexible container component with consistent styling and dark mode support.

#### Usage

```typescript
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

<Card hover>
  <CardHeader>
    <h2>Title</h2>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
</Card>
```

#### Props

**Card**
- `children`: ReactNode - Card content
- `className?`: string - Additional CSS classes
- `hover?`: boolean - Enable hover effect (default: false)

**CardHeader**
- `children`: ReactNode - Header content
- `className?`: string - Additional CSS classes

**CardContent**
- `children`: ReactNode - Content area
- `className?`: string - Additional CSS classes

#### Examples

**Basic Card**
```tsx
<Card>
  <CardContent>
    Simple card content
  </CardContent>
</Card>
```

**Card with Hover Effect**
```tsx
<Card hover className="cursor-pointer">
  <CardHeader>
    <h3>Clickable Card</h3>
  </CardHeader>
  <CardContent>
    Click me!
  </CardContent>
</Card>
```

**Card with Custom Styling**
```tsx
<Card className="border-2 border-blue-500">
  <CardHeader className="bg-blue-50 dark:bg-blue-900">
    <h3>Custom Styled</h3>
  </CardHeader>
  <CardContent>
    With custom colors
  </CardContent>
</Card>
```

### Button

Located in `src/components/ui/Button.tsx`

A versatile button component with multiple variants and sizes.

#### Usage

```typescript
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

#### Props

- `children`: ReactNode - Button label
- `variant?`: 'primary' | 'secondary' | 'outline' | 'ghost' - Button style (default: 'primary')
- `size?`: 'sm' | 'md' | 'lg' - Button size (default: 'md')
- `disabled?`: boolean - Disable button (default: false)
- `className?`: string - Additional CSS classes
- `onClick?`: () => void - Click handler
- `type?`: 'button' | 'submit' | 'reset' - Button type (default: 'button')

#### Examples

**Primary Button**
```tsx
<Button variant="primary">
  Primary Action
</Button>
```

**Secondary Button**
```tsx
<Button variant="secondary" size="lg">
  Secondary Action
</Button>
```

**Outline Button**
```tsx
<Button variant="outline">
  Outline Style
</Button>
```

**Ghost Button**
```tsx
<Button variant="ghost" size="sm">
  Subtle Action
</Button>
```

**Disabled Button**
```tsx
<Button disabled>
  Cannot Click
</Button>
```

### Badge

Located in `src/components/ui/Badge.tsx`

Status indicator component with color variants.

#### Usage

```typescript
import { Badge } from '@/components/ui/Badge';

<Badge variant="success">Active</Badge>
```

#### Props

- `children`: ReactNode - Badge label
- `variant?`: 'default' | 'success' | 'warning' | 'error' | 'info' - Badge color (default: 'default')
- `className?`: string - Additional CSS classes

#### Examples

**Status Badges**
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="default">Default</Badge>
```

**Custom Styled Badge**
```tsx
<Badge variant="success" className="text-lg px-4 py-2">
  Large Success
</Badge>
```

## Dashboard Components

### MetricCard

Located in `src/components/dashboard/MetricCard.tsx`

Display key metrics with title, value, and optional icon.

#### Usage

```typescript
import { MetricCard } from '@/components/dashboard/MetricCard';

<MetricCard
  title="Total Users"
  value={1234}
  icon={<UsersIcon />}
  trend="+12%"
/>
```

#### Props

- `title`: string - Metric title
- `value`: string | number - Metric value
- `icon?`: ReactNode - Optional icon
- `trend?`: string - Optional trend indicator
- `className?`: string - Additional CSS classes

### QuickActions

Located in `src/components/dashboard/QuickActions.tsx`

Grid of action buttons for common operations.

#### Usage

```typescript
import { QuickActions } from '@/components/dashboard/QuickActions';

<QuickActions />
```

Displays 4 quick action buttons:
- Deploy New Model
- Configure Agent
- Run Task
- View Analytics

### SystemHealth

Located in `src/components/dashboard/SystemHealth.tsx`

Display system health metrics with visual indicators.

#### Usage

```typescript
import { SystemHealth } from '@/components/dashboard/SystemHealth';

<SystemHealth />
```

Shows:
- CPU Usage
- Memory Usage
- Storage Usage

### RecentActivity

Located in `src/components/dashboard/RecentActivity.tsx`

List of recent activities with timestamps.

#### Usage

```typescript
import { RecentActivity } from '@/components/dashboard/RecentActivity';

<RecentActivity />
```

Displays activity feed with:
- Activity type badge
- Activity description
- Timestamp

## MCP Components

### MCPServerCard

Located in `src/components/mcp/MCPServerCard.tsx`

Display and manage MCP server information.

#### Usage

```typescript
import { MCPServerCard } from '@/components/mcp/MCPServerCard';

<MCPServerCard
  server={serverConfig}
  onConnect={handleConnect}
  onDisconnect={handleDisconnect}
  onDelete={handleDelete}
  onDetails={handleDetails}
/>
```

#### Props

- `server`: MCPServerConfig - Server configuration
- `onConnect`: (server: MCPServerConfig) => void - Connect handler
- `onDisconnect`: (serverId: string) => void - Disconnect handler
- `onDelete`: (serverId: string) => void - Delete handler
- `onDetails`: (server: MCPServerConfig) => void - Details handler

#### Features

- Status badge (connected/disconnected/connecting/error)
- Transport type display
- Action buttons (Connect, Disconnect, Details, Delete)
- Server description
- URL display

### AddMCPServerModal

Located in `src/components/mcp/AddMCPServerModal.tsx`

Modal dialog for adding new MCP servers.

#### Usage

```typescript
import { AddMCPServerModal } from '@/components/mcp/AddMCPServerModal';

<AddMCPServerModal
  isOpen={isOpen}
  onClose={handleClose}
  onAdd={handleAdd}
/>
```

#### Props

- `isOpen`: boolean - Modal visibility
- `onClose`: () => void - Close handler
- `onAdd`: (server: MCPServerConfig) => void - Add server handler

#### Features

- Form validation
- Transport type selection (STDIO, SSE, WebSocket)
- Dynamic field labels based on transport
- Dark mode support

### MCPServerDetails

Located in `src/components/mcp/MCPServerDetails.tsx`

Detailed view of MCP server capabilities.

#### Usage

```typescript
import { MCPServerDetails } from '@/components/mcp/MCPServerDetails';

<MCPServerDetails
  server={serverConfig}
  connection={connectionData}
  onClose={handleClose}
/>
```

#### Props

- `server`: MCPServerConfig - Server configuration
- `connection?`: MCPConnection - Connection details
- `onClose`: () => void - Close handler

#### Features

- Server information display
- Capabilities summary (tools, resources, prompts)
- Connection status
- Close button

## MCP UI Components

### ToolCaller

Located in `src/components/mcp-ui/ToolCaller.tsx`

Interactive interface for calling MCP tools.

#### Usage

```typescript
import { ToolCaller } from '@/components/mcp-ui/ToolCaller';

<ToolCaller />
```

#### Features

- Server selection dropdown
- Tool selection dropdown
- Dynamic parameter form generation
- JSON result display
- Execute button
- Loading states

### ResourceBrowser

Located in `src/components/mcp-ui/ResourceBrowser.tsx`

Browse and view MCP resources.

#### Usage

```typescript
import { ResourceBrowser } from '@/components/mcp-ui/ResourceBrowser';

<ResourceBrowser />
```

#### Features

- Server selection
- Resource list with mime-type icons
- Resource details modal
- Content viewing based on mime-type
- Empty state handling

### PromptExecutor

Located in `src/components/mcp-ui/PromptExecutor.tsx`

Execute MCP prompts with arguments.

#### Usage

```typescript
import { PromptExecutor } from '@/components/mcp-ui/PromptExecutor';

<PromptExecutor />
```

#### Features

- Server selection
- Prompt selection
- Dynamic argument inputs
- Required field validation
- Result display
- Execute button

## A2A Components

### AgentCard

Located in `src/components/a2a/AgentCard.tsx`

Display and manage A2A agent information.

#### Usage

```typescript
import { AgentCard } from '@/components/a2a/AgentCard';

<AgentCard
  agent={agentData}
  onSendMessage={handleSendMessage}
  onDelete={handleDelete}
  onDetails={handleDetails}
/>
```

#### Props

- `agent`: A2AAgent - Agent data
- `onSendMessage`: (agent: A2AAgent) => void - Send message handler
- `onDelete`: (agentId: string) => void - Delete handler
- `onDetails`: (agent: A2AAgent) => void - Details handler

#### Features

- Status badge (active/inactive/busy)
- Capability count display
- Provider and tags
- Action buttons
- Hover effects

### AddAgentModal

Located in `src/components/a2a/AddAgentModal.tsx`

Modal dialog for adding new A2A agents.

#### Usage

```typescript
import { AddAgentModal } from '@/components/a2a/AddAgentModal';

<AddAgentModal
  isOpen={isOpen}
  onClose={handleClose}
  onAdd={handleAdd}
/>
```

#### Props

- `isOpen`: boolean - Modal visibility
- `onClose`: () => void - Close handler
- `onAdd`: (agent: A2AAgent) => void - Add agent handler

#### Features

- Form validation
- Dynamic capability builder
- Tag input (comma-separated)
- Optional fields (endpoint, description)
- Add/remove capabilities

### SendMessageModal

Located in `src/components/a2a/SendMessageModal.tsx`

Modal dialog for sending messages between agents.

#### Usage

```typescript
import { SendMessageModal } from '@/components/a2a/SendMessageModal';

<SendMessageModal
  isOpen={isOpen}
  onClose={handleClose}
  fromAgent={senderAgent}
  agents={allAgents}
/>
```

#### Props

- `isOpen`: boolean - Modal visibility
- `onClose`: () => void - Close handler
- `fromAgent`: A2AAgent - Sending agent
- `agents`: A2AAgent[] - All available agents

#### Features

- Target agent selection
- Message type selection (request/response/notification)
- Capability selection (for requests)
- JSON content editor
- Priority selection
- Conversation ID support

## AP2 Components

### TaskCard

Located in `src/components/ap2/TaskCard.tsx`

Display and manage AP2 task information.

#### Usage

```typescript
import { TaskCard } from '@/components/ap2/TaskCard';

<TaskCard
  task={taskData}
  onExecute={handleExecute}
  onCancel={handleCancel}
  onDelete={handleDelete}
  onDetails={handleDetails}
/>
```

#### Props

- `task`: AP2Task - Task data
- `onExecute`: (taskId: string) => void - Execute handler
- `onCancel`: (taskId: string) => void - Cancel handler
- `onDelete`: (taskId: string) => void - Delete handler
- `onDetails`: (task: AP2Task) => void - Details handler

#### Features

- Status badge with color coding
- Progress bar (0-100%)
- Action count display
- Agent ID display
- Conditional action buttons based on status
- Timestamp display

### CreateTaskModal

Located in `src/components/ap2/CreateTaskModal.tsx`

Modal dialog for creating new AP2 tasks.

#### Usage

```typescript
import { CreateTaskModal } from '@/components/ap2/CreateTaskModal';

<CreateTaskModal
  isOpen={isOpen}
  onClose={handleClose}
  onCreate={handleCreate}
/>
```

#### Props

- `isOpen`: boolean - Modal visibility
- `onClose`: () => void - Close handler
- `onCreate`: (task: Partial<AP2Task>) => void - Create task handler

#### Features

- Complex form with multiple sections
- Dynamic action builder with all 5 types
- Dynamic resource builder with all types
- Action dependency support
- Parameter key-value editor
- Form validation
- Scrollable content

## Layout Components

### Navigation

Located in `src/components/Navigation.tsx`

Main navigation component with mobile support.

#### Usage

```typescript
import { Navigation } from '@/components/Navigation';

<Navigation />
```

#### Features

- Desktop horizontal navigation
- Mobile hamburger menu
- Active route highlighting
- ConsciousOps branding
- Links to all major pages:
  - Dashboard
  - MCP Servers
  - MCP Playground
  - A2A Agents
  - AP2 Tasks
  - Models
  - Deployments
  - Analytics
  - Settings

#### Customization

Add new navigation items in `src/components/Navigation.tsx`:

```typescript
const navItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Your Page', href: '/your-page' },
  // ...
];
```

## Styling Guide

### Tailwind CSS Classes

All components use Tailwind CSS with consistent patterns:

#### Colors

**Background**
- Light: `bg-white`, `bg-gray-50`, `bg-gray-100`
- Dark: `dark:bg-gray-800`, `dark:bg-gray-900`

**Text**
- Light: `text-gray-900`, `text-gray-700`
- Dark: `dark:text-white`, `dark:text-gray-300`

**Borders**
- Light: `border-gray-200`, `border-gray-300`
- Dark: `dark:border-gray-700`, `dark:border-gray-600`

#### Status Colors

**Success** (Green)
- `bg-green-100`, `text-green-800`, `border-green-300`
- Dark: `dark:bg-green-900`, `dark:text-green-200`

**Warning** (Yellow)
- `bg-yellow-100`, `text-yellow-800`, `border-yellow-300`
- Dark: `dark:bg-yellow-900`, `dark:text-yellow-200`

**Error** (Red)
- `bg-red-100`, `text-red-800`, `border-red-300`
- Dark: `dark:bg-red-900`, `dark:text-red-200`

**Info** (Blue)
- `bg-blue-100`, `text-blue-800`, `border-blue-300`
- Dark: `dark:bg-blue-900`, `dark:text-blue-200`

#### Spacing

Use consistent spacing scale:
- `p-4`, `p-6`, `p-8` - Padding
- `m-4`, `m-6`, `m-8` - Margin
- `gap-4`, `gap-6`, `gap-8` - Grid/Flex gap
- `space-y-4`, `space-x-4` - Stack spacing

#### Typography

- Headings: `text-xl`, `text-2xl`, `text-3xl`
- Font weights: `font-medium`, `font-semibold`, `font-bold`
- Line height: `leading-tight`, `leading-normal`

#### Interactive Elements

- Hover: `hover:bg-gray-50`, `hover:shadow-lg`
- Focus: `focus:ring-2`, `focus:ring-blue-500`
- Transition: `transition-all`, `duration-200`
- Cursor: `cursor-pointer`, `cursor-not-allowed`

### Dark Mode

All components support dark mode using Tailwind's `dark:` prefix:

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content that adapts to dark mode
</div>
```

### Responsive Design

Use Tailwind breakpoints for responsive design:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* Responsive grid */}
</div>
```

Breakpoints:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px
- `2xl:` - 1536px

## Creating Custom Components

### Component Template

```typescript
import React from 'react';

interface MyComponentProps {
  title: string;
  description?: string;
  onAction?: () => void;
}

export function MyComponent({ title, description, onAction }: MyComponentProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}

      {onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Action
        </button>
      )}
    </div>
  );
}
```

### Best Practices

1. **TypeScript Types** - Always define prop interfaces
2. **Dark Mode** - Support both light and dark themes
3. **Accessibility** - Use semantic HTML and ARIA labels
4. **Responsive** - Test on different screen sizes
5. **Consistent Styling** - Follow Tailwind conventions
6. **Optional Props** - Use `?` for optional properties
7. **Event Handlers** - Use clear naming (`onAction`, `onClick`)
8. **Loading States** - Handle loading and error states
9. **Empty States** - Display helpful messages when no data
10. **Documentation** - Document props and usage

## Component Composition

Combine components to build complex interfaces:

```tsx
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

function CustomCard() {
  return (
    <Card hover>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3>My Custom Card</h3>
          <Badge variant="success">Active</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p>Card content here</p>

        <div className="flex gap-2 mt-4">
          <Button variant="primary">Primary</Button>
          <Button variant="outline">Secondary</Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Testing Components

### Example Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Development Guide](./DEVELOPMENT.md)
