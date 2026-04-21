// src/components/TemplateSelector.tsx
import { useBuilderStore } from '../store/useBuilderStore';
import { v4 as uuid } from 'uuid';
import type { Block } from '../types.ts';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  blocks: Omit<Block, 'id'>[];
}

const TEMPLATES: Template[] = [
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Design épuré et professionnel',
    icon: '✨',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Nom Développeur',
          role: 'Fullstack Developer',
          email: 'dev@example.com',
          github: 'github.com/yourprofile',
        },
        styles: {},
        theme: 'header-modern',
      },
      {
        type: 'text',
        content: {
          text: 'Bienvenue sur mon portfolio. Je suis un développeur passionné par la création d\'applications web modernes.',
        },
        styles: {},
      },
      {
        type: 'terminal',
        content: {
          lines: [
            { label: '$ ', value: 'npm run build' },
            { label: '> ', value: 'Building production bundle...' },
            { label: '✓ ', value: 'Build completed successfully' },
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
    description: 'Style cyberpunk avec animations',
    icon: '🌌',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Dev404',
          role: 'Creative Developer',
          email: 'dev@cyber.io',
          github: 'github.com/dev404',
        },
        styles: {},
        theme: 'header-neon',
      },
      {
        type: 'terminal',
        content: {
          lines: [
            { label: '> ', value: 'Initializing neural network...' },
            { label: '> ', value: 'Loading creative algorithms...' },
            { label: '✓ ', value: 'System online' },
          ],
        },
        styles: {},
        theme: 'terminal-cyberpunk',
      },
      {
        type: 'code-snippet',
        content: {
          language: 'typescript',
          code: 'const createMagic = () => {\n  return "infinity";\n};',
        },
        styles: {},
        theme: 'code-radical',
      },
      {
        type: 'stack',
        content: {
          skills: ['React', 'TypeScript', 'Tailwind', 'Node.js'],
        },
        styles: {},
        theme: 'stack-neon',
      },
    ],
  },
  {
    id: 'professional',
    name: 'Professionnel',
    description: 'Portfolio d\'entreprise classique',
    icon: '💼',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Jean Dupont',
          role: 'Senior Software Engineer',
          email: 'jean.dupont@company.com',
          github: 'github.com/jeandupont',
        },
        styles: {},
        theme: 'header-gradient',
      },
      {
        type: 'text',
        content: {
          text: '10 ans d\'expérience dans le développement de solutions web scalables. Spécialisé en architecture microservices et DevOps.',
        },
        styles: {},
      },
      {
        type: 'timeline',
        content: {
          entries: [
            {
              date: '2023 - Présent',
              title: 'Senior Developer',
              description: 'TechCorp Inc.',
            },
            {
              date: '2020 - 2023',
              title: 'Lead Developer',
              description: 'WebSolutions Ltd.',
            },
            {
              date: '2018 - 2020',
              title: 'Full Stack Developer',
              description: 'StartUp XYZ',
            },
          ],
        },
        styles: {},
        theme: 'timeline-cards',
      },
      {
        type: 'stack',
        content: {
          skills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS'],
        },
        styles: {},
        theme: 'stack-grid',
      },
    ],
  },
  {
    id: 'creative',
    name: 'Créatif Aurora',
    description: 'Design avec gradients animés',
    icon: '🎨',
    blocks: [
      {
        type: 'header',
        content: {
          name: 'Luna Creative',
          role: 'Creative Developer',
          email: 'luna@creative.dev',
          github: 'github.com/luna-creative',
        },
        styles: {},
        theme: 'header-aurora',
      },
      {
        type: 'text',
        content: {
          text: 'Développeuse créative passionnée par l\'art et la technologie. Je crée des expériences web captivantes et mémorables.',
        },
        styles: {},
      },
      {
        type: 'terminal',
        content: {
          lines: [
            { label: '✨ ', value: 'Rendering creative visions...' },
            { label: '🎨 ', value: 'Applying aurora effects...' },
            { label: '🚀 ', value: 'Launching masterpiece' },
          ],
        },
        styles: {},
        theme: 'terminal-aurora',
      },
      {
        type: 'code-snippet',
        content: {
          language: 'css',
          code: '@keyframes aurora {\n  0% { opacity: 0; }\n  100% { opacity: 1; }\n}',
        },
        styles: {},
        theme: 'code-tokyonight',
      },
      {
        type: 'stack',
        content: {
          skills: ['React', 'Three.js', 'GSAP', 'Figma', 'Blender'],
        },
        styles: {},
        theme: 'stack-aurora',
      },
    ],
  },
];

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
}

export default function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-8 text-white">📚 Choisir un template</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className="group relative overflow-hidden bg-slate-800 border-2 border-slate-700 rounded-xl p-6 hover:border-indigo-500 transition-all hover:shadow-xl hover:shadow-indigo-500/20 text-left"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-pink-600/0 group-hover:from-indigo-600/10 group-hover:to-pink-600/10 transition-all" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{template.icon}</span>
                <div>
                  <h4 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {template.name}
                  </h4>
                  <p className="text-sm text-slate-400">{template.description}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase">Contient:</p>
                <div className="flex flex-wrap gap-2">
                  {template.blocks.map((block, idx) => {
                    const icons: Record<string, string> = {
                      header: '📋',
                      terminal: '🖥️',
                      code: '💻',
                      timeline: '📅',
                      stack: '🎯',
                      text: '📝',
                    };
                    return (
                      <span key={idx} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                        {icons[block.type as any] || '📦'} {block.type}
                      </span>
                    );
                  })}
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white rounded font-semibold text-sm transition-all transform group-hover:scale-105">
                Utiliser ce template →
              </button>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Export pour pouvoir utiliser les templates
export { TEMPLATES };
