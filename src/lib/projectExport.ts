// src/lib/projectExport.ts
import JSZip from 'jszip';
import type { Block } from '../types';

interface ProjectData {
  version: string;
  exportDate: string;
  blocks: Block[];
  settings: {
    fontFamily: string;
    backgroundColor: string;
  };
}

/**
 * Exporte le projet (tous les blocs et settings) en JSON compressé dans un ZIP
 */
export async function exportProject(blocks: Block[], settings: any, projectName = 'mon-portfolio') {
  const projectData: ProjectData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    blocks,
    settings,
  };

  const zip = new JSZip();
  zip.file('project.json', JSON.stringify(projectData, null, 2));

  // Génération et téléchargement
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `${projectName}-devfolio.zip`;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Importe un projet depuis un fichier ZIP
 */
export async function importProject(file: File): Promise<ProjectData | null> {
  try {
    const zip = new JSZip();
    await zip.loadAsync(file);

    const projectFile = zip.file('project.json');
    if (!projectFile) {
      console.error('Fichier project.json non trouvé dans le ZIP');
      return null;
    }

    const jsonText = await projectFile.async('text');
    const projectData: ProjectData = JSON.parse(jsonText);

    // Validation basique
    if (!projectData.blocks || !projectData.settings) {
      console.error('Format de projet invalide');
      return null;
    }

    return projectData;
  } catch (error) {
    console.error('Erreur lors de l\'import du projet:', error);
    return null;
  }
}

/**
 * Importe un projet depuis un fichier JSON local
 */
export async function importProjectFromJson(file: File): Promise<ProjectData | null> {
  try {
    const text = await file.text();
    const projectData: ProjectData = JSON.parse(text);

    if (!projectData.blocks || !projectData.settings) {
      console.error('Format de fichier JSON invalide');
      return null;
    }

    return projectData;
  } catch (error) {
    console.error('Erreur lors de l\'import du JSON:', error);
    return null;
  }
}
