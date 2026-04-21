// src/components/builder/SortableBlock.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Block } from '../../types.ts';
import { GripVertical, Trash2 } from 'lucide-react';
import { useBuilderStore } from '../../store/useBuilderStore';
import HeaderBlock from '../blocks/HeaderBlock';

export default function SortableBlock({ block }: { block: Block }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const { removeBlock, selectBlock, selectedBlockId } = useBuilderStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = selectedBlockId === block.id;

  // Mapping des composants
  const renderBlockContent = () => {
    switch (block.type) {
      case 'header':
        return <HeaderBlock block={block} />;
      default:
        return (
          <div className="p-4 bg-slate-900/50 rounded border border-slate-700 italic text-slate-500">
            Composant {block.type} en cours de développement...
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
      }`}
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
      
      <div className="p-4">
        {renderBlockContent()}
      </div>
    </div>
  );
}
