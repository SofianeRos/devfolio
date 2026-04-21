# 🎨 DevFolio Theme Library - Complete Guide

## 📚 Overview

DevFolio includes a comprehensive theme library with **50+ pre-designed themes** and **25+ animations**, accessible through multiple interfaces:

### Quick Access Methods:

1. **🖱️ Theme Gallery (Visual)** - Click "Galerie Thèmes" button in the left sidebar
2. **⚙️ Theme Selector** - Select a block and choose theme from dropdown
3. **💻 Programmatic Access** - Import from `src/lib/themeIndex.ts`

---

## 📊 Theme Statistics

| Category     | Count   | Type                 |
| ------------ | ------- | -------------------- |
| **Terminal** | 10      | Console/CLI styles   |
| **Header**   | 10      | Portfolio headers    |
| **Code**     | 9       | Syntax highlighting  |
| **Timeline** | 6       | Experience timelines |
| **Stack**    | 8       | Skill display        |
| **TOTAL**    | **50+** | **All Categories**   |

**Animations:** 25+ different animation effects

---

## 🎯 Terminal Themes (10)

Perfect for displaying command-line interfaces and console outputs.

| Theme         | Animation    | Style               | Best For          |
| ------------- | ------------ | ------------------- | ----------------- |
| **macOS**     | pulse-glow   | Minimal             | Standard terminal |
| **Hacker**    | matrix-glow  | Green neon          | Retro/Matrix vibe |
| **Cyberpunk** | neon-pulse   | Cyan/Magenta        | Futuristic        |
| **Aurora**    | aurora-shift | Gradient blue/cyan  | Nature-inspired   |
| **Lava**      | lava-flow    | Gradient red/orange | Energy/Fire       |
| **Ocean**     | wave-flow    | Gradient blue       | Calm/Water        |
| **Dracula**   | fade-glow    | Purple              | Elegant           |
| **Nord**      | slide-glow   | Blue/frost          | Professional      |
| **Minimal**   | none         | White/black         | Clean/Simple      |
| **Midnight**  | pulse-blue   | Dark blue           | Modern            |

**Use in code:**

```typescript
import { TERMINAL_THEMES } from "../lib/themes.ts";
// Access: TERMINAL_THEMES[0].id === 'terminal-macos'
```

---

## 📋 Header Themes (10)

Hero sections and portfolio introductions.

| Theme                | Animation    | Background          | Best For          |
| -------------------- | ------------ | ------------------- | ----------------- |
| **Modern**           | fade-in-down | Transparent         | Minimal portfolio |
| **Gradient Vibrant** | fade-in-up   | Indigo→Pink         | Bold statement    |
| **Aurora Borealis**  | aurora-shift | Animated gradient   | Eye-catching      |
| **Glassmorphism**    | fade-in-down | Frosted glass       | Modern/Sleek      |
| **Sunset**           | sunset-glow  | Animated red-orange | Warm/Welcoming    |
| **Ocean Waves**      | wave-flow    | Animated blue       | Calm/Professional |
| **Galaxy**           | pulse-glow   | Purple gradient     | Cosmic/Space      |
| **Neon Glow**        | neon-pulse   | Dark cyan neon      | Cyberpunk         |
| **Lava Flow**        | lava-flow    | Animated red/orange | Energy/Passion    |
| **Forest Green**     | forest-glow  | Animated green      | Nature/Growth     |

**Use in code:**

```typescript
import { HEADER_THEMES } from "../lib/themes.ts";
// Access: HEADER_THEMES.find(t => t.name === 'Aurora Borealis')
```

---

## 💻 Code Themes (9)

Syntax highlighting for code snippets.

| Theme              | Animation  | Style        | Best For           |
| ------------------ | ---------- | ------------ | ------------------ |
| **Dracula**        | fade-glow  | Dark purple  | Popular dark theme |
| **Nord**           | slide-glow | Cool blue    | Professional       |
| **Monokai**        | fade-in    | Dark retro   | Classic choice     |
| **Tokyo Night**    | pulse-glow | Modern blue  | Contemporary       |
| **One Dark**       | fade-glow  | Blue-tinted  | Developer favorite |
| **Solarized Dark** | slide-glow | Warm dark    | Accessibility      |
| **Gruvbox Dark**   | fade-glow  | Warm brown   | Comfortable        |
| **Material Dark**  | pulse-glow | Modern cyan  | Material Design    |
| **Radical**        | neon-pulse | Neon vibrant | Cyberpunk          |

**Use in code:**

```typescript
import { CODE_THEMES, getThemeById } from "../lib/themes.ts";
const dracula = getThemeById("code-dracula");
```

---

## 📅 Timeline Themes (6)

Display experiences and chronological events.

