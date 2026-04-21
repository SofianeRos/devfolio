// src/components/blocks/HeaderBlock.tsx
import { Code, Mail } from 'lucide-react';
import type { Block } from '../../types.ts';
import { useBuilderStore } from '../../store/useBuilderStore.ts';
import { getThemeById } from '../../lib/themes.ts';

export default function HeaderBlock({ block }: { block: Block }) {
  const updateBlock = useBuilderStore((state) => state.updateBlock);
  const theme = block.theme ? getThemeById(block.theme) : null;

  // Valeurs par défaut si le contenu est vide
  const { 
    name = "Ton Nom", 
    role = "Fullstack Developer", 
    email = "contact@stack.dev",
    github = "github.com/username" 
  } = block.content || {};

  const handleBlur = (field: string, value: string) => {
    updateBlock(block.id, {
      content: { ...block.content, [field]: value }
    });
  };

  const accentColor = block.styles?.accentColor || theme?.colors?.accent || '#818cf8';
  const textColor = block.styles?.textColor || theme?.colors?.text || '#e2e8f0';

  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all ${theme?.customClass || 'p-2'}`}>
      <div>
        <h1 
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleBlur('name', e.currentTarget.innerText)}
          className="text-4xl font-bold outline-none focus:ring-2 ring-indigo-500/30 rounded px-1 cursor-text hover:bg-slate-700/30 transition-colors"
          style={{ color: textColor }}
        >
          {name}
        </h1>
        <p 
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleBlur('role', e.currentTarget.innerText)}
          className="text-xl font-mono mt-1 outline-none focus:ring-2 ring-indigo-500/30 rounded px-1 cursor-text hover:bg-slate-700/30 transition-colors"
          style={{ color: accentColor }}
        >
          {role}
        </p>
      </div>

      <div className="flex flex-wrap gap-4" style={{ color: textColor }}>
        <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Mail size={16} />
          <span 
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('email', e.currentTarget.innerText)}
            className="text-sm outline-none focus:ring-2 ring-indigo-500/30 rounded px-1 cursor-text hover:bg-slate-700/30 transition-colors"
          >
            {email}
          </span>
        </div>
        <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Code size={16} />
          <span 
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('github', e.currentTarget.innerText)}
            className="text-sm outline-none focus:ring-2 ring-indigo-500/30 rounded px-1 cursor-text hover:bg-slate-700/30 transition-colors"
          >
            {github}
          </span>
        </div>
      </div>
    </div>
  );
}
