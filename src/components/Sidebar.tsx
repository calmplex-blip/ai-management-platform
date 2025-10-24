'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  DashboardIcon, 
  ModelsIcon, 
  DeploymentsIcon, 
  ServersIcon, 
  PlaygroundIcon, 
  AgentsIcon, 
  TasksIcon, 
  SkinsIcon, 
  WorkspaceIcon 
} from './icons';

const navigation = [
  { name: 'Dashboard', href: '/', icon: <DashboardIcon /> },
  { name: 'Models', href: '/models', icon: <ModelsIcon /> },
  { name: 'Deployments', href: '/deployments', icon: <DeploymentsIcon /> },
  { name: 'MCP Servers', href: '/mcp-servers', icon: <ServersIcon /> },
  { name: 'MCP Playground', href: '/mcp-playground', icon: <PlaygroundIcon /> },
  { name: 'A2A Agents', href: '/a2a-agents', icon: <AgentsIcon /> },
  { name: 'AP2 Tasks', href: '/ap2-tasks', icon: <TasksIcon /> },
  { name: 'Skins', href: '/skins', icon: <SkinsIcon /> },
  { name: 'Workspace', href: '/workspace', icon: <WorkspaceIcon /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-3 rounded-xl bg-black/20 backdrop-blur-md border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/50 transition-all duration-300 shadow-lg shadow-cyan-400/20"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`bg-black/20 backdrop-blur-xl border-r border-cyan-400/30 transition-all duration-500 flex flex-col h-screen max-h-screen ${
        collapsed ? 'w-16' : 'w-64'
      } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed lg:static inset-y-0 left-0 z-50 lg:z-auto shadow-2xl shadow-cyan-400/10`}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-cyan-400/20 flex-shrink-0">
        {!collapsed && (
          <Link href="/" className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-cyan-300 hover:via-blue-300 hover:to-purple-300 transition-all duration-300">
            ConsciousOps
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={collapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-400/20 to-blue-400/20 text-cyan-300 border border-cyan-400/40 shadow-lg shadow-cyan-400/20'
                  : 'text-gray-300 hover:text-cyan-300 hover:bg-black/20 border border-transparent hover:border-cyan-400/20 hover:shadow-md hover:shadow-cyan-400/10'
              }`}
            >
              <span className="text-lg mr-2 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
              {!collapsed && (
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  {item.name}
                </span>
              )}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent animate-pulse"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-cyan-400/20 p-2 flex-shrink-0">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black font-bold text-xs shadow-lg shadow-cyan-400/30 border border-cyan-400/40">
            A
          </div>
          {!collapsed && (
            <div className="ml-2">
              <p className="text-xs font-medium text-cyan-300">
                Admin User
              </p>
              <p className="text-xs text-gray-400">
                admin@consciousops.com
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
