// src/components/builder/Canvas.tsx
import { useBuilderStore } from '../../store/useBuilderStore.ts';
import SortableBlock from './SortableBlock.tsx';
import { useDroppable } from '@dnd-kit/core';

export default function Canvas() {
  const blocks = useBuilderStore((state) => state.blocks);
  const { setNodeRef } = useDroppable({ id: 'canvas-droppable' });

  if (blocks.length === 0) {
    return (
      <div ref={setNodeRef} className="border-2 border-dashed border-slate-700 rounded-2xl p-20 text-center flex-1">
        <p className="text-slate-500">Glissez un bloc ici ou cliquez sur la sidebar pour commencer</p>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} className="flex flex-col gap-4 min-h-[50vh] pb-32">
      {blocks.map((block) => (
        <SortableBlock key={block.id} block={block} />
      ))}
    </div>
  );
}
