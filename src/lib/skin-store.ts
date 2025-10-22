import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Skin, SkinBuilderState } from '@/types/skin';

interface SkinStore {
  // Skins
  skins: Skin[];
  activeSkinId: string | null;

  // Builder state
  builderState: SkinBuilderState;

  // Skin actions
  addSkin: (skin: Skin) => void;
  updateSkin: (id: string, updates: Partial<Skin>) => void;
  deleteSkin: (id: string) => void;
  setActiveSkin: (id: string | null) => void;
  duplicateSkin: (id: string) => void;

  // Builder actions
  setCurrentSkin: (skin: Skin | null) => void;
  setSelectedComponent: (componentId: string | null) => void;
  setIsEditing: (isEditing: boolean) => void;
  setIsDragging: (isDragging: boolean) => void;
  setDraggedComponent: (componentType?: string) => void;
}

export const useSkinStore = create<SkinStore>()(
  persist(
    (set, get) => ({
      skins: [],
      activeSkinId: null,

      builderState: {
        currentSkin: null,
        selectedComponent: null,
        isEditing: false,
        isDragging: false,
      },

      addSkin: (skin) =>
        set((state) => ({
          skins: [...state.skins, skin]
        })),

      updateSkin: (id, updates) =>
        set((state) => ({
          skins: state.skins.map((skin) =>
            skin.id === id
              ? { ...skin, ...updates, updatedAt: new Date() }
              : skin
          )
        })),

      deleteSkin: (id) =>
        set((state) => ({
          skins: state.skins.filter((skin) => skin.id !== id),
          activeSkinId: state.activeSkinId === id ? null : state.activeSkinId
        })),

      setActiveSkin: (id) =>
        set({ activeSkinId: id }),

      duplicateSkin: (id) => {
        const skin = get().skins.find((s) => s.id === id);
        if (skin) {
          const newSkin: Skin = {
            ...skin,
            id: crypto.randomUUID(),
            name: `${skin.name} (Copy)`,
            isTemplate: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set((state) => ({
            skins: [...state.skins, newSkin]
          }));
        }
      },

      setCurrentSkin: (skin) =>
        set((state) => ({
          builderState: { ...state.builderState, currentSkin: skin }
        })),

      setSelectedComponent: (componentId) =>
        set((state) => ({
          builderState: { ...state.builderState, selectedComponent: componentId }
        })),

      setIsEditing: (isEditing) =>
        set((state) => ({
          builderState: { ...state.builderState, isEditing }
        })),

      setIsDragging: (isDragging) =>
        set((state) => ({
          builderState: { ...state.builderState, isDragging }
        })),

      setDraggedComponent: (draggedComponent) =>
        set((state) => ({
          builderState: { ...state.builderState, draggedComponent: draggedComponent as any }
        })),
    }),
    {
      name: 'skin-store'
    }
  )
);
