'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSkinStore } from '@/lib/skin-store';
import { SKIN_TEMPLATES, createSkinFromTemplate } from '@/lib/skin-templates';
import { COMPONENT_REGISTRY, getComponentsByCategory } from '@/lib/component-registry';
import { Skin, SkinComponent, ComponentType } from '@/types/skin';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SkinRenderer } from '@/components/skin/SkinRenderer';

function BuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skinIdParam = searchParams.get('id');
  const { skins, addSkin, updateSkin } = useSkinStore();

  const existingSkin = skinIdParam ? skins.find((s) => s.id === skinIdParam) : null;

  const [skin, setSkin] = useState<Skin>(
    existingSkin || {
      id: crypto.randomUUID(),
      name: 'New Custom Skin',
      description: 'My custom workspace layout',
      category: 'custom',
      layout: {
        type: 'grid',
        areas: ['main'],
        columns: '1fr',
        rows: '1fr',
        gap: '12px',
      },
      components: [],
      theme: 'dark',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  const [activeTab, setActiveTab] = useState<'setup' | 'components' | 'preview'>('setup');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const handleSave = () => {
    if (existingSkin) {
      updateSkin(skin.id, skin);
    } else {
      addSkin(skin);
    }
    router.push('/skins');
  };

  const handleStartFromTemplate = (templateId: string) => {
    const template = SKIN_TEMPLATES.find((t) => t.templateId === templateId);
    if (template) {
      const newSkin = createSkinFromTemplate(template);
      newSkin.isTemplate = false;
      newSkin.name = `${template.name} (Custom)`;
      setSkin(newSkin);
      setActiveTab('preview');
    }
  };

  const handleAddComponent = (type: ComponentType) => {
    const componentDef = COMPONENT_REGISTRY[type];
    const newComponent: SkinComponent = {
      id: crypto.randomUUID(),
      type,
      title: componentDef.name,
      props: { ...componentDef.defaultProps },
      gridArea: 'main',
    };

    setSkin({
      ...skin,
      components: [...skin.components, newComponent],
      updatedAt: new Date(),
    });
  };

  const handleRemoveComponent = (componentId: string) => {
    setSkin({
      ...skin,
      components: skin.components.filter((c) => c.id !== componentId),
      updatedAt: new Date(),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Skin Builder
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {existingSkin ? 'Edit your custom skin' : 'Create a new custom workspace layout'}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/skins')}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Skin
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {['setup', 'components', 'preview'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Setup Tab */}
        {activeTab === 'setup' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skin Name
                  </label>
                  <input
                    type="text"
                    value={skin.name}
                    onChange={(e) => setSkin({ ...skin, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={skin.description}
                    onChange={(e) => setSkin({ ...skin, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={skin.category}
                    onChange={(e) => setSkin({ ...skin, category: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="custom">Custom</option>
                    <option value="ide">IDE</option>
                    <option value="chat">Chat</option>
                    <option value="analytics">Analytics</option>
                    <option value="monitoring">Monitoring</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Start from Template</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {SKIN_TEMPLATES.map((template) => (
                    <div
                      key={template.templateId}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-colors"
                      onClick={() => handleStartFromTemplate(template.templateId)}
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {template.description}
                      </p>
                      <Badge variant="info">{template.category}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Components Tab */}
        {activeTab === 'components' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Available Components */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Available Components</h3>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                  {Object.values(COMPONENT_REGISTRY).map((component) => (
                    <button
                      key={component.type}
                      onClick={() => handleAddComponent(component.type)}
                      className="w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{component.icon}</span>
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {component.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {component.description}
                      </p>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Current Components */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    Current Components ({skin.components.length})
                  </h3>
                </CardHeader>
                <CardContent>
                  {skin.components.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No components added yet. Add components from the left panel.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {skin.components.map((component) => (
                        <div
                          key={component.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {component.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {component.type}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveComponent(component.id)}
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Preview</h3>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4" style={{ height: '600px' }}>
                {skin.components.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    No components to preview. Add components in the Components tab.
                  </div>
                ) : (
                  <SkinRenderer skin={skin} />
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default function SkinBuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading builder...</div>
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
