// src/components/builder/Sidebar.tsx
import { useState } from 'react';
import { Terminal, Layout, Type, List, Cpu, Code, Palette, Sparkles } from 'lucide-react';
import { useBuilderStore } from '../../store/useBuilderStore';
import type { BlockType } from '../../types.ts';
import { getThemesByType } from '../../lib/themes.ts';
import ThemeGallery from '../ThemeGallery.tsx';

const BLOCK_LIBRARY: { type: BlockType; label: string; icon: any }[] = [
  { type: 'header', label: 'En-tête', icon: Layout },
  { type: 'terminal', label: 'Console', icon: Terminal },
  { type: 'stack', label: 'Compétences', icon: Cpu },
  { type: 'timeline', label: 'Expérience', icon: List },
  { type: 'code-snippet', label: 'Code', icon: Code },
  { type: 'text', label: 'Texte', icon: Type },
];

export default function Sidebar() {
  const [showGallery, setShowGallery] = useState(false);
  
  const addBlock = useBuilderStore((s) => s.addBlock);
  const selectedBlockId = useBuilderStore((s) => s.selectedBlockId);
  const blocks = useBuilderStore((s) => s.blocks);
  const updateBlock = useBuilderStore((s) => s.updateBlock);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
  const availableThemes = selectedBlock ? getThemesByType(selectedBlock.type) : [];

  const handleThemeChange = (themeId: string) => {
    if (selectedBlock) {
      updateBlock(selectedBlock.id, { theme: themeId });
    }
  };

  return (
    <>
      <aside className="w-64 border-r border-builder-border bg-builder-panel p-4 flex flex-col gap-4 overflow-y-auto">
        {/* Gallery Button */}
        <button
          onClick={() => setShowGallery(true)}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg"
        >
          <Sparkles size={18} />
          Galerie Thèmes
        </button>

        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Composants</h2>
        <div className="grid grid-cols-1 gap-2">
          {BLOCK_LIBRARY.map((item) => (
          <button
            key={item.type}
            onClick={() => addBlock(item.type)}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-indigo-600 transition-colors group"
          >
            <item.icon size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Séparateur */}
      <div className="border-t border-slate-700 my-2" />

      {/* Section Thèmes */}
      {selectedBlock && availableThemes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Thème</h2>
          </div>
          
          <select
            value={selectedBlock.theme || ''}
            onChange={(e) => handleThemeChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded border border-slate-600 hover:border-indigo-500 transition-colors focus:outline-none focus:ring-2 ring-indigo-500/30 text-sm"
          >
            <option value="">Aucun thème</option>
            {availableThemes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>

          {/* Aperçu du thème */}
          {selectedBlock.theme && (
            <div className="p-3 bg-slate-800 rounded text-xs space-y-1 border border-slate-700">
              {availableThemes
                .filter((t) => t.id === selectedBlock.theme)
                .map((theme) => (
                  <div key={theme.id}>
                    <p className="text-slate-400">
                      <span className="text-indigo-300 font-semibold">Nom :</span> {theme.name}
                    </p>
                    <p className="text-slate-400">
                      <span className="text-indigo-300 font-semibold">Description :</span> {theme.description}
                    </p>
                    <p className="text-slate-400">
                      <span className="text-indigo-300 font-semibold">Animation :</span> {theme.animation || 'aucune'}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Message si aucun bloc sélectionné */}
      {!selectedBlock && (
        <div className="text-xs text-slate-500 italic text-center">
          Sélectionnez un bloc pour voir ses thèmes disponibles
        </div>
      )}
    </aside>
    
    <ThemeGallery isOpen={showGallery} onClose={() => setShowGallery(false)} />
    </>
  );
}
