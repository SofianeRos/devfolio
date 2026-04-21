// src/lib/themeIndex.ts
/**
 * Index complet de tous les thèmes et animations
 * Permet de rechercher et d'explorer tous les thèmes disponibles
 */

import type { Theme } from '../types.ts';
import {
  TERMINAL_THEMES,
  HEADER_THEMES,
  CODE_THEMES,
  TIMELINE_THEMES,
  STACK_THEMES,
} from './themes.ts';

// 📚 INDEX COMPLET DES THÈMES
export const THEME_INDEX = {
  terminal: TERMINAL_THEMES,
  header: HEADER_THEMES,
  code: CODE_THEMES,
  timeline: TIMELINE_THEMES,
  stack: STACK_THEMES,
};

// 📊 STATISTIQUES THÈMES
export const THEME_STATS = {
  total: TERMINAL_THEMES.length + HEADER_THEMES.length + CODE_THEMES.length + TIMELINE_THEMES.length + STACK_THEMES.length,
  byType: {
    terminal: TERMINAL_THEMES.length,
    header: HEADER_THEMES.length,
    code: CODE_THEMES.length,
    timeline: TIMELINE_THEMES.length,
    stack: STACK_THEMES.length,
  },
};

// ✨ ANIMATIONS DISPONIBLES
export const ANIMATION_INDEX = {
  entrance: [
    { name: 'fade-in', description: 'Fondu simple', duration: '0.5s' },
    { name: 'fade-in-up', description: 'Fondu vers le haut', duration: '0.6s' },
    { name: 'fade-in-down', description: 'Fondu vers le bas', duration: '0.6s' },
    { name: 'slide-in-right', description: 'Glissade de la gauche', duration: '0.5s' },
    { name: 'slide-in-left', description: 'Glissade de la droite', duration: '0.5s' },
  ],
  glow: [
    { name: 'pulse-glow', description: 'Pulsation avec glow indigo', duration: '2s', category: 'glow' },
    { name: 'fade-glow', description: 'Fondu avec glow violet', duration: '2s', category: 'glow' },
    { name: 'slide-glow', description: 'Glissade avec glow bleu', duration: '2s', category: 'glow' },
    { name: 'neon-pulse', description: 'Pulsation néon cyan', duration: '2s', category: 'glow' },
    { name: 'pulse-blue', description: 'Pulsation bleu doux', duration: '2s', category: 'glow' },
    { name: 'galaxy-glow', description: 'Glow galaxie violet', duration: '3s', category: 'glow' },
    { name: 'code-glow', description: 'Glow code bleu', duration: '2s', category: 'glow' },
  ],
  gradient: [
    { name: 'aurora-shift', description: 'Aurore boréale animée', duration: '6s', category: 'gradient' },
    { name: 'lava-flow', description: 'Lave rouge-orange', duration: '5s', category: 'gradient' },
    { name: 'wave-flow', description: 'Vagues océan', duration: '3s', category: 'gradient' },
    { name: 'sunset-glow', description: 'Coucher de soleil', duration: '5s', category: 'gradient' },
    { name: 'forest-glow', description: 'Forêt verte', duration: '5s', category: 'gradient' },
  ],
  special: [
    { name: 'matrix-glow', description: 'Effet Matrix vert', duration: '2s', category: 'special' },
    { name: 'neon-border', description: 'Border néon clignotante', duration: '2s', category: 'special' },
    { name: 'pulse-fast', description: 'Pulsation rapide', duration: '1.5s', category: 'special' },
    { name: 'spin-slow', description: 'Rotation lente', duration: '3s', category: 'special' },
  ],
};

// 🔍 SEARCH & FILTER FUNCTIONS

/**
 * Chercher les thèmes par motif
 * @param query - Terme de recherche (nom, description, couleur, animation)
 * @returns Array de thèmes correspondants
 */
