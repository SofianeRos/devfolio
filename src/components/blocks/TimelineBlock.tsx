import type { Block } from '../../types.ts';
import { useBuilderStore } from '../../store/useBuilderStore.ts';
import { getThemeById } from '../../lib/themes.ts';
import { Plus, Trash2 } from 'lucide-react';

export default function TimelineBlock({ block }: { block: Block }) {
  const updateBlock = useBuilderStore((state) => state.updateBlock);
  const theme = block.theme ? getThemeById(block.theme) : null;
  const events = (block.content?.events || [
    { year: '2024', title: 'Position Actuelle', company: 'Current Company' },
    { year: '2022', title: 'Senior Role', company: 'Previous Company' },
  ]) as Array<{ year: string; title: string; company: string }>;

  const handleEventChange = (index: number, field: string, value: string) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    updateBlock(block.id, { content: { ...block.content, events: newEvents } });
  };

  const handleAddEvent = () => {
    updateBlock(block.id, {
      content: { ...block.content, events: [...events, { year: new Date().getFullYear().toString(), title: 'Nouveau Poste', company: 'Entreprise' }] }
    });
  };

  const handleRemoveEvent = (index: number) => {
    const newEvents = events.filter((_, i) => i !== index);
    updateBlock(block.id, { content: { ...block.content, events: newEvents } });
  };

  const accentColor = block.styles?.accentColor || theme?.colors?.accent || '#6366f1';
  const textColor = block.styles?.textColor || theme?.colors?.text || '#cbd5e1';

  return (
    <div className={`w-full space-y-6 transition-all ${theme?.customClass || 'p-2'}`}>
      {events.map((event, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div 
              className="w-3 h-3 rounded-full ring-4 ring-slate-800"
              style={{ backgroundColor: accentColor }}
            />
            {index < events.length - 1 && <div className="w-0.5 h-16 bg-slate-700 my-2" />}
          </div>
          <div className="flex-1 pb-4 space-y-2">
            <input
              value={event.year}
              onChange={(e) => handleEventChange(index, 'year', e.target.value)}
              className="px-2 py-1 bg-slate-700 text-slate-300 rounded outline-none focus:ring-2 ring-indigo-500/30 text-xs w-20"
              placeholder="Année"
            />
            <input
              value={event.title}
              onChange={(e) => handleEventChange(index, 'title', e.target.value)}
              className="w-full px-2 py-1 bg-slate-700 text-slate-200 rounded outline-none focus:ring-2 ring-indigo-500/30 text-sm font-semibold"
              placeholder="Titre du poste"
            />
            <input
              value={event.company}
              onChange={(e) => handleEventChange(index, 'company', e.target.value)}
              className="w-full px-2 py-1 bg-slate-700 text-slate-400 rounded outline-none focus:ring-2 ring-indigo-500/30 text-sm"
              placeholder="Entreprise"
            />
            <button
              onClick={() => handleRemoveEvent(index)}
              className="mt-2 px-2 py-1 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded transition-colors text-xs flex items-center gap-1"
            >
              <Trash2 size={12} /> Supprimer
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={handleAddEvent}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded transition-colors text-sm"
      >
        <Plus size={14} /> Ajouter une expérience
      </button>
    </div>
  );
}
