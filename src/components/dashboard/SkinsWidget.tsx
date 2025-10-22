'use client';

import Link from 'next/link';
import { useSkinStore } from '@/lib/skin-store';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useEffect } from 'react';
import { SKIN_TEMPLATES, createSkinFromTemplate } from '@/lib/skin-templates';

export function SkinsWidget() {
  const { skins, activeSkinId, addSkin, setActiveSkin } = useSkinStore();

  // Initialize with templates if no skins exist
  useEffect(() => {
    if (skins.length === 0) {
      SKIN_TEMPLATES.forEach((template) => {
        const skin = createSkinFromTemplate(template);
        addSkin(skin);
      });
    }
  }, [skins.length, addSkin]);

  const activeSkin = skins.find((s) => s.id === activeSkinId);
  const recentSkins = skins.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Workspace Skins
          </h3>
          <Link href="/skins">
            <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </span>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {/* Active Skin */}
        {activeSkin ? (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {activeSkin.name}
                  </span>
                  <Badge variant="success">Active</Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                  {activeSkin.description}
                </p>
              </div>
            </div>
            <Link href="/workspace">
              <Button variant="primary" size="sm" className="w-full">
                Open Workspace
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              No active skin. Choose one to get started.
            </p>
            <Link href="/skins">
              <Button variant="outline" size="sm" className="w-full">
                Browse Skins
              </Button>
            </Link>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {skins.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {skins.filter((s) => s.isTemplate).length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Templates
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {skins.filter((s) => !s.isTemplate).length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Custom
            </div>
          </div>
        </div>

        {/* Recent Skins */}
        {recentSkins.length > 0 && (
          <>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Recent Skins
            </div>
            <div className="space-y-2">
              {recentSkins.map((skin) => (
                <div
                  key={skin.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group"
                  onClick={() => {
                    setActiveSkin(skin.id);
                    window.location.href = '/workspace';
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {skin.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {skin.category} • {skin.components.length} components
                    </div>
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open →
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <Link href="/skins/builder">
            <Button variant="outline" size="sm" className="w-full">
              + Create New Skin
            </Button>
          </Link>
          <Link href="/skins">
            <Button variant="ghost" size="sm" className="w-full">
              Manage All Skins
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
