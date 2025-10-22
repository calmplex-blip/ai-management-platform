# ConsciousOps

A comprehensive enterprise-grade AI management platform built with Next.js, React, and TypeScript. ConsciousOps provides unified interfaces for managing AI models, agents, and protocols with consciousness and clarity.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Overview

ConsciousOps is an open-source platform designed to help teams manage, monitor, and optimize their AI operations. It integrates with modern AI protocols including Model Context Protocol (MCP), Agent-to-Agent (A2A), and Agent Protocol 2 (AP2) to provide a unified management experience.

### Key Features

- **Enterprise Dashboard** - Real-time metrics, system health monitoring, and quick actions
- **MCP Integration** - Connect to and manage Model Context Protocol servers
- **MCP Playground** - Interactive environment for testing MCP tools, resources, and prompts
- **A2A Management** - Register agents, send messages, and manage agent-to-agent communication
- **AP2 Task Engine** - Create and execute complex tasks with resource allocation and progress tracking
- **Dark Mode** - Full dark mode support throughout the application
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend Framework** | Next.js 15 with App Router |
| **UI Library** | React 19 |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS |
| **State Management** | Zustand with localStorage persistence |
| **AI Protocols** | @modelcontextprotocol/sdk |
| **Code Editor** | Monaco Editor (@monaco-editor/react) |
| **JSON Viewer** | react-json-view-lite |
| **Package Manager** | npm |

## Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-org/ai-management-platform.git
cd ai-management-platform
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx             # Dashboard home
│   │   ├── mcp-servers/         # MCP server management
│   │   ├── mcp-playground/      # MCP interactive testing
│   │   ├── a2a-agents/          # A2A agent management
│   │   └── ap2-tasks/           # AP2 task management
│   ├── components/              # React components
│   │   ├── ui/                  # Reusable UI primitives
│   │   ├── dashboard/           # Dashboard widgets
│   │   ├── mcp/                 # MCP components
│   │   ├── mcp-ui/              # MCP playground components
│   │   ├── a2a/                 # A2A components
│   │   └── ap2/                 # AP2 components
│   ├── lib/                     # Core logic and managers
│   │   ├── mcp-client.ts        # MCP client manager
│   │   ├── mcp-store.ts         # MCP state management
│   │   ├── a2a-manager.ts       # A2A messaging manager
│   │   ├── a2a-store.ts         # A2A state management
│   │   ├── ap2-manager.ts       # AP2 execution engine
│   │   └── ap2-store.ts         # AP2 state management
│   └── types/                   # TypeScript type definitions
│       ├── mcp.ts               # MCP protocol types
│       ├── a2a.ts               # A2A protocol types
│       └── ap2.ts               # AP2 protocol types
├── public/                      # Static assets
├── docs/                        # Documentation
└── ...config files
```

## Documentation

- **[MCP Integration Guide](docs/MCP.md)** - Connect and manage MCP servers
- **[A2A Integration Guide](docs/A2A.md)** - Work with agent-to-agent communication
- **[AP2 Integration Guide](docs/AP2.md)** - Create and execute AP2 tasks
- **[Component Library](docs/COMPONENTS.md)** - Reusable UI components
- **[Development Guide](docs/DEVELOPMENT.md)** - Contributing and development setup
- **[API Integration](docs/API-INTEGRATION.md)** - Backend integration guide

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on http://localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

## Features in Detail

### Dashboard
The main dashboard provides an at-a-glance view of your AI infrastructure:
- **Metrics**: Track models, deployments, active agents, and tasks
- **Quick Actions**: Deploy models, configure agents, run tasks, and view analytics
- **System Health**: Monitor CPU, memory, and storage
- **Protocol Widgets**: View MCP servers, A2A agents, and AP2 tasks

### MCP Integration
Model Context Protocol (MCP) support includes:
- Connect to MCP servers via SSE, WebSocket, or STDIO transports
- Discover and execute tools with dynamic parameter forms
- Browse resources with mime-type handling
- Execute prompts with custom arguments
- Interactive playground for testing

**Learn more:** [MCP Integration Guide](docs/MCP.md)

### A2A Integration
Agent-to-Agent (A2A) protocol features:
- Register agents with capabilities, tags, and metadata
- Send messages between agents with priority handling
- Thread conversations for context
- Discover agents by capabilities, tags, or provider
- Event-driven message handling

**Learn more:** [A2A Integration Guide](docs/A2A.md)

### AP2 Integration
Agent Protocol 2 (AP2) task management:
- Create tasks with multiple actions and resources
- 5 action types: query, execute, observe, plan, delegate
- Resource allocation and management
- Action dependency resolution
- Real-time progress tracking (0-100%)
- Event-driven status updates

**Learn more:** [AP2 Integration Guide](docs/AP2.md)

## Development

### State Management
ConsciousOps uses Zustand for state management with localStorage persistence:
- `useMCPStore` - MCP servers and connections
- `useA2AStore` - A2A agents and conversations
- `useAP2Store` - AP2 tasks and tools

### Styling
Tailwind CSS is used throughout with:
- Dark mode support via `dark:` prefix
- Custom color scheme for AI/tech aesthetic
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Consistent spacing and typography scale

### Type Safety
Full TypeScript coverage with strict mode enabled:
- Protocol types in `src/types/`
- Component prop types
- Store type definitions
- Manager interface contracts

## Browser Compatibility

ConsciousOps is optimized for modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Note:** MCP STDIO transport requires server-side implementation due to Node.js dependencies. Use SSE or WebSocket transports in the browser.

## Contributing

We welcome contributions! Please see our [Development Guide](docs/DEVELOPMENT.md) for:
- Code style guidelines
- Testing requirements
- Pull request process
- Issue reporting

## Roadmap

### Phase 1: Core Platform (Complete)
- [x] Enterprise dashboard UI
- [x] MCP client integration
- [x] MCP interactive playground
- [x] A2A protocol support
- [x] AP2 task engine

### Phase 2: Backend Integration (Planned)
- [ ] REST API for protocol backends
- [ ] Real MCP server connections
- [ ] A2A message routing service
- [ ] AP2 execution workers
- [ ] WebSocket real-time updates

### Phase 3: Advanced Features (Planned)
- [ ] Model deployment automation
- [ ] Analytics and insights
- [ ] Team collaboration tools
- [ ] Role-based access control
- [ ] Audit logging

### Phase 4: Ecosystem (Planned)
- [ ] Plugin system
- [ ] Custom protocol adapters
- [ ] Marketplace for agents and tools
- [ ] Community templates

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/ai-management-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/ai-management-platform/discussions)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Protocol specifications from [Anthropic MCP](https://modelcontextprotocol.io/)
- Inspired by modern AI operations workflows

---

Built with consciousness and care.
