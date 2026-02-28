'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';

type TimeRange = '7d' | '30d' | '90d';

interface DataPoint {
  label: string;
  value: number;
}

const data: Record<TimeRange, {
  apiRequests: DataPoint[];
  responseTimes: DataPoint[];
  costs: DataPoint[];
  modelUsage: { model: string; requests: number; tokens: number; cost: number }[];
}> = {
  '7d': {
    apiRequests: [
      { label: 'Mon', value: 42000 },
      { label: 'Tue', value: 58000 },
      { label: 'Wed', value: 51000 },
      { label: 'Thu', value: 67000 },
      { label: 'Fri', value: 73000 },
      { label: 'Sat', value: 31000 },
      { label: 'Sun', value: 28000 },
    ],
    responseTimes: [
      { label: 'Mon', value: 210 },
      { label: 'Tue', value: 245 },
      { label: 'Wed', value: 228 },
      { label: 'Thu', value: 267 },
      { label: 'Fri', value: 234 },
      { label: 'Sat', value: 198 },
      { label: 'Sun', value: 192 },
    ],
    costs: [
      { label: 'Mon', value: 142 },
      { label: 'Tue', value: 198 },
      { label: 'Wed', value: 171 },
      { label: 'Thu', value: 224 },
      { label: 'Fri', value: 245 },
      { label: 'Sat', value: 103 },
      { label: 'Sun', value: 94 },
    ],
    modelUsage: [
      { model: 'claude-opus-4-6', requests: 124500, tokens: 48200000, cost: 724 },
      { model: 'claude-sonnet-4-6', requests: 89300, tokens: 31600000, cost: 316 },
      { model: 'claude-haiku-4-5', requests: 136200, tokens: 22400000, cost: 112 },
      { model: 'gpt-4o', requests: 23400, tokens: 9800000, cost: 196 },
    ],
  },
  '30d': {
    apiRequests: [
      { label: 'W1', value: 310000 },
      { label: 'W2', value: 368000 },
      { label: 'W3', value: 412000 },
      { label: 'W4', value: 389000 },
    ],
    responseTimes: [
      { label: 'W1', value: 218 },
      { label: 'W2', value: 231 },
      { label: 'W3', value: 248 },
      { label: 'W4', value: 234 },
    ],
    costs: [
      { label: 'W1', value: 1040 },
      { label: 'W2', value: 1230 },
      { label: 'W3', value: 1380 },
      { label: 'W4', value: 1302 },
    ],
    modelUsage: [
      { model: 'claude-opus-4-6', requests: 524500, tokens: 204000000, cost: 3060 },
      { model: 'claude-sonnet-4-6', requests: 389300, tokens: 138000000, cost: 1380 },
      { model: 'claude-haiku-4-5', requests: 536200, tokens: 89400000, cost: 447 },
      { model: 'gpt-4o', requests: 93400, tokens: 39200000, cost: 784 },
    ],
  },
  '90d': {
    apiRequests: [
      { label: 'Jan', value: 1020000 },
      { label: 'Feb', value: 1200000 },
      { label: 'Mar', value: 1480000 },
    ],
    responseTimes: [
      { label: 'Jan', value: 224 },
      { label: 'Feb', value: 238 },
      { label: 'Mar', value: 234 },
    ],
    costs: [
      { label: 'Jan', value: 3410 },
      { label: 'Feb', value: 4020 },
      { label: 'Mar', value: 4952 },
    ],
    modelUsage: [
      { model: 'claude-opus-4-6', requests: 1574500, tokens: 612000000, cost: 9180 },
      { model: 'claude-sonnet-4-6', requests: 1169300, tokens: 414000000, cost: 4140 },
      { model: 'claude-haiku-4-5', requests: 1608600, tokens: 268200000, cost: 1341 },
      { model: 'gpt-4o', requests: 280200, tokens: 117600000, cost: 2352 },
    ],
  },
};