export function searchThemes(query: string): Theme[] {
  const lowerQuery = query.toLowerCase();
  const allThemes = [...TERMINAL_THEMES, ...HEADER_THEMES, ...CODE_THEMES, ...TIMELINE_THEMES, ...STACK_THEMES];

  return allThemes.filter(
    (theme) =>
      theme.name.toLowerCase().includes(lowerQuery) ||
      theme.description.toLowerCase().includes(lowerQuery) ||
      theme.id.toLowerCase().includes(lowerQuery) ||
      theme.animation?.toLowerCase().includes(lowerQuery) ||
      Object.values(theme.colors).some((color) => typeof color === 'string' && color.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Chercher les thèmes par animation
 * @param animation - Nom de l'animation
 * @returns Array de thèmes avec cette animation
 */
export function themesByAnimation(animation: string): Theme[] {
  const allThemes = [...TERMINAL_THEMES, ...HEADER_THEMES, ...CODE_THEMES, ...TIMELINE_THEMES, ...STACK_THEMES];
  return allThemes.filter((theme) => theme.animation === animation);
}

/**
 * Chercher les thèmes par couleur
 * @param colorHex - Code hex de la couleur (#fff, #ffffff, etc)
 * @returns Array de thèmes contenant cette couleur
 */
export function themesByColor(colorHex: string): Theme[] {
  const allThemes = [...TERMINAL_THEMES, ...HEADER_THEMES, ...CODE_THEMES, ...TIMELINE_THEMES, ...STACK_THEMES];
  return allThemes.filter((theme) => Object.values(theme.colors).includes(colorHex));
}

/**
 * Chercher les thèmes par palette (dark/light/neon/gradient)
 * @param palette - Type de palette
 * @returns Array de thèmes correspondants
 */
export function themesByPalette(palette: 'dark' | 'light' | 'neon' | 'gradient'): Theme[] {
  const allThemes = [...TERMINAL_THEMES, ...HEADER_THEMES, ...CODE_THEMES, ...TIMELINE_THEMES, ...STACK_THEMES];

  return allThemes.filter((theme) => {
    const colors = Object.values(theme.colors).join('').toLowerCase();
    const id = theme.id.toLowerCase();

    switch (palette) {
      case 'dark':
        return id.includes('dark') || id.includes('midnight') || id.includes('nord') || id.includes('dracula');
      case 'light':
        return id.includes('minimal') || id.includes('glass') || id.includes('light');
      case 'neon':
        return id.includes('neon') || id.includes('cyberpunk') || id.includes('hacker') || id.includes('radical');
      case 'gradient':
        return id.includes('gradient') || id.includes('aurora') || id.includes('lava') || id.includes('ocean');
      default:
        return false;
    }
  });
}

/**
 * Obtenir tous les thèmes par type
 * @param type - Type de bloc (terminal, header, etc)
 * @returns Array de thèmes
 */
export function getThemesByBlockType(type: string): Theme[] {
  return (THEME_INDEX as any)[type] || [];
}

/**
 * Obtenir les animations pour une catégorie
 * @param category - Catégorie (entrance, glow, gradient, special)
 * @returns Array d'animations
 */
export function getAnimationsByCategory(category: keyof typeof ANIMATION_INDEX) {
  return ANIMATION_INDEX[category];
}

/**
 * Obtenir une animation par nom
 * @param name - Nom de l'animation
 * @returns L'animation ou undefined
 */
export function getAnimationByName(name: string) {
  for (const category of Object.values(ANIMATION_INDEX)) {
    const found = (category as any[]).find((a) => a.name === name);
    if (found) return found;
  }
  return undefined;
}

// 📋 DOCUMENTATION & GUIDES

export const THEME_GUIDE = {
  introduction: `
    La bibliothèque DevFolio propose 50+ thèmes pré-conçus organisés en 5 catégories:
    - Terminal: Styles de console (10 thèmes)
    - Header: En-têtes de portfolio (10 thèmes)
    - Code: Coloration syntaxe (9 thèmes)
    - Timeline: Historiques d'expériences (6 thèmes)
    - Stack: Affichage de compétences (8 thèmes)
  `,

  categories: {
    terminal: {
      description: 'Thèmes pour blocs de terminal/console',
      count: TERMINAL_THEMES.length,
      examples: ['macOS', 'Hacker', 'Cyberpunk', 'Aurora', 'Lava'],
    },
    header: {
      description: 'Thèmes pour en-tête de portfolio',
      count: HEADER_THEMES.length,
      examples: ['Modern', 'Gradient Vibrant', 'Glassmorphism', 'Galaxy'],
    },
    code: {
      description: 'Thèmes de coloration pour blocs de code',
      count: CODE_THEMES.length,
      examples: ['Dracula', 'Nord', 'Tokyo Night', 'Radical'],
    },
    timeline: {
      description: 'Thèmes pour timelines d\'expériences',
      count: TIMELINE_THEMES.length,
      examples: ['Classic Line', 'Cards', 'Neon Pulse'],
    },
    stack: {
      description: 'Thèmes pour affichage de compétences',
      count: STACK_THEMES.length,
      examples: ['Badges', 'Grid Cards', 'Aurora'],
    },
  },

  animationTypes: {
    entrance: 'Animations d\'apparition au chargement',
    glow: 'Effets de brillance et pulsation',
    gradient: 'Dégradés et backgrounds animés',
    special: 'Effets spécialisés (Matrix, Néon, etc)',
  },

  colors: {
    dark: 'Palettes sombres (parfait pour une ambiance code)',
    light: 'Palettes claires (lisibilité maximale)',
    neon: 'Palettes néon futuristes (cyberpunk)',
    gradient: 'Palettes dégradées (nature, aurore, etc)',
  },

  usageExamples: {
    basic: `
      // Récupérer un thème par type
      const themes = getThemesByBlockType('terminal');
      
      // Chercher dans les thèmes
      const neonThemes = searchThemes('neon');
      
      // Filtrer par animation
      const glowingThemes = themesByAnimation('neon-pulse');
    `,
    search: `
      // Chercher par couleur
      const cyanThemes = themesByColor('#00ffff');
      
      // Filtrer par palette
      const darkThemes = themesByPalette('dark');
      
      // Obtenir les animations
      const glowAnimations = getAnimationsByCategory('glow');
    `,
  },
};

// 🏷️ TAGS & METADATA

export const THEME_TAGS = {
  palettes: ['dark', 'light', 'neon', 'gradient', 'nature', 'tech', 'retro'],
  moods: ['calm', 'energetic', 'professional', 'playful', 'minimal', 'vibrant'],
  useCase: ['code', 'presentation', 'portfolio', 'hacker', 'artistic'],
};

// Export ALL data in one place
export const COMPLETE_THEME_LIBRARY = {
  themes: {
    terminal: TERMINAL_THEMES,
    header: HEADER_THEMES,
    code: CODE_THEMES,
    timeline: TIMELINE_THEMES,
    stack: STACK_THEMES,
  },
  animations: ANIMATION_INDEX,
  stats: THEME_STATS,
  search: searchThemes,
  filterByAnimation: themesByAnimation,
  filterByColor: themesByColor,
  filterByPalette: themesByPalette,
  guide: THEME_GUIDE,
  tags: THEME_TAGS,
};

export default COMPLETE_THEME_LIBRARY;
