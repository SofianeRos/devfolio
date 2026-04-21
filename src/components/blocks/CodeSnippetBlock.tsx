import type { Block } from '../../types.ts';
import { useBuilderStore } from '../../store/useBuilderStore.ts';
import { getThemeById } from '../../lib/themes.ts';
import { Copy } from 'lucide-react';
import { useState } from 'react';

export default function CodeSnippetBlock({ block }: { block: Block }) {
  const updateBlock = useBuilderStore((state) => state.updateBlock);
  const theme = block.theme ? getThemeById(block.theme) : null;
  const [copied, setCopied] = useState(false);
  
  const {
    title = 'Code Example',
    code = 'function hello() {\n  console.log("Hello, World!");\n}',
    language = 'javascript'
  } = (block.content || {}) as { title?: string; code?: string; language?: string };

  const handleTitleChange = (newTitle: string) => {
    updateBlock(block.id, {
      content: { ...block.content, title: newTitle }
    });
  };

  const handleCodeChange = (newCode: string) => {
    updateBlock(block.id, {
      content: { ...block.content, code: newCode }
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    updateBlock(block.id, {
      content: { ...block.content, language: newLanguage }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const LANGUAGE_OPTIONS = ['javascript', 'typescript', 'python', 'rust', 'solidity', 'gdscript', 'bash', 'html', 'css', 'sql', 'java', 'go'];
  const bgColor = theme?.colors?.bg || '#1e293b';
  const textColor = theme?.colors?.text || '#cbd5e1';
  const accentColor = block.styles?.accentColor || theme?.colors?.accent || '#818cf8';

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between gap-2">
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="flex-1 px-2 py-1 bg-slate-700 text-slate-200 rounded outline-none focus:ring-2 ring-indigo-500/30 text-sm font-semibold"
          placeholder="Titre du code"
        />
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="px-2 py-1 bg-slate-700 text-slate-200 rounded outline-none focus:ring-2 ring-indigo-500/30 text-xs"
        >
          {LANGUAGE_OPTIONS.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <button
          onClick={handleCopy}
          className={`p-2 rounded transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'hover:bg-slate-700 text-slate-400'}`}
          title="Copier le code"
        >
          <Copy size={14} />
        </button>
      </div>

      <div className="relative rounded overflow-hidden">
        <textarea
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="w-full h-40 p-3 rounded font-mono text-xs outline-none focus:ring-2 ring-indigo-500/30 resize-none"
          placeholder="Votre code ici..."
          spellCheck="false"
          style={{ backgroundColor: bgColor, color: textColor }}
        />
        <div className="absolute top-2 right-2 text-xs" style={{ color: accentColor }}>
          {code.split('\n').length} lignes
        </div>
      </div>

      <div className="text-xs text-slate-500 italic">
        💡 Astuce: Editez directement le code et le langage
      </div>
    </div>
  );
}
