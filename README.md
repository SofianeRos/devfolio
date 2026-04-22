# 🚀 DevFolio Builder

> Un outil **drag-and-drop** pour créer et déployer des portfolios de développeurs sans coder

## 📖 À propos

**DevFolio Builder** est une application web intuitive permettant de créer des portfolios professionnels de développeurs en quelques minutes. Aucune connaissance en code requise!

### 🎓 Projet Scolaire

Ce projet a été développé dans le cadre d'un cours de l'école où l'objectif est d'**apprendre à coder avec l'IA**. Il démontre comment utiliser les assistants IA pour :

- Résoudre des bugs et des erreurs TypeScript
- Générer des composants React réutilisables
- Concevoir une architecture frontend scalable
- Implémenter des animations et des thèmes personnalisés

## ✨ Fonctionnalités

- ✅ **Drag & Drop** - Glissez-déposez des blocs pour construire votre portfolio
- ✅ **50+ Thèmes** - Une galerie massive de thèmes pré-conçus
- ✅ **25+ Animations** - Effets visuels modernes (glows, gradients, etc.)
- ✅ **WYSIWYG** - Aperçu en temps réel des modifications
- ✅ **Export ZIP** - Téléchargez votre site en format ZIP
- ✅ **Déploiement GitHub** - Déployez directement sur GitHub Pages
- ✅ **Responsive Design** - Compatible desktop et mobile
- ✅ **Stockage Local** - Vos données sont sauvegardées localement

## 📦 Types de Blocs Disponibles

- 📋 **Header** - Section d'en-tête avec présentation
- 💻 **Code Snippet** - Affichage de code coloré
- 🖥️ **Terminal** - Simulation d'un terminal/console
- 📅 **Timeline** - Historique d'expériences professionnelles
- 🎯 **Stack** - Compétences et technologies maîtrisées
- 📝 **Texte** - Paragraphes et descriptions personnalisés
- 🏆 **Certifications** - Diplômes et certifications
- 🔗 **Réseaux Sociaux** - Liens vers GitHub, LinkedIn, Twitter, etc.
- 📸 **Média** - Images et vidéos
- ❓ **FAQ** - Questions fréquemment posées

## 🛠️ Installation

### Prérequis

- **Node.js** (v16+)
- **npm** ou **yarn**
- **Git**

### Étapes

1. **Cloner le repository**

```bash
git clone https://github.com/yourusername/devfolio-builder.git
cd devfolio-builder
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Lancer le serveur de développement**

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173/`

## 🚀 Utilisation

1. **Ouvrez l'application** - Cliquez sur "Commencer à créer"
2. **Ajoutez des blocs** - Cliquez sur les composants dans la barre latérale gauche
3. **Organisez** - Déplacez les blocs par leur poignée (⋮)
4. **Personnalisez** - Sélectionnez un bloc et choisissez un thème
5. **Publiez** - Exportez en ZIP ou déployez sur GitHub Pages

## 📂 Structure du Projet

```
src/
├── components/
│   ├── blocks/              # Composants de blocs (Header, Code, etc.)
│   ├── builder/             # Interface de construction (Canvas, Sidebar, etc.)
│   ├── WelcomePage.tsx      # Page d'accueil
│   └── ThemeGallery.tsx     # Galerie de thèmes
├── store/
│   └── useBuilderStore.ts   # État global (Zustand)
├── lib/
│   ├── themes.ts            # Définitions des thèmes
│   ├── outputGenerator.ts   # Génération du HTML/CSS final
│   └── exportZip.ts         # Export ZIP
├── types.ts                 # Types TypeScript
├── App.tsx                  # Composant principal
└── main.tsx                 # Point d'entrée
```

## 🏗️ Stack Technologique

- **React 18** - Librairie UI
- **TypeScript** - Typage fort
- **Vite** - Bundler ultra-rapide
- **Tailwind CSS** - Styles utilitaires
- **Zustand** - Gestion d'état
- **dnd-kit** - Drag & drop
- **lucide-react** - Icônes
- **uuid** - Génération d'IDs uniques

## 📝 Scripts Disponibles

```bash
npm run dev      # Lancer le serveur de développement
npm run build    # Construire pour la production
npm run preview  # Prévisualiser la build production
npm run lint     # Vérifier les erreurs ESLint
```

## 🎨 Personnalisation

### Ajouter un Nouveau Thème

Modifiez `src/lib/themes.ts` pour ajouter vos propres thèmes

### Ajouter une Nouvelle Animation

Modifiez `src/index.css` pour ajouter des animations CSS personnalisées

### Ajouter un Nouveau Type de Bloc

1. Créez un composant dans `src/components/blocks/`
2. Enregistrez-le dans `SortableBlock.tsx`
3. Ajoutez le type dans `types.ts`

## 🤝 Contribution

Les contributions sont bienvenues! N'hésitez pas à :

- Signaler des bugs
- Proposer des améliorations
- Soumettre des pull requests

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

Développé par un étudiant en tant que projet d'apprentissage du **codage avec l'IA**.

---

**Astuce:** Utilisez un assistant IA pour déboguer, améliorer ou étendre ce projet! C'est un excellent exercice d'apprentissage. 🤖✨
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
