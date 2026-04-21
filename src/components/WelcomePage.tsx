// src/components/WelcomePage.tsx
import { ArrowRight, Sparkles, Palette, Zap, Code, BookOpen } from 'lucide-react';

interface WelcomePageProps {
  onStart: () => void;
}

export default function WelcomePage({ onStart }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-auto">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Logo & Title */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-3 text-4xl font-bold">
              <Sparkles className="text-indigo-400" size={40} />
              <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                DevFolio Builder
              </span>
            </div>
          </div>
          <p className="text-xl text-slate-300 mb-4">
            Créez votre portfolio de développeur sans coder ✨
          </p>
          <p className="text-slate-400 text-lg">
            Un outil drag-and-drop avec 50+ thèmes et 25+ animations
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-20">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-2xl"
          >
            Commencer à créer
            <ArrowRight size={24} />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {/* Feature 1 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 animate-fade-in-up">
            <div className="mb-4 w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Zap className="text-indigo-400" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Drag & Drop</h3>
            <p className="text-slate-400">
              Glissez et déposez des blocs pour construire votre portfolio en temps réel
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-pink-500/50 transition-all hover:shadow-lg hover:shadow-pink-500/10 animate-fade-in-up">
            <div className="mb-4 w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <Palette className="text-pink-400" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">50+ Thèmes</h3>
            <p className="text-slate-400">
              Explorez une bibliothèque massive de thèmes avec animations élégantes
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 animate-fade-in-up">
            <div className="mb-4 w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Code className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">WYSIWYG</h3>
            <p className="text-slate-400">
              Vérifiez vos modifications en temps réel sans connaître le code
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-800/50 border border-slate-700 rounded-2xl p-12 mb-20">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
            <BookOpen className="text-indigo-400" size={32} />
            Comment ça marche ?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-lg mb-2 text-center">Ajouter des blocs</h3>
                <p className="text-sm text-slate-400 text-center">
                  Cliquez sur les composants dans la barre latérale gauche
                </p>
              </div>
              {/* Arrow */}
              <div className="hidden md:block absolute top-6 -right-8 text-indigo-400">
                <ArrowRight size={20} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-lg mb-2 text-center">Organiser</h3>
                <p className="text-sm text-slate-400 text-center">
                  Déplacez les blocs pour les réorganiser
                </p>
              </div>
              <div className="hidden md:block absolute top-6 -right-8 text-indigo-400">
                <ArrowRight size={20} />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-lg mb-2 text-center">Personnaliser</h3>
                <p className="text-sm text-slate-400 text-center">
                  Sélectionnez un bloc et choisissez un thème
                </p>
              </div>
              <div className="hidden md:block absolute top-6 -right-8 text-indigo-400">
                <ArrowRight size={20} />
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center font-bold text-lg mb-4">
                  ✨
                </div>
                <h3 className="font-bold text-lg mb-2 text-center">Publier</h3>
                <p className="text-sm text-slate-400 text-center">
                  Exportez et déployez sur GitHub Pages
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Block Types */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8">📦 Types de blocs disponibles</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: '📋', name: 'En-tête', desc: 'Présentation professionnelle' },
              { icon: '🖥️', name: 'Terminal', desc: 'Affichage de code/console' },
              { icon: '💻', name: 'Code', desc: 'Blocs de code colorés' },
              { icon: '📅', name: 'Timeline', desc: 'Historique d\'expériences' },
              { icon: '🎯', name: 'Compétences', desc: 'Affichage des skills' },
              { icon: '📝', name: 'Texte', desc: 'Paragraphes personnalisés' },
            ].map((block, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-indigo-500/50 transition-all"
              >
                <div className="text-3xl mb-2">{block.icon}</div>
                <h4 className="font-bold mb-1">{block.name}</h4>
                <p className="text-sm text-slate-400">{block.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Theme Gallery Highlight */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-12 mb-20">
          <div className="flex items-center gap-4 mb-4">
            <Palette className="text-purple-400" size={32} />
            <h2 className="text-3xl font-bold">Galerie de thèmes intégrée</h2>
          </div>
          <p className="text-slate-300 mb-6">
            Une fois dans l'éditeur, cliquez sur le bouton <span className="font-bold text-purple-300">🎨 Galerie Thèmes</span> pour explorer:
          </p>
          <ul className="space-y-2 text-slate-300">
            <li>✨ <span className="font-semibold">50+ thèmes</span> pré-conçus organisés par catégorie</li>
            <li>🎬 <span className="font-semibold">25+ animations</span> impressionnantes (glows, gradients, etc)</li>
            <li>🔍 Recherche et filtrage par nom, couleur, ou style</li>
            <li>📋 Aperçus en temps réel avec couleurs et animations</li>
            <li>📋 Copie facile des IDs de thème</li>
          </ul>
        </div>

        {/* Tips Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              💡 Astuces
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li>
                <span className="font-bold text-indigo-400">→</span> Cliquez sur un bloc pour le sélectionner
              </li>
              <li>
                <span className="font-bold text-indigo-400">→</span> Glissez-le par la poignée (⋮) pour le déplacer
              </li>
              <li>
                <span className="font-bold text-indigo-400">→</span> Double-cliquez pour éditer le contenu
              </li>
              <li>
                <span className="font-bold text-indigo-400">→</span> Utilisez la loupe dans Galerie pour chercher des thèmes
              </li>
              <li>
                <span className="font-bold text-indigo-400">→</span> Vos modifications sont sauvegardées automatiquement
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              🎨 Recommandations de thèmes
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li>
                <span className="font-bold text-pink-400">Modern</span> → Header minimaliste élégant
              </li>
              <li>
                <span className="font-bold text-cyan-400">Aurora</span> → Effets animés futuristes
              </li>
              <li>
                <span className="font-bold text-purple-400">Dracula</span> → Code coloré professionnel
              </li>
              <li>
                <span className="font-bold text-green-400">Nord</span> → Palette froide reposante
              </li>
              <li>
                <span className="font-bold text-yellow-400">Cyberpunk</span> → Style tech futuriste
              </li>
            </ul>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-2xl"
          >
            C'est parti ! 🚀 Créer mon portfolio
            <ArrowRight size={24} />
          </button>
          <p className="text-slate-400 mt-6 text-sm">
            Pas de compte requis • Données sauvegardées localement • 100% gratuit
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 mt-20 py-8 px-6 text-center text-slate-400 text-sm">
        <p>Made with ❤️ for developers • DevFolio Builder 2026</p>
      </div>
    </div>
  );
}
