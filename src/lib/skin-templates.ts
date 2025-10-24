import { SkinTemplate } from '@/types/skin';

export const SKIN_TEMPLATES: SkinTemplate[] = [
  // IDE Skin - Code-focused layout
  {
    templateId: 'ide-template',
    name: 'IDE Workspace',
    description: 'Full-featured IDE with code editor, terminal, file browser, and AI chat',
    author: 'ConsciousOps',
    category: 'ide',
    isTemplate: true,
    tags: ['development', 'coding', 'terminal'],
    layout: {
      type: 'grid',
      areas: [
        'chat chat editor editor editor',
        'files files editor editor editor',
        'files files terminal terminal terminal',
      ],
      columns: '200px 150px 1fr 1fr 1fr',
      rows: '250px 1fr 200px',
      gap: '8px',
    },
    components: [
      {
        id: 'chat-1',
        type: 'chat',
        title: 'AI Assistant',
        gridArea: 'chat',
        props: {
          placeholder: 'Ask for help with your code...',
          provider: 'mcp',
          showHistory: true,
        },
      },
      {
        id: 'files-1',
        type: 'file-browser',
        title: 'Files',
        gridArea: 'files',
        props: {
          rootPath: '/workspace',
          showHidden: false,
        },
      },
      {
        id: 'editor-1',
        type: 'code-editor',
        title: 'Editor',
        gridArea: 'editor',
        props: {
          language: 'typescript',
          theme: 'vs-dark',
          readOnly: false,
        },
      },
      {
        id: 'terminal-1',
        type: 'terminal',
        title: 'Terminal',
        gridArea: 'terminal',
        props: {
          shell: 'bash',
          workingDirectory: '/workspace',
        },
      },
    ],
    theme: 'dark',
  },

  // Chat Skin - AI conversation with resource portals
  {
    templateId: 'chat-template',
    name: 'AI Chat Station',
    description: 'Chat interface with two MCP resource portals for enhanced context',
    author: 'ConsciousOps',
    category: 'chat',
    isTemplate: true,
    tags: ['chat', 'ai', 'mcp'],
    layout: {
      type: 'grid',
      areas: [
        'chat chat chat',
        'portal1 portal2 portal2',
      ],
      columns: '1fr 1fr 1fr',
      rows: '1fr 400px',
      gap: '12px',
    },
    components: [
      {
        id: 'chat-1',
        type: 'chat',
        title: 'AI Chat',
        gridArea: 'chat',
        props: {
          placeholder: 'What would you like to know?',
          provider: 'mcp',
          showHistory: true,
        },
      },
      {
        id: 'portal-1',
        type: 'iframe',
        title: 'Resource Portal 1',
        gridArea: 'portal1',
        props: {
          title: 'MCP Resource Viewer',
        },
      },
      {
        id: 'portal-2',
        type: 'iframe',
        title: 'Resource Portal 2',
        gridArea: 'portal2',
        props: {
          title: 'MCP Resource Viewer',
        },
      },
    ],
    theme: 'dark',
  },

  // Analytics Skin - Metrics and monitoring
  {
    templateId: 'analytics-template',
    name: 'Analytics Dashboard',
    description: 'Comprehensive analytics with metrics, health, and task monitoring',
    author: 'ConsciousOps',
    category: 'analytics',
    isTemplate: true,
    tags: ['analytics', 'monitoring', 'metrics'],
    layout: {
      type: 'grid',
      areas: [
        'metrics metrics health health',
        'tasks tasks tasks tasks',
        'agents agents agents agents',
      ],
      columns: '1fr 1fr 1fr 1fr',
      rows: '200px 1fr 1fr',
      gap: '16px',
    },
    components: [
      {
        id: 'metrics-1',
        type: 'metrics',
        title: 'Key Metrics',
        gridArea: 'metrics',
        props: {
          refreshInterval: 5000,
        },
      },
      {
        id: 'health-1',
        type: 'system-health',
        title: 'System Health',
        gridArea: 'health',
        props: {
          showCPU: true,
          showMemory: true,
          showStorage: true,
        },
      },
      {
        id: 'tasks-1',
        type: 'ap2-tasks',
        title: 'Active Tasks',
        gridArea: 'tasks',
        props: {
          view: 'list',
          filter: 'all',
        },
      },
      {
        id: 'agents-1',
        type: 'a2a-agents',
        title: 'Agents',
        gridArea: 'agents',
        props: {
          view: 'grid',
        },
      },
    ],
    theme: 'auto',
  },

  // Agent Control Skin - Multi-agent management
  {
    templateId: 'agent-control-template',
    name: 'Agent Control Center',
    description: 'Manage and orchestrate multiple AI agents with real-time monitoring',
    author: 'ConsciousOps',
    category: 'monitoring',
    isTemplate: true,
    tags: ['agents', 'a2a', 'control'],
    layout: {
      type: 'grid',
      areas: [
        'chat agents agents',
        'chat tasks tasks',
        'chat mcp mcp',
      ],
      columns: '400px 1fr 1fr',
      rows: '1fr 1fr 1fr',
      gap: '12px',
    },
    components: [
      {
        id: 'chat-1',
        type: 'chat',
        title: 'Agent Commander',
        gridArea: 'chat',
        props: {
          placeholder: 'Send commands to agents...',
          provider: 'a2a',
          showHistory: true,
        },
      },
      {
        id: 'agents-1',
        type: 'a2a-agents',
        title: 'Active Agents',
        gridArea: 'agents',
        props: {
          view: 'grid',
        },
      },
      {
        id: 'tasks-1',
        type: 'ap2-tasks',
        title: 'Running Tasks',
        gridArea: 'tasks',
        props: {
          view: 'list',
          filter: 'running',
        },
      },
      {
        id: 'mcp-1',
        type: 'mcp-tools',
        title: 'MCP Tools',
        gridArea: 'mcp',
        props: {},
      },
    ],
    theme: 'dark',
  },

  // MCP Explorer Skin - Deep MCP integration
  {
    templateId: 'mcp-explorer-template',
    name: 'MCP Explorer',
    description: 'Comprehensive MCP server exploration with tools, resources, and prompts',
    author: 'ConsciousOps',
    category: 'custom',
    isTemplate: true,
    tags: ['mcp', 'tools', 'resources'],
    layout: {
      type: 'grid',
      areas: [
        'tools resources prompts',
        'tools resources prompts',
      ],
      columns: '1fr 1fr 1fr',
      rows: '1fr 1fr',
      gap: '12px',
    },
    components: [
      {
        id: 'tools-1',
        type: 'mcp-tools',
        title: 'MCP Tools',
        gridArea: 'tools',
        props: {},
      },
      {
        id: 'resources-1',
        type: 'mcp-resources',
        title: 'MCP Resources',
        gridArea: 'resources',
        props: {},
      },
      {
        id: 'prompts-1',
        type: 'mcp-prompts',
        title: 'MCP Prompts',
        gridArea: 'prompts',
        props: {},
      },
    ],
    theme: 'dark',
  },

  // Minimal Chat - Simple focused chat
  {
    templateId: 'minimal-chat-template',
    name: 'Minimal Chat',
    description: 'Simple, distraction-free chat interface',
    author: 'ConsciousOps',
    category: 'chat',
    isTemplate: true,
    tags: ['chat', 'minimal', 'simple'],
    layout: {
      type: 'grid',
      areas: ['chat'],
      columns: '1fr',
      rows: '1fr',
      gap: '0',
    },
    components: [
      {
        id: 'chat-1',
        type: 'chat',
        title: 'Chat',
        gridArea: 'chat',
        props: {
          placeholder: 'Start chatting...',
          provider: 'mcp',
          showHistory: true,
        },
      },
    ],
    theme: 'auto',
  },

  // Split View - Two-panel layout
  {
    templateId: 'split-view-template',
    name: 'Split View',
    description: 'Two-panel layout for comparing or working with two contexts',
    author: 'ConsciousOps',
    category: 'custom',
    isTemplate: true,
    tags: ['split', 'dual', 'compare'],
    layout: {
      type: 'grid',
      areas: [
        'left right',
      ],
      columns: '1fr 1fr',
      rows: '1fr',
      gap: '8px',
    },
    components: [
      {
        id: 'left-1',
        type: 'code-editor',
        title: 'Editor 1',
        gridArea: 'left',
        props: {
          language: 'typescript',
          theme: 'vs-dark',
        },
      },
      {
        id: 'right-1',
        type: 'code-editor',
        title: 'Editor 2',
        gridArea: 'right',
        props: {
          language: 'typescript',
          theme: 'vs-dark',
        },
      },
    ],
    theme: 'dark',
  },

  // RPO Recruitment Workspace
  {
    templateId: 'rpo-recruitment-template',
    name: 'RPO Recruitment Hub',
    description: 'Complete recruitment workspace with candidate tracking, scheduling, and communication',
    author: 'ConsciousOps',
    category: 'recruitment',
    isTemplate: true,
    tags: ['recruitment', 'rpo', 'hiring', 'candidates', 'interviews'],
    layout: {
      type: 'grid',
      areas: [
        'spreadsheet spreadsheet integrations integrations',
        'spreadsheet spreadsheet integrations integrations',
        'messages messages zoom calendly',
      ],
      columns: '1fr 1fr 1fr 1fr',
      rows: '1fr 1fr 400px',
      gap: '12px',
    },
    components: [
      {
        id: 'spreadsheet-1',
        type: 'spreadsheet',
        title: 'Candidate Pipeline',
        gridArea: 'spreadsheet',
        props: {
          editable: true,
          allowUpload: true,
          trackingStages: ['New', 'Screening', 'Phone Screen', 'Technical Interview', 'Final Interview', 'Offer', 'Hired', 'Rejected'],
          columns: [
            { key: 'name', label: 'Name', width: 150 },
            { key: 'email', label: 'Email', width: 200 },
            { key: 'phone', label: 'Phone', width: 130 },
            { key: 'position', label: 'Position', width: 150 },
            { key: 'stage', label: 'Stage', width: 140 },
            { key: 'source', label: 'Source', width: 100 },
            { key: 'dateApplied', label: 'Date Applied', width: 120 },
            { key: 'notes', label: 'Notes', width: 200 },
          ],
        },
      },
      {
        id: 'indeed-1',
        type: 'indeed',
        title: 'Indeed Candidates',
        gridArea: 'integrations',
        props: {
          companyId: '',
          view: 'candidates',
        },
      },
      {
        id: 'messages-1',
        type: 'google-messages',
        title: 'Candidate Communication',
        gridArea: 'messages',
        props: {
          autoRefresh: true,
        },
      },
      {
        id: 'zoom-1',
        type: 'zoom',
        title: 'Interview Scheduling',
        gridArea: 'zoom',
        props: {
          view: 'upcoming',
        },
      },
      {
        id: 'calendly-1',
        type: 'calendly',
        title: 'Calendly',
        gridArea: 'calendly',
        props: {
          url: '',
          username: '',
        },
      },
    ],
    theme: 'auto',
  },
];

// Helper to convert template to skin
export function createSkinFromTemplate(template: SkinTemplate): any {
  return {
    ...template,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Helper to get template by ID
export function getTemplateById(templateId: string): SkinTemplate | undefined {
  return SKIN_TEMPLATES.find((t) => t.templateId === templateId);
}

// Helper to get templates by category
export function getTemplatesByCategory(category: SkinTemplate['category']) {
  return SKIN_TEMPLATES.filter((t) => t.category === category);
}
