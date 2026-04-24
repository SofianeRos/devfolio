// src/App.tsx
import { useState, useEffect, useRef } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Home, ArrowRight, Play, Code, X, Loader, Check, Download, Monitor, Smartphone, Upload } from 'lucide-react';
import { useBuilderStore } from './store/useBuilderStore.ts';
import Sidebar from './components/builder/Sidebar.tsx';
import Canvas from './components/builder/Canvas.tsx';
import PropertiesPanel from './components/builder/PropertiesPanel.tsx';
import WelcomePage from './components/WelcomePage.tsx';
import { generateStaticSite } from './lib/outputGenerator.ts';
import { deployToGithub } from './lib/github.ts';
import { downloadZip } from './lib/exportZip.ts';
import { exportProject, importProject, importProjectFromJson, importProjectFromGithub } from './lib/projectExport.ts';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [generatedSite, setGeneratedSite] = useState<{ htmlBody: string; css: string; js: string } | null>(null);
  
  // États pour la configuration GitHub
  const [showDeployConfig, setShowDeployConfig] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [repoName, setRepoName] = useState('mon-portfolio-devfolio');
  const [deployUrl, setDeployUrl] = useState('');
  const [deployError, setDeployError] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // États pour l'import/export du projet
  const [importMessage, setImportMessage] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showGithubImport, setShowGithubImport] = useState(false);
  const [githubImportUrl, setGithubImportUrl] = useState('');
  const [githubImportToken, setGithubImportToken] = useState('');
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const blocks = useBuilderStore((s) => s.blocks);
  const settings = useBuilderStore((s) => s.settings);
  const reorderBlocks = useBuilderStore((s) => s.reorderBlocks);
  const setBlocks = useBuilderStore((s) => s.setBlocks);
  const updateSettings = useBuilderStore((s) => s.updateSettings);

  // Configurer les capteurs pour différencier un "clic" d'un "glisser" (drag)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // 5px de mouvement requis pour déclencher le drag
    }),
    useSensor(KeyboardSensor)
  );

  // Injection dynamique de la police Google Fonts
  useEffect(() => {
    const fontName = settings.fontFamily.split(',')[0].replace(/'/g, '').trim();
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`;
    let link = document.getElementById('google-font-preview') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.id = 'google-font-preview';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = fontUrl;
  }, [settings.fontFamily]);

  const getFontUrl = () => `https://fonts.googleapis.com/css2?family=${settings.fontFamily.split(',')[0].replace(/'/g, '').trim().replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`;

  const handleShowPreview = () => {
    const site = generateStaticSite(blocks, settings);
    setGeneratedSite(site);
    setShowPreview(true);
    setDeploySuccess(false);
    setIsDeploying(false);
    setShowDeployConfig(false);
    setDeployError('');
  };

  const handleDownloadZip = async () => {
    if (!generatedSite) return;
    try {
      await downloadZip(generatedSite.htmlBody, generatedSite.css, generatedSite.js, getFontUrl());
    } catch (error) {
      console.error("Erreur d'export ZIP:", error);
    }
  };

  const handleExportProject = async () => {
    try {
      await exportProject(blocks, settings, 'mon-cv-devfolio');
      setImportMessage('✅ Projet exporté avec succès!');
      setImportStatus('success');
      setTimeout(() => setImportStatus('idle'), 3000);
    } catch (error) {
      console.error('Erreur export:', error);
      setImportMessage('❌ Erreur lors de l\'export');
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 3000);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let projectData;
      
      // Essayer d'abord comme ZIP
      if (file.name.endsWith('.zip')) {
        projectData = await importProject(file);
      } else if (file.name.endsWith('.json')) {
        projectData = await importProjectFromJson(file);
      } else {
        setImportMessage('❌ Format non supporté (ZIP ou JSON requis)');
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 3000);
        return;
      }

      if (!projectData) {
        setImportMessage('❌ Erreur lors de la lecture du fichier');
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 3000);
        return;
      }

      // Confirmer avant de remplacer
      if (blocks.length > 0) {
        const shouldReplace = window.confirm(
          '⚠️ Cela remplacera tous vos blocs actuels.\n\nÊtes-vous sûr de vouloir continuer?'
        );
        if (!shouldReplace) return;
      }

      // Restaurer le projet
      setBlocks(projectData.blocks);
      updateSettings(projectData.settings);

      setImportMessage(`✅ Projet importé! (${projectData.blocks.length} blocs restaurés)`);
      setImportStatus('success');
      setTimeout(() => setImportStatus('idle'), 4000);
    } catch (error) {
      console.error('Erreur import:', error);
      setImportMessage('❌ Erreur lors de l\'import du projet');
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 3000);
    }

    // Réinitialiser l'input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportGithub = async () => {
    if (!githubImportUrl.trim()) {
      setImportMessage('❌ Veuillez entrer une URL ou un chemin GitHub');
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 3000);
      return;
    }

    setIsLoadingGithub(true);
    setImportMessage('🔄 Récupération du fichier depuis GitHub...');

    try {
      // Passer le token optionnel (pour les repos privés ou eviter les rate limits)
      const projectData = await importProjectFromGithub(
        githubImportUrl,
        githubImportToken || undefined
      );

      if (!projectData) {
        setImportMessage('❌ Fichier non trouvé ou format invalide');
        setImportStatus('error');
        setIsLoadingGithub(false);
        setTimeout(() => setImportStatus('idle'), 3000);
        return;
      }

      // Confirmer avant de remplacer
      if (blocks.length > 0) {
        const shouldReplace = window.confirm(
          '⚠️ Cela remplacera tous vos blocs actuels.\n\nÊtes-vous sûr de vouloir continuer?'
        );
        if (!shouldReplace) {
          setIsLoadingGithub(false);
          return;
        }
      }

      // Restaurer le projet
      setBlocks(projectData.blocks);
      updateSettings(projectData.settings);

      setImportMessage(`✅ Projet importé depuis GitHub! (${projectData.blocks.length} blocs restaurés)`);
      setImportStatus('success');
      setShowGithubImport(false);
      setGithubImportUrl('');
      setGithubImportToken('');
      setTimeout(() => setImportStatus('idle'), 4000);
    } catch (error: any) {
      console.error('Erreur import GitHub:', error);
      const errorMsg = error.message || 'Erreur lors de l\'import depuis GitHub';
      setImportMessage(`❌ ${errorMsg}`);
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 5000);
    } finally {
      setIsLoadingGithub(false);
    }
  };

  const handleDeploy = async () => {
    if (!generatedSite || !githubToken || !repoName) return;
    setIsDeploying(true);
    setDeployError('');

    const fullHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio Développeur</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="main.css">
  <link href="${getFontUrl()}" rel="stylesheet" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
</head>
<body>
  <main>
${generatedSite.htmlBody}
  </main>
  <script src="app.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
</body>
</html>`;

    const filesToDeploy = [
      { path: 'index.html', content: fullHtml },
      { path: 'main.css', content: generatedSite.css },
      { path: 'app.js', content: generatedSite.js },
    ];

    const result = await deployToGithub(githubToken, repoName, filesToDeploy);
    
    setIsDeploying(false);
    
    if (result.success) {
      setDeployUrl(result.url || '');
      setDeploySuccess(true);
    } else {
      setDeployError(result.error || 'Une erreur est survenue lors du déploiement.');
    }
  };

  // Fonction déclenchée quand on lâche un bloc après l'avoir déplacé
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // 1. Si on a glissé un NOUVEAU composant depuis le catalogue
    if (active.data.current?.type === 'new-block') {
      const blockType = active.data.current.blockType;
      let dropIndex = blocks.length; // Par défaut à la fin
      
      if (over.id !== 'canvas-droppable') {
        const overIndex = blocks.findIndex((b) => b.id === over.id);
        if (overIndex !== -1) dropIndex = overIndex;
      }
      
      useBuilderStore.getState().addBlock(blockType, dropIndex);
      return;
    }

    // 2. Si on réordonne un bloc existant dans le Canvas
    if (active.id !== over.id) {
      reorderBlocks(active.id as string, over.id as string);
    }
  };

  if (showWelcome) {
    return <WelcomePage onStart={() => setShowWelcome(false)} />;
  }

  return (
    <div className="flex h-screen w-full bg-builder-bg overflow-hidden text-slate-300">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        
        {/* 1. Barre latérale gauche : Catalogue de blocs */}
        <Sidebar />

        {/* 2. Zone centrale : Le CV en cours de construction */}
        <main 
          className="flex-1 overflow-y-auto p-12 relative transition-colors duration-500"
          style={{ backgroundColor: settings.backgroundColor, fontFamily: settings.fontFamily }}
        >
          <div className="max-w-4xl mx-auto">
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <Canvas />
            </SortableContext>
          </div>
        </main>

        {/* 3. Barre latérale droite : Paramètres du bloc sélectionné */}
        <PropertiesPanel />

        {/* ====== BOUTONS D'ACTIONS GLOBAUX ====== */}
        {/* Bouton Retour (Calé dans l'espace de la Sidebar) */}
        <button
          onClick={() => setShowWelcome(true)}
          className="fixed bottom-6 left-6 z-50 flex items-center justify-center gap-3 w-[272px] py-4 bg-slate-800 border-2 border-slate-700 hover:bg-slate-700 hover:border-slate-500 rounded-xl transition-all shadow-2xl text-white font-bold text-lg group"
        >
          <Home size={24} className="text-slate-400 group-hover:text-white transition-colors" />
          Retour à l'accueil
        </button>

        {/* Boutons Import/Export (Milieu bas) */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 flex-col" style={{ width: 'fit-content' }}>
          {importStatus !== 'idle' && (
            <div className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all animate-fade-in-down ${
              importStatus === 'success' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {importMessage}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleExportProject}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border-2 border-slate-700 hover:bg-slate-700 hover:border-slate-500 rounded-xl transition-all shadow-lg text-white font-semibold text-sm group"
              title="Exporter votre projet pour le réutiliser plus tard"
            >
              <Download size={16} className="group-hover:scale-110 transition-transform" />
              Exporter
            </button>
            <button
              onClick={handleImportClick}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border-2 border-slate-700 hover:bg-slate-700 hover:border-slate-500 rounded-xl transition-all shadow-lg text-white font-semibold text-sm group"
              title="Importer un projet sauvegardé"
            >
              <Upload size={16} className="group-hover:scale-110 transition-transform" />
              Importer
            </button>
            <button
              onClick={() => setShowGithubImport(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border-2 border-slate-700 hover:bg-slate-700 hover:border-slate-500 rounded-xl transition-all shadow-lg text-white font-semibold text-sm group"
              title="Importer depuis GitHub"
            >
              <Code size={16} className="group-hover:scale-110 transition-transform" />
              GitHub
            </button>
          </div>
        </div>

        {/* Input file caché pour l'import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,.json"
          onChange={handleFileSelected}
          className="hidden"
        />

        {/* Modal Import GitHub */}
        {showGithubImport && (
          <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl max-w-2xl w-full space-y-6 shadow-2xl animate-fade-in-up">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Importer depuis GitHub</h3>
                <button
                  onClick={() => {
                    setShowGithubImport(false);
                    setGithubImportUrl('');
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    URL ou chemin du fichier project.json
                  </label>
                  <input
                    type="text"
                    value={githubImportUrl}
                    onChange={(e) => setGithubImportUrl(e.target.value)}
                    placeholder="Ex: https://raw.githubusercontent.com/username/repo/main/project.json"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm"
                    disabled={isLoadingGithub}
                  />
                  <p className="text-xs text-slate-400 mt-2 space-y-1">
                    <div>📝 Format d'URL GitHub raw:</div>
                    <code className="bg-slate-900 px-2 py-1 rounded">https://raw.githubusercontent.com/username/repo/branch/project.json</code>
                    <div className="mt-2">Ou format raccourci:</div>
                    <code className="bg-slate-900 px-2 py-1 rounded">username/repo/main/project.json</code>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Token GitHub (optionnel - pour les repos privés)
                  </label>
                  <input
                    type="password"
                    value={githubImportToken}
                    onChange={(e) => setGithubImportToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm"
                    disabled={isLoadingGithub}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Laissez vide pour les repos publics. Générez un token sur GitHub Settings → Developer settings → Personal access tokens
                  </p>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => {
                      setShowGithubImport(false);
                      setGithubImportUrl('');
                      setGithubImportToken('');
                    }}
                    disabled={isLoadingGithub}
                    className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-xl transition-colors font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleImportGithub}
                    disabled={isLoadingGithub || !githubImportUrl.trim()}
                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    {isLoadingGithub ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Chargement...
                      </>
                    ) : (
                      <>
                        <Code size={16} />
                        Importer
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bouton Suivant (Calé dans l'espace des propriétés) */}
        <button
          onClick={handleShowPreview}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-3 w-[272px] py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all shadow-2xl shadow-indigo-500/20 text-white font-bold text-lg"
        >
          Publier 🚀
          <ArrowRight size={24} />
        </button>

      </DndContext>

      {/* ====== MODAL DE PRÉVISUALISATION & DÉPLOIEMENT ====== */}
      {showPreview && generatedSite && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex flex-col animate-fade-in">
          {/* Header de la Modal */}
          <div className="h-20 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-8 shrink-0 shadow-xl">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Play className="text-indigo-400" size={28} />
              Aperçu final du Portfolio
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setShowPreview(false);
                  setDeploySuccess(false);
                  setShowDeployConfig(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors font-semibold"
              >
                <X size={20} />
                Fermer
              </button>
              
              {!showDeployConfig && !deploySuccess && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownloadZip}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white hover:bg-slate-700 rounded-lg font-bold transition-all border border-slate-700 hover:border-slate-500 shadow-lg"
                  >
                    <Download size={20} />
                    Télécharger .ZIP
                  </button>
                  <button
                    onClick={() => setShowDeployConfig(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-900 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg font-bold transition-all shadow-xl hover:shadow-white/20"
                  >
                    <Code size={20} />
                    Déployer sur GitHub
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Zone d'aperçu (Simule la page finale publiée) */}
          {deploySuccess ? (
            <div className="flex-1 w-full flex items-center justify-center p-8 text-center bg-builder-bg">
              <div className="space-y-6 max-w-md">
                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-fade-in-down border-4 border-emerald-500/30">
                  <Check size={48} />
                </div>
                <h3 className="text-3xl font-bold text-white">Portfolio en ligne ! 🎉</h3>
                <p className="text-slate-400 text-lg">
                  Votre code source a été poussé sur GitHub. Votre site sera disponible d'ici 1 à 2 minutes sur le lien suivant :
                </p>
                <a 
                  href={deployUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl shadow-xl hover:shadow-white/20 hover:scale-105 transition-all"
                >
                  Visiter mon site →
                </a>
              </div>
            </div>
          ) : showDeployConfig ? (
            <div className="flex-1 w-full flex items-center justify-center p-8 bg-builder-bg">
              <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl max-w-xl w-full space-y-6 shadow-2xl animate-fade-in-up">
                <h3 className="text-2xl font-bold text-white mb-2">Configuration GitHub</h3>
                
                {deployError && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm font-semibold">
                    ⚠️ {deployError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Nom du dépôt (Repository)</label>
                  <input 
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="ex: mon-portfolio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex justify-between">
                    <span>Personal Access Token (PAT)</span>
                    <a href="https://github.com/settings/tokens/new?scopes=repo" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 text-xs transition-colors">Générer un token →</a>
                  </label>
                  <input 
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  />
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Le token nécessite <strong>uniquement</strong> la permission <code className="bg-slate-900 px-1 rounded text-slate-400">repo</code>. DevFolio Builder n'enregistre jamais ce token, il est seulement utilisé localement par votre navigateur pour cette requête.
                  </p>
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-700">
                  <button 
                    onClick={() => setShowDeployConfig(false)}
                    disabled={isDeploying}
                    className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-xl transition-colors font-semibold"
                  >
                    Retour
                  </button>
                  <button 
                    onClick={handleDeploy}
                    disabled={!githubToken || !repoName || isDeploying}
                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl transition-colors font-semibold flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    {isDeploying ? <Loader size={20} className="animate-spin" /> : '🚀 Lancer le déploiement'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col bg-slate-900/80 overflow-hidden">
              {/* Toolbar Preview (Desktop vs Mobile) */}
              <div className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-center gap-4 shrink-0 shadow-lg z-10">
                <button onClick={() => setPreviewMode('desktop')} className={`p-2.5 rounded-lg flex items-center gap-2 transition-all ${previewMode === 'desktop' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                  <Monitor size={18} />
                  <span className="text-xs font-bold">Vue Bureau</span>
                </button>
                <button onClick={() => setPreviewMode('mobile')} className={`p-2.5 rounded-lg flex items-center gap-2 transition-all ${previewMode === 'mobile' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                  <Smartphone size={18} />
                  <span className="text-xs font-bold">Vue Mobile</span>
                </button>
              </div>
              
              {/* Espace d'affichage de la fenêtre */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start scroll-smooth custom-scrollbar">
                <div className={`bg-white rounded-t-xl overflow-hidden transition-all duration-500 ease-in-out flex flex-col ${previewMode === 'mobile' ? 'w-[375px] h-[812px] rounded-b-xl ring-[12px] ring-slate-950 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : 'w-full max-w-6xl h-full min-h-[800px] border border-slate-700 rounded-b-xl shadow-2xl'}`}>
                  
                  {/* Faux En-tête de Navigateur (macOS Style) */}
                  <div className="h-12 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-4 shrink-0">
                    <div className="flex gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-sm" />
                      <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-sm" />
                      <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] shadow-sm" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-white px-4 py-1.5 rounded-md text-[11px] text-slate-500 font-mono shadow-sm border border-slate-200/60 w-full max-w-md text-center flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        127.0.0.1:3000 / preview
                      </div>
                    </div>
                    <div className="w-16"></div> {/* Espacement symétrique */}
                  </div>

                  {/* Le CV compilé en temps réel */}
                  <iframe
                    className="w-full flex-1 border-0 bg-slate-50"
                    title="Portfolio Preview"
                    sandbox="allow-scripts"
                    srcDoc={`
                      <!DOCTYPE html>
                      <html lang="fr">
                        <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <title>Aperçu du Portfolio</title>
                          <script src="https://cdn.tailwindcss.com"></script>
                          <style>${generatedSite.css}</style>
                          <link href="${getFontUrl()}" rel="stylesheet" />
                          <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
                          <style>
                            /* Scrollbar personnalisée pour le CV */
                            ::-webkit-scrollbar { width: 6px; }
                            ::-webkit-scrollbar-track { background: transparent; }
                            ::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }
                            ::-webkit-scrollbar-thumb:hover { background: #64748b; }
                          </style>
                        </head>
                        <body>
                          <main>${generatedSite.htmlBody}</main>
                          <script>${generatedSite.js}</script>
                          <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
                          <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
                        </body>
                      </html>
                    `}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
