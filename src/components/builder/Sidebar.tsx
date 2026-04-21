// src/components/builder/Sidebar.tsx
import { useState } from 'react';
import { Terminal, Layout, Type, List, Cpu, Code, Sparkles, Trash2, GripVertical, Loader, X, ChevronDown } from 'lucide-react';
import { useBuilderStore } from '../../store/useBuilderStore.ts';
import type { BlockType, Block } from '../../types.ts';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDraggable } from '@dnd-kit/core';

interface DraggableBlockItemProps {
  block: Block;
  index: number;
  selectedBlockId: string | null;
  onSelect: (id: string | null) => void;
  onRemove: (id: string) => void;
}

const BLOCK_LIBRARY: { type: BlockType; label: string; icon: any; description: string }[] = [
  { type: 'header', label: '📋 En-tête', icon: Layout, description: 'Présentation du portfolio' },
  { type: 'terminal', label: '🖥️ Terminal', icon: Terminal, description: 'Affichage de code/console' },
  { type: 'stack', label: '🎯 Compétences', icon: Cpu, description: 'Liste de vos skills' },
  { type: 'timeline', label: '📅 Expérience', icon: List, description: 'Historique professionnel' },
  { type: 'code-snippet', label: '💻 Code', icon: Code, description: 'Bloc de code coloré' },
  { type: 'text', label: '📝 Texte', icon: Type, description: 'Paragraphes personnalisés' },
];

