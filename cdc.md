# Cahier des Charges : Projet "DevFolio Builder"

> **DevFolio Builder** est une application web open-source permettant de concevoir visuellement et de déployer automatiquement un portfolio de développeur ultra-moderne.

---

## 1. Vision et Objectifs

- **Type :** Application Web Open-Source (Client-side app).
- **Cible :** Développeurs, Ingénieurs, Profils Tech.
- **Objectif Principal :** Fournir une interface de conception (Builder Drag & Drop) permettant de créer un CV web interactif et moderne sans écrire de code, puis de le déployer automatiquement sur GitHub Pages.
- **Contrainte Majeure :** Le rendu final généré doit être en HTML/CSS/JS Vanilla (statique) pur. Cela garantit des performances maximales (SEO, temps de chargement, accessibilité) sans nécessiter de serveur pour la compilation ni d'un framework frontend lourd côté client final.

---

## 2. Spécifications Fonctionnelles : L'Interface Builder

L'application agit comme un IDE visuel fluide, organisé en trois zones principales :

### 2.1 Le Catalogue et les Templates

- **Système de base :** L'utilisateur peut démarrer son portfolio de zéro (from scratch) ou s'appuyer sur un Squelette pré-défini (ex : _Terminal Layout_, _Bento Grid_, _Classic Sidebar_).
- **Versioning :** Les templates disposent d'un système de versions. Cela permet de proposer des mises à jour de structure sans perte du contenu saisi par l'utilisateur (implique un mapping rigoureux des IDs de blocs).

### 2.2 L'Espace de Travail (Canvas Drag & Drop)

- **Grille Fluide :** Un système de grille intelligent avec des zones de dépôt (_DropZones_) claires.
- **Blocs de Contenu :**
  - `Terminal` : Simulation d'une interface en ligne de commande (effet _typewriter_).
  - `Code Snippet` : Affichage de bouts de code ou réalisations avec coloration syntaxique.
  - `Timeline` : Ligne du temps dynamique (tracé SVG au scroll) pour les expériences professionnelles.
  - `Stack` : Affichage visuel des compétences (radar, nuage de tags ou grille d'icônes).
  - `Header & Text` : Zones d'information standard pour la présentation.
- **Blocs Cosmétiques (Wrappers) :**
  - Arrière-plans dynamiques (Effets Matrix, Particules, Vagues animées SVG).
  - Conteneurs stylisés (_Glassmorphism_, _Neumorphism_, bordures néon/glow).

### 2.3 Le Panneau de Configuration (Propriétés)

Édition contextuelle du bloc sélectionné dans le Canvas :

- **Contenu :** Saisie des textes, dates, liens, tags, et autres données métiers.
- **Style :** Modification des variables CSS locales du bloc (Couleurs, Typographie via Google Fonts, Espacements, _Border-radius_).

---

## 3. Le Moteur de Rendu (Output Generator)

Le Builder doit transformer l'état JSON en fichiers statiques purs. **Le CV généré n'est pas une application React.**

- **Performance & UX :** Intégration d'animations au défilement (`IntersectionObserver`), transitions fluides (accélération matérielle/GPU), et support natif du basculement Mode Sombre/Clair (`prefers-color-scheme`).
- **Structure des Fichiers Générés :**
  - `index.html` : Structure sémantique HTML5 robuste et accessible.
  - `css/main.css` : Fichier minifié incluant les variables CSS personnalisées et les _keyframes_ d'animation.
  - `js/app.js` : Vanilla JS ultra-léger pour gérer la logique interactive (effets de curseur, animations terminal, observers).

---

## 4. Le Pipeline de Déploiement (GitHub Automatisé)

Un workflow CI/CD abstrait permettant le déploiement en 1-clic directement depuis l'interface client du Builder :

1.  **Authentification :** Connexion via OAuth GitHub (nécessite le scope `public_repo`).
2.  **Compilation Client :** Transformation de la configuration JSON du Builder en chaînes de caractères représentant le code source statique (HTML/CSS/JS).
3.  **Opérations API Git :**
    - Création d'un dépôt (ex : `username.github.io`).
    - Commit des fichiers générés via l'API Git Database (gestion des Trees, Blobs, et Commits).
4.  **Déploiement :** Activation des GitHub Pages via l'appel à l'endpoint `POST /repos/{owner}/{repo}/pages` sur la branche principale (main/master).

---

## 5. Architecture Technique (Le Builder React)

- **Stack Principale :** React 18, TypeScript (Strict Mode), Vite.
- **UI & Styling :** Tailwind CSS + utilitaires (`clsx`, `tailwind-merge`). Utilisation de Radix Primitives / Shadcn UI pour les composants d'interface de l'éditeur (modales, menus contextuels, popovers).
- **Moteur Drag & Drop :** `@dnd-kit/core` (avec ses modules _sortable_, _utilities_). Choisi pour son approche _headless_, ses excellentes performances et son accessibilité native.
- **Gestion de l'État (State Management) :** `Zustand`. Choisi pour sa légèreté par rapport à Redux, sa simplicité d'utilisation et sa capacité à limiter les re-renders massifs de l'arbre DOM.
- **Sauvegarde Locale :** Utilisation d'un middleware Zustand (`persist`) pour une synchronisation en temps réel dans le `localStorage` du navigateur, évitant la perte de données en cas de rafraîchissement.

---

## 6. Contrat de Données (Single Source of Truth)

L'architecture repose sur un état global agnostique du DOM. Les interfaces TypeScript centrales sont définies comme suit :

```typescript
// Types de blocs supportés par le moteur
export type BlockType =
  | "header"
  | "terminal"
  | "code-snippet"
  | "timeline"
  | "stack"
  | "text";

// Configuration cosmétique d'un bloc
export interface BlockStyles {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  borderRadius?: string;
  [key: string]: string | undefined;
}

// Entité Bloc manipulée dans l'espace de travail du Builder
export interface Block {
  id: string; // UUID unique
  type: BlockType; // Variante du composant
  content: any; // Contenu métier (texte, liste, config spécifique)
  styles: BlockStyles; // Configuration visuelle locale
}

// Structure de l'état global (Store Zustand)
export interface BuilderState {
  blocks: Block[]; // Arbre virtuel de la page
  selectedBlockId: string | null; // ID du bloc actuellement focalisé/édité

  // Actions
  addBlock: (block: Block) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  selectBlock: (id: string | null) => void;
}
```
