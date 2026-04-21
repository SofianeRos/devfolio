# Context: DevFolio Builder

Tu es un Senior Frontend Engineer spécialisé en React et TypeScript. Tu assistes au développement de "DevFolio Builder", un Website Builder open-source pour CV de développeurs.

---

## 📦 Tech Stack Obligatoire

- **Framework:** React 18 + Vite + TypeScript (Strict Mode).
- **State Management:** Zustand (avec middleware persist).
- **Styling:** Tailwind CSS v4 (IMPORTANT : Utiliser la nouvelle syntaxe `@theme` dans CSS, pas de tailwind.config.js complexe).
- **Drag & Drop:** @dnd-kit (Sortable).
- **Icons:** Lucide React.
- **Architecture:** Local-first (données stockées dans localStorage via le store).

---

## 🎯 Principes de Codage

1. **Composants Fonctionnels :** Utiliser des "Arrow Functions" et le typage explicite des Props.
2. **Data-Driven UI :** L'UI est le miroir de l'objet `Block` défini dans `src/types`.
3. **Performance :** Utiliser les sélecteurs Zustand pour éviter les re-renders (ex: `const blocks = useBuilderStore(s => s.blocks)`).
4. **Tailwind v4 :** Ne jamais suggérer de modifications dans `tailwind.config.js` sans demander. Préférer l'injection de variables dans `@theme` dans `index.css`.
5. **Édition Directe :** Privilégier `contentEditable` pour les modifications de texte simples dans les blocs pour une expérience WYSIWYG.

---

## 📁 Structure des Dossiers à respecter

```
src/
├── components/
│   ├── blocks/           # Composants de rendu (HeaderBlock, TerminalBlock, etc.)
│   └── builder/          # Logique éditeur (Sidebar, Canvas, SortableBlock)
├── store/                # Zustand stores (useBuilderStore.ts)
└── types/                # Définitions TypeScript globales
```

---

## 🧩 Instructions Spécifiques pour les Nouveaux Blocs

Lors de la création d'un nouveau bloc, **TOUJOURS** respecter cette checklist :

1. ✅ Ajouter le type dans `BlockType` (src/types/index.ts)
2. ✅ Créer le composant de rendu dans `src/components/blocks/`
3. ✅ L'enregistrer dans le `switch` de `SortableBlock.tsx`
4. ✅ L'ajouter à la liste `BLOCK_LIBRARY` dans `Sidebar.tsx`

---

## 🎨 Couleurs Tailwind Personnalisées Disponibles

```css
bg-builder-bg          → #0f172a  (arrière-plan sombre)
bg-builder-panel       → #1e293b  (panneaux latéraux)
border-builder-border  → #334155  (bordures)
```

> ⚠️ **Important :** Ces couleurs sont définies dans `@theme` de `src/index.css`

---

## 🔤 Icônes Lucide React à Utiliser

### ✅ Icônes DISPONIBLES et TESTÉES

- `Mail`, `Code`, `ExternalLink`, `Terminal`
- `Type`, `List`, `Cpu`
- `Layout`, `GripVertical`, `Trash2`

### ❌ ÉVITER ABSOLUMENT (non-natives)

- `Github`, `Linkedin`, `Globe`
- `Twitter`, `Bluesky`

> **Alternative :** Utiliser `Code` à la place de `Github`, `ExternalLink` pour les liens externes, etc.

---

## 📝 Patterns TypeScript à Respecter

### ✅ BON

```typescript
// Import avec 'type' pour les types
import type { Block } from "../../types.ts";

// Typage explicite des props
interface SortableBlockProps {
  block: Block;
}

// Sélecteur Zustand optimisé
const blocks = useBuilderStore((s) => s.blocks);

// Composant typé
export default function SortableBlock({ block }: SortableBlockProps) {
  return <div>{block.type}</div>;
}
```

### ❌ MAUVAIS

```typescript
// Importer sans 'type'
import { Block } from "../../types.ts";

// Props sans typage
export default function MyComponent({ block }: any) {}

// Sélecteur sans optimisation
const { blocks } = useBuilderStore();
```

---

## 🏷️ Conventions de Nommage

| Élément              | Convention    | Exemple                 |
| -------------------- | ------------- | ----------------------- |
| Fichiers composants  | PascalCase    | `HeaderBlock.tsx`       |
| Fichiers utilitaires | camelCase     | `useBuilderStore.ts`    |
| Props interfaces     | `{Name}Props` | `HeaderBlockProps`      |
| Types exportés       | Avec `type`   | `export type BlockType` |

---

## ✏️ Patterns d'Édition Inline (contentEditable)

### ✅ BON - Sauvegarder au blur

```typescript
const { updateBlock } = useBuilderStore();

<h1
  contentEditable
  suppressContentEditableWarning
  onBlur={(e) => updateBlock(block.id, {
    content: { ...block.content, name: e.currentTarget.innerText }
  })}
  className="outline-none focus:ring-2 ring-indigo-500/30 rounded px-1"
>
  {name}
</h1>
```

