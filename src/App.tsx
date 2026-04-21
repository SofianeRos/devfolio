// src/App.tsx
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBuilderStore } from './store/useBuilderStore';
import Sidebar from './components/builder/Sidebar';
import Canvas from './components/builder/Canvas';
import PropertiesPanel from './components/builder/PropertiesPanel';

export default function App() {
  const { blocks, reorderBlocks } = useBuilderStore();

  // Fonction déclenchée quand on lâche un bloc après l'avoir déplacé
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderBlocks(active.id as string, over.id as string);
    }
  };

  return (
    <div className="flex h-screen w-full bg-builder-bg overflow-hidden text-slate-300">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        
        {/* 1. Barre latérale gauche : Catalogue de blocs */}
        <Sidebar />

        {/* 2. Zone centrale : Le CV en cours de construction */}
        <main className="flex-1 overflow-y-auto p-12 bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
              <Canvas />
            </SortableContext>
          </div>
        </main>

        {/* 3. Barre latérale droite : Paramètres du bloc sélectionné */}
        <PropertiesPanel />

      </DndContext>
    </div>
  );
}
