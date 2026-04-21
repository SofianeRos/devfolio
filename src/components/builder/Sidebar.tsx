// src/components/builder/Sidebar.tsx
import { Terminal, Layout, Type, List, Cpu, Code } from 'lucide-react';
import { useBuilderStore } from '../../store/useBuilderStore';
import type { BlockType } from '../../types.ts';

const BLOCK_LIBRARY: { type: BlockType; label: string; icon: any }[] = [
  { type: 'header', label: 'En-tête', icon: Layout },
  { type: 'terminal', label: 'Console', icon: Terminal },
  { type: 'stack', label: 'Compétences', icon: Cpu },
  { type: 'timeline', label: 'Expérience', icon: List },
  { type: 'code-snippet', label: 'Code', icon: Code },
  { type: 'text', label: 'Texte', icon: Type },
];

export default function Sidebar() {
  const addBlock = useBuilderStore((state) => state.addBlock);

  return (
    <aside className="w-64 border-r border-builder-border bg-builder-panel p-4 flex flex-col gap-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Composants</h2>
      <div className="grid grid-cols-1 gap-2">
        {BLOCK_LIBRARY.map((item) => (
          <button
            key={item.type}
            onClick={() => addBlock(item.type)}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-indigo-600 transition-colors group"
          >
            <item.icon size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
