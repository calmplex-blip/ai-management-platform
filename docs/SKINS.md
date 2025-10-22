# Skin System Guide

The ConsciousOps Skin System enables you to create custom, composable workspace layouts tailored to your specific AI workflows. Build your perfect workspace with drag-and-drop components, save layouts, and switch between them instantly.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Template Skins](#template-skins)
- [Creating Custom Skins](#creating-custom-skins)
- [Component Library](#component-library)
- [Layout System](#layout-system)
- [Use Cases](#use-cases)
- [Advanced Features](#advanced-features)
- [API Reference](#api-reference)

## Overview

### What is a Skin?

A **skin** is a complete workspace layout definition that includes:
- **Layout configuration** - Grid or flex-based positioning
- **Components** - Interactive UI elements (chat, editor, terminal, etc.)
- **Theme settings** - Light/dark mode preferences
- **Metadata** - Name, description, category, tags

### Why Use Skins?

Different tasks require different tools:
- **Coding?** You need an editor, terminal, and file browser
- **Chatting with AI?** Focus on conversation with context panels
- **Monitoring agents?** Display metrics, tasks, and system health
- **Research?** Multiple resource viewers and note-taking

Instead of juggling windows, create a skin for each workflow and switch instantly.

## Getting Started

### Accessing the Skin System

1. Navigate to **Skins** in the main navigation
2. Browse available skins and templates
3. Click **Activate** to use a skin
4. Click **Open** to launch the workspace

### Your First Workspace

The easiest way to start is with a template:

1. Go to `/skins`
2. Find the **"AI Chat Station"** template
3. Click **Activate**
4. Click **Open** or navigate to `/workspace`

You now have a chat interface with two resource portals!

### Creating Your First Custom Skin

1. Click **"+ Create New Skin"** on the skins page
2. Name your skin (e.g., "My Dev Environment")
3. Go to the **Components** tab
4. Click components from the left panel to add them
5. Go to **Preview** to see your layout
6. Click **Save Skin**

## Template Skins

ConsciousOps includes 7 pre-built templates:

### 1. IDE Workspace

**Perfect for**: Software development

**Layout:**
```
┌─────────┬─────────────────┐
│  Chat   │                 │
├─────────┤     Editor      │
│  Files  │                 │
│         ├─────────────────┤
│         │    Terminal     │
└─────────┴─────────────────┘
```

**Components:**
- AI Assistant chat
- Code editor with syntax highlighting
- File browser
- Interactive terminal

**Use case:** Write code with AI assistance, run commands, manage files - all in one view.

### 2. AI Chat Station

**Perfect for**: AI-assisted research and content creation

**Layout:**
```
┌─────────────────────────────┐
│                             │
│          AI Chat            │
│                             │
├─────────────┬───────────────┤
│  Portal 1   │   Portal 2    │
│ (Resource)  │  (Resource)   │
└─────────────┴───────────────┘
```

**Components:**
- Chat interface (top, full width)
- Two IFrame portals for MCP resources

**Use case:** Chat with AI while viewing reference materials in the portals. Perfect for asking questions about documentation, code, or data.

**Example workflow:**
1. Load a document in Portal 1
2. Load related API docs in Portal 2
3. Ask AI questions about both in the chat
4. AI can reference both resources

### 3. Analytics Dashboard

**Perfect for**: Monitoring and observability

**Layout:**
```
┌─────────┬─────────┬─────────┐
│ Metrics │ Metrics │ Health  │
├─────────┴─────────┴─────────┤
│        Active Tasks         │
├─────────────────────────────┤
│      Deployed Agents        │
└─────────────────────────────┘
```

**Components:**
- Key metrics cards
- System health indicators
- AP2 tasks list
- A2A agents grid

**Use case:** Real-time monitoring of your AI infrastructure.

### 4. Agent Control Center

**Perfect for**: Multi-agent orchestration

**Layout:**
```
┌──────────┬──────────────────┐
│          │                  │
│   Chat   │   Active Agents  │
│ Command  │                  │
│          ├──────────────────┤
│          │  Running Tasks   │
│          ├──────────────────┤
│          │   MCP Tools      │
└──────────┴──────────────────┘
```

**Components:**
- Agent command chat
- A2A agents view
- AP2 tasks monitor
- MCP tools panel

**Use case:** Control and coordinate multiple AI agents, assign tasks, monitor execution.

### 5. MCP Explorer

**Perfect for**: Model Context Protocol development

**Layout:**
```
┌─────────┬─────────┬─────────┐
│   MCP   │   MCP   │   MCP   │
│  Tools  │Resource │ Prompts │
│         │         │         │
│         │         │         │
└─────────┴─────────┴─────────┘
```

**Components:**
- MCP Tools executor
- MCP Resources browser
- MCP Prompts runner

**Use case:** Comprehensive MCP server testing and development.

### 6. Minimal Chat

**Perfect for**: Distraction-free AI conversation

**Layout:**
```
┌─────────────────────────────┐
│                             │
│                             │
│          Chat               │
│                             │
│                             │
└─────────────────────────────┘
```

**Components:**
- Chat interface only

**Use case:** Focus mode for deep AI conversations.

### 7. Split View

**Perfect for**: Comparing or dual-context work

**Layout:**
```
┌──────────────┬──────────────┐
│              │              │
│   Editor 1   │   Editor 2   │
│              │              │
│              │              │
└──────────────┴──────────────┘
```

**Components:**
- Two code editors side-by-side

**Use case:** Compare files, review changes, or work on related code.

## Creating Custom Skins

### The Skin Builder

Access the builder at `/skins/builder` or click **"+ Create New Skin"**.

#### Setup Tab

Configure basic information:

- **Skin Name**: Descriptive name (e.g., "Data Science Workspace")
- **Description**: What is this skin for?
- **Category**: IDE, Chat, Analytics, Monitoring, or Custom

You can also start from a template and customize it.

#### Components Tab

Add components to your skin:

**Left Panel:** Available components organized by category
**Right Panel:** Your current components

**To add a component:**
1. Click any component in the left panel
2. It appears in your components list
3. Repeat for all components you need

**To remove a component:**
1. Find it in the right panel
2. Click **Remove**

#### Preview Tab

See your skin in action before saving. The preview shows:
- Actual component rendering
- Layout structure
- Dark mode appearance

### Component Configuration

Each component has configurable properties:

**Example: Chat Component**
```typescript
{
  placeholder: "Ask me anything...",
  provider: "mcp" | "a2a" | "ap2",
  agentId: "specific-agent-id",
  showHistory: true
}
```

**Example: IFrame Component**
```typescript
{
  src: "https://example.com",
  mcpResource: "file:///path/to/resource",
  title: "Resource Viewer",
  sandbox: "allow-same-origin allow-scripts"
}
```

**Example: Code Editor**
```typescript
{
  language: "typescript" | "python" | "javascript",
  theme: "vs-dark" | "light",
  readOnly: false,
  file: "/workspace/src/app.ts"
}
```

## Component Library

### Communication

#### Chat Interface
- **Type**: `chat`
- **Description**: AI chat with MCP/A2A/AP2 integration
- **Props**: placeholder, provider, agentId, showHistory
- **Min Size**: 300px × 400px

**Features:**
- Message history
- Timestamp display
- Provider selection (MCP, A2A, AP2)
- Clear history
- Keyboard shortcuts (Enter to send)

**Example use:**
```typescript
{
  type: 'chat',
  props: {
    placeholder: 'How can I help you code?',
    provider: 'mcp',
    showHistory: true
  }
}
```

### Development

#### Code Editor
- **Type**: `code-editor`
- **Description**: Monaco editor with syntax highlighting
- **Props**: language, theme, readOnly, file
- **Min Size**: 400px × 300px

**Supported Languages:**
- TypeScript/JavaScript
- Python
- JSON
- Markdown
- HTML/CSS
- And more...

**Features:**
- IntelliSense
- Syntax highlighting
- Line numbers
- Minimap
- Auto-formatting
- Multi-cursor editing

#### Terminal
- **Type**: `terminal`
- **Description**: Interactive terminal emulator
- **Props**: shell, workingDirectory, environment
- **Min Size**: 400px × 200px

**Features:**
- Command history (arrow keys)
- Auto-completion
- Multiple shells (bash, zsh, fish)
- Custom working directory

**Built-in commands:**
- `help` - Show available commands
- `clear` - Clear terminal
- `pwd` - Print working directory
- `ls` - List files
- `echo` - Echo text

#### File Browser
- **Type**: `file-browser`
- **Description**: File system browser
- **Props**: rootPath, showHidden
- **Min Size**: 250px × 300px

**Features:**
- Navigate directories
- File type icons
- File sizes and dates
- Show/hide hidden files

### Integration

#### IFrame Portal
- **Type**: `iframe`
- **Description**: Embed external content or MCP resources
- **Props**: src, mcpResource, title, sandbox
- **Min Size**: 200px × 200px

**Use cases:**
- Embed documentation
- Show MCP resources
- Display dashboards
- View external tools

**Security:**
Default sandbox policy: `allow-same-origin allow-scripts`

#### MCP Tools
- **Type**: `mcp-tools`
- **Description**: Execute MCP tools
- **Props**: serverId
- **Min Size**: 350px × 400px

**Note:** Links to MCP Playground for full functionality

#### MCP Resources
- **Type**: `mcp-resources`
- **Description**: Browse MCP resources
- **Props**: serverId
- **Min Size**: 350px × 400px

**Note:** Links to MCP Playground for full functionality

#### MCP Prompts
- **Type**: `mcp-prompts`
- **Description**: Execute MCP prompts
- **Props**: serverId
- **Min Size**: 350px × 400px

**Note:** Links to MCP Playground for full functionality

#### A2A Agents
- **Type**: `a2a-agents`
- **Description**: Manage A2A agents
- **Props**: view (grid/list)
- **Min Size**: 350px × 400px

#### AP2 Tasks
- **Type**: `ap2-tasks`
- **Description**: Manage AP2 tasks
- **Props**: view, filter
- **Min Size**: 350px × 400px

### Monitoring

#### Metrics Dashboard
- **Type**: `metrics`
- **Description**: Display key metrics
- **Props**: refreshInterval
- **Min Size**: 300px × 200px

**Displays:**
- Model count
- Deployment count
- Active agents
- Total tasks

#### System Health
- **Type**: `system-health`
- **Description**: Monitor system resources
- **Props**: showCPU, showMemory, showStorage
- **Min Size**: 300px × 150px

**Monitors:**
- CPU usage
- Memory usage
- Storage usage

### Custom

#### Custom Component
- **Type**: `custom`
- **Description**: Create your own component
- **Props**: content (JSON)
- **Min Size**: 200px × 200px

Build your own components using JSON configuration.

## Layout System

### Grid Layout

The most powerful and flexible layout type.

**Configuration:**
```typescript
{
  type: 'grid',
  areas: [
    'header header header',
    'sidebar main main',
    'sidebar footer footer'
  ],
  columns: '200px 1fr 1fr',
  rows: '100px 1fr 100px',
  gap: '12px'
}
```

**Grid Areas:**
Each string in `areas` represents a row. Each word represents a cell.

**Example:**
```
'chat chat editor'  // Row 1: chat spans 2 cols, editor spans 1
'files files editor' // Row 2: files spans 2 cols, editor spans 1
```

**Column/Row Sizing:**
- `1fr` - One fraction of available space
- `200px` - Fixed pixel width
- `auto` - Size to content
- `minmax(200px, 1fr)` - Minimum and maximum

### Flex Layout

Simple linear layouts.

**Configuration:**
```typescript
{
  type: 'flex',
  direction: 'row' | 'column',
  wrap: true,
  gap: '12px'
}
```

**Use cases:**
- Horizontal tool palettes
- Vertical stacked panels
- Simple side-by-side layouts

### Component Sizing

Each component can specify:
- `width` / `height` - Explicit size
- `minWidth` / `minHeight` - Minimum size
- `flex` - Flex grow/shrink factor
- `gridArea` - Grid area name

## Use Cases

### Software Development

**Skin: "Full Stack Dev"**

Components:
- Code editor (main area)
- Terminal (bottom)
- File browser (left sidebar)
- Chat for AI help (right sidebar)
- API docs in iframe

Workflow:
1. Browse files in sidebar
2. Edit code in main editor
3. Run commands in terminal
4. Ask AI for help in chat
5. Reference docs in iframe

### AI Research

**Skin: "Research Station"**

Components:
- Chat (full width, top)
- Paper PDF (iframe, bottom left)
- Documentation (iframe, bottom middle)
- Notes editor (bottom right)

Workflow:
1. Read paper in left portal
2. Check API docs in middle
3. Take notes in editor
4. Ask AI to explain concepts

### Data Science

**Skin: "Data Lab"**

Components:
- Jupyter notebook (iframe, left)
- Python editor (top right)
- Terminal (bottom right)
- Data visualization (bottom center)

Workflow:
1. Prototype in Jupyter
2. Refine code in editor
3. Run scripts in terminal
4. View results inline

### DevOps Monitoring

**Skin: "Ops Center"**

Components:
- System health (top)
- Metrics dashboard (middle)
- Agent tasks (bottom left)
- Logs terminal (bottom right)
- Alert chat (sidebar)

Workflow:
1. Monitor health at a glance
2. Track key metrics
3. View running tasks
4. Check logs
5. Respond to alerts via chat

### Content Creation

**Skin: "Writer's Studio"**

Components:
- Markdown editor (main)
- AI chat (sidebar)
- Preview (iframe, right)
- Research portals (bottom)

Workflow:
1. Write in markdown
2. Ask AI for suggestions
3. Preview formatted output
4. Reference sources in portals

## Advanced Features

### Skin Duplication

Clone any skin to customize it:

1. Find a skin you like
2. Click **Duplicate**
3. A copy is created with "(Copy)" suffix
4. Edit the copy without affecting the original

**Use case:** Start with a template, tweak it for your needs.

### Skin Categories

Organize skins by category:
- **IDE** - Development environments
- **Chat** - Conversation-focused
- **Analytics** - Monitoring and metrics
- **Monitoring** - System health and alerts
- **Custom** - Everything else

Filter by category on the skins page.

### Skin Tags

Add tags to skins for better organization:

```typescript
tags: ['python', 'data-science', 'jupyter']
```

Search and filter by tags.

### Theme Preferences

Each skin can specify theme preference:
- `light` - Always light mode
- `dark` - Always dark mode
- `auto` - Follow system preference

### Active Skin

The active skin is the one that loads when you visit `/workspace`.

**To change:**
1. Go to `/skins`
2. Click **Activate** on any skin
3. It becomes the active skin

### Skin Persistence

Skins are stored in localStorage and persist across sessions.

**To clear:**
```javascript
localStorage.removeItem('skin-store');
window.location.reload();
```

### Responsive Layouts

All skins are responsive and adapt to screen size:
- Desktop: Full layout
- Tablet: Adjusted columns
- Mobile: Stacked components

## API Reference

### useSkinStore

Zustand store for skin management.

```typescript
import { useSkinStore } from '@/lib/skin-store';

const {
  skins,           // All skins
  activeSkinId,    // Current active skin ID
  addSkin,         // Add new skin
  updateSkin,      // Update existing skin
  deleteSkin,      // Delete skin
  setActiveSkin,   // Set active skin
  duplicateSkin,   // Duplicate skin
} = useSkinStore();
```

**Methods:**

#### addSkin(skin: Skin): void

Add a new skin to the store.

```typescript
const newSkin: Skin = {
  id: crypto.randomUUID(),
  name: 'My Skin',
  category: 'custom',
  layout: { type: 'grid', ... },
  components: [...],
  createdAt: new Date(),
  updatedAt: new Date(),
};

addSkin(newSkin);
```

#### updateSkin(id: string, updates: Partial<Skin>): void

Update an existing skin.

```typescript
updateSkin('skin-id', {
  name: 'Updated Name',
  description: 'New description'
});
```

#### deleteSkin(id: string): void

Delete a skin.

```typescript
deleteSkin('skin-id');
```

#### setActiveSkin(id: string | null): void

Set the active skin.

```typescript
setActiveSkin('skin-id');
```

#### duplicateSkin(id: string): void

Create a copy of a skin.

```typescript
duplicateSkin('skin-id');
// Creates new skin with " (Copy)" suffix
```

### Component Registry

Access all available components.

```typescript
import { COMPONENT_REGISTRY } from '@/lib/component-registry';

// Get component definition
const chatDef = COMPONENT_REGISTRY['chat'];

console.log(chatDef.name);         // "Chat Interface"
console.log(chatDef.category);     // "communication"
console.log(chatDef.defaultProps); // { placeholder: '...', ... }
```

### Skin Templates

Pre-built templates.

```typescript
import { SKIN_TEMPLATES, createSkinFromTemplate } from '@/lib/skin-templates';

// Get template
const ideTemplate = SKIN_TEMPLATES.find(t => t.templateId === 'ide-template');

// Create skin from template
const newSkin = createSkinFromTemplate(ideTemplate);
addSkin(newSkin);
```

### SkinRenderer

Render a skin dynamically.

```typescript
import { SkinRenderer } from '@/components/skin/SkinRenderer';

<SkinRenderer skin={mySkin} className="h-screen" />
```

## Keyboard Shortcuts

When in workspace:

- `Cmd/Ctrl + /` - Toggle skin switcher (coming soon)
- `Cmd/Ctrl + ,` - Open skin settings (coming soon)
- `Esc` - Close modals

Component-specific:

**Chat:**
- `Enter` - Send message
- `Shift + Enter` - New line

**Terminal:**
- `↑` / `↓` - Command history
- `Tab` - Auto-complete (coming soon)

**Editor:**
- Standard Monaco shortcuts apply

## Best Practices

1. **Name clearly** - Use descriptive names like "Python Dev" not "Skin 1"
2. **Start with templates** - Customize existing templates instead of starting from scratch
3. **Test layouts** - Use Preview tab before saving
4. **Consider screen size** - Ensure components have minimum sizes set
5. **Use grid areas** - Grid layouts are more flexible than flex
6. **Group related components** - Keep tools for the same task together
7. **Save variations** - Create multiple skins for different workflows
8. **Tag appropriately** - Use tags for easy filtering later

## Troubleshooting

### Skin won't activate

**Solution:** Check that the skin has at least one component.

### Components overlapping

**Solution:** Check grid area definitions - ensure no duplicates and all areas are defined in columns/rows.

### Workspace is blank

**Solution:** Ensure you've activated a skin. Go to `/skins` and click Activate.

### Changes not saving

**Solution:** Click Save in the builder. Changes are not auto-saved.

### Layout looks broken

**Solution:** Check minimum widths/heights on components. Some components need minimum space to render properly.

### IFrame not loading

**Solution:** Check the URL is correct and the site allows iframe embedding (check CORS/X-Frame-Options).

## Next Steps

- Explore [Component Library](./COMPONENTS.md) for UI component details
- Learn about [MCP Integration](./MCP.md) for tool/resource portals
- Read [Development Guide](./DEVELOPMENT.md) to contribute new components
- Check [API Integration](./API-INTEGRATION.md) for backend connections

## Support

- **GitHub Issues**: Report bugs or request features
- **Discussions**: Share your custom skins with the community
- **Documentation**: Full guides in `/docs`

---

Build your perfect AI workspace with the Skin System!