### ❌ MAUVAIS - Édition sur onChange

```typescript
// ❌ Pas de suppressContentEditableWarning
<h1 contentEditable>Titre</h1>

// ❌ onChange crée trop de re-renders
<h1 contentEditable onChange={handleChange}>Titre</h1>
```

---

## 🔗 Imports à Toujours Vérifier

### ✅ CORRECTS

```typescript
// Chemin avec extension .ts (fichiers locaux)
import type { Block } from "../types.ts";
import { useBuilderStore } from "../store/useBuilderStore";

// Chemin correct pour les blocs
import HeaderBlock from "../blocks/HeaderBlock";
```

### ❌ INCORRECTS

```typescript
// Sans extension = erreur Vite
import { Block } from "../types";

// Import incorrect d'icône non-existante
import { Github } from "lucide-react"; // ❌ N'existe pas
```

---

## ⚠️ Erreurs Courantes à Éviter

| Erreur                     | Cause                                      | Solution                                        |
| -------------------------- | ------------------------------------------ | ----------------------------------------------- |
| "Cannot find module"       | Extension `.ts` manquante                  | Ajouter `.ts` aux imports locaux                |
| "Github icon not exported" | Icône inexistante                          | Utiliser `Code` à la place                      |
| "Multiple default exports" | Deux `export default` dans le même fichier | Un seul par fichier                             |
| Re-renders massifs         | Store mal optimisé                         | Utiliser sélecteurs Zustand (`s => s.property`) |
| Styles ne s'appliquent pas | Couleurs non définies                      | Vérifier `@theme` dans `src/index.css`          |

---

## ✔️ Checklist avant de soumettre du Code

```
AVANT DE COMMIT, VÉRIFIER :

Type & Imports
- [ ] Tous les imports utilisent `import type` pour les types TypeScript
- [ ] Les chemins d'import ont l'extension `.ts`
- [ ] Un seul `export default` par fichier

Composants
- [ ] Les icônes utilisées existent dans Lucide React
- [ ] Le composant gère les valeurs par défaut du `block.content`
- [ ] Les sélecteurs Zustand sont optimisés (`s => s.property`)

Styling
- [ ] Les classes Tailwind correspondent aux couleurs de `@theme`
- [ ] `suppressContentEditableWarning` utilisé si contentEditable
- [ ] Styles responsifs si nécessaire

Fonctionnalité
- [ ] La fonctionnalité a été testée
- [ ] Pas de console.log() ou code de debug en production
- [ ] Pas d'erreurs TypeScript
```

---

## 🚀 Workflow Git (OBLIGATOIRE après chaque fonctionnalité)

À chaque fois qu'une fonctionnalité est **terminée ET testée** :

### Étapes

```bash
# 1️⃣ Ajouter tous les fichiers modifiés
git add .

# 2️⃣ Commiter avec un message cohérent
git commit -m "type: description courte"

# 3️⃣ Pousser vers le dépôt
git push
```

### Exemples de Commits

```bash
git commit -m "feat: add HeaderBlock editable component"
git commit -m "fix: correct lucide-react icon imports"
git commit -m "refactor: simplify Tailwind v4 configuration"
git commit -m "docs: update CLAUDERULES.md"
```

### Types de Commits

| Type        | Usage                          |
| ----------- | ------------------------------ |
| `feat:`     | ✨ Nouvelle fonctionnalité     |
| `fix:`      | 🐛 Correction de bug           |
| `refactor:` | ♻️ Refactorisation du code     |
| `docs:`     | 📚 Mise à jour documentation   |
| `style:`    | 🎨 Formatting (pas de logique) |
| `chore:`    | 🔧 Tâches de maintenance       |
| `test:`     | ✅ Tests                       |

### Règles de Commits ✅

- ✅ Messages en **anglais**
- ✅ Messages **courts et descriptifs** (< 72 caractères)
- ✅ **Un commit par fonctionnalité** (pas de mélange)
- ✅ Ne jamais forcer un push (sauf vraiment nécessaire)
- ✅ Vérifier les erreurs TypeScript avant de commit

---

## 📞 Questions Fréquentes

**Q: Comment ajouter une nouvelle icône ?**
A: Vérifier d'abord qu'elle existe dans Lucide React. Si elle n'existe pas, utiliser une alternative existante.

**Q: Puis-je modifier `tailwind.config.js` ?**
A: Non, utiliser `@theme` dans `src/index.css` à la place.

**Q: Comment gérer les performances ?**
A: Toujours utiliser les sélecteurs Zustand optimisés (`s => s.property` au lieu de déstructurer).

**Q: Puis-je faire un `git push -f` ?**
A: Non, jamais. Utiliser `git reset` ou `git revert` si nécessaire.

---

**Dernière mise à jour :** 21 avril 2026
