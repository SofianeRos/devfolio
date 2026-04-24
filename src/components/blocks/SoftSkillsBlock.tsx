import type { Block } from '../../types.ts';
import { useBuilderStore } from '../../store/useBuilderStore.ts';
import { getThemeById } from '../../lib/themes.ts';
import { Plus, Trash2 } from 'lucide-react';

export default function SoftSkillsBlock({ block }: { block: Block }) {
  const updateBlock = useBuilderStore((state) => state.updateBlock);
  const theme = block.theme ? getThemeById(block.theme) : null;
  const skills = (block.content?.skills || [
    { name: 'Communication', level: 90 },
    { name: 'Leadership', level: 85 },
  ]) as Array<{ name: string; level: number }>;

  const handleSkillChange = (index: number, field: 'name' | 'level', value: string | number) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [field]: field === 'level' ? Number(value) : value };
    updateBlock(block.id, { content: { ...block.content, skills: newSkills } });
  };

  const handleAddSkill = () => {
    updateBlock(block.id, {
      content: { ...block.content, skills: [...skills, { name: 'Nouveau Soft Skill', level: 80 }] }
    });
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    updateBlock(block.id, { content: { ...block.content, skills: newSkills } });
  };

  const barColor = block.styles?.accentColor || theme?.colors?.accent || '#6366f1';

  return (
    <div className={`w-full space-y-4 transition-all ${theme?.customClass || 'p-2'}`}>
      <h2 className="text-xl font-bold mb-4" style={{ color: block.styles?.textColor || '#ffffff' }}>
        Soft Skills
      </h2>
      {skills.map((skill, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <input
              value={skill.name}
              onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
              className="flex-1 px-2 py-1 bg-slate-700 text-slate-200 rounded outline-none focus:ring-2 ring-indigo-500/30 text-sm"
              placeholder="Nom du soft skill"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={skill.level}
              onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
              className="w-16 px-2 py-1 bg-slate-700 text-slate-200 rounded outline-none focus:ring-2 ring-indigo-500/30 text-sm text-center"
            />
            <span className="text-xs text-slate-500 w-8">{skill.level}%</span>
            <button
              onClick={() => handleRemoveSkill(index)}
              className="p-1 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full transition-all"
              style={{ width: `${skill.level}%`, backgroundColor: barColor }}
            />
          </div>
        </div>
      ))}
      <button
        onClick={handleAddSkill}
        className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded transition-colors text-sm"
      >
        <Plus size={14} /> Ajouter un soft skill
      </button>
    </div>
  );
}
