// src/components/blocks/TerminalBlock.tsx
import type { Block } from '../../types.ts';
import { useBuilderStore } from '../../store/useBuilderStore.ts';
import { getThemeById } from '../../lib/themes.ts';

export default function TerminalBlock({ block }: { block: Block }) {
  const updateBlock = useBuilderStore((state) => state.updateBlock);

  // Récupérer le thème appliqué
  const theme = block.theme ? getThemeById(block.theme) : null;

  // Données par défaut
  const lines = block.content?.lines || [
    { label: 'whoami', value: 'Passionné par l\'architecture logicielle et le Clean Code.' },
    { label: 'location', value: 'Paris, France' },
    { label: 'status', value: 'En recherche d\'opportunités Fullstack React/Node.' }
  ];

  const handleUpdate = (index: number, field: 'label' | 'value', text: string) => {
    const newLines = [...lines];
    newLines[index][field] = text;
    updateBlock(block.id, { content: { lines: newLines } });
  };

  // Déterminer les classes en fonction du thème
  const getTerminalClasses = () => {
    if (!theme) {
      return 'w-full bg-[#1e1e1e] rounded-lg overflow-hidden shadow-2xl border border-slate-700 font-mono';
    }
    return `w-full ${theme.customClass || ''} overflow-hidden font-mono`;
  };

  const getTextColor = () => block.styles?.textColor || theme?.colors.text || '#e0e0e0';
  const getAccentColor = () => block.styles?.accentColor || theme?.colors.accent || '#61dafb';
  const getSecondaryColor = () => theme?.colors.secondary || '#27c93f';

  return (
    <div className={getTerminalClasses()}>
      {/* Barre de titre du terminal */}
      <div className={`${theme?.id === 'terminal-hacker' ? 'bg-black' : 'bg-[#333]'} px-4 py-2 flex items-center gap-2`}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-xs text-slate-400 ml-2">bash — 80x24</span>
      </div>

      {/* Contenu du terminal */}
      <div className="p-6 text-sm sm:text-base" style={{ color: getTextColor() }}>
        {lines.map((line: any, index: number) => (
          <div key={index} className="mb-3 flex flex-col sm:flex-row gap-1">
            <div className="flex items-center">
              <span style={{ color: getSecondaryColor() }} className="mr-2">➜</span>
              <span style={{ color: getAccentColor() }} className="mr-2">~</span>
              <span 
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleUpdate(index, 'label', e.currentTarget.innerText)}
                className="outline-none border-b border-transparent focus:border-indigo-500 cursor-text"
                style={{ color: getAccentColor() }}
              >
                {line.label}
              </span>
            </div>
            <div 
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdate(index, 'value', e.currentTarget.innerText)}
              className="outline-none flex-1 cursor-text"
              style={{ color: getTextColor() }}
            >
              {line.value}
            </div>
          </div>
        ))}
        
        {/* Curseur clignotant simulant l'attente */}
        <div className="flex items-center gap-2 mt-2">
          <span style={{ color: getSecondaryColor() }}>➜</span>
          <span style={{ color: getAccentColor() }}>~</span>
          <span className="w-2.5 h-5 bg-slate-400 animate-pulse" style={{ backgroundColor: getAccentColor() }} />
        </div>
      </div>

      {/* Affichage du thème appliqué */}
      {theme && (
        <div className="px-4 py-2 bg-black/20 text-xs text-slate-400 border-t border-slate-700/50">
          Thème: <span className="text-indigo-400">{theme.name}</span>
        </div>
      )}
    </div>
  );
}
