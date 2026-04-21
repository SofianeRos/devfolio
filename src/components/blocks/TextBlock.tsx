import type { Block } from '../../types.ts';
import { useBuilderStore } from '../../store/useBuilderStore.ts';
import { getThemeById } from '../../lib/themes.ts';

export default function TextBlock({ block }: { block: Block }) {
  const updateBlock = useBuilderStore((state) => state.updateBlock);
  const theme = block.theme ? getThemeById(block.theme) : null;
  const text = (block.content?.text || "Ajoutez votre texte ici...") as string;

  const handleTextChange = (newText: string) => {
    updateBlock(block.id, {
      content: { ...block.content, text: newText }
    });
  };

  const textColor = block.styles?.textColor || theme?.colors?.text || '#cbd5e1';

  return (
    <div className={`w-full transition-all ${theme?.customClass || 'p-2'}`}>
      <p
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => handleTextChange(e.currentTarget.innerText)}
        className="text-lg leading-relaxed outline-none focus:ring-2 ring-indigo-500/30 rounded px-3 py-2 cursor-text hover:bg-slate-700/30 min-h-20 transition-colors"
        style={{ color: textColor }}
      >
        {text}
      </p>
    </div>
  );
}
