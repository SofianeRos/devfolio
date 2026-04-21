// src/components/blocks/HeaderBlock.tsx
import { Code, ExternalLink, Mail } from 'lucide-react';
import type { Block } from '../../types.ts';
import { useBuilderStore } from '../../store/useBuilderStore';

export default function HeaderBlock({ block }: { block: Block }) {
  const updateBlock = useBuilderStore((state) => state.updateBlock);

  // Valeurs par défaut si le contenu est vide
  const { 
    name = "Ton Nom", 
    role = "Fullstack Developer", 
    email = "contact@stack.dev",
    github = "github.com/username" 
  } = block.content;

  const handleBlur = (field: string, value: string) => {
    updateBlock(block.id, {
      content: { ...block.content, [field]: value }
    });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleBlur('name', e.currentTarget.innerText)}
          className="text-4xl font-bold text-white outline-none focus:ring-2 ring-indigo-500/30 rounded px-1 cursor-text hover:bg-slate-700/50"
        >
          {name}
        </h1>
        <p 
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleBlur('role', e.currentTarget.innerText)}
          className="text-xl text-indigo-400 font-mono mt-1 outline-none focus:ring-2 ring-indigo-500/30 rounded px-1 cursor-text hover:bg-slate-700/50"
        >
          {role}
        </p>
      </div>

      <div className="flex flex-wrap gap-4 text-slate-400">
        <div className="flex items-center gap-2 hover:text-white transition-colors">
          <Mail size={16} />
          <span 
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('email', e.currentTarget.innerText)}
            className="text-sm outline-none focus:ring-2 ring-indigo-500/30 rounded px-1 cursor-text hover:bg-slate-700/50"
          >
            {email}
          </span>
        </div>
        <div className="flex items-center gap-2 hover:text-white transition-colors">
          <Code size={16} />
          <span 
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('github', e.currentTarget.innerText)}
            className="text-sm outline-none focus:ring-2 ring-indigo-500/30 rounded px-1 cursor-text hover:bg-slate-700/50"
          >
            {github}
          </span>
        </div>
      </div>
    </div>
  );
}
