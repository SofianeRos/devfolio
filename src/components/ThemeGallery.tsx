// src/components/ThemeGallery.tsx
import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import type { BlockType, Theme } from '../types.ts';
import {
  TERMINAL_THEMES,
  HEADER_THEMES,
  CODE_THEMES,
  TIMELINE_THEMES,
  STACK_THEMES,
} from '../lib/themes.ts';

const BLOCK_TYPES: { type: BlockType; label: string }[] = [
  { type: 'terminal', label: '🖥️ Terminal' },
  { type: 'header', label: '📋 Header' },
  { type: 'code-snippet', label: '💻 Code' },
  { type: 'timeline', label: '📅 Timeline' },
  { type: 'stack', label: '🎯 Stack' },
];

const ANIMATIONS = [
  'fade-in',
  'fade-in-up',
  'fade-in-down',
  'slide-in-right',
  'slide-in-left',
  'pulse-glow',
  'fade-glow',
  'slide-glow',
  'aurora-shift',
  'lava-flow',
  'wave-flow',
  'matrix-glow',
  'neon-pulse',
  'pulse-blue',
  'sunset-glow',
  'forest-glow',
  'galaxy-glow',
  'neon-border',
  'code-glow',
  'pulse-fast',
  'spin-slow',
];

interface ThemeGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeGallery({ isOpen, onClose }: ThemeGalleryProps) {
  const [selectedType, setSelectedType] = useState<BlockType>('terminal');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const getThemesByType = (type: BlockType): Theme[] => {
    const themeMap: Record<BlockType, Theme[]> = {
      terminal: TERMINAL_THEMES,
      header: HEADER_THEMES,
      'code-snippet': CODE_THEMES,
      timeline: TIMELINE_THEMES,
      stack: STACK_THEMES,
      text: [],
      certifications: [],
      'social-links': [],
      media: [],
      faq: [],
      'soft-skills': [],
      'hard-skills': [],
    };
    return themeMap[type];
  };

  const themes = getThemesByType(selectedType);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-auto">
      <div className="w-full min-h-screen p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-slate-900/90 backdrop-blur-md p-4 rounded-lg border border-slate-700">
          <div>
            <h1 className="text-3xl font-bold text-white">🎨 Theme Gallery</h1>
            <p className="text-slate-400 text-sm mt-1">Tous les thèmes, animations et effets disponibles</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-300" />
          </button>
        </div>

        {/* Type Selector */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4">
          {BLOCK_TYPES.map((item) => (
            <button
              key={item.type}
              onClick={() => setSelectedType(item.type)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedType === item.type
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/20"
            >
              {/* Theme Preview */}
              <div
                className={`w-full h-32 rounded-lg mb-4 border-2 flex items-center justify-center relative overflow-hidden ${theme.borderStyle} ${theme.shadow}`}
                style={{
                  backgroundColor: theme.colors.bg as any,
                  animation: theme.animation ? `${theme.animation} 2s ease-in-out infinite` : 'none',
                }}
              >
                <span
                  style={{
                    color: theme.colors.text,
                    textShadow:
                      theme.animation?.includes('glow') ||
                      theme.animation?.includes('neon') ||
                      theme.animation?.includes('matrix')
                        ? `0 0 10px ${theme.colors.accent}`
                        : 'none',
                  }}
                  className="text-sm font-bold text-center px-4"
                >
                  {theme.name}
                </span>
              </div>

              {/* Theme Details */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{theme.name}</h3>
                  <p className="text-slate-400 text-sm">{theme.description}</p>
                </div>

                {/* Colors Display */}
                <div className="flex gap-2">
                  {Object.entries(theme.colors).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex-1"
                      title={`${key}: ${value}`}
                    >
                      <div
                        className="w-full h-8 rounded border border-slate-600"
                        style={{
                          backgroundColor:
                            typeof value === 'string' && value.startsWith('#')
                              ? value
                              : '#333',
                        }}
                      />
                      <span className="text-xs text-slate-500 capitalize">{key}</span>
                    </div>
                  ))}
                </div>

                {/* Animation & Styles */}
                <div className="text-xs space-y-1">
                  <p className="text-slate-400">
                    <span className="text-indigo-400 font-semibold">Animation:</span> {theme.animation || 'none'}
                  </p>
                  <p className="text-slate-400">
                    <span className="text-indigo-400 font-semibold">Border:</span> {theme.borderStyle}
                  </p>
                  <p className="text-slate-400">
                    <span className="text-indigo-400 font-semibold">Shadow:</span> {theme.shadow}
                  </p>
                </div>

                {/* Copy ID Button */}
                <button
                  onClick={() => copyToClipboard(theme.id, theme.id)}
                  className="w-full mt-4 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors flex items-center justify-center gap-2 text-sm text-slate-300"
                >
                  {copiedId === theme.id ? (
                    <>
                      <Check size={16} /> Copié!
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> {theme.id}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Animations Section */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">✨ Animations Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ANIMATIONS.map((anim) => (
              <div
                key={anim}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 overflow-hidden"
              >
                <div
                  className="w-full h-24 bg-gradient-to-r from-indigo-600 to-pink-600 rounded mb-4 flex items-center justify-center"
                  style={{
                    animation: `${anim} 2s ease-in-out infinite`,
                  }}
                >
                  <span className="text-white font-semibold text-center">
                    {anim.replace(/-/g, ' ')}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(`animate-${anim}`, anim)}
                  className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors flex items-center justify-center gap-2 text-sm text-slate-300"
                >
                  {copiedId === anim ? (
                    <>
                      <Check size={16} /> Copié!
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> animate-{anim}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-400">
              {TERMINAL_THEMES.length +
                HEADER_THEMES.length +
                CODE_THEMES.length +
                TIMELINE_THEMES.length +
                STACK_THEMES.length}
            </p>
            <p className="text-slate-400 text-sm">Total Themes</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">{ANIMATIONS.length}</p>
            <p className="text-slate-400 text-sm">Animations</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-cyan-400">{BLOCK_TYPES.length}</p>
            <p className="text-slate-400 text-sm">Block Types</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">25+</p>
            <p className="text-slate-400 text-sm">Styles</p>
          </div>
        </div>
      </div>
    </div>
  );
}