| Theme               | Animation      | Style             | Best For     |
| ------------------- | -------------- | ----------------- | ------------ |
| **Classic Line**    | fade-in-up     | Left border       | Traditional  |
| **Cards**           | slide-in-right | Stacked cards     | Organized    |
| **Dots**            | pulse          | Minimal dots      | Clean/Simple |
| **Neon Pulse**      | neon-pulse     | Cyan neon         | Futuristic   |
| **Gradient Aurora** | aurora-shift   | Animated gradient | Eye-catching |
| **Smooth Glow**     | fade-glow      | Indigo subtle     | Elegant      |

**Use in code:**

```typescript
import { TIMELINE_THEMES } from "../lib/themes.ts";
const cards = TIMELINE_THEMES.find((t) => t.id === "timeline-cards");
```

---

## 🎯 Stack Themes (8)

Show technical skills and competencies.

| Theme             | Animation    | Style                | Best For          |
| ----------------- | ------------ | -------------------- | ----------------- |
| **Badges**        | fade-in-up   | Indigo→Pink gradient | Standard skills   |
| **Grid Cards**    | fade-in-up   | Card layout          | Organized display |
| **Neon Pulse**    | neon-pulse   | Cyan neon            | Tech-forward      |
| **Gradient Glow** | pulse-glow   | Green→Blue           | Modern            |
| **Aurora**        | aurora-shift | Blue→Cyan→Green      | Animated gradient |
| **Lava**          | lava-flow    | Red→Orange→Yellow    | Energetic         |
| **Ocean Waves**   | wave-flow    | Blue→Cyan            | Calm              |
| **Forest**        | forest-glow  | Green gradient       | Nature-inspired   |

**Use in code:**

```typescript
import { STACK_THEMES } from "../lib/themes.ts";
STACK_THEMES.forEach((theme) => console.log(theme.name));
```

---

## ✨ Animation Reference

### 🔤 Entrance Animations (5)

Appear when elements load.

```
fade-in          → Simple opacity fade
fade-in-up       → Fade + slide up
fade-in-down     → Fade + slide down
slide-in-right   → Slide from left
slide-in-left    → Slide from right
```

### 💫 Glow Animations (7)

Pulsing and glowing effects.

```
pulse-glow       → Indigo pulsing glow
fade-glow        → Purple fade glow
slide-glow       → Blue sliding glow
neon-pulse       → Cyan neon pulse
pulse-blue       → Blue soft pulse
galaxy-glow      → Purple galaxy effect
code-glow        → Blue code highlight glow
```

### 🌈 Gradient Animations (5)

Background and color gradients.

```
aurora-shift     → Animated aurora borealis
lava-flow        → Flowing lava effect
wave-flow        → Ocean wave motion
sunset-glow      → Animated sunset
forest-glow      → Animated forest green
```

### 🎬 Special Effects (4)

Unique effects.

```
matrix-glow      → Matrix rain effect
neon-border      → Neon border pulse
pulse-fast       → Rapid pulsation
spin-slow        → Slow continuous rotation
```

---

## 🔍 Search & Filter Functions

### programmatic Access

Import from `src/lib/themeIndex.ts`:

```typescript
import {
  searchThemes,
  themesByAnimation,
  themesByColor,
  themesByPalette,
  getThemesByBlockType,
  getAnimationsByCategory,
  COMPLETE_THEME_LIBRARY,
} from "../lib/themeIndex.ts";

// Search by keyword
const neonThemes = searchThemes("neon");

// Filter by animation
const pulsingThemes = themesByAnimation("neon-pulse");

// Find by color
const cyanThemes = themesByColor("#00ffff");

// Filter by palette
const darkThemes = themesByPalette("dark");
const lightThemes = themesByPalette("light");
const neonPalette = themesByPalette("neon");
const gradientThemes = themesByPalette("gradient");

// Get animations
const glowEffects = getAnimationsByCategory("glow");
const entranceEffects = getAnimationsByCategory("entrance");
const gradientEffects = getAnimationsByCategory("gradient");
const specialEffects = getAnimationsByCategory("special");

// Get all data
console.log(COMPLETE_THEME_LIBRARY.stats); // { total: 50+, byType: {...} }
```

### Search Examples

```typescript
// Find all "dark" themed items
const darkThemes = themesByPalette("dark");
// Returns: dracula, nord, midnight, ocean, etc.

// Find themes with "aurora"
const aurora = searchThemes("aurora");
// Returns: Terminal Aurora, Header Aurora Borealis, Stack Aurora

// Get all themes using a specific animation
const neonAnimated = themesByAnimation("neon-pulse");
// Returns: Cyberpunk, Neon Glow, Neon Pulse (timeline & stack), etc.

// Find by exact color
const cyan = themesByColor("#00ffff");
// Returns all themes with cyan (#00ffff) in their palette
```

---

## 🎨 Theme Properties

Each theme contains:

