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

/**
 * Importe un projet depuis une URL GitHub (raw.githubusercontent.com)
 * Exemple: https://raw.githubusercontent.com/username/repo/branch/path/to/project.json
 * Ou simplement: username/repo/branch/path (sera converti automatiquement)
 */
export async function importProjectFromGithub(githubUrl: string): Promise<ProjectData | null> {
  try {
    let url = githubUrl.trim();
    
    // Convertir le format raccourci en URL raw GitHub
    if (!url.includes('http')) {
      // Format: username/repo/branch/path/to/project.json
      const parts = url.split('/');
      if (parts.length >= 3) {
        const username = parts[0];
        const repo = parts[1];
        const branch = parts[2];
        const filePath = parts.slice(3).join('/');
        url = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${filePath || 'project.json'}`;
      } else {
        throw new Error('Format GitHub invalide. Utilisez: username/repo/branch/chemin/vers/project.json');
      }
    }

    // Ajouter /raw ou convertir vers raw.githubusercontent.com si nécessaire
    if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
      url = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    }

    // Récupérer le fichier
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: Fichier non trouvé sur GitHub`);
    }

    const projectData: ProjectData = await response.json();

    if (!projectData.blocks || !projectData.settings) {
      console.error('Format de fichier JSON invalide');
      return null;
    }

    return projectData;
  } catch (error) {
    console.error('Erreur lors de l\'import depuis GitHub:', error);
    throw error;
  }
}
