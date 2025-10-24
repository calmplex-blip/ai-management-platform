'use client';

import React from 'react';
import { Skin, SkinComponent } from '@/types/skin';
import { ChatComponent } from './ChatComponent';
import { IFrameComponent } from './IFrameComponent';
import { CodeEditorComponent } from './CodeEditorComponent';
import { TerminalComponent } from './TerminalComponent';
import { FileBrowserComponent } from './FileBrowserComponent';
import { SpreadsheetComponent } from './SpreadsheetComponent';
import { CalendlyComponent } from './CalendlyComponent';
import { IndeedComponent } from './IndeedComponent';
import { ZoomComponent } from './ZoomComponent';
import { GoogleMessagesComponent } from './GoogleMessagesComponent';
import { MetricCard } from '../dashboard/MetricCard';
import { SystemHealth } from '../dashboard/SystemHealth';

interface SkinRendererProps {
  skin: Skin;
  className?: string;
}

export function SkinRenderer({ skin, className = '' }: SkinRendererProps) {
  const renderComponent = (component: SkinComponent) => {
    const commonProps = {
      key: component.id,
      style: {
        gridArea: component.gridArea,
        flex: component.flex,
        width: component.width,
        height: component.height,
        minWidth: component.minWidth,
        minHeight: component.minHeight,
        ...component.style,
      },
    };

    switch (component.type) {
      case 'chat':
        return (
          <div {...commonProps}>
            <ChatComponent {...(component.props || {})} />
          </div>
        );

      case 'iframe':
        return (
          <div {...commonProps}>
            <IFrameComponent {...(component.props || {})} />
          </div>
        );

      case 'code-editor':
        return (
          <div {...commonProps}>
            <CodeEditorComponent {...(component.props || {})} />
          </div>
        );

      case 'terminal':
        return (
          <div {...commonProps}>
            <TerminalComponent {...(component.props || {})} />
          </div>
        );

      case 'file-browser':
        return (
          <div {...commonProps}>
            <FileBrowserComponent {...(component.props || {})} />
          </div>
        );

      case 'mcp-tools':
      case 'mcp-resources':
      case 'mcp-prompts':
        return (
          <div {...commonProps} className="p-4">
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {component.type === 'mcp-tools' ? '🔧' : component.type === 'mcp-resources' ? '📦' : '💡'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {component.title || component.type}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Use MCP Playground page for full functionality
                </div>
              </div>
            </div>
          </div>
        );

      case 'metrics':
        return (
          <div {...commonProps} className="grid grid-cols-2 gap-4 p-4">
            <MetricCard title="Models" value={12} />
            <MetricCard title="Deployments" value={8} />
            <MetricCard title="Active Agents" value={5} />
            <MetricCard title="Tasks" value={24} />
          </div>
        );

      case 'system-health':
        return (
          <div {...commonProps}>
            <SystemHealth />
          </div>
        );

      case 'spreadsheet':
        return (
          <div {...commonProps}>
            <SpreadsheetComponent {...(component.props || {})} />
          </div>
        );

      case 'calendly':
        return (
          <div {...commonProps}>
            <CalendlyComponent {...(component.props || {})} />
          </div>
        );

      case 'indeed':
        return (
          <div {...commonProps}>
            <IndeedComponent {...(component.props || {})} />
          </div>
        );

      case 'zoom':
        return (
          <div {...commonProps}>
            <ZoomComponent {...(component.props || {})} />
          </div>
        );

      case 'google-messages':
        return (
          <div {...commonProps}>
            <GoogleMessagesComponent {...(component.props || {})} />
          </div>
        );

      case 'a2a-agents':
      case 'ap2-tasks':
        return (
          <div {...commonProps} className="p-4">
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {component.type === 'a2a-agents' ? '🤖' : '✅'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {component.title || component.type}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Component integration pending
                </div>
              </div>
            </div>
          </div>
        );

      case 'custom':
        return (
          <div {...commonProps} className="p-4">
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl mb-2">🎨</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Custom Component
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Configure in properties
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div {...commonProps} className="p-4">
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              <div className="text-sm text-gray-500">
                Unknown component: {component.type}
              </div>
            </div>
          </div>
        );
    }
  };

  const getLayoutStyle = (): React.CSSProperties => {
    const { layout } = skin;

    if (layout.type === 'grid') {
      return {
        display: 'grid',
        gridTemplateAreas: layout.areas?.map((area) => `"${area}"`).join(' '),
        gridTemplateColumns: layout.columns,
        gridTemplateRows: layout.rows,
        gap: layout.gap || '8px',
      };
    }

    if (layout.type === 'flex') {
      return {
        display: 'flex',
        flexDirection: layout.direction || 'row',
        flexWrap: layout.wrap ? 'wrap' : 'nowrap',
        gap: layout.gap || '8px',
      };
    }

    return {
      display: 'grid',
      gap: layout.gap || '8px',
    };
  };

  return (
    <div
      className={`w-full h-full ${className}`}
      style={getLayoutStyle()}
    >
      {skin.components.map(renderComponent)}
    </div>
  );
}
