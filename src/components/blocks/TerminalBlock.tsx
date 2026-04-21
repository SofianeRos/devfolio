// src/components/blocks/TerminalBlock.tsx
import type { Block } from '../../types.ts';
import { useBuilderStore } from '../../store/useBuilderStore';

export default function TerminalBlock({ block }: { block: Block }) {
  const updateBlock = useBuilderStore((state) => state.updateBlock);

  // Données par défaut
  const lines = block.content.lines || [
    { label: 'whoami', value: 'Passionné par l\'architecture logicielle et le Clean Code.' },
    { label: 'location', value: 'Paris, France' },
    { label: 'status', value: 'En recherche d\'opportunités Fullstack React/Node.' }
  ];

  const handleUpdate = (index: number, field: 'label' | 'value', text: string) => {
    const newLines = [...lines];
    newLines[index][field] = text;
    updateBlock(block.id, { content: { lines: newLines } });
  };

  return (
    <div className="w-full bg-[#1e1e1e] rounded-lg overflow-hidden shadow-2xl border border-slate-700 font-mono">
      {/* Barre de titre du terminal */}
      <div className="bg-[#333] px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-xs text-slate-400 ml-2">bash — 80x24</span>
      </div>

      {/* Contenu du terminal */}
      <div className="p-6 text-sm sm:text-base">
        {lines.map((line: any, index: number) => (
          <div key={index} className="mb-3 flex flex-col sm:flex-row gap-1">
            <div className="flex items-center">
              <span className="text-emerald-400 mr-2">➜</span>
              <span className="text-cyan-400 mr-2">~</span>
              <span 
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleUpdate(index, 'label', e.currentTarget.innerText)}
                className="text-indigo-300 outline-none border-b border-transparent focus:border-indigo-500 cursor-text"
              >
                {line.label}
              </span>
            </div>
            <div 
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdate(index, 'value', e.currentTarget.innerText)}
              className="text-slate-200 outline-none flex-1 cursor-text"
            >
              {line.value}
            </div>
          </div>
        ))}
        
        {/* Curseur clignotant simulant l'attente */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-emerald-400">➜</span>
          <span className="text-cyan-400">~</span>
          <span className="w-2.5 h-5 bg-slate-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
