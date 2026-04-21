// src/components/builder/Canvas.tsx
import { useBuilderStore } from '../../store/useBuilderStore';
import SortableBlock from './SortableBlock';

export default function Canvas() {
  const blocks = useBuilderStore((state) => state.blocks);

  if (blocks.length === 0) {
    return (
      <div className="border-2 border-dashed border-slate-700 rounded-2xl p-20 text-center">
        <p className="text-slate-500">Glissez un bloc ici ou cliquez sur la sidebar pour commencer</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block) => (
        <SortableBlock key={block.id} block={block} />
      ))}
    </div>
  );
}
