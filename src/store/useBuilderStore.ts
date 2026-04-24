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
      settings: {
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#0f172a",
      },

      // Ajouter un bloc avec des valeurs par défaut selon le type
      addBlock: (type: BlockType, index?: number) => {
        let content = {};
        
        // Initialiser les données par défaut selon le type
        if (type === 'social-links') {
          content = {
            socialLinks: [
              { id: '1', platform: 'github', url: 'https://github.com', label: 'GitHub' },
              { id: '2', platform: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
              { id: '3', platform: 'email', url: 'mailto:contact@example.com', label: 'Email' },
            ]
          };
        } else if (type === 'faq') {
          content = {
            faqItems: [
              { id: '1', question: 'Question 1?', answer: 'Réponse à votre question...' },
              { id: '2', question: 'Question 2?', answer: 'Réponse détaillée...' },
            ]
          };
        } else if (type === 'soft-skills') {
          content = {
            skills: [
              { name: 'Communication', level: 90 },
              { name: 'Leadership', level: 85 },
            ]
          };
        } else if (type === 'hard-skills') {
          content = {
            skills: [
              { name: 'React', level: 90 },
              { name: 'TypeScript', level: 85 },
            ]
          };
        } else if (type === 'timeline') {
          content = {
            title: '',
            events: [
              { year: '2024', title: 'Position Actuelle', company: 'Entreprise' },
              { year: '2022', title: 'Poste Senior', company: 'Entreprise Précédente' },
            ]
          };
        }
        
        const newBlock: Block = {
          id: uuidv4(),
          type,
          content,
          styles: {
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#1e293b',
            textColor: '#ffffff',
            accentColor: '#6366f1',
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
          blocks: state.blocks.map((b: Block) => {
            if (b.id === id) {
              // Fusionner correctement les objets imbriqués (content, styles)
              return {
                ...b,
                ...updates,
                content: updates.content !== undefined ? updates.content : b.content,
                styles: updates.styles !== undefined ? { ...b.styles, ...updates.styles } : b.styles,
              };
            }
            return b;
          }),
        }));
      },
      
      // Mettre à jour le contenu d'un bloc (pour les items sociaux et FAQ)
      updateBlockContent: (id: string, content: any) => {
        set((state: BuilderState) => ({
          blocks: state.blocks.map((b: Block) => 
            b.id === id ? { ...b, content: { ...b.content, ...content } } : b
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
      
      // Mettre à jour les paramètres globaux
      updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
    }),
    {
      name: 'devfolio-storage', // Nom de la clé dans le localStorage
    }
  )
);
