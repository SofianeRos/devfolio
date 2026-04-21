// src/store/useBuilderStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { BuilderState, Block, BlockType } from '../types.ts';
import { arrayMove } from '@dnd-kit/sortable';

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
      blocks: [],
      selectedBlockId: null,

      // Ajouter un bloc avec des valeurs par défaut selon le type
      addBlock: (type: BlockType, index?: number) => {
        const newBlock: Block = {
          id: uuidv4(),
          type,
          content: {}, // On remplira selon le type plus tard
          styles: {
            padding: '20px',
            borderRadius: '8px',
          },
        };
        set((state: BuilderState) => {
          const newBlocks = [...state.blocks];
          if (index !== undefined && index >= 0 && index <= newBlocks.length) {
            newBlocks.splice(index, 0, newBlock);
          } else {
            newBlocks.push(newBlock);
          }
          return { blocks: newBlocks };
        });
      },

      // Mettre à jour les données ou le style d'un bloc précis
      updateBlock: (id: string, updates: Partial<Block>) => {
        set((state: BuilderState) => ({
          blocks: state.blocks.map((b: Block) => 
            b.id === id ? { ...b, ...updates } : b
          ),
        }));
      },

      // Supprimer un bloc
      removeBlock: (id: string) => {
        set((state: BuilderState) => ({
          blocks: state.blocks.filter((b: Block) => b.id !== id),
          selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
        }));
      },

      // Logique pour réordonner les blocs (indispensable pour dnd-kit)
      reorderBlocks: (activeId: string, overId: string) => {
        set((state: BuilderState) => {
          const oldIndex = state.blocks.findIndex((b: Block) => b.id === activeId);
          const newIndex = state.blocks.findIndex((b: Block) => b.id === overId);
          
          return {
            blocks: arrayMove(state.blocks, oldIndex, newIndex),
          };
        });
      },

      // Sélectionner un bloc pour l'édition
      selectBlock: (id: string | null) => set({ selectedBlockId: id }),

      // Charger une liste complète de blocs (pour les templates)
      setBlocks: (blocks: Block[]) => set({ blocks, selectedBlockId: null }),
    }),
    {
      name: 'devfolio-storage', // Nom de la clé dans le localStorage
    }
  )
);
