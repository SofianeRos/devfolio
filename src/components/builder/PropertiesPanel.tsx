// src/components/builder/PropertiesPanel.tsx
import { useState } from 'react';
import { useBuilderStore } from '../../store/useBuilderStore.ts';
import { Palette, Info, Plus, Trash2 } from 'lucide-react';
import { getThemesByType, getThemeById } from '../../lib/themes.ts';
import ThemeGallery from '../ThemeGallery.tsx';

interface SocialLink {
  id: string;
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'website';
  url: string;
  label: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const ANIMATIONS = [
  { group: 'Entrance', items: ['fade-in', 'fade-in-up', 'fade-in-down', 'slide-in-right', 'slide-in-left'] },
  { group: 'Glow', items: ['pulse-glow', 'fade-glow', 'slide-glow', 'neon-pulse', 'pulse-blue', 'galaxy-glow', 'aurora-shift'] },
  { group: 'Gradient', items: ['lava-flow', 'wave-flow', 'sunset-glow', 'forest-glow'] },
  { group: 'Special', items: ['matrix-glow', 'neon-border', 'pulse-fast', 'spin-slow'] },
];


const BORDER_RADIUS = [
  { label: 'Carré', value: '0px' },
  { label: 'Subtil', value: '0.375rem' },
  { label: 'Arrondi', value: '0.75rem' },
  { label: 'Pilule', value: '9999px' },
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

              {/* Outils de surchage de couleurs */}
              <div className="pt-4 border-t border-slate-700/50">
                <label className="text-xs font-bold text-emerald-400 uppercase block mb-3">🎨 Couleurs du Bloc</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Accent</span>
                    <input type="color" value={selectedBlock.styles?.accentColor || selectedBlockTheme?.colors.accent || '#6366f1'} onChange={(e) => handleStyleChange('accentColor', e.target.value)} className="w-full h-6 cursor-pointer" />
                  </div>
                  <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Texte</span>
                    <input type="color" value={selectedBlock.styles?.textColor || selectedBlockTheme?.colors.text || '#ffffff'} onChange={(e) => handleStyleChange('textColor', e.target.value)} className="w-full h-6 cursor-pointer" />
                  </div>
                  <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 flex flex-col items-center gap-1 col-span-2">
                    <div className="flex justify-between w-full">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Arrière-plan</span>
                      {selectedBlock.styles?.backgroundColor && <button onClick={() => handleStyleChange('backgroundColor', undefined)} className="text-[10px] text-red-400 hover:text-red-300">Retirer</button>}
                    </div>
                    <input type="color" value={selectedBlock.styles?.backgroundColor || '#1e293b'} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} className="w-full h-6 cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Outils de bordures & Espacements */}
              <div className="pt-2">
                <label className="text-xs font-bold text-emerald-400 uppercase block mb-3">📐 Structure</label>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Arrondi (Border-Radius)</span>
                      {selectedBlock.styles?.borderRadius && <button onClick={() => handleStyleChange('borderRadius', undefined)} className="text-[10px] text-red-400">Retirer</button>}
                    </div>
                    <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                      {BORDER_RADIUS.map(br => (
                        <button 
                          key={br.label}
                          onClick={() => handleStyleChange('borderRadius', br.value)}
                          className={`flex-1 py-1 text-[10px] rounded transition-colors ${selectedBlock.styles?.borderRadius === br.value ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-700'}`}
                        >
                          {br.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Marge Interne (Padding)</span>
                      {selectedBlock.styles?.padding && <button onClick={() => handleStyleChange('padding', undefined)} className="text-[10px] text-red-400">Retirer</button>}
                    </div>
                    <input 
                      type="range" 
                      min="0" max="64" step="4"
                      value={parseInt(selectedBlock.styles?.padding || '24')}
                      onChange={(e) => handleStyleChange('padding', `${e.target.value}px`)}
                      className="w-full accent-emerald-500"
                    />
                    <div className="text-center text-xs text-slate-500 font-mono mt-1">{selectedBlock.styles?.padding || 'Par défaut'}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowGallery(true)}
                className="w-full mt-4 px-4 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-purple-500/20"
              >
                🎨 Explorer la galerie
              </button>
            </div>

            {/* ===== ÉDITION DU CONTENU - RÉSEAUX SOCIAUX ===== */}
            {selectedBlock.type === 'social-links' && (
              <div className="space-y-4 pt-6 mt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
                  <Info size={18} className="text-green-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Réseaux Sociaux</h2>
                </div>

                <div className="space-y-3">
                  {(selectedBlock.content?.socialLinks || []).map((link: SocialLink, index: number) => (
                    <div key={link.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-400">Lien {index + 1}</label>
                        <button
                          onClick={() => {
                            const newLinks = selectedBlock.content.socialLinks.filter((_: SocialLink, i: number) => i !== index);
                            updateBlock(selectedBlock.id, { content: { socialLinks: newLinks } });
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Plateforme</label>
                        <select
                          value={link.platform}
                          onChange={(e) => {
                            const newLinks = [...selectedBlock.content.socialLinks];
                            newLinks[index].platform = e.target.value;
                            updateBlock(selectedBlock.id, { content: { socialLinks: newLinks } });
                          }}
                          className="w-full mt-1 px-2 py-1 bg-slate-700 text-slate-200 rounded border border-slate-600 text-xs"
                        >
                          <option value="github">GitHub</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="twitter">Twitter</option>
                          <option value="email">Email</option>
                          <option value="website">Site Web</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Label</label>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const newLinks = [...selectedBlock.content.socialLinks];
                            newLinks[index].label = e.target.value;
                            updateBlock(selectedBlock.id, { content: { socialLinks: newLinks } });
                          }}
                          className="w-full mt-1 px-2 py-1 bg-slate-700 text-slate-200 rounded border border-slate-600 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">URL</label>
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => {
                            const newLinks = [...selectedBlock.content.socialLinks];
                            newLinks[index].url = e.target.value;
                            updateBlock(selectedBlock.id, { content: { socialLinks: newLinks } });
                          }}
                          className="w-full mt-1 px-2 py-1 bg-slate-700 text-slate-200 rounded border border-slate-600 text-xs"
                          placeholder={
                            link.platform === 'github' ? 'Ex: username ou https://github.com/username' :
                            link.platform === 'email' ? 'Ex: contact@gmail.com' :
                            link.platform === 'linkedin' ? 'Ex: username ou https://linkedin.com/in/username' :
                            link.platform === 'twitter' ? 'Ex: username ou https://twitter.com/username' :
                            'https://exemple.com'
                          }
                        />
                        <div className="text-[9px] text-slate-500 mt-1 italic">
                          {link.platform === 'github' && '📝 Entrez votre username ou l\'URL complète'}
                          {link.platform === 'email' && '📝 Entrez votre adresse email (ex: mon@gmail.com)'}
                          {link.platform === 'linkedin' && '📝 Entrez votre username ou l\'URL complète'}
                          {link.platform === 'twitter' && '📝 Entrez votre @username ou l\'URL complète'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const newLinks = [
                      ...(selectedBlock.content?.socialLinks || []),
                      {
                        id: Date.now().toString(),
                        platform: 'website',
                        url: 'https://exemple.com',
                        label: 'Nouveau lien',
                      },
                    ];
                    updateBlock(selectedBlock.id, { content: { socialLinks: newLinks } });
                  }}
                  className="w-full px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Ajouter un lien
                </button>
              </div>
            )}

            {/* ===== ÉDITION DU CONTENU - FAQ ===== */}
            {selectedBlock.type === 'faq' && (
              <div className="space-y-4 pt-6 mt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
                  <Info size={18} className="text-orange-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Questions Fréquentes</h2>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {(selectedBlock.content?.faqItems || []).map((item: FAQItem, index: number) => (
                    <div key={item.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-400">Item {index + 1}</label>
                        <button
                          onClick={() => {
                            const newItems = selectedBlock.content.faqItems.filter((_: FAQItem, i: number) => i !== index);
                            updateBlock(selectedBlock.id, { content: { faqItems: newItems } });
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Question</label>
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => {
                            const newItems = [...selectedBlock.content.faqItems];
                            newItems[index].question = e.target.value;
                            updateBlock(selectedBlock.id, { content: { faqItems: newItems } });
                          }}
                          className="w-full mt-1 px-2 py-1 bg-slate-700 text-slate-200 rounded border border-slate-600 text-xs"
                          placeholder="Quelle est votre question ?"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Réponse</label>
                        <textarea
                          value={item.answer}
                          onChange={(e) => {
                            const newItems = [...selectedBlock.content.faqItems];
                            newItems[index].answer = e.target.value;
                            updateBlock(selectedBlock.id, { content: { faqItems: newItems } });
                          }}
                          className="w-full mt-1 px-2 py-1 bg-slate-700 text-slate-200 rounded border border-slate-600 text-xs resize-none"
                          rows={3}
                          placeholder="Détails de la réponse..."
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const newItems = [
                      ...(selectedBlock.content?.faqItems || []),
                      {
                        id: Date.now().toString(),
                        question: 'Nouvelle question ?',
                        answer: 'Réponse à ajouter...',
                      },
                    ];
                    updateBlock(selectedBlock.id, { content: { faqItems: newItems } });
                  }}
                  className="w-full px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Ajouter une question
                </button>
              </div>
            )}

            {/* ===== ÉDITION DU CONTENU - SOFT SKILLS ===== */}
            {selectedBlock.type === 'soft-skills' && (
              <div className="space-y-4 pt-6 mt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
                  <Info size={18} className="text-cyan-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Soft Skills</h2>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {(selectedBlock.content?.skills || []).map((skill: any, index: number) => (
                    <div key={index} className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-400">Skill {index + 1}</label>
                        <button
                          onClick={() => {
                            const newSkills = selectedBlock.content.skills.filter((_: any, i: number) => i !== index);
                            updateBlock(selectedBlock.id, { content: { skills: newSkills } });
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Nom</label>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => {
                            const newSkills = [...selectedBlock.content.skills];
                            newSkills[index].name = e.target.value;
                            updateBlock(selectedBlock.id, { content: { skills: newSkills } });
                          }}
                          className="w-full mt-1 px-2 py-1 bg-slate-700 text-slate-200 rounded border border-slate-600 text-xs"
                          placeholder="Ex: Communication"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Niveau ({skill.level}%)</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skill.level}
                          onChange={(e) => {
                            const newSkills = [...selectedBlock.content.skills];
                            newSkills[index].level = Number(e.target.value);
                            updateBlock(selectedBlock.id, { content: { skills: newSkills } });
                          }}
                          className="w-full mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const newSkills = [
                      ...(selectedBlock.content?.skills || []),
                      {
                        name: 'Nouveau Soft Skill',
                        level: 75,
                      },
                    ];
                    updateBlock(selectedBlock.id, { content: { skills: newSkills } });
                  }}
                  className="w-full px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Ajouter un soft skill
                </button>
              </div>
            )}

            {/* ===== ÉDITION DU CONTENU - HARD SKILLS ===== */}
            {selectedBlock.type === 'hard-skills' && (
              <div className="space-y-4 pt-6 mt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
                  <Info size={18} className="text-purple-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Hard Skills</h2>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {(selectedBlock.content?.skills || []).map((skill: any, index: number) => (
                    <div key={index} className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-400">Skill {index + 1}</label>
                        <button
                          onClick={() => {
                            const newSkills = selectedBlock.content.skills.filter((_: any, i: number) => i !== index);
                            updateBlock(selectedBlock.id, { content: { skills: newSkills } });
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Nom</label>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => {
                            const newSkills = [...selectedBlock.content.skills];
                            newSkills[index].name = e.target.value;
                            updateBlock(selectedBlock.id, { content: { skills: newSkills } });
                          }}
                          className="w-full mt-1 px-2 py-1 bg-slate-700 text-slate-200 rounded border border-slate-600 text-xs"
                          placeholder="Ex: React"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Niveau ({skill.level}%)</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skill.level}
                          onChange={(e) => {
                            const newSkills = [...selectedBlock.content.skills];
                            newSkills[index].level = Number(e.target.value);
                            updateBlock(selectedBlock.id, { content: { skills: newSkills } });
                          }}
                          className="w-full mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const newSkills = [
                      ...(selectedBlock.content?.skills || []),
                      {
                        name: 'Nouveau Hard Skill',
                        level: 75,
                      },
                    ];
                    updateBlock(selectedBlock.id, { content: { skills: newSkills } });
                  }}
                  className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Ajouter un hard skill
                </button>
              </div>
            )}

            {/* ===== ÉDITION DU CONTENU - TIMELINE ===== */}
            {selectedBlock.type === 'timeline' && (
              <div className="space-y-4 pt-6 mt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
                  <Info size={18} className="text-blue-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Expérience</h2>
                </div>

                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[10px] text-slate-400 font-semibold">Titre de la section</label>
                    {selectedBlock.content?.title && (
                      <button
                        onClick={() => {
                          updateBlock(selectedBlock.id, { content: { ...selectedBlock.content, title: '' } });
                        }}
                        className="text-[10px] text-red-400 hover:text-red-300 transition-colors font-semibold"
                      >
                        Effacer
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={selectedBlock.content?.title || ''}
                    onChange={(e) => {
                      updateBlock(selectedBlock.id, { content: { ...selectedBlock.content, title: e.target.value } });
                    }}
                    className="w-full px-2 py-2 bg-slate-700 text-slate-200 rounded border border-slate-600 text-sm"
                    placeholder="Ex: Expérience Professionnelle (laissez vide pour sans titre)"
                  />
                  <p className="text-[9px] text-slate-500 italic">Ce titre s'affichera en haut de la timeline</p>
                </div>
              </div>
            )}

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
