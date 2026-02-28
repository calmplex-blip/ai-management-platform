'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

type ModelStatus = 'active' | 'inactive' | 'deprecated';
type ModelProvider = 'Anthropic' | 'OpenAI' | 'Google' | 'Meta' | 'Custom';

interface Model {
  id: string;
  name: string;
  provider: ModelProvider;
  version: string;
  status: ModelStatus;
  contextWindow: number;
  inputCost: number;
  outputCost: number;
  requestsToday: number;
  avgLatency: number;
  successRate: number;
  description: string;
  tags: string[];
}

const models: Model[] = [
  {
    id: 'claude-opus-4-6',
    name: 'Claude Opus 4.6',
    provider: 'Anthropic',
    version: '4.6',
    status: 'active',
    contextWindow: 200000,
    inputCost: 15,
    outputCost: 75,
    requestsToday: 18420,
    avgLatency: 2840,
    successRate: 99.7,
    description: 'Most capable Claude model for complex reasoning, analysis, and nuanced tasks.',
    tags: ['reasoning', 'analysis', 'coding'],
  },
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    version: '4.6',
    status: 'active',
    contextWindow: 200000,
    inputCost: 3,
    outputCost: 15,
    requestsToday: 42100,
    avgLatency: 1240,
    successRate: 99.9,
    description: 'Best balance of intelligence and speed for production workloads.',
    tags: ['production', 'balanced', 'fast'],
  },
  {
    id: 'claude-haiku-4-5',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    version: '4.5',
    status: 'active',
    contextWindow: 200000,
    inputCost: 0.8,
    outputCost: 4,
    requestsToday: 89300,
    avgLatency: 380,
    successRate: 99.8,
    description: 'Fastest and most compact model for high-throughput, latency-sensitive applications.',
    tags: ['fast', 'high-volume', 'cost-effective'],
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    version: '2024-11-20',
    status: 'active',
    contextWindow: 128000,
    inputCost: 2.5,
    outputCost: 10,
    requestsToday: 8940,
    avgLatency: 1820,
    successRate: 99.4,
    description: 'OpenAI flagship model with multimodal capabilities.',
    tags: ['multimodal', 'openai', 'vision'],
  },
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    version: '2.0',
    status: 'active',
    contextWindow: 1000000,
    inputCost: 0.1,
    outputCost: 0.4,
    requestsToday: 12600,
    avgLatency: 640,
    successRate: 99.1,
    description: 'Google\'s fastest model with an extremely long context window.',
    tags: ['google', 'long-context', 'fast'],
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'Meta',
    version: '3.0',
    status: 'inactive',
    contextWindow: 128000,
    inputCost: 0,
    outputCost: 0,
    requestsToday: 0,
    avgLatency: 2100,
    successRate: 98.2,
    description: 'Open-weight model deployed on self-hosted infrastructure.',
    tags: ['open-source', 'self-hosted', 'meta'],
  },
];

const statusColor: Record<ModelStatus, string> = {
  active: 'success',
  inactive: 'neutral',
  deprecated: 'warning',
};

const providerColor: Record<ModelProvider, string> = {
  Anthropic: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  OpenAI: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  Google: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Meta: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  Custom: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
};

export default function ModelsPage() {
  const [filter, setFilter] = useState<'all' | ModelStatus>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Model | null>(null);

  const filtered = models.filter((m) => {
    if (filter !== 'all' && m.status !== filter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Models</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {models.filter((m) => m.status === 'active').length} active models across {new Set(models.map((m) => m.provider)).size} providers
            </p>
          </div>
          <Button size="sm">+ Add Model</Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search models..."
            className="w-64 text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {(['all', 'active', 'inactive', 'deprecated'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Model List */}
          <div className="flex-1 space-y-3">
            {filtered.map((model) => (
              <div
                key={model.id}
                onClick={() => setSelected(model)}
                className={`bg-white dark:bg-gray-800 rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md ${
                  selected?.id === model.id
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{model.name}</h3>
                        <Badge variant={statusColor[model.status] as 'success' | 'neutral' | 'warning'}>{model.status}</Badge>
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${providerColor[model.provider]}`}>
                          {model.provider}
                        </span>
                      </div>
                      <code className="text-xs text-gray-400 font-mono mt-0.5 block">{model.id}</code>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{model.description}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {model.requestsToday.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">req today</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>{(model.contextWindow / 1000).toFixed(0)}K ctx</span>
                  <span>${model.inputCost}/M in · ${model.outputCost}/M out</span>
                  <span>{model.avgLatency}ms avg</span>
                  <span className="text-green-600 dark:text-green-400">{model.successRate}% success</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">No models match your search.</div>
            )}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div className="w-72 shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sticky top-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{selected.name}</h3>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    ['Provider', selected.provider],
                    ['Version', selected.version],
                    ['Status', selected.status],
                    ['Context Window', (selected.contextWindow / 1000).toFixed(0) + 'K tokens'],
                    ['Input Cost', '$' + selected.inputCost + ' / 1M tokens'],
                    ['Output Cost', '$' + selected.outputCost + ' / 1M tokens'],
                    ['Avg Latency', selected.avgLatency + 'ms'],
                    ['Success Rate', selected.successRate + '%'],
                    ['Requests Today', selected.requestsToday.toLocaleString()],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{k}</span>
                      <span className="font-medium text-gray-900 dark:text-white text-right ml-2">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.tags.map((t) => (
                      <span key={t} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <Button size="sm" className="w-full">Configure</Button>
                  <Button size="sm" variant="secondary" className="w-full">
                    {selected.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
