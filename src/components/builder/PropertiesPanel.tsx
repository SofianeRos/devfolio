// src/components/builder/PropertiesPanel.tsx
import { useState } from 'react';
import { useBuilderStore } from '../../store/useBuilderStore.ts';
import { Palette, Info } from 'lucide-react';
import { getThemesByType, getThemeById } from '../../lib/themes.ts';
import ThemeGallery from '../ThemeGallery.tsx';

const ANIMATIONS = [
  { group: 'Entrance', items: ['fade-in', 'fade-in-up', 'fade-in-down', 'slide-in-right', 'slide-in-left'] },
  { group: 'Glow', items: ['pulse-glow', 'fade-glow', 'slide-glow', 'neon-pulse', 'pulse-blue', 'galaxy-glow', 'aurora-shift'] },
  { group: 'Gradient', items: ['lava-flow', 'wave-flow', 'sunset-glow', 'forest-glow'] },
  { group: 'Special', items: ['matrix-glow', 'neon-border', 'pulse-fast', 'spin-slow'] },
];

export default function PropertiesPanel() {
  const selectedBlockId = useBuilderStore((s) => s.selectedBlockId);
  const blocks = useBuilderStore((s) => s.blocks);
  const updateBlock = useBuilderStore((s) => s.updateBlock);
  const [showGallery, setShowGallery] = useState(false);
  const [previewAnimation, setPreviewAnimation] = useState<string | null>(null);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
  const availableThemes = selectedBlock ? getThemesByType(selectedBlock.type) : [];
  const selectedBlockTheme = selectedBlock?.theme ? getThemeById(selectedBlock.theme) : undefined;

  const handleThemeChange = (themeId: string) => {
    if (selectedBlock) {
      updateBlock(selectedBlock.id, { theme: themeId });
    }
  };

  const handleAnimationChange = (animationName: string) => {
    if (selectedBlock) {
      updateBlock(selectedBlock.id, { animation: animationName });
    }
  };

  const handleStyleChange = (key: string, value: string | undefined) => {
    if (selectedBlock) {
      const newStyles = { ...(selectedBlock.styles || {}) };
      if (value === undefined) {
        delete newStyles[key];
      } else {
        newStyles[key] = value;
      }
      updateBlock(selectedBlock.id, { styles: newStyles });
    }
  };

  return (
    <>
      <aside className="w-80 border-l border-builder-border bg-builder-panel p-4 pb-28 flex flex-col gap-6 overflow-y-auto">
        {!selectedBlock ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 opacity-60 mt-20">
            <Palette size={48} />
            <p className="text-sm italic text-center">
              Sélectionnez un bloc pour<br/>éditer ses propriétés
            </p>
          </div>
        ) : (
          <>
            {/* ===== STYLES & ANIMATIONS ===== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
                <Palette size={18} className="text-pink-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Style & Animations</h2>
              </div>
              
              {/* Animations */}
              <div>
                <label className="text-xs font-bold text-cyan-400 uppercase block mb-2">✨ Animation d'entrée</label>
                <div className="space-y-3">
                  {ANIMATIONS.map((group) => (
                    <div key={group.group}>
                      <p className="text-xs text-slate-500 font-semibold mb-1">{group.group}</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {group.items.map((anim) => (
                          <button
                            key={anim}
                            onClick={() => {
                              handleAnimationChange(anim);
                              setPreviewAnimation(anim);
                            }}
                            className={`px-2 py-1.5 text-xs rounded font-semibold transition-all ${
                              selectedBlock.animation === anim
                                ? 'bg-cyan-600 text-white ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/30'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
                            }`}
                          >
                            {anim}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {(previewAnimation || selectedBlock.animation) && (
                  <div className="mt-4 p-4 bg-linear-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-400 mb-3 flex justify-between items-center">
                      <span>Aperçu:</span>
                      <span className="font-mono text-cyan-300 bg-cyan-900/30 px-2 py-0.5 rounded">{previewAnimation || selectedBlock.animation}</span>
                    </p>
                    <div className="flex items-center justify-center py-6 bg-slate-950/50 rounded-md border border-slate-800 overflow-hidden">
                      <div
                        key={previewAnimation || selectedBlock.animation}
                        className="w-16 h-16 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg"
                        style={{
                          animation: `${previewAnimation || selectedBlock.animation} 2s ease-in-out infinite`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    handleAnimationChange('');
                    setPreviewAnimation(null);
                  }}
                  className={`w-full mt-3 px-2 py-2 text-xs rounded font-semibold transition-all ${
                    !selectedBlock.animation
                      ? 'bg-slate-600 text-white ring-2 ring-slate-400'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  ✕ Aucune animation
                </button>
              </div>

              {/* Thème */}
              {availableThemes.length > 0 && (
                <div className="pt-2">
                  <label className="text-xs font-bold text-indigo-400 uppercase block mb-2">📌 Thème d'apparence</label>
                  <select
                    value={selectedBlock.theme || ''}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors focus:outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer"
                  >
                    <option value="">Par défaut (Aucun)</option>
                    {availableThemes.map((theme) => (
                      <option key={theme.id} value={theme.id}>
                        {theme.name}
                      </option>
                    ))}
                  </select>
                  
                  {selectedBlock.theme && (
                    <div className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      {availableThemes
                        .filter((t) => t.id === selectedBlock.theme)
                        .map((theme) => (
                          <div key={theme.id} className="space-y-2">
                            <p className="text-xs text-slate-400 flex justify-between">
                              <span>Palette:</span>
                              <span className="text-indigo-300 font-semibold">{theme.name}</span>
                            </p>
                            <div className="flex gap-1 h-8">
                              {Object.entries(theme.colors).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="flex-1 rounded-sm border border-slate-700 shadow-inner"
                                  style={{
                                    backgroundColor:
                                      typeof value === 'string' && value.startsWith('#') ? value : '#333',
                                  }}
                                  title={`${key}`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Couleur d'accentuation manuelle */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-emerald-400 uppercase">🎨 Couleur Principale</label>
                  {selectedBlock.styles?.accentColor && (
                    <button 
                      onClick={() => handleStyleChange('accentColor', undefined)}
                      className="text-[10px] text-slate-400 hover:text-white transition-colors underline"
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3 bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                  <input 
                    type="color" 
                    value={selectedBlock.styles?.accentColor || selectedBlockTheme?.colors.accent || '#6366f1'} 
                    onChange={(e) => handleStyleChange('accentColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                  />
                  <span className="text-xs text-slate-300 font-mono flex-1">
                    {selectedBlock.styles?.accentColor || selectedBlockTheme?.colors.accent || '#6366f1'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowGallery(true)}
                className="w-full mt-4 px-4 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-purple-500/20"
              >
                🎨 Explorer la galerie
              </button>
            </div>

            {/* ===== LE BLOC ACTUEL ===== */}
            <div className="space-y-4 pt-6 mt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
                <Info size={18} className="text-blue-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Le Bloc Actuel</h2>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 space-y-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Type de composant</label>
                  <div className="text-sm font-medium text-slate-300 mt-0.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="capitalize">{selectedBlock.type}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Identifiant Unique (ID)</label>
                  <div className="text-xs text-slate-400 mt-0.5 font-mono truncate select-all bg-slate-900/50 p-1.5 rounded">
                    {selectedBlock.id}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      <ThemeGallery isOpen={showGallery} onClose={() => setShowGallery(false)} />
    </>
  );
}
