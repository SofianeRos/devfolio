// src/components/builder/PropertiesPanel.tsx
import { useBuilderStore } from '../../store/useBuilderStore';

export default function PropertiesPanel() {
  const { selectedBlockId, blocks } = useBuilderStore();

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  return (
    <aside className="w-80 border-l border-builder-border bg-builder-panel p-4 flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Propriétés</h2>
      
      {!selectedBlock ? (
        <div className="text-slate-500 text-sm italic">
          Sélectionnez un bloc pour voir ses propriétés
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">Type</label>
            <div className="text-sm text-slate-300 mt-1 p-2 bg-slate-800 rounded">
              {selectedBlock.type}
            </div>
          </div>
          
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">ID</label>
            <div className="text-xs text-slate-400 mt-1 p-2 bg-slate-800 rounded font-mono">
              {selectedBlock.id}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <p className="text-slate-500 text-sm italic">
              Éditeur de propriétés (En attente d'implémentation)
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
