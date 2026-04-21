// src/components/builder/Sidebar.tsx
import { useState } from 'react';
import { Terminal, Layout, Type, List, Cpu, Code, Palette, Sparkles, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import { useBuilderStore } from '../../store/useBuilderStore';
import type { BlockType } from '../../types.ts';
import { getThemesByType } from '../../lib/themes.ts';
import ThemeGallery from '../ThemeGallery.tsx';

const BLOCK_LIBRARY: { type: BlockType; label: string; icon: any; description: string }[] = [
  { type: 'header', label: '📋 En-tête', icon: Layout, description: 'Présentation du portfolio' },
  { type: 'terminal', label: '🖥️ Terminal', icon: Terminal, description: 'Affichage de code/console' },
  { type: 'stack', label: '🎯 Compétences', icon: Cpu, description: 'Liste de vos skills' },
  { type: 'timeline', label: '📅 Expérience', icon: List, description: 'Historique professionnel' },
  { type: 'code-snippet', label: '💻 Code', icon: Code, description: 'Bloc de code coloré' },
  { type: 'text', label: '📝 Texte', icon: Type, description: 'Paragraphes personnalisés' },
];

export default function Sidebar() {
  const [showGallery, setShowGallery] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'add' | 'current' | 'style'>('add');
  
  const addBlock = useBuilderStore((s) => s.addBlock);
  const selectBlock = useBuilderStore((s) => s.selectBlock);
  const removeBlock = useBuilderStore((s) => s.removeBlock);
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

  const handleAddBlock = (type: BlockType) => {
    addBlock(type);
    setExpandedSection('current');
  };

  return (
    <>
      <aside className="w-80 border-r border-builder-border bg-builder-panel flex flex-col gap-0 overflow-hidden">
        
        {/* ===== SECTION 1: AJOUTER DES COMPOSANTS ===== */}
        <div className="border-b border-slate-700">
          <button
            onClick={() => setExpandedSection(expandedSection === 'add' ? 'current' : 'add')}
            className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 transition-colors flex items-center justify-between text-slate-200 font-semibold"
          >
            <span className="flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-400" />
              Ajouter un composant
            </span>
            <span className={`transform transition-transform ${expandedSection === 'add' ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {expandedSection === 'add' && (
            <div className="p-4 space-y-2 bg-slate-900/50">
              {BLOCK_LIBRARY.map((item) => (
                <button
                  key={item.type}
                  onClick={() => handleAddBlock(item.type)}
                  className="w-full text-left p-3 rounded-lg bg-slate-700 hover:bg-indigo-600 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-1">{item.label.split(' ')[0]}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-100 group-hover:text-white">{item.label.split(' ').slice(1).join(' ')}</p>
                      <p className="text-xs text-slate-400 group-hover:text-slate-300">{item.description}</p>
                    </div>
                    <span className="text-lg text-slate-400 group-hover:text-white">+</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===== SECTION 2: BLOCS ACTUELS (DRAG & DROP) ===== */}
        <div className="border-b border-slate-700 flex-1 flex flex-col">
          <button
            onClick={() => setExpandedSection(expandedSection === 'current' ? 'add' : 'current')}
            className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 transition-colors flex items-center justify-between text-slate-200 font-semibold"
          >
            <span className="flex items-center gap-2">
              <GripVertical size={18} className="text-cyan-400" />
              Blocs actuels ({blocks.length})
            </span>
            <span className={`transform transition-transform ${expandedSection === 'current' ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {expandedSection === 'current' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-900/50">
              {blocks.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-8">
                  Aucun bloc ajouté. Commencez par en ajouter un ! ⬆️
                </p>
              ) : (
                blocks.map((block, idx) => (
                  <div
                    key={block.id}
                    className={`group p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedBlockId === block.id
                        ? 'border-indigo-500 bg-slate-700'
                        : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                    }`}
                    onClick={() => selectBlock(block.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-300">
                        {idx + 1}. {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBlock(block.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-600/20 rounded"
                        title="Supprimer"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <GripVertical size={12} className="text-slate-500" />
                      <span>ID: {block.id.slice(0, 8)}...</span>
                      {block.theme && <span className="text-indigo-300">✓ {block.theme}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ===== SECTION 3: ANIMATIONS & STYLES ===== */}
        <div className="border-t border-slate-700">
          <button
            onClick={() => setExpandedSection(expandedSection === 'style' ? 'add' : 'style')}
            className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 transition-colors flex items-center justify-between text-slate-200 font-semibold"
          >
            <span className="flex items-center gap-2">
              <Palette size={18} className="text-pink-400" />
              Style & Animations
            </span>
            <span className={`transform transition-transform ${expandedSection === 'style' ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {expandedSection === 'style' && (
            <div className="p-4 space-y-4 bg-slate-900/50 max-h-96 overflow-y-auto">
              {!selectedBlock ? (
                <p className="text-xs text-slate-500 italic text-center py-4">
                  Sélectionnez un bloc à gauche pour personnaliser son style
                </p>
              ) : (
                <>
                  {/* Thème Selector */}
                  {availableThemes.length > 0 && (
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">📌 Thème</label>
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
                      
                      {/* Theme Preview */}
                      {selectedBlock.theme && (
                        <div className="mt-3 p-3 bg-slate-800 rounded border border-slate-700 text-xs space-y-2">
                          {availableThemes
                            .filter((t) => t.id === selectedBlock.theme)
                            .map((theme) => (
                              <div key={theme.id}>
                                <p className="text-slate-300"><span className="font-semibold text-indigo-300">Nom:</span> {theme.name}</p>
                                <p className="text-slate-300"><span className="font-semibold text-indigo-300">Description:</span> {theme.description}</p>
                                <p className="text-slate-300">
                                  <span className="font-semibold text-indigo-300">Animation:</span> 
                                  <span className="text-cyan-300 font-mono"> {theme.animation || 'aucune'}</span>
                                </p>
                                <div className="flex gap-1 mt-2">
                                  {Object.entries(theme.colors).map(([key, value]) => (
                                    <div
                                      key={key}
                                      className="flex-1 h-6 rounded border border-slate-600"
                                      style={{
                                        backgroundColor:
                                          typeof value === 'string' && value.startsWith('#') ? value : '#333',
                                      }}
                                      title={`${key}: ${value}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Gallery Button */}
                  <button
                    onClick={() => setShowGallery(true)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <Sparkles size={16} />
                    Voir tous les thèmes
                  </button>
                </>
              )}
            </div>
          )}
        </div>

      </aside>
    
    
    <ThemeGallery isOpen={showGallery} onClose={() => setShowGallery(false)} />
    </>
  );
}
