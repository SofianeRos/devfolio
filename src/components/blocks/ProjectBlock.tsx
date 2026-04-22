import type { Block } from '../../types.ts';
import { useBuilderStore } from '../../store/useBuilderStore.ts';
import { getThemeById } from '../../lib/themes.ts';
import { Plus, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProjectBlock({ block }: { block: Block }) {
  const updateBlock = useBuilderStore((state) => state.updateBlock);
  const theme = block.theme ? getThemeById(block.theme) : null;
  const initialProjects = (block.content?.projects || [
    { 
      title: 'E-commerce Platform', 
      description: 'Application fullstack avec panier temps réel et paiement Stripe.', 
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&q=80', 
      link: 'https://github.com', 
      tags: 'Next.js, TypeScript, Tailwind' 
    },
    { 
      title: 'SaaS Dashboard', 
      description: 'Interface d\'administration B2B avec graphiques et gestion d\'utilisateurs.', 
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80', 
      link: 'https://github.com', 
      tags: 'React, Vite, Supabase' 
    }
  ]) as Array<{ title: string; description: string; image: string; link: string; tags: string }>;

  const [localProjects, setLocalProjects] = useState(initialProjects);
  useEffect(() => { setLocalProjects(initialProjects); }, [initialProjects]);

  const handleProjectChange = (index: number, field: string, value: string) => {
    const newProjects = [...localProjects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setLocalProjects(newProjects);
  };

  const handleBlur = () => {
    updateBlock(block.id, { content: { ...block.content, projects: localProjects } });
  };

  const handleAddProject = () => {
    updateBlock(block.id, {
      content: { 
        ...block.content, 
        projects: [...localProjects, { title: 'Nouveau Projet', description: 'Description courte du projet...', image: '', link: '', tags: 'Tag1, Tag2' }] 
      }
    });
  };

  const handleRemoveProject = (index: number) => {
    const newProjects = localProjects.filter((_, i) => i !== index);
    updateBlock(block.id, { content: { ...block.content, projects: newProjects } });
  };

  const accentColor = block.styles?.accentColor || theme?.colors?.accent || '#6366f1';
  const textColor = block.styles?.textColor || theme?.colors?.text || '#cbd5e1';

  return (
    <div className={`w-full transition-all ${theme?.customClass || 'p-2'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {localProjects.map((project, index) => (
          <div key={index} className="flex flex-col border border-slate-700/50 rounded-xl overflow-hidden bg-slate-800/40 relative group shadow-sm hover:shadow-lg transition-all hover:border-slate-600">
            
            {/* Section Image */}
            <div className="relative h-40 bg-slate-900 border-b border-slate-700/50 flex flex-col">
              {project.image ? (
                 <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-30 transition-opacity duration-300" />
              ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-600"><ImageIcon size={32}/></div>
              )}
              
              {/* Input URL Image (Visible au survol) */}
              <div className="absolute inset-0 p-3 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/60 backdrop-blur-sm">
                 <label className="text-[10px] text-slate-300 font-semibold mb-1 uppercase">URL de l'image</label>
                 <input value={project.image} onChange={(e) => handleProjectChange(index, 'image', e.target.value)} onBlur={handleBlur} placeholder="https://..." className="text-xs w-full bg-slate-800 text-white border border-slate-600 p-2 rounded outline-none focus:border-indigo-500" />
              </div>
            </div>

            {/* Section Contenu */}
            <div className="p-4 flex-1 flex flex-col gap-2">
               <input value={project.title} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} onBlur={handleBlur} placeholder="Titre du projet" className="font-bold text-lg bg-transparent outline-none w-full border-b border-transparent focus:border-indigo-500/50 transition-colors" style={{ color: accentColor }} />
               <textarea value={project.description} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} onBlur={handleBlur} placeholder="Description de la réalisation..." className="text-sm bg-transparent outline-none resize-none h-16 w-full border-b border-transparent focus:border-indigo-500/50 transition-colors" style={{ color: textColor }} />
               
               <div className="mt-auto pt-2 space-y-2">
                 <input value={project.tags} onChange={(e) => handleProjectChange(index, 'tags', e.target.value)} onBlur={handleBlur} placeholder="Tags (séparés par virgules)" className="text-xs bg-slate-900/50 text-slate-300 p-1.5 rounded outline-none w-full border border-slate-700/50 focus:border-indigo-500/50 transition-colors" />
                 <div className="flex items-center gap-2 px-1.5 py-1 bg-slate-900/30 rounded border border-slate-700/50">
                   <ExternalLink size={12} className="text-slate-500" />
                   <input value={project.link} onChange={(e) => handleProjectChange(index, 'link', e.target.value)} onBlur={handleBlur} placeholder="Lien (ex: https://github.com/...)" className="text-xs bg-transparent text-slate-400 outline-none w-full" />
                 </div>
               </div>
            </div>

            {/* Bouton Supprimer */}
            <button onClick={() => handleRemoveProject(index)} className="absolute top-2 right-2 p-1.5 bg-red-500/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg" title="Supprimer">
              <Trash2 size={14}/>
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleAddProject} className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl transition-all shadow-sm">
        <Plus size={16} /> Ajouter un nouveau projet
      </button>
    </div>
  );
}