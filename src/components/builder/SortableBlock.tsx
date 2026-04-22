// src/components/builder/SortableBlock.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Block } from '../../types.ts';
import { GripVertical, Trash2 } from 'lucide-react';
import { useBuilderStore } from '../../store/useBuilderStore.ts';
import HeaderBlock from '../blocks/HeaderBlock.tsx';
import TerminalBlock from '../blocks/TerminalBlock.tsx';
import TextBlock from '../blocks/TextBlock.tsx';
import StackBlock from '../blocks/StackBlock.tsx';
import TimelineBlock from '../blocks/TimelineBlock.tsx';
import CodeSnippetBlock from '../blocks/CodeSnippetBlock.tsx';
import CertificationsBlock from '../blocks/CertificationsBlock.tsx';
import SocialLinksBlock from '../blocks/SocialLinksBlock.tsx';
import MediaBlock from '../blocks/MediaBlock.tsx';
import FAQBlock from '../blocks/FAQBlock.tsx';

// Mapping des noms d'animations aux classes Tailwind
const ANIMATION_CLASS_MAP: Record<string, string> = {
  'fade-in': 'animate-fade-in',
  'fade-in-up': 'animate-fade-in-up',
  'fade-in-down': 'animate-fade-in-down',
  'slide-in-right': 'animate-slide-in-right',
  'slide-in-left': 'animate-slide-in-left',
  'pulse-glow': 'animate-pulse-glow',
  'fade-glow': 'animate-fade-glow',
  'slide-glow': 'animate-slide-glow',
  'neon-pulse': 'animate-neon',
  'pulse-blue': 'animate-pulse-blue',
  'galaxy-glow': 'animate-galaxy',
  'aurora-shift': 'animate-aurora',
  'lava-flow': 'animate-lava',
  'wave-flow': 'animate-ocean',
  'sunset-glow': 'animate-sunset',
  'forest-glow': 'animate-forest',
  'matrix-glow': 'animate-matrix',
  'neon-border': 'animate-neon-border',
  'pulse-fast': 'animate-pulse-fast',
  'spin-slow': 'animate-spin-slow',
  'code-glow': 'animate-code-glow',
};

export default function SortableBlock({ block }: { block: Block }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const removeBlock = useBuilderStore((s) => s.removeBlock);
  const selectBlock = useBuilderStore((s) => s.selectBlock);
  const selectedBlockId = useBuilderStore((s) => s.selectedBlockId);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = selectedBlockId === block.id;
  
  // Récupérer la classe d'animation correspondante
  const animationClass = block.animation ? ANIMATION_CLASS_MAP[block.animation] || '' : '';

  // Mapping des composants
  const renderBlockContent = () => {
    switch (block.type) {
      case 'header':
        return <HeaderBlock block={block} />;
      case 'terminal':
        return <TerminalBlock block={block} />;
      case 'text':
        return <TextBlock block={block} />;
      case 'stack':
        return <StackBlock block={block} />;
      case 'timeline':
        return <TimelineBlock block={block} />;
      case 'code-snippet':
        return <CodeSnippetBlock block={block} />;
      case 'certifications':
        return <CertificationsBlock block={block as any} />;
      case 'social-links':
        return <SocialLinksBlock block={block as any} />;
      case 'media':
        return <MediaBlock block={block as any} />;
      case 'faq':
        return <FAQBlock block={block as any} />;
      default:
        return (
          <div className="p-4 bg-slate-900/50 rounded border border-slate-700 italic text-slate-500">
            Composant {block.type} non reconnu
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => selectBlock(block.id)}
      className={`group relative bg-slate-800 border-2 rounded-xl p-2 cursor-pointer transition-all ${
        isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-transparent hover:border-slate-700'
      } ${animationClass}`}
    >
      {/* Poignée de déplacement */}
      <div {...attributes} {...listeners} className="absolute -left-3 top-1/2 -translate-y-1/2 p-2 bg-slate-700 rounded-md opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity">
        <GripVertical size={14} />
      </div>

      {/* Bouton supprimer */}
      <button 
        onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
        className="absolute -right-2 -top-2 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 size={14} />
      </button>

      <div className="text-xs font-mono text-indigo-400 mb-2 uppercase tracking-widest">{block.type}</div>
      
      <div 
        className="p-4 transition-all duration-300"
        style={{
          backgroundColor: block.styles?.backgroundColor,
          color: block.styles?.textColor,
          borderRadius: block.styles?.borderRadius,
          padding: block.styles?.padding,
        }}
      >
        {renderBlockContent()}
      </div>
    </div>
  );
}
