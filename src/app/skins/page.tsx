'use client';

import React, { useState, useEffect } from 'react';
import { useSkinStore } from '@/lib/skin-store';
import { SKIN_TEMPLATES, createSkinFromTemplate } from '@/lib/skin-templates';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';

export default function SkinsPage() {
  const router = useRouter();
  const { skins, activeSkinId, addSkin, setActiveSkin, deleteSkin, duplicateSkin } =
    useSkinStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Initialize with templates if no skins exist
  useEffect(() => {
    if (skins.length === 0) {
      SKIN_TEMPLATES.forEach((template) => {
        const skin = createSkinFromTemplate(template);
        addSkin(skin);
      });
    }
  }, []);

  const categories = [
    { id: 'all', label: 'All Skins' },
    { id: 'ide', label: 'IDE' },
    { id: 'chat', label: 'Chat' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'monitoring', label: 'Monitoring' },
    { id: 'custom', label: 'Custom' },
  ];

  const filteredSkins =
    selectedCategory === 'all'
      ? skins
      : skins.filter((skin) => skin.category === selectedCategory);

  const handleActivate = (skinId: string) => {
    setActiveSkin(skinId);
    router.push(`/workspace?skin=${skinId}`);
  };

  const handleDuplicate = (skinId: string) => {
    duplicateSkin(skinId);
  };

  const handleDelete = (skinId: string) => {
    if (confirm('Are you sure you want to delete this skin?')) {
      deleteSkin(skinId);
    }
  };

  const handleCreateNew = () => {
    router.push('/skins/builder');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Workspace Skins
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a skin template or create your own custom workspace layout
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <Button variant="primary" onClick={handleCreateNew}>
            + Create New Skin
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {skins.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Skins
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {skins.filter((s) => s.isTemplate).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Templates
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {skins.filter((s) => !s.isTemplate).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Custom Skins
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {skins.find((s) => s.id === activeSkinId)?.name || 'None'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Skin
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkins.map((skin) => (
            <Card key={skin.id} hover>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {skin.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {skin.description}
                    </p>
                  </div>
                  {skin.id === activeSkinId && (
                    <Badge variant="success">Active</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {/* Metadata */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="info">{skin.category}</Badge>
                  {skin.isTemplate && <Badge variant="neutral">Template</Badge>}
                  <span className="text-xs text-gray-500">
                    {skin.components.length} components
                  </span>
                </div>

                {/* Tags */}
                {skin.tags && skin.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {skin.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleActivate(skin.id)}
                    className="flex-1"
                  >
                    {skin.id === activeSkinId ? 'Open' : 'Activate'}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(skin.id)}
                  >
                    Duplicate
                  </Button>

                  {!skin.isTemplate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(skin.id)}
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Delete
                    </Button>
                  )}
                </div>

                {/* Info */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {skin.author && <div>by {skin.author}</div>}
                    <div>Updated {skin.updatedAt.toLocaleDateString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSkins.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">🎨</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No skins found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {selectedCategory === 'all'
                ? 'Get started by creating your first custom skin'
                : `No skins in the ${selectedCategory} category`}
            </p>
            <Button variant="primary" onClick={handleCreateNew}>
              Create New Skin
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