function BarChart({ points, color, unit = '' }: { points: DataPoint[]; color: string; unit?: string }) {
  const max = Math.max(...points.map((p) => p.value));
  return (
    <div className="flex items-end gap-2 h-40">
      {points.map((p) => {
        const height = Math.round((p.value / max) * 100);
        return (
          <div key={p.label} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {unit}{p.value.toLocaleString()}
            </div>
            <div
              className={`w-full rounded-t transition-all ${color}`}
              style={{ height: `${height}%` }}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">{p.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ points, color }: { points: DataPoint[]; color: string }) {
  const max = Math.max(...points.map((p) => p.value));
  const min = Math.min(...points.map((p) => p.value));
  const range = max - min || 1;
  const w = 400;
  const h = 120;
  const pad = 10;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  const coords = points.map((p, i) => {
    const x = pad + (i / (points.length - 1)) * innerW;
    const y = pad + (1 - (p.value - min) / range) * innerH;
    return { x, y, label: p.label, value: p.value };
  });

  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ');
  const area = `${path} L${coords[coords.length - 1].x},${h - pad} L${coords[0].x},${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" className={color} />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#grad-${color})`} className={color} />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" className={color} />
      {coords.map((c) => (
        <circle key={c.label} cx={c.x} cy={c.y} r="4" fill="currentColor" className={color} />
      ))}
    </svg>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<TimeRange>('7d');
  const d = data[range];

  const totalRequests = d.modelUsage.reduce((s, m) => s + m.requests, 0);
  const totalTokens = d.modelUsage.reduce((s, m) => s + m.tokens, 0);
  const totalCost = d.modelUsage.reduce((s, m) => s + m.cost, 0);
  const avgLatency = Math.round(d.responseTimes.reduce((s, p) => s + p.value, 0) / d.responseTimes.length);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Platform usage, performance, and cost metrics
            </p>
          </div>
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {(['7d', '30d', '90d'] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  range === r
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {r === '7d' ? 'Last 7 days' : r === '30d' ? 'Last 30 days' : 'Last 90 days'}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Requests', value: totalRequests.toLocaleString(), sub: 'API calls', color: 'text-blue-600' },
            { label: 'Total Tokens', value: (totalTokens / 1_000_000).toFixed(1) + 'M', sub: 'tokens processed', color: 'text-purple-600' },
            { label: 'Total Cost', value: '$' + totalCost.toLocaleString(), sub: 'USD spent', color: 'text-green-600' },
            { label: 'Avg Latency', value: avgLatency + 'ms', sub: 'response time', color: 'text-orange-600' },
          ].map((card) => (
            <div key={card.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
              <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">API Requests</h3>
            <BarChart points={d.apiRequests} color="bg-blue-500" />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Response Time (ms)</h3>
            <LineChart points={d.responseTimes} color="text-orange-500" />
            <div className="flex justify-between mt-1">
              {d.responseTimes.map((p) => (
                <span key={p.label} className="text-xs text-gray-400">{p.label}</span>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Cost (USD)</h3>
            <BarChart points={d.costs} color="bg-green-500" unit="$" />
          </div>
        </div>

        {/* Model Usage Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-8">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Model Usage Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  <th className="pb-3 pr-4 font-medium">Model</th>
                  <th className="pb-3 pr-4 font-medium text-right">Requests</th>
                  <th className="pb-3 pr-4 font-medium text-right">Tokens</th>
                  <th className="pb-3 pr-4 font-medium text-right">Cost</th>
                  <th className="pb-3 font-medium">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {d.modelUsage.map((m) => {
                  const share = Math.round((m.requests / totalRequests) * 100);
                  return (
                    <tr key={m.model}>
                      <td className="py-3 pr-4">
                        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
                          {m.model}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-700 dark:text-gray-300">
                        {m.requests.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-700 dark:text-gray-300">
                        {(m.tokens / 1_000_000).toFixed(1)}M
                      </td>
                      <td className="py-3 pr-4 text-right font-medium text-gray-900 dark:text-white">
                        ${m.cost.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${share}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8">{share}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Protocol Activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'MCP Protocol',
              items: [
                { label: 'Tool Calls', value: '18,432' },
                { label: 'Resource Reads', value: '9,210' },
                { label: 'Prompt Executions', value: '4,887' },
                { label: 'Active Servers', value: '7' },
              ],
              color: 'bg-purple-500',
            },
            {
              title: 'A2A Protocol',
              items: [
                { label: 'Agent Messages', value: '6,241' },
                { label: 'Tasks Delegated', value: '1,832' },
                { label: 'Capability Queries', value: '3,109' },
                { label: 'Active Agents', value: '4' },
              ],
              color: 'bg-indigo-500',
            },
            {
              title: 'AP2 Protocol',
              items: [
                { label: 'Tasks Created', value: '2,847' },
                { label: 'Artifacts Generated', value: '5,694' },
                { label: 'Completed', value: '2,631' },
                { label: 'Success Rate', value: '92.4%' },
              ],
              color: 'bg-cyan-500',
            },
          ].map((proto) => (
            <div key={proto.title} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2.5 h-2.5 rounded-full ${proto.color}`} />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{proto.title}</h3>
              </div>
              <div className="space-y-3">
                {proto.items.map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
