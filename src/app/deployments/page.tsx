'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

type DeployStatus = 'running' | 'stopped' | 'failed' | 'deploying';
type DeployEnv = 'production' | 'staging' | 'development';

interface Deployment {
  id: string;
  name: string;
  model: string;
  env: DeployEnv;
  status: DeployStatus;
  version: string;
  replicas: number;
  cpu: number;
  memory: string;
  requestsPerMin: number;
  p95Latency: number;
  uptime: string;
  deployedAt: string;
  deployedBy: string;
}

const deployments: Deployment[] = [
  {
    id: 'dep-001',
    name: 'Customer Support Bot',
    model: 'claude-sonnet-4-6',
    env: 'production',
    status: 'running',
    version: 'v2.4.1',
    replicas: 3,
    cpu: 42,
    memory: '1.8 GB',
    requestsPerMin: 287,
    p95Latency: 1340,
    uptime: '99.97%',
    deployedAt: '2026-02-20 14:32',
    deployedBy: 'deploy-bot',
  },
  {
    id: 'dep-002',
    name: 'Code Review Assistant',
    model: 'claude-opus-4-6',
    env: 'production',
    status: 'running',
    version: 'v1.8.0',
    replicas: 2,
    cpu: 68,
    memory: '3.2 GB',
    requestsPerMin: 94,
    p95Latency: 3820,
    uptime: '99.91%',
    deployedAt: '2026-02-18 09:15',
    deployedBy: 'alice@company.com',
  },
  {
    id: 'dep-003',
    name: 'Data Extraction Pipeline',
    model: 'claude-haiku-4-5',
    env: 'production',
    status: 'running',
    version: 'v3.1.2',
    replicas: 5,
    cpu: 31,
    memory: '0.9 GB',
    requestsPerMin: 1240,
    p95Latency: 410,
    uptime: '99.99%',
    deployedAt: '2026-02-25 18:00',
    deployedBy: 'deploy-bot',
  },
  {
    id: 'dep-004',
    name: 'RPO Recruitment AI',
    model: 'claude-sonnet-4-6',
    env: 'staging',
    status: 'running',
    version: 'v0.9.3',
    replicas: 1,
    cpu: 15,
    memory: '0.6 GB',
    requestsPerMin: 12,
    p95Latency: 1180,
    uptime: '99.80%',
    deployedAt: '2026-02-27 11:45',
    deployedBy: 'bob@company.com',
  },
  {
    id: 'dep-005',
    name: 'Internal Knowledge Base',
    model: 'gpt-4o',
    env: 'production',
    status: 'failed',
    version: 'v1.2.0',
    replicas: 0,
    cpu: 0,
    memory: '0 GB',
    requestsPerMin: 0,
    p95Latency: 0,
    uptime: '94.2%',
    deployedAt: '2026-02-28 02:13',
    deployedBy: 'deploy-bot',
  },
  {
    id: 'dep-006',
    name: 'A2A Orchestrator',
    model: 'claude-sonnet-4-6',
    env: 'development',
    status: 'stopped',
    version: 'v0.3.0-alpha',
    replicas: 0,
    cpu: 0,
    memory: '0 GB',
    requestsPerMin: 0,
    p95Latency: 0,
    uptime: 'N/A',
    deployedAt: '2026-02-15 16:00',
    deployedBy: 'carol@company.com',
  },
];

const statusVariant: Record<DeployStatus, string> = {
  running: 'success',
  stopped: 'neutral',
  failed: 'error',
  deploying: 'warning',
};

const envColor: Record<DeployEnv, string> = {
  production: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  staging: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  development: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
};

function CpuBar({ value }: { value: number }) {
  const color = value > 80 ? 'bg-red-500' : value > 60 ? 'bg-yellow-500' : 'bg-green-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-8">{value}%</span>
    </div>
  );
}

export default function DeploymentsPage() {
  const [envFilter, setEnvFilter] = useState<'all' | DeployEnv>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | DeployStatus>('all');

  const filtered = deployments.filter((d) => {
    if (envFilter !== 'all' && d.env !== envFilter) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    return true;
  });

  const running = deployments.filter((d) => d.status === 'running').length;
  const failed = deployments.filter((d) => d.status === 'failed').length;
  const totalReplicas = deployments.reduce((s, d) => s + d.replicas, 0);
  const totalRpm = deployments.reduce((s, d) => s + d.requestsPerMin, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deployments</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Manage and monitor your AI model deployments
            </p>
          </div>
          <Button size="sm">+ New Deployment</Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Running', value: running, color: 'text-green-600' },
            { label: 'Failed', value: failed, color: 'text-red-600' },
            { label: 'Total Replicas', value: totalReplicas, color: 'text-blue-600' },
            { label: 'Req / min', value: totalRpm.toLocaleString(), color: 'text-purple-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {(['all', 'production', 'staging', 'development'] as const).map((e) => (
              <button
                key={e}
                onClick={() => setEnvFilter(e)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  envFilter === e
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {(['all', 'running', 'stopped', 'failed', 'deploying'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  statusFilter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Deployments Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <th className="px-5 py-3 font-medium">Deployment</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Replicas</th>
                  <th className="px-5 py-3 font-medium">CPU</th>
                  <th className="px-5 py-3 font-medium">Memory</th>
                  <th className="px-5 py-3 font-medium">Req/min</th>
                  <th className="px-5 py-3 font-medium">p95 Latency</th>
                  <th className="px-5 py-3 font-medium">Uptime</th>
                  <th className="px-5 py-3 font-medium">Deployed</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filtered.map((dep) => (
                  <tr key={dep.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{dep.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <code className="text-xs font-mono text-gray-400">{dep.model}</code>
                          <span className="text-gray-300 dark:text-gray-600">·</span>
                          <span className="text-xs text-gray-400">{dep.version}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${envColor[dep.env]}`}>
                            {dep.env}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={statusVariant[dep.status] as 'success' | 'neutral' | 'error' | 'warning'}>
                        {dep.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300">{dep.replicas}</td>
                    <td className="px-5 py-4">
                      {dep.cpu > 0 ? <CpuBar value={dep.cpu} /> : <span className="text-gray-300 dark:text-gray-600">—</span>}
                    </td>
                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300">{dep.memory}</td>
                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                      {dep.requestsPerMin > 0 ? dep.requestsPerMin.toLocaleString() : '—'}
                    </td>
                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                      {dep.p95Latency > 0 ? dep.p95Latency + 'ms' : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={dep.uptime === 'N/A' ? 'text-gray-400' : 'text-green-600 dark:text-green-400 font-medium'}>
                        {dep.uptime}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-xs text-gray-500">{dep.deployedAt}</p>
                        <p className="text-xs text-gray-400">by {dep.deployedBy}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {dep.status === 'running' && (
                          <button className="text-xs text-yellow-600 hover:text-yellow-700 font-medium">Stop</button>
                        )}
                        {dep.status === 'stopped' && (
                          <button className="text-xs text-green-600 hover:text-green-700 font-medium">Start</button>
                        )}
                        {dep.status === 'failed' && (
                          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Retry</button>
                        )}
                        <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">Logs</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No deployments match your filters.</div>
          )}
        </div>
      </main>
    </div>
  );
}