```typescript
interface Theme {
  id: string; // Unique identifier
  name: string; // Display name
  description: string; // Short description
  category: BlockType; // Type: terminal, header, code-snippet, timeline, stack
  colors: {
    bg: string; // Background color (hex or gradient)
    text: string; // Text color
    accent: string; // Primary accent color
    secondary: string; // Secondary accent color
  };
  animation?: string; // Animation effect name
  borderStyle: string; // Tailwind border class
  borderRadius: string; // Tailwind radius class
  shadow: string; // Tailwind shadow class
  customClass: string; // Additional Tailwind classes
}
```

---

## 📱 Usage Examples

### In React Components

```typescript
// src/components/MyBlock.tsx
import { useBuilderStore } from '../store/useBuilderStore';
import { getThemeById } from '../lib/themes';

function MyBlock({ block }) {
  const theme = block.theme ? getThemeById(block.theme) : null;

  return (
    <div
      className={`p-6 rounded-lg ${theme?.borderStyle} ${theme?.shadow}`}
      style={{
        backgroundColor: theme?.colors.bg,
        color: theme?.colors.text,
        animation: theme?.animation ? `${theme.animation} 2s ease-in-out infinite` : 'none',
      }}
    >
      {/* Your content */}
    </div>
  );
}
```

### Accessing Theme Gallery

1. **Visual Explorer**: Click "🎨 Galerie Thèmes" button in left sidebar
2. **View all themes** organized by category
3. **See animations** in real-time
4. **Copy theme IDs** to clipboard
5. **Filter** by block type

### Copy Theme ID

In the Theme Gallery, hover over any theme card and click the "Copy" button to get the theme ID:

```
Terminal Aurora → terminal-aurora
Header Galaxy → header-galaxy
Code Tokyo Night → code-tokyonight
Timeline Neon Pulse → timeline-neon
Stack Lava → stack-lava
```

---

## 🌈 Color Palettes

### Dark Themes

Professional, code-focused, easy on the eyes.

- **Terminal**: macOS, Hacker, Dracula, Nord, Midnight
- **Code**: Dracula, Nord, Monokai, One Dark, Solarized Dark

### Light Themes

Clean, readable, minimal.

- **Terminal**: Minimal
- **Header**: Modern, Minimal Clean

### Neon Themes

Futuristic, cyberpunk, energetic.

- **Terminal**: Hacker, Cyberpunk
- **All types**: Neon variants available

### Gradient Themes

Dynamic, eye-catching, nature-inspired.

- **Terminal**: Aurora, Lava, Ocean
- **Header**: All gradient variants
- **Stack**: Aurora, Lava, Ocean, Forest

---

## 🚀 Performance Tips

1. **Lazy load animations** - Use `animate-none` by default, add animation on interaction
2. **Limit simultaneous animations** - Reduce eye strain with fewer animated blocks
3. **Use solid colors for content** - Reserve glowing animations for accents
4. **Test on mobile** - Reduce animation intensity on smaller screens
5. **Cache theme lookups** - Use `getThemeById()` in memoized components

---

## 📝 Adding Custom Themes

To add a custom theme, edit `src/lib/themes.ts`:

```typescript
export const CUSTOM_THEMES: Theme[] = [
  {
    id: "custom-myname",
    name: "My Theme",
    description: "My custom theme description",
    category: "terminal",
    colors: {
      bg: "#1a1a1a",
      text: "#ffffff",
      accent: "#00ff00",
      secondary: "#00aa00",
    },
    animation: "pulse-glow",
    borderStyle: "border-2 border-green-500",
    borderRadius: "rounded-lg",
    shadow: "shadow-lg shadow-green-500/30",
    customClass: "hover:border-green-400 transition-colors",
  },
];
```

Then add to `getThemesByType()` function.

---

## 🎓 Learning Resources

- **Animations**: See `src/index.css` for @keyframes definitions
- **Themes**: See `src/lib/themes.ts` for complete theme library
- **Index**: See `src/lib/themeIndex.ts` for search functions
- **Component**: See `src/components/ThemeGallery.tsx` for visual gallery

---

## 💡 Best Practices

✅ **DO:**

- Use themes matched to your portfolio style
- Combine animations for entrance effects
- Test glowing effects in different lighting
- Use contrasting colors for accessibility
- Pick animations that match your brand energy

❌ **DON'T:**

- Use too many different animations (limit to 2-3 per page)
- Combine multiple glows on same element
- Use neon themes for text-heavy sections
- Animate everything - subtlety is better
- Ignore accessibility (contrast ratios)

---

## 🐛 Troubleshooting

**Theme not appearing?**

- Check if theme ID is correct
- Verify block type matches theme category
- Ensure theme is imported in component

**Animation not working?**

- Check animation name spelling
- Verify CSS animation is defined
- Check for conflicting CSS classes

**Performance issues?**

- Reduce number of animated elements
- Use `animation: none` for hidden elements
- Disable animations on mobile devices

---

**Made with ❤️ for DevFolio Builder**

Last updated: April 21, 2026
