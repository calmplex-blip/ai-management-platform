'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSkinStore } from '@/lib/skin-store';
import { SkinRenderer } from '@/components/skin/SkinRenderer';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

function WorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skinId = searchParams.get('skin');
  const { skins, activeSkinId, setActiveSkin } = useSkinStore();
  const [currentSkinId, setCurrentSkinId] = useState<string | null>(null);

  useEffect(() => {
    if (skinId) {
      setCurrentSkinId(skinId);
      setActiveSkin(skinId);
    } else if (activeSkinId) {
      setCurrentSkinId(activeSkinId);
    }
  }, [skinId, activeSkinId, setActiveSkin]);

  const activeSkin = skins.find((s) => s.id === currentSkinId);

  if (!activeSkin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎨</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Active Skin
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please select a skin to get started
          </p>
          <Button variant="primary" onClick={() => router.push('/skins')}>
            Browse Skins
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ← Back
          </button>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {activeSkin.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {activeSkin.description}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/skins')}
          >
            Change Skin
          </Button>
          {!activeSkin.isTemplate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/skins/builder?id=${activeSkin.id}`)}
            >
              Edit Skin
            </Button>
          )}
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 overflow-hidden p-4">
        <SkinRenderer skin={activeSkin} className="h-full" />
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading workspace...</div>
      </div>
    }>
      <WorkspaceContent />
    </Suspense>
  );
}
