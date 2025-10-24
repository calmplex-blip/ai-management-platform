// Skin System Types

export type ComponentType =
  | 'chat'
  | 'iframe'
  | 'code-editor'
  | 'terminal'
  | 'file-browser'
  | 'mcp-tools'
  | 'mcp-resources'
  | 'mcp-prompts'
  | 'a2a-agents'
  | 'ap2-tasks'
  | 'metrics'
  | 'system-health'
  | 'spreadsheet'
  | 'calendly'
  | 'indeed'
  | 'zoom'
  | 'google-messages'
  | 'custom';

export type LayoutType = 'grid' | 'flex' | 'split';

// Base component configuration
export interface SkinComponent {
  id: string;
  type: ComponentType;
  title: string;
  gridArea?: string; // CSS grid-area for grid layout
  flex?: number; // Flex grow/shrink for flex layout
  width?: string; // Width for split layout
  height?: string; // Height
  minWidth?: string;
  minHeight?: string;
  props?: Record<string, any>; // Component-specific props
  style?: React.CSSProperties;
}

// Chat component props
export interface ChatComponentProps {
  placeholder?: string;
  provider?: 'mcp' | 'a2a' | 'ap2';
  agentId?: string;
  systemPrompt?: string;
  showHistory?: boolean;
}

// IFrame component props
export interface IFrameComponentProps {
  src?: string;
  title?: string;
  sandbox?: string;
  allow?: string;
  mcpResource?: string; // Reference to MCP resource to display
}

// Code Editor component props
export interface CodeEditorComponentProps {
  language?: string;
  theme?: 'vs-dark' | 'light';
  readOnly?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  file?: string; // File path to edit
}

// Terminal component props
export interface TerminalComponentProps {
  shell?: string;
  workingDirectory?: string;
  environment?: Record<string, string>;
}

// Spreadsheet component props
export interface SpreadsheetComponentProps {
  columns?: Array<{ key: string; label: string; width?: number }>;
  data?: any[];
  editable?: boolean;
  allowUpload?: boolean;
  trackingStages?: string[];
}

// Integration component props
export interface CalendlyComponentProps {
  url?: string;
  username?: string;
  eventType?: string;
}

export interface IndeedComponentProps {
  companyId?: string;
  view?: 'jobs' | 'candidates' | 'analytics';
}

export interface ZoomComponentProps {
  meetingId?: string;
  view?: 'schedule' | 'upcoming' | 'past';
}

export interface GoogleMessagesComponentProps {
  conversationId?: string;
  autoRefresh?: boolean;
}

// Layout configuration
export interface SkinLayout {
  type: LayoutType;
  areas?: string[]; // For grid layout: grid-template-areas
  columns?: string; // For grid layout: grid-template-columns
  rows?: string; // For grid layout: grid-template-rows
  gap?: string;
  direction?: 'row' | 'column'; // For flex layout
  wrap?: boolean; // For flex layout
}

// Complete skin definition
export interface Skin {
  id: string;
  name: string;
  description?: string;
  author?: string;
  category?: 'ide' | 'chat' | 'analytics' | 'monitoring' | 'recruitment' | 'custom';
  thumbnail?: string;
  layout: SkinLayout;
  components: SkinComponent[];
  theme?: 'light' | 'dark' | 'auto';
  createdAt: Date;
  updatedAt: Date;
  isTemplate?: boolean; // Template skins can't be edited
  tags?: string[];
}

// Skin builder state
export interface SkinBuilderState {
  currentSkin: Skin | null;
  selectedComponent: string | null; // Component ID
  isEditing: boolean;
  isDragging: boolean;
  draggedComponent?: ComponentType;
}

// Component registry for the builder
export interface ComponentDefinition {
  type: ComponentType;
  name: string;
  description: string;
  icon: string; // Icon name or emoji
  defaultProps: Record<string, any>;
  configSchema: ComponentConfigSchema[];
  minWidth?: string;
  minHeight?: string;
  category: 'communication' | 'development' | 'monitoring' | 'integration' | 'custom';
}

// Configuration schema for component properties
export interface ComponentConfigSchema {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'json';
  default?: any;
  options?: Array<{ label: string; value: any }>;
  description?: string;
  required?: boolean;
}

// Skin template
export interface SkinTemplate extends Omit<Skin, 'id' | 'createdAt' | 'updatedAt'> {
  templateId: string;
  isTemplate: true;
}
