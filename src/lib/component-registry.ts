import { ComponentDefinition, ComponentType } from '@/types/skin';

export const COMPONENT_REGISTRY: Record<ComponentType, ComponentDefinition> = {
  chat: {
    type: 'chat',
    name: 'Chat Interface',
    description: 'AI chat interface with MCP/A2A/AP2 integration',
    icon: '💬',
    category: 'communication',
    defaultProps: {
      placeholder: 'Ask me anything...',
      provider: 'mcp',
      showHistory: true,
    },
    configSchema: [
      {
        key: 'placeholder',
        label: 'Placeholder Text',
        type: 'text',
        default: 'Ask me anything...',
      },
      {
        key: 'provider',
        label: 'AI Provider',
        type: 'select',
        options: [
          { label: 'MCP', value: 'mcp' },
          { label: 'A2A', value: 'a2a' },
          { label: 'AP2', value: 'ap2' },
        ],
        default: 'mcp',
      },
      {
        key: 'agentId',
        label: 'Agent ID',
        type: 'text',
        description: 'Specific agent to chat with',
      },
      {
        key: 'showHistory',
        label: 'Show History',
        type: 'boolean',
        default: true,
      },
    ],
    minWidth: '300px',
    minHeight: '400px',
  },

  iframe: {
    type: 'iframe',
    name: 'IFrame Portal',
    description: 'Embed external content or MCP resources',
    icon: '🖼️',
    category: 'integration',
    defaultProps: {
      src: '',
      title: 'Portal',
      sandbox: 'allow-same-origin allow-scripts',
    },
    configSchema: [
      {
        key: 'src',
        label: 'Source URL',
        type: 'text',
        description: 'URL to embed',
      },
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        default: 'Portal',
      },
      {
        key: 'mcpResource',
        label: 'MCP Resource URI',
        type: 'text',
        description: 'URI of MCP resource to display',
      },
      {
        key: 'sandbox',
        label: 'Sandbox Policy',
        type: 'text',
        default: 'allow-same-origin allow-scripts',
      },
    ],
    minWidth: '200px',
    minHeight: '200px',
  },

  'code-editor': {
    type: 'code-editor',
    name: 'Code Editor',
    description: 'Monaco code editor with syntax highlighting',
    icon: '📝',
    category: 'development',
    defaultProps: {
      language: 'typescript',
      theme: 'vs-dark',
      readOnly: false,
    },
    configSchema: [
      {
        key: 'language',
        label: 'Language',
        type: 'select',
        options: [
          { label: 'TypeScript', value: 'typescript' },
          { label: 'JavaScript', value: 'javascript' },
          { label: 'Python', value: 'python' },
          { label: 'JSON', value: 'json' },
          { label: 'Markdown', value: 'markdown' },
          { label: 'HTML', value: 'html' },
          { label: 'CSS', value: 'css' },
        ],
        default: 'typescript',
      },
      {
        key: 'theme',
        label: 'Theme',
        type: 'select',
        options: [
          { label: 'Dark', value: 'vs-dark' },
          { label: 'Light', value: 'light' },
        ],
        default: 'vs-dark',
      },
      {
        key: 'readOnly',
        label: 'Read Only',
        type: 'boolean',
        default: false,
      },
      {
        key: 'file',
        label: 'File Path',
        type: 'text',
        description: 'Path to file to edit',
      },
    ],
    minWidth: '400px',
    minHeight: '300px',
  },

  terminal: {
    type: 'terminal',
    name: 'Terminal',
    description: 'Command line terminal emulator',
    icon: '⌨️',
    category: 'development',
    defaultProps: {
      shell: 'bash',
      workingDirectory: '~',
    },
    configSchema: [
      {
        key: 'shell',
        label: 'Shell',
        type: 'select',
        options: [
          { label: 'Bash', value: 'bash' },
          { label: 'Zsh', value: 'zsh' },
          { label: 'Fish', value: 'fish' },
        ],
        default: 'bash',
      },
      {
        key: 'workingDirectory',
        label: 'Working Directory',
        type: 'text',
        default: '~',
      },
    ],
    minWidth: '400px',
    minHeight: '200px',
  },

  'file-browser': {
    type: 'file-browser',
    name: 'File Browser',
    description: 'Browse and manage files',
    icon: '📁',
    category: 'development',
    defaultProps: {
      rootPath: '/',
      showHidden: false,
    },
    configSchema: [
      {
        key: 'rootPath',
        label: 'Root Path',
        type: 'text',
        default: '/',
      },
      {
        key: 'showHidden',
        label: 'Show Hidden Files',
        type: 'boolean',
        default: false,
      },
    ],
    minWidth: '250px',
    minHeight: '300px',
  },

  'mcp-tools': {
    type: 'mcp-tools',
    name: 'MCP Tools',
    description: 'Execute MCP tools',
    icon: '🔧',
    category: 'integration',
    defaultProps: {
      serverId: null,
    },
    configSchema: [
      {
        key: 'serverId',
        label: 'MCP Server ID',
        type: 'text',
        description: 'ID of MCP server to use',
      },
    ],
    minWidth: '350px',
    minHeight: '400px',
  },

  'mcp-resources': {
    type: 'mcp-resources',
    name: 'MCP Resources',
    description: 'Browse MCP resources',
    icon: '📦',
    category: 'integration',
    defaultProps: {
      serverId: null,
    },
    configSchema: [
      {
        key: 'serverId',
        label: 'MCP Server ID',
        type: 'text',
        description: 'ID of MCP server to use',
      },
    ],
    minWidth: '350px',
    minHeight: '400px',
  },

  'mcp-prompts': {
    type: 'mcp-prompts',
    name: 'MCP Prompts',
    description: 'Execute MCP prompts',
    icon: '💡',
    category: 'integration',
    defaultProps: {
      serverId: null,
    },
    configSchema: [
      {
        key: 'serverId',
        label: 'MCP Server ID',
        type: 'text',
        description: 'ID of MCP server to use',
      },
    ],
    minWidth: '350px',
    minHeight: '400px',
  },

  'a2a-agents': {
    type: 'a2a-agents',
    name: 'A2A Agents',
    description: 'Manage A2A agents',
    icon: '🤖',
    category: 'integration',
    defaultProps: {
      view: 'grid',
    },
    configSchema: [
      {
        key: 'view',
        label: 'View Mode',
        type: 'select',
        options: [
          { label: 'Grid', value: 'grid' },
          { label: 'List', value: 'list' },
        ],
        default: 'grid',
      },
    ],
    minWidth: '350px',
    minHeight: '400px',
  },

  'ap2-tasks': {
    type: 'ap2-tasks',
    name: 'AP2 Tasks',
    description: 'Manage AP2 tasks',
    icon: '✅',
    category: 'integration',
    defaultProps: {
      view: 'grid',
      filter: 'all',
    },
    configSchema: [
      {
        key: 'view',
        label: 'View Mode',
        type: 'select',
        options: [
          { label: 'Grid', value: 'grid' },
          { label: 'List', value: 'list' },
        ],
        default: 'grid',
      },
      {
        key: 'filter',
        label: 'Filter',
        type: 'select',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Running', value: 'running' },
          { label: 'Completed', value: 'completed' },
          { label: 'Failed', value: 'failed' },
        ],
        default: 'all',
      },
    ],
    minWidth: '350px',
    minHeight: '400px',
  },

  metrics: {
    type: 'metrics',
    name: 'Metrics Dashboard',
    description: 'Display key metrics',
    icon: '📊',
    category: 'monitoring',
    defaultProps: {
      refreshInterval: 5000,
    },
    configSchema: [
      {
        key: 'refreshInterval',
        label: 'Refresh Interval (ms)',
        type: 'number',
        default: 5000,
      },
    ],
    minWidth: '300px',
    minHeight: '200px',
  },

  'system-health': {
    type: 'system-health',
    name: 'System Health',
    description: 'Monitor system health',
    icon: '❤️',
    category: 'monitoring',
    defaultProps: {
      showCPU: true,
      showMemory: true,
      showStorage: true,
    },
    configSchema: [
      {
        key: 'showCPU',
        label: 'Show CPU',
        type: 'boolean',
        default: true,
      },
      {
        key: 'showMemory',
        label: 'Show Memory',
        type: 'boolean',
        default: true,
      },
      {
        key: 'showStorage',
        label: 'Show Storage',
        type: 'boolean',
        default: true,
      },
    ],
    minWidth: '300px',
    minHeight: '150px',
  },

  spreadsheet: {
    type: 'spreadsheet',
    name: 'Spreadsheet',
    description: 'Data grid with CSV/Excel upload and pipeline tracking',
    icon: '📊',
    category: 'custom',
    defaultProps: {
      editable: true,
      allowUpload: true,
      trackingStages: ['New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'],
    },
    configSchema: [
      {
        key: 'editable',
        label: 'Editable',
        type: 'boolean',
        default: true,
      },
      {
        key: 'allowUpload',
        label: 'Allow File Upload',
        type: 'boolean',
        default: true,
      },
    ],
    minWidth: '400px',
    minHeight: '300px',
  },

  calendly: {
    type: 'calendly',
    name: 'Calendly Scheduler',
    description: 'Embed Calendly for interview scheduling',
    icon: '📅',
    category: 'integration',
    defaultProps: {
      url: '',
      username: '',
    },
    configSchema: [
      {
        key: 'url',
        label: 'Calendly URL',
        type: 'text',
        description: 'Full Calendly scheduling URL',
      },
      {
        key: 'username',
        label: 'Calendly Username',
        type: 'text',
        description: 'Your Calendly username',
      },
      {
        key: 'eventType',
        label: 'Event Type',
        type: 'text',
        description: 'Specific event type to display',
      },
    ],
    minWidth: '320px',
    minHeight: '600px',
  },

  indeed: {
    type: 'indeed',
    name: 'Indeed Integration',
    description: 'Indeed job postings and candidate sourcing',
    icon: '💼',
    category: 'integration',
    defaultProps: {
      view: 'candidates',
    },
    configSchema: [
      {
        key: 'companyId',
        label: 'Company ID',
        type: 'text',
        description: 'Your Indeed company identifier',
      },
      {
        key: 'view',
        label: 'View',
        type: 'select',
        options: [
          { label: 'Candidates', value: 'candidates' },
          { label: 'Job Postings', value: 'jobs' },
          { label: 'Analytics', value: 'analytics' },
        ],
        default: 'candidates',
      },
    ],
    minWidth: '400px',
    minHeight: '500px',
  },

  zoom: {
    type: 'zoom',
    name: 'Zoom Meetings',
    description: 'Schedule and manage Zoom interviews',
    icon: '📹',
    category: 'integration',
    defaultProps: {
      view: 'upcoming',
    },
    configSchema: [
      {
        key: 'meetingId',
        label: 'Meeting ID',
        type: 'text',
        description: 'Specific Zoom meeting to display',
      },
      {
        key: 'view',
        label: 'View',
        type: 'select',
        options: [
          { label: 'Schedule Meeting', value: 'schedule' },
          { label: 'Upcoming Meetings', value: 'upcoming' },
          { label: 'Past Meetings', value: 'past' },
        ],
        default: 'upcoming',
      },
    ],
    minWidth: '350px',
    minHeight: '450px',
  },

  'google-messages': {
    type: 'google-messages',
    name: 'Google Messages',
    description: 'Candidate communication via Google Messages',
    icon: '💬',
    category: 'communication',
    defaultProps: {
      autoRefresh: true,
    },
    configSchema: [
      {
        key: 'conversationId',
        label: 'Conversation ID',
        type: 'text',
        description: 'Specific conversation to display',
      },
      {
        key: 'autoRefresh',
        label: 'Auto Refresh',
        type: 'boolean',
        default: true,
      },
    ],
    minWidth: '350px',
    minHeight: '400px',
  },

  custom: {
    type: 'custom',
    name: 'Custom Component',
    description: 'Create your own custom component',
    icon: '🎨',
    category: 'custom',
    defaultProps: {},
    configSchema: [
      {
        key: 'content',
        label: 'Content',
        type: 'json',
        description: 'Custom component configuration',
      },
    ],
    minWidth: '200px',
    minHeight: '200px',
  },
};

// Helper to get components by category
export function getComponentsByCategory(category: ComponentDefinition['category']) {
  return Object.values(COMPONENT_REGISTRY).filter((comp) => comp.category === category);
}

// Helper to get all component types
export function getAllComponentTypes(): ComponentType[] {
  return Object.keys(COMPONENT_REGISTRY) as ComponentType[];
}