// Component DraggableBlockItem
function DraggableBlockItem({ block, index, selectedBlockId, onSelect, onRemove }: DraggableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group p-3 rounded-lg border-2 cursor-pointer transition-all ${
        selectedBlockId === block.id
          ? 'border-indigo-500 bg-slate-700'
          : 'border-slate-600 bg-slate-800 hover:border-slate-500'
      } ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
      onClick={() => onSelect(block.id)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-700 rounded"
            title="Drag pour réordonner"
          >
            <GripVertical size={14} className="text-slate-500" />
          </button>
          <span className="text-sm font-semibold text-slate-300">
            {index + 1}. {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(block.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-600/20 rounded"
          title="Supprimer"
        >
          <Trash2 size={14} className="text-red-400" />
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>ID: {block.id.slice(0, 8)}...</span>
        {block.theme && <span className="text-indigo-300">✓ {block.theme}</span>}
        {block.animation && <span className="text-cyan-300">✨ {block.animation}</span>}
      </div>
    </div>
  );
}

// Composant de catalogue Draggable (pour le Drag & Drop)
function DraggableLibraryItem({ item, onAdd }: { item: any; onAdd: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `template-${item.type}`,
    data: { type: 'new-block', blockType: item.type },
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  } : undefined;

  const Icon = item.icon;

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={onAdd}
      className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-indigo-600 transition-all group border border-slate-700 hover:border-indigo-400 shadow-sm"
    >
      <div className="p-2 bg-slate-900/50 rounded-lg group-hover:bg-black/20 transition-colors pointer-events-none">
        <Icon size={20} className="text-indigo-400 group-hover:text-white" />
      </div>
      <span className="text-xs font-bold text-slate-300 group-hover:text-white text-center pointer-events-none">
        {item.label.split(' ').slice(1).join(' ')}
      </span>
    </button>
  );
}

export default function Sidebar() {
  const [showTemplates, setShowTemplates] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(true);
  const [isLayersOpen, setIsLayersOpen] = useState(true);
  
  const addBlock = useBuilderStore((s) => s.addBlock);
  const selectBlock = useBuilderStore((s) => s.selectBlock);
  const removeBlock = useBuilderStore((s) => s.removeBlock);
  const selectedBlockId = useBuilderStore((s) => s.selectedBlockId);
  const blocks = useBuilderStore((s) => s.blocks);
  const setBlocks = useBuilderStore((s) => s.setBlocks);

  const handleAddBlock = (type: BlockType) => {
    addBlock(type);
  };

  const handleLoadTemplate = async (templateBlocks: any[]) => {
    setLoadingTemplate(true);
    try {
      // Importer v4 pour générer les IDs
      const { v4: uuid } = await import('uuid');
      const newBlocks = templateBlocks.map((block) => ({
        ...block,
        id: uuid(),
      }));
      setBlocks(newBlocks);
      setShowTemplates(false);
    } catch (error) {
      console.error('Erreur lors du chargement du template:', error);
    } finally {
      setLoadingTemplate(false);
    }
  };

  return (
    <>
      <aside className="w-80 border-r border-builder-border bg-builder-panel flex flex-col gap-0 overflow-hidden">
        
        {/* ===== SECTION 0: ACTIONS GLOBALES ===== */}
        <div className="p-4 border-b border-slate-700 bg-slate-800/30">
          <button
            onClick={() => setShowTemplates(true)}
            className="w-full py-2.5 px-4 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
          >
            📦 Explorer les Templates
          </button>
        </div>

        {/* ===== SECTION 1: AJOUTER DES COMPOSANTS ===== */}
        <div className="flex flex-col border-b border-slate-700 transition-all shrink-0">
          <button 
            onClick={() => setIsAddOpen(!isAddOpen)}
            className={`w-full px-4 py-3 bg-slate-800/80 hover:bg-slate-700/80 flex items-center justify-between text-slate-200 font-semibold shrink-0 transition-colors ${isAddOpen ? 'border-b border-slate-700/50' : ''}`}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-400" />
              Ajouter un composant
            </div>
            <ChevronDown size={16} className={`text-slate-400 transform transition-transform duration-200 ${isAddOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isAddOpen && (
            <div className="p-3 grid grid-cols-2 gap-2 bg-slate-900/50">
              {BLOCK_LIBRARY.map((item) => {
                return <DraggableLibraryItem key={item.type} item={item} onAdd={() => handleAddBlock(item.type)} />;
              })}
            </div>
          )}
        </div>

        {/* ===== SECTION 2: BLOCS ACTUELS (DRAG & DROP) ===== */}
        <div className={`flex flex-col bg-slate-900/50 transition-all ${isLayersOpen ? 'flex-1 min-h-0' : 'shrink-0'}`}>
          <button 
            onClick={() => setIsLayersOpen(!isLayersOpen)}
            className={`w-full px-4 py-3 bg-slate-800/80 hover:bg-slate-700/80 flex items-center justify-between text-slate-200 font-semibold shrink-0 transition-colors ${isLayersOpen ? 'border-b border-slate-700/50' : ''}`}
          >
            <div className="flex items-center gap-2">
              <GripVertical size={18} className="text-cyan-400" />
              Blocs actuels ({blocks.length})
            </div>
            <ChevronDown size={16} className={`text-slate-400 transform transition-transform duration-200 ${isLayersOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isLayersOpen && (
            <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-2">
              {blocks.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-8">
                  Aucun bloc ajouté. Commencez par en ajouter un ! ⬆️
                </p>
              ) : (
                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                  {blocks.map((block, idx) => (
                    <DraggableBlockItem
                      key={block.id}
                      block={block}
                      index={idx}
                      selectedBlockId={selectedBlockId}
                      onSelect={selectBlock}
                      onRemove={removeBlock}
                    />
                  ))}
                </SortableContext>
              )}
            </div>
          )}
        </div>

      </aside>

      {/* ===== MODAL GALERIE DE TEMPLATES ===== */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-full flex flex-col shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Header de la Modale */}
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📦</span>
                <div>
                  <h2 className="text-xl font-bold text-white">Galerie de Templates</h2>
                  <p className="text-sm text-slate-400">Démarrez avec une structure de portfolio professionnelle</p>
                </div>
              </div>
              <button
                onClick={() => setShowTemplates(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Grille de Templates */}
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-900/50">
              {TEMPLATE_OPTIONS.map((tpl) => (
                <div key={tpl.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{tpl.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{tpl.name}</h3>
                      <p className="text-sm text-slate-400">{tpl.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex-1">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Composants inclus</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tpl.blocks.map((b, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-900 text-slate-300 text-[10px] rounded border border-slate-700 font-mono">
                          {b.type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleLoadTemplate(tpl.blocks)}
                    disabled={loadingTemplate}
                    className="w-full mt-6 py-2.5 bg-slate-700 hover:bg-purple-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 group"
                  >
                    {loadingTemplate ? <Loader size={16} className="animate-spin" /> : 'Utiliser ce template'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Template options - PROFESSIONNEL & BIEN FAIT
const TEMPLATE_OPTIONS = [
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Design épuré et élégant',
    icon: '✨',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Thomas Leclerc',
          role: 'Développeur Fullstack',
          email: 'thomas.leclerc@dev.fr',
          github: 'github.com/thomasleclerc',
        },
        styles: {},
        theme: 'header-modern',
        animation: 'fade-in-up',
      },
      {
        type: 'text',
        content: {
          text: 'Développeur passionné par les technologies web modernes et les architectures scalables. Spécialisé en React, Node.js et solutions cloud. 7 ans d\'expérience dans le développement d\'applications complexes pour startups et grandes entreprises.',
        },
        styles: {},
      },
      {
        type: 'stack',
        content: {
          skills: [
            { name: 'React & Next.js', level: 95 },
            { name: 'Node.js & Express', level: 93 },
            { name: 'TypeScript', level: 92 },
            { name: 'PostgreSQL', level: 90 },
          ],
        },
        styles: {},
        theme: 'stack-modern',
      },
      {
        type: 'terminal',
        content: {
          lines: [
            { label: '$ ', value: 'npm run build' },
            { label: '> ', value: 'Building production bundle...' },
            { label: '✓ ', value: 'Compiled successfully - 324KB gzipped' },
            { label: '$ ', value: 'npm run deploy' },
            { label: '✓ ', value: 'Deployed to production' },
          ],
        },
        styles: {},
        theme: 'terminal-macos',
      },
    ],
  },
  {
    id: 'neon',
    name: 'Neon Futuriste',
    description: 'Cyberpunk avec effets glow',
    icon: '⚡',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Alex Neon',
          role: 'Senior Developer',
          email: 'alex@neon-tech.io',
          github: 'github.com/alexneon',
        },
        styles: {},
        theme: 'header-neon',
        animation: 'neon-pulse',
      },
      {
        type: 'text',
        content: {
          text: 'Développeur spécialisé dans les technologies Edge, WebGL et l\'optimisation extrême des performances. Créateur d\'expériences visuelles modernes et immersives. Fan de cybersecurity et d\'architecture décentralisée.',
        },
        styles: {},
      },
      {
        type: 'terminal',
        content: {
          lines: [
            { label: '> ', value: 'Initializing GPU compute cluster...' },
            { label: '$ ', value: 'npm install @neural/ai @edge/compute' },
            { label: '✓ ', value: 'Neural network loaded: 2.4GB' },
            { label: '$ ', value: 'start --mode=accelerated' },
            { label: '⚡ ', value: 'System ready - 0.3ms latency' },
          ],
        },
        styles: {},
        theme: 'terminal-neon',
        animation: 'fade-glow',
      },
    ],
  },
  {
    id: 'professionnel',
    name: 'Professionnel Corporate',
    description: 'Corporate et réputé',
    icon: '💼',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Jean-Pierre Dupont',
          role: 'CTO & Technical Lead',
          email: 'jp.dupont@techcorp.com',
          github: 'github.com/jpdupont',
        },
        styles: {},
        theme: 'header-corporate',
        animation: 'fade-in',
      },
      {
        type: 'text',
        content: {
          text: 'Directeur technique avec 18 ans d\'expérience dans la transformation numérique des entreprises. Expertise en gouvernance IT, architecture microservices et leadership technique de grandes équipes. Passionné par l\'innovation et la gestion des talents.',
        },
        styles: {},
      },
      {
        type: 'timeline',
        content: {
          events: [
            { year: '2023', title: 'CTO', company: 'TechCorp International' },
            { year: '2020', title: 'VP Engineering', company: 'CloudScale Systems' },
            { year: '2017', title: 'Senior Architect', company: 'FinTech Solutions' },
            { year: '2014', title: 'Tech Lead', company: 'WebServices Inc' },
          ],
        },
        styles: {},
        theme: 'timeline-corporate',
        animation: 'slide-in-right',
      },
    ],
  },
  {
    id: 'aurora',
    name: 'Aurora Créatif',
    description: 'Aurores boréales & dégradés',
    icon: '🌌',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Aurora Valentin',
          role: 'Creative & Dev Fusion',
          email: 'hello@aurora-creative.dev',
          github: 'github.com/auroracreative',
        },
        styles: {},
        theme: 'header-aurora',
        animation: 'aurora-shift',
      },
      {
        type: 'text',
        content: {
          text: 'Créatrice fusionnant design artistique et développement technique. Spécialisée en WebGL, animations avancées et expériences interactives immersives. Mes projects fusionnent l\'art, la physique et la technologie pour créer des moments digitaux mémorables.',
        },
        styles: {},
      },
      {
        type: 'code-snippet',
        content: {
          title: 'Interactive Aurora Effect',
          code: 'const aurora = new ParticleSystem({\n  count: 5000,\n  colors: ["#00ff88", "#ff00ff", "#00ccff"],\n  physics: { gravity: -0.0001, damping: 0.995 }\n});\n\nauora.animate(t => {\n  particles.forEach(p => p.update(t * 0.001));\n});',
          language: 'javascript',
        },
        styles: {},
        theme: 'code-aurora',
        animation: 'wave-flow',
      },
    ],
  },
  {
    id: 'designer-ui',
    name: 'Designer UI/UX',
    description: 'Portfolio créatif pour designers',
    icon: '🎨',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Sophie Martin',
          role: 'Lead Product Designer',
          email: 'sophie@designstudio.co',
          github: 'github.com/sophiemartindesign',
        },
        styles: {},
        theme: 'header-gradient',
        animation: 'fade-in-up',
      },
      {
        type: 'text',
        content: {
          text: 'Directrice de Design avec 12 ans d\'expérience en création d\'interfaces intuitives et accessibles. Spécialisée en design systems, user research et leadership créatif. J\'ai mené des projets pour plus de 50 clients internationaux, transformant des visions en expériences visuelles exceptionnelles.',
        },
        styles: {},
      },
      {
        type: 'stack',
        content: {
          skills: [
            { name: 'Figma & Design Systems', level: 98 },
            { name: 'User Research', level: 94 },
            { name: 'Prototyping & Animation', level: 96 },
            { name: 'Accessibility (WCAG)', level: 92 },
          ],
        },
        styles: {},
        theme: 'stack-gradient',
        animation: 'pulse-glow',
      },
    ],
  },
  {
    id: 'backend-devops',
    name: 'Backend & DevOps',
    description: 'Infrastructure & Performance',
    icon: '🔧',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Marcus Chen',
          role: 'DevOps & Infrastructure Lead',
          email: 'marcus@infrastructure-ops.dev',
          github: 'github.com/marcuschen-devops',
        },
        styles: {},
        theme: 'header-dark',
        animation: 'slide-in-left',
      },
      {
        type: 'text',
        content: {
          text: 'Ingénieur DevOps senior avec expertise en Kubernetes, Terraform et architecture cloud distribuée. 10 ans d\'expérience en gestion d\'infrastructures haute disponibilité. Optimisé le pipeline CI/CD pour 40+ microservices, réduisant le time-to-deploy de 80%.',
        },
        styles: {},
      },
      {
        type: 'terminal',
        content: {
          lines: [
            { label: '$ ', value: 'kubectl deploy -f production-cluster.yaml' },
            { label: '> ', value: 'Deploying 12 services across 3 regions...' },
            { label: '✓ ', value: 'All replicas healthy - 99.99% uptime' },
            { label: '$ ', value: 'terraform apply -auto-approve' },
            { label: '✓ ', value: 'Infrastructure provisioned - 127ms latency' },
          ],
        },
        styles: {},
        theme: 'terminal-dark',
        animation: 'matrix-glow',
      },
      {
        type: 'stack',
        content: {
          skills: [
            { name: 'Kubernetes & Docker', level: 97 },
            { name: 'AWS & GCP', level: 95 },
            { name: 'Terraform & IaC', level: 96 },
            { name: 'Monitoring & Observability', level: 93 },
          ],
        },
        styles: {},
        theme: 'stack-dark',
      },
    ],
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist ML',
    description: 'IA, Data & Analytics',
    icon: '📊',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Dr. Emma Watson',
          role: 'Senior ML Engineer & Data Scientist',
          email: 'emma.watson@ai-research.com',
          github: 'github.com/emmawatson-ml',
        },
        styles: {},
        theme: 'header-technical',
        animation: 'pulse-glow',
      },
      {
        type: 'text',
        content: {
          text: 'Data scientist et ML engineer avec PhD en Computer Science. Expert en deep learning, NLP et computer vision. J\'ai publié 8 papers dans des conférences top-tier et déployé des modèles ML en production utilisés par 10M+ utilisateurs. Passionnée par l\'éthique en IA.',
        },
        styles: {},
      },
      {
        type: 'code-snippet',
        content: {
          title: 'Transformer Model Fine-tuning',
          code: 'import torch\nfrom transformers import AutoModelForSequenceClassification, Trainer\n\nmodel = AutoModelForSequenceClassification.from_pretrained("bert-base")\ntrainer = Trainer(\n  model=model,\n  args=training_args,\n  train_dataset=train_dataset,\n  eval_dataset=eval_dataset\n)\ntrainer.train()',
          language: 'python',
        },
        styles: {},
        theme: 'code-technical',
        animation: 'fade-glow',
      },
      {
        type: 'stack',
        content: {
          skills: [
            { name: 'TensorFlow & PyTorch', level: 97 },
            { name: 'NLP & LLMs', level: 95 },
            { name: 'SQL & BigQuery', level: 93 },
            { name: 'ML Engineering & MLOps', level: 94 },
          ],
        },
        styles: {},
        theme: 'stack-technical',
      },
    ],
  },
  {
    id: 'mobile-dev',
    name: 'Mobile Developer',
    description: 'iOS, Android & Cross-Platform',
    icon: '📱',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'James Rodriguez',
          role: 'Mobile Engineering Lead',
          email: 'james@mobileinnovation.dev',
          github: 'github.com/jamesrodriguez-mobile',
        },
        styles: {},
        theme: 'header-mobile',
        animation: 'slide-in-right',
      },
      {
        type: 'text',
        content: {
          text: 'Lead mobile engineer avec 11 ans d\'expérience. Expert en Swift, Kotlin et React Native. Conçu et déployé 15 applications iOS avec +50M downloads. Spécialisé en performance optimization, offline-first architectures et user experience mobile exceptionnelle.',
        },
        styles: {},
      },
      {
        type: 'stack',
        content: {
          skills: [
            { name: 'Swift & iOS Architecture', level: 96 },
            { name: 'Kotlin & Android', level: 94 },
            { name: 'React Native & Cross-Platform', level: 92 },
            { name: 'Performance & Battery Optimization', level: 95 },
          ],
        },
        styles: {},
        theme: 'stack-mobile',
      },
    ],
  },
  {
    id: 'gamedev',
    name: 'Game Developer',
    description: 'Moteurs & Jeux 3D/2D',
    icon: '🎮',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Lucas Knight',
          role: 'Game Developer & Engine Architect',
          email: 'lucas@gamedev-studios.com',
          github: 'github.com/lucasknight-games',
        },
        styles: {},
        theme: 'header-neon',
        animation: 'neon-pulse',
      },
      {
        type: 'text',
        content: {
          text: 'Game developer senior avec 13 ans d\'expérience en création de jeux AAA et indie. Expert en Unity et Unreal Engine. Créateur de jeux ayant générés 5M$ de revenue et 2M+ joueurs actifs. Passionné par game design innovant et optimisation graphique.',
        },
        styles: {},
      },
      {
        type: 'terminal',
        content: {
          lines: [
            { label: '> ', value: 'Compiling game engine in production mode...' },
            { label: '$ ', value: 'unity build -target StandaloneWindows64 -development false' },
            { label: '✓ ', value: 'Build complete - 850MB executable' },
            { label: '$ ', value: 'profiler --capture-frame=60 --analyze fps' },
            { label: '✓ ', value: 'Stable 120fps @ 1440p - GPU-bound' },
          ],
        },
        styles: {},
        theme: 'terminal-neon',
        animation: 'slide-glow',
      },
      {
        type: 'stack',
        content: {
          skills: [
            { name: 'Unity & C#', level: 98 },
            { name: 'Unreal Engine & C++', level: 94 },
            { name: 'Game Design & Physics', level: 96 },
            { name: 'Graphics & Optimization', level: 95 },
          ],
        },
        styles: {},
        theme: 'stack-neon',
      },
    ],
  },
  {
    id: 'freelancer',
    name: 'Freelancer Pro',
    description: 'Polyvalent & Multi-projets',
    icon: '🚀',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Sarah Johnson',
          role: 'Fullstack Developer & Technical Consultant',
          email: 'sarah@freelance-elite.io',
          github: 'github.com/sarahjohnson-tech',
        },
        styles: {},
        theme: 'header-aurora',
        animation: 'aurora-shift',
      },
      {
        type: 'text',
        content: {
          text: 'Freelance developer senior avec 10 ans d\'expérience en gestion de projets complexes et diversifiés. Ayant livré 100+ projets avec taux de satisfaction client de 98%. Expert en fullstack, solutions cloud et transformation digitale. Actuellement dirigeant une team de 5 développeurs freelance.',
        },
        styles: {},
      },
      {
        type: 'timeline',
        content: {
          events: [
            { year: '2024', title: 'Freelance Team Lead', company: 'Elite Dev Collective' },
            { year: '2022', title: 'Senior Freelancer', company: 'Independent Consultant' },
            { year: '2019', title: 'Full-time Senior Dev', company: 'TechStartup Inc' },
            { year: '2016', title: 'Developer', company: 'WebAgency Pro' },
          ],
        },
        styles: {},
        theme: 'timeline-aurora',
        animation: 'fade-in-up',
      },
    ],
  },
  {
    id: 'startup-cto',
    name: 'Startup CTO',
    description: 'Fondateur & Innovation',
    icon: '⚙️',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'David Chen',
          role: 'CTO & Co-founder',
          email: 'david@aistartup.io',
          github: 'github.com/davidchen-founder',
        },
        styles: {},
        theme: 'header-corporate',
        animation: 'fade-in',
      },
      {
        type: 'text',
        content: {
          text: 'Fondateur et CTO d\'une startup IA Series-A avec 25M$ de financement. Ancien engineer chez Google avec 8 ans d\'expérience. Focus sur machine learning, product development et leadership technique. Notre plateforme est utilisée par 500+ entreprises du Fortune 1000.',
        },
        styles: {},
      },
      {
        type: 'code-snippet',
        content: {
          title: 'Core Optimization Algorithm',
          code: 'async function optimizePortfolio(metrics, constraints) {\n  const baseline = await fetchHistoricalData();\n  const normalized = metrics.map(m => m / baseline);\n  const filtered = normalized.filter(x => x > threshold);\n  return await solver.solve(filtered, constraints, { precision: 0.0001 });\n}',
          language: 'javascript',
        },
        styles: {},
        theme: 'code-aurora',
        animation: 'fade-glow',
      },
    ],
  },
  {
    id: 'webmaster',
    name: 'Web Master Créatif',
    description: 'Design & Performance',
    icon: '🌈',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Nina Rossi',
          role: 'Creative Web Technologist',
          email: 'nina@web-artistry.design',
          github: 'github.com/ninarossi-creative',
        },
        styles: {},
        theme: 'header-gradient',
        animation: 'wave-flow',
      },
      {
        type: 'text',
        content: {
          text: 'Web developer créatif fusionnant design d\'exception et performance technique. Passionnée par Three.js, animations avancées et expériences utilisateur extraordinaires. Créé des sites avec +95 Lighthouse scores et animations fluides 60fps. Speaker dans 8 conférences internationales.',
        },
        styles: {},
      },
      {
        type: 'stack',
        content: {
          skills: [
            { name: 'React & Next.js', level: 95 },
            { name: 'Three.js & WebGL', level: 94 },
            { name: 'Tailwind & CSS Advanced', level: 97 },
            { name: 'Web Performance & Animation', level: 96 },
          ],
        },
        styles: {},
        theme: 'stack-gradient',
        animation: 'aurora-shift',
      },
    ],
  },
  {
    id: 'security-expert',
    name: 'Cybersecurity Expert',
    description: 'Sécurité & Pentest',
    icon: '🔐',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Viktor Sokolov',
          role: 'Chief Security Officer',
          email: 'viktor@cyber-defense.pro',
          github: 'github.com/viktorsokolov-ciso',
        },
        styles: {},
        theme: 'header-dark',
        animation: 'matrix-glow',
      },
      {
        type: 'text',
        content: {
          text: 'CISO avec 15 ans d\'expérience en cybersécurité et gouvernance IT. Expert en penetration testing, zero-trust architecture et compliance (SOC2, HIPAA, GDPR). Ayant sécurisé l\'infrastructure de 200+ entreprises. Ancien hacker reconverti en défenseur - comprends les deux côtés.',
        },
        styles: {},
      },
      {
        type: 'terminal',
        content: {
          lines: [
            { label: '$ ', value: 'nmap -sV -A -p- --script vuln target.com' },
            { label: '> ', value: 'Running comprehensive security scan...' },
            { label: '⚠️  ', value: 'CVE-2024-1234: CRITICAL - RCE vulnerability' },
            { label: '$ ', value: 'metasploit > exploit -module CVE-2024-1234' },
            { label: '✓ ', value: 'Vulnerability remediated & verified' },
          ],
        },
        styles: {},
        theme: 'terminal-matrix',
        animation: 'fade-glow',
      },
      {
        type: 'stack',
        content: {
          skills: [
            { name: 'Penetration Testing & RedTeam', level: 98 },
            { name: 'Cryptography & Auth', level: 96 },
            { name: 'Incident Response', level: 94 },
            { name: 'Compliance & Governance', level: 93 },
          ],
        },
        styles: {},
        theme: 'stack-dark',
      },
    ],
  },
  {
    id: 'architect',
    name: 'Solutions Architect',
    description: 'Architecture & Stratégie',
    icon: '🏗️',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Catherine Moreau',
          role: 'Principal Solutions Architect',
          email: 'catherine@enterprise-architecture.com',
          github: 'github.com/catherinemoreau-sa',
        },
        styles: {},
        theme: 'header-corporate',
        animation: 'fade-in-down',
      },
      {
        type: 'text',
        content: {
          text: 'Architecte logiciel principal avec 18 ans d\'expérience. Spécialisée en architecture de systèmes distribués complexes, scalabilité et haute disponibilité. Designer de l\'infrastructure technique de 50+ entreprises Fortune 500. Expert reconnu en DDD, CQRS et microservices patterns.',
        },
        styles: {},
      },
      {
        type: 'timeline',
        content: {
          events: [
            { year: '2023', title: 'Principal Solutions Architect', company: 'Global Tech Corp' },
            { year: '2020', title: 'Senior Systems Architect', company: 'CloudScale Inc' },
            { year: '2017', title: 'Tech Lead & Architect', company: 'FinTech Solutions' },
            { year: '2014', title: 'Senior Developer', company: 'Enterprise Systems' },
          ],
        },
        styles: {},
        theme: 'timeline-corporate',
        animation: 'slide-in-right',
      },
    ],
  },
  {
    id: 'devrel',
    name: 'Developer Advocate',
    description: 'Communauté & Engagement',
    icon: '📢',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Alex Taylor',
          role: 'Principal Developer Advocate',
          email: 'alex@dev-community.io',
          github: 'github.com/alextaylor-devrel',
        },
        styles: {},
        theme: 'header-aurora',
        animation: 'fade-in-up',
      },
      {
        type: 'text',
        content: {
          text: 'Developer Advocate senior passionné par la communauté open-source et l\'éducation technique. Créateur de 100+ tutoriels vidéo vus 5M+ fois. Speaker invité à 20+ conférences tech internationales. Contributeur majeur à 8 projets open-source avec 1M+ stars combinés.',
        },
        styles: {},
      },
      {
        type: 'stack',
        content: {
          skills: [
            { name: 'Technical Writing & Content', level: 96 },
            { name: 'Public Speaking & Events', level: 95 },
            { name: 'Community Leadership', level: 94 },
            { name: 'Full Stack Development', level: 91 },
          ],
        },
        styles: {},
        theme: 'stack-aurora',
        animation: 'pulse-glow',
      },
    ],
  },
  {
    id: 'frontend-expert',
    name: 'Frontend Expert',
    description: 'React & Performance',
    icon: '🎨',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Lisa Chen',
          role: 'Principal Frontend Engineer',
          email: 'lisa@frontend-innovation.dev',
          github: 'github.com/lisachen-frontend',
        },
        styles: {},
        theme: 'header-gradient',
        animation: 'fade-in-up',
      },
      {
        type: 'text',
        content: {
          text: 'Frontend engineer principal avec 12 ans d\'expertise en React, performance et accessibility. Lead architect de plusieurs design systems utilisés par 10M+ utilisateurs. Expert en Core Web Vitals, TypeScript strict mode et state management patterns avancés. Mentor de 30+ engineers.',
        },
        styles: {},
      },
      {
        type: 'code-snippet',
        content: {
          title: 'Advanced React Pattern',
          code: 'import { useMemo, useCallback } from \'react\';\n\nconst OptimizedComponent = React.memo(({ data }) => {\n  const memoizedValue = useMemo(() => \n    expensiveComputation(data), [data]\n  );\n  \n  const callback = useCallback(() => {\n    handleOptimizedClick(memoizedValue);\n  }, [memoizedValue]);\n  \n  return <div onClick={callback}>{memoizedValue}</div>;\n});',
          language: 'javascript',
        },
        styles: {},
        theme: 'code-aurora',
        animation: 'fade-glow',
      },
      {
        type: 'stack',
        content: {
          skills: [
            { name: 'React & Next.js Mastery', level: 98 },
            { name: 'TypeScript & Advanced Patterns', level: 97 },
            { name: 'Performance & Bundle Optimization', level: 96 },
            { name: 'Accessibility & User Experience', level: 95 },
          ],
        },
        styles: {},
        theme: 'stack-gradient',
        animation: 'aurora-shift',
      },
    ],
  },
  {
    id: 'tech-writer',
    name: 'Technical Writer',
    description: 'Documentation & Content',
    icon: '📚',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Rachel Morgan',
          role: 'Principal Technical Writer',
          email: 'rachel@techwriting-pro.io',
          github: 'github.com/rachelmorgan-docs',
        },
        styles: {},
        theme: 'header-modern',
        animation: 'fade-in',
      },
      {
        type: 'text',
        content: {
          text: 'Technical writer senior avec 14 ans d\'expérience. Spécialisée en documentation API, guides d\'architecture et création de contenu éducatif. Crée la documentation pour 20+ produits majeurs. Passionnée par clarity, precision et user-centered writing. Mentor chez Write the Docs community.',
        },
        styles: {},
      },
      {
        type: 'code-snippet',
        content: {
          title: 'API Documentation Example',
          code: '/**\n * Fetches user data from the API\n * @param {string} userId - The unique user identifier\n * @param {Object} options - Optional configuration\n * @param {boolean} options.includeProfile - Include profile data\n * @returns {Promise<User>} User object with specified fields\n * @throws {AuthenticationError} If credentials are invalid\n */\nasync function fetchUser(userId, options = {}) {\n  return await api.get(`/users/${userId}`, options);\n}',
          language: 'javascript',
        },
        styles: {},
        theme: 'code-modern',
        animation: 'fade-in-up',
      },
    ],
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    description: 'Leadership Produit',
    icon: '🎯',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Michael Park',
          role: 'Senior Product Manager',
          email: 'michael@product-leadership.co',
          github: 'github.com/michaelpark-product',
        },
        styles: {},
        theme: 'header-corporate',
      },
      {
        type: 'text',
        content: {
          text: 'Product Manager senior avec 11 ans d\'expérience en leadership produit. Spécialisé en stratégie produit, product-market fit et go-to-market. Lancé 5 produits multi-millions de dollars. Mentor de 15+ product managers. Passionné par data-driven decision making et customer obsession.',
        },
        styles: {},
      },
      {
        type: 'timeline',
        content: {
          events: [
            { year: '2024', title: 'Senior PM', company: 'TechProduct Corp' },
            { year: '2022', title: 'Product Manager', company: 'StartupScale (Series B)' },
            { year: '2020', title: 'Associate PM', company: 'CloudServices Inc' },
            { year: '2018', title: 'PM - Growth', company: 'WebServices Platform' },
          ],
        },
        styles: {},
        theme: 'timeline-corporate',
        animation: 'slide-in-right',
      },
    ],
  },
  {
    id: 'blockchain-dev',
    name: 'Blockchain Developer',
    description: 'Web3 & Smart Contracts',
    icon: '⛓️',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Satoshi Nakamoto',
          role: 'Senior Blockchain Engineer',
          email: 'satoshi@web3-builders.io',
          github: 'github.com/satoshi-blockchain',
        },
        styles: {},
        theme: 'header-neon',
        animation: 'neon-pulse',
      },
      {
        type: 'text',
        content: {
          text: 'Blockchain engineer senior avec 8 ans d\'expertise Web3 et DeFi. Architecte de protocoles générant 2B$ TVL. Expert en Solidity, Cairo et Move. Contributeur à Ethereum, Solana et Cosmos. Passionné par cryptoeconomics, security audits et composability.',
        },
        styles: {},
      },
      {
        type: 'code-snippet',
        content: {
          title: 'ERC-721 NFT Contract',
          code: 'pragma solidity ^0.8.19;\nimport "@openzeppelin/contracts/token/ERC721/ERC721.sol";\nimport "@openzeppelin/contracts/access/Ownable.sol";\n\ncontract AdvancedNFT is ERC721, Ownable {\n  uint256 private _tokenIdCounter;\n  \n  function mint(address to) public onlyOwner {\n    _safeMint(to, _tokenIdCounter++);\n  }\n}',
          language: 'solidity',
        },
        styles: {},
        theme: 'code-neon',
        animation: 'fade-glow',
      },
    ],
  },
  {
    id: 'ar-vr-dev',
    name: 'AR/VR Developer',
    description: 'Expériences Immersives',
    icon: '🥽',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Jordan Quest',
          role: 'XR Lead Engineer',
          email: 'jordan@immersive-tech.io',
          github: 'github.com/jordanquest-xr',
        },
        styles: {},
        theme: 'header-aurora',
        animation: 'aurora-shift',
      },
      {
        type: 'text',
        content: {
          text: 'XR engineer senior spécialisé en créations d\'expériences immersives exceptionnelles. Expert en Unity, Unreal, WebXR et 3D modeling. Créé des expériences AR pour 3M+ utilisateurs. Passionné par computer vision, spatial computing et futur des interfaces humain-machine.',
        },
        styles: {},
      },
      {
        type: 'stack',
        content: {
          skills: [
            { name: 'Unity & C# XR', level: 96 },
            { name: 'Unreal Engine', level: 91 },
            { name: 'WebXR & Three.js', level: 89 },
            { name: '3D Modeling & Animation', level: 94 },
          ],
        },
        styles: {},
        theme: 'stack-aurora',
        animation: 'wave-flow',
      },
    ],
  },
  {
    id: 'cloud-architect',
    name: 'Cloud Architect',
    description: 'Infrastructure Cloud Scale',
    icon: '☁️',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Dr. Cloud Wang',
          role: 'Principal Cloud Architect',
          email: 'cloud@cloud-scale-solutions.io',
          github: 'github.com/cloudwang-architect',
        },
        styles: {},
        theme: 'header-dark',
      },
      {
        type: 'text',
        content: {
          text: 'Cloud architect principal avec 16 ans d\'expérience en conception d\'infrastructures cloud massives. Designer de solutions cloud pour 100+ entreprises. Expert en cost optimization, disaster recovery et multi-cloud strategies. Ayant économisé 500M$ aux clients en cloud optimization.',
        },
        styles: {},
      },
      {
        type: 'terminal',
        content: {
          lines: [
            { label: '$ ', value: 'terraform plan -var-file=production.tfvars' },
            { label: '> ', value: 'Planning infrastructure with 1,200 resources...' },
            { label: '✓ ', value: 'Plan complete - 0 errors' },
            { label: '$ ', value: 'terraform apply -auto-approve' },
            { label: '✓ ', value: 'Infrastructure deployed - 99.999% SLA' },
          ],
        },
        styles: {},
        theme: 'terminal-dark',
        animation: 'matrix-glow',
      },
    ],
  },
  {
    id: 'indie-dev',
    name: 'Indie Developer',
    description: 'Créateur Indépendant',
    icon: '🎪',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Casey Studios',
          role: 'Indie Game Developer',
          email: 'casey@indie-games-studio.io',
          github: 'github.com/caseyindiegames',
        },
        styles: {},
        theme: 'header-neon',
        animation: 'pulse-blue',
      },
      {
        type: 'text',
        content: {
          text: 'Développeur indie passionné créant des jeux innovants avec Godot. Créateur de 3 jeux vendus 500K+ fois générant 2.5M$ de revenue. Spécialisé en game design créatif, optimisation et community engagement. Advocat de l\'open-source et l\'indie game movement.',
        },
        styles: {},
      },
      {
        type: 'code-snippet',
        content: {
          title: 'GDScript Game Logic',
          code: 'extends CharacterBody2D\n\nvar speed = 200.0\nvar velocity = Vector2.ZERO\n\nfunc _physics_process(delta):\n  velocity.x = Input.get_axis("ui_left", "ui_right") * speed\n  velocity.y = Input.get_axis("ui_up", "ui_down") * speed\n  velocity = move_and_slide(velocity)\n  emit_signal("position_changed", position)',
          language: 'gdscript',
        },
        styles: {},
        theme: 'code-neon',
        animation: 'slide-glow',
      },
    ],
  },
  {
    id: 'consultant',
    name: 'Tech Consultant',
    description: 'Transformation & Stratégie',
    icon: '💼',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Alexandra Consulting',
          role: 'Principal Tech Consultant',
          email: 'alex@consulting-excellence.pro',
          github: 'github.com/alexandraconsult-cto',
        },
        styles: {},
        theme: 'header-corporate',
        animation: 'fade-in-down',
      },
      {
        type: 'text',
        content: {
          text: 'Consultant technologique principal avec 16 ans d\'expérience en transformation digitale et stratégie. Aidé 150+ entreprises à moderniser leurs architectures et optimiser leurs opérations. Expert en change management, technology strategy et organizational transformation.',
        },
        styles: {},
      },
      {
        type: 'timeline',
        content: {
          events: [
            { year: '2024', title: 'Principal Consultant', company: 'Global Tech Partners' },
            { year: '2021', title: 'Senior Consultant', company: 'Digital Transformation Inc' },
            { year: '2018', title: 'Technology Strategist', company: 'Enterprise Solutions' },
            { year: '2014', title: 'Senior Consultant', company: 'McKinsey & Co' },
          ],
        },
        styles: {},
        theme: 'timeline-corporate',
      },
    ],
  },
  {
    id: 'growth-engineer',
    name: 'Growth Engineer',
    description: 'Analytics & Optimisation',
    icon: '📈',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Priya Singh',
          role: 'Senior Growth Engineer',
          email: 'priya@growth-hacking.tech',
          github: 'github.com/priyasingh-growth',
        },
        styles: {},
        theme: 'header-gradient',
        animation: 'fade-in-up',
      },
      {
        type: 'text',
        content: {
          text: 'Growth engineer senior avec fusion de développement et data science. Expérience en scaling 5 produits de 0 à 10M+ users. Expert en experimentation, A/B testing, analytics et growth loops. Ayant augmenté les conversions de 350% grâce à optimisations data-driven.',
        },
        styles: {},
      },
      {
        type: 'stack',
        content: {
          skills: [
            { name: 'A/B Testing & Experimentation', level: 97 },
            { name: 'Analytics & SQL', level: 96 },
            { name: 'Python & Data Science', level: 94 },
            { name: 'Product Analytics & Funnel Optimization', level: 95 },
          ],
        },
        styles: {},
        theme: 'stack-gradient',
        animation: 'pulse-glow',
      },
    ],
  },
  {
    id: 'rust-systems',
    name: 'Systems Programmer',
    description: 'Rust & Low-level',
    icon: '⚙️',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Thor Rustsson',
          role: 'Senior Systems Programmer',
          email: 'thor@systems-programming.dev',
          github: 'github.com/thorrust-systems',
        },
        styles: {},
        theme: 'header-dark',
        animation: 'slide-in-left',
      },
      {
        type: 'text',
        content: {
          text: 'Systems programmer senior passionné par Rust et l\'optimisation extrême. Expert en OS development, concurrent systems et embedded programming. Contributeur majeur au projet Rust. Créé des systèmes handling 100K+ connections concurrentes avec <1ms latency.',
        },
        styles: {},
      },
      {
        type: 'code-snippet',
        content: {
          title: 'Rust Concurrent System',
          code: 'use tokio::task;\nuse std::sync::Arc;\n\n#[tokio::main]\nasync fn main() {\n  let data = Arc::new(vec![1,2,3]);\n  let mut handles = vec![];\n  \n  for _ in 0..10 {\n    let data_clone = Arc::clone(&data);\n    let handle = task::spawn(async move {\n      process_data(&data_clone).await\n    });\n    handles.push(handle);\n  }\n}',
          language: 'rust',
        },
        styles: {},
        theme: 'code-dark',
        animation: 'matrix-glow',
      },
    ],
  },
  {
    id: 'devops-expert',
    name: 'DevOps Specialist',
    description: 'CI/CD & Automation',
    icon: '🔄',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Elena DevOps',
          role: 'Senior DevOps Engineer',
          email: 'elena@devops-excellence.io',
          github: 'github.com/elenadevops-pro',
        },
        styles: {},
        theme: 'header-dark',
        animation: 'spin-slow',
      },
      {
        type: 'text',
        content: {
          text: 'DevOps engineer senior avec 10 ans d\'expertise en CI/CD et infrastructure automation. Designer de pipelines déployant 1000+ fois par jour avec 99.99% success rate. Expert en GitOps, containerization et observability. Ayant réduit deployment time de 4h à 5 minutes.',
        },
        styles: {},
      },
      {
        type: 'terminal',
        content: {
          lines: [
            { label: '$ ', value: 'docker-compose up -d' },
            { label: '> ', value: 'Building 24 microservices in parallel...' },
            { label: '✓ ', value: '24 services running - health checks passed' },
            { label: '$ ', value: 'curl -I http://localhost:3000/health' },
            { label: '< ', value: 'HTTP/1.1 200 OK - All systems operational' },
          ],
        },
        styles: {},
        theme: 'terminal-dark',
        animation: 'fade-glow',
      },
    ],
  },
  {
    id: 'ml-researcher',
    name: 'ML Researcher',
    description: 'Research & Innovation',
    icon: '🧠',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Dr. Alice Yang',
          role: 'Senior ML Research Scientist',
          email: 'alice.yang@ai-research-labs.com',
          github: 'github.com/draliceyang-research',
        },
        styles: {},
        theme: 'header-technical',
        animation: 'pulse-glow',
      },
      {
        type: 'text',
        content: {
          text: 'ML researcher senior avec PhD en machine learning. Publiée 12 papers dans venues top-tier (NeurIPS, ICML, ICLR). Experte en deep learning, reinforcement learning et frontier research. Ayant breakthroughs en efficient AI et few-shot learning.',
        },
        styles: {},
      },
      {
        type: 'code-snippet',
        content: {
          title: 'Vision Transformer Implementation',
          code: 'import torch\nimport torch.nn as nn\nfrom einops import rearrange\n\nclass ViT(nn.Module):\n  def __init__(self, image_size=224, patch_size=16, num_classes=1000):\n    super().__init__()\n    self.patch_embed = nn.Linear(3*patch_size*patch_size, 768)\n    self.transformer = nn.TransformerEncoder(...)\n    self.head = nn.Linear(768, num_classes)',
          language: 'python',
        },
        styles: {},
        theme: 'code-technical',
        animation: 'fade-glow',
      },
    ],
  },
  {
    id: 'fullstack-minimal',
    name: 'Fullstack Simple',
    description: 'Efficace & Direct',
    icon: '✨',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'John Developer',
          role: 'Fullstack Engineer',
          email: 'john@simpledev.io',
          github: 'github.com/johndeveloper',
        },
        styles: {},
        theme: 'header-modern',
        animation: 'fade-in',
      },
      {
        type: 'text',
        content: {
          text: 'Développeur fullstack avec 9 ans d\'expérience. Spécialisé dans la création d\'applications web robustes et scalables. Pragmatique et efficace - j\'aime les solutions simples qui marchent. Passionné par craft et continuous improvement.',
        },
        styles: {},
      },
      {
        type: 'stack',
        content: {
          skills: [
            { name: 'React & Node.js', level: 94 },
            { name: 'TypeScript', level: 93 },
            { name: 'PostgreSQL & MongoDB', level: 91 },
            { name: 'AWS & Docker', level: 90 },
          ],
        },
        styles: {},
        theme: 'stack-modern',
      },
    ],
  },
  {
    id: 'css-artist',
    name: 'CSS Wizard',
    description: 'Animations & Visual Magic',
    icon: '🎨',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Stella Animator',
          role: 'Creative Technologist',
          email: 'stella@css-artistry.io',
          github: 'github.com/stella-cssartist',
        },
        styles: {},
        theme: 'header-gradient',
        animation: 'wave-flow',
      },
      {
        type: 'text',
        content: {
          text: 'CSS artist et creative technologist obsédée par les animations pixel-perfect. Expert en SVG, Canvas et performance optimization. Créé des expériences visuelles époustouflantes utilisées par 20M+ utilisateurs. Speaker dans 12 conférences internationales sur web animation.',
        },
        styles: {},
      },
      {
        type: 'stack',
        content: {
          skills: [
            { name: 'CSS Advanced & Animations', level: 99 },
            { name: 'SVG & Canvas', level: 96 },
            { name: 'Motion Design & UX Animation', level: 97 },
            { name: 'WebGL & Three.js', level: 93 },
          ],
        },
        styles: {},
        theme: 'stack-gradient',
        animation: 'aurora-shift',
      },
    ],
  },
  {
    id: 'api-specialist',
    name: 'API Architect',
    description: 'API Design & Integration',
    icon: '🔌',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Marcus API',
          role: 'Principal API Architect',
          email: 'marcus@api-design-excellence.io',
          github: 'github.com/marcusapi-architect',
        },
        styles: {},
        theme: 'header-modern',
        animation: 'slide-in-right',
      },
      {
        type: 'text',
        content: {
          text: 'API architect senior avec expertise en design d\'APIs performantes et intuitives. Designer de 15+ APIs publiques utilisées par 10K+ développeurs. Expert en REST, GraphQL, gRPC et API versioning. Passionné par developer experience et documentation.',
        },
        styles: {},
      },
      {
        type: 'code-snippet',
        content: {
          title: 'REST API Architecture',
          code: 'GET    /api/v2/users              # List all users\nPOST   /api/v2/users              # Create user\nGET    /api/v2/users/:id           # Get user by ID\nPUT    /api/v2/users/:id           # Update user\nDELETE /api/v2/users/:id           # Delete user\nGET    /api/v2/users?role=admin&active=true  # Filter\n\n// Response format\n{ "status": 200, "data": {...}, "meta": { "timestamp": 1234567890 } }',
          language: 'bash',
        },
        styles: {},
        theme: 'code-modern',
        animation: 'fade-in-up',
      },
    ],
  },
  {
    id: 'retro-80s',
    name: 'Retrowave 1984',
    description: 'Ambiance Synthwave & Néon',
    icon: '🌴',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Tommy Vercetti',
          role: 'Cyber-Architect',
          email: 'tommy@vice-city.net',
          github: 'github.com/tommy-retro',
        },
        styles: {},
        theme: 'header-synthwave',
        animation: 'float',
      },
      {
        type: 'terminal',
        content: {
          lines: [
            { label: 'C:\\> ', value: 'LOAD "CYBER_CORE",8,1' },
            { label: 'SEARCHING...', value: 'FOUND CYBER_CORE' },
            { label: 'LOADING...', value: 'READY.' },
            { label: 'C:\\> ', value: 'RUN' },
          ],
        },
        styles: {},
        theme: 'terminal-synthwave',
        animation: 'neon-flicker',
      },
      {
        type: 'stack',
        content: {
          skills: [
            { name: 'C++ & Low Level', level: 99 },
            { name: 'Assembly x86', level: 90 },
            { name: 'Network Protocols', level: 95 },
          ],
        },
        styles: {},
        theme: 'stack-synthwave',
        animation: 'zoom-in',
      },
    ],
  },
  {
    id: 'github-standard',
    name: 'GitHub Profile',
    description: 'Clean, clair, et rassurant',
    icon: '🐈‍⬛',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Linus OpenSource',
          role: 'Open Source Maintainer',
          email: 'linus@oss-foundation.org',
          github: 'github.com/linus-oss',
        },
        styles: {},
        theme: 'header-github-light',
        animation: 'fade-in-down',
      },
      {
        type: 'text',
        content: {
          text: 'Développeur Open Source à plein temps. Je maintiens plusieurs librairies TypeScript majeures utilisées par des millions de développeurs chaque mois. Passionné par l\'accessibilité, le typage strict et la DX (Developer Experience).',
        },
        styles: {},
        theme: 'text-github',
        animation: 'fade-in',
      },
      {
        type: 'code-snippet',
        content: {
          title: 'src/core/index.ts',
          code: 'export function createRouter<T extends Routes>(routes: T): Router<T> {\n  return new RouterImpl(routes);\n}\n\n// Type-safe routing\nconst router = createRouter({\n  home: "/",\n  user: "/users/:id"\n});',
          language: 'typescript',
        },
        styles: {},
        theme: 'code-github-dark',
        animation: 'fade-in-up',
      },
      {
        type: 'timeline',
        content: {
          events: [
            { year: '2024', title: 'Core Team Member', company: 'TypeScript Foundation' },
            { year: '2020', title: 'Senior Software Engineer', company: 'Vercel' },
          ],
        },
        styles: {},
        theme: 'timeline-github',
      },
    ],
  }
];
