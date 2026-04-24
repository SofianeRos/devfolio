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
 * Importe un projet depuis une URL GitHub (raw.githubusercontent.com ou API GitHub)
 * Exemple: https://raw.githubusercontent.com/username/repo/branch/path/to/project.json
 * Ou simplement: username/repo/branch/path (sera converti automatiquement)
 * Token optionnel pour les repos privés ou pour éviter les rate limits
 */
export async function importProjectFromGithub(githubUrl: string, token?: string): Promise<ProjectData | null> {
  try {
    let url = githubUrl.trim();
    let owner = '';
    let repo = '';
    let branch = '';
    let filePath = '';

    // Parser le format raccourci: username/repo/branch/path/to/project.json
    if (!url.includes('http') && !url.includes('://')) {
      const parts = url.split('/');
      if (parts.length >= 3) {
        owner = parts[0];
        repo = parts[1];
        branch = parts[2];
        filePath = parts.slice(3).join('/') || 'project.json';
      } else {
        throw new Error('Format GitHub invalide. Utilisez: username/repo/branch/chemin/vers/project.json');
      }
    } else {
      // Parser les URL GitHub
      if (url.includes('raw.githubusercontent.com')) {
        // Format: https://raw.githubusercontent.com/username/repo/branch/path/to/file
        const match = url.match(/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.*)/);
        if (match) {
          owner = match[1];
          repo = match[2];
          branch = match[3];
          filePath = match[4] || 'project.json';
        } else {
          throw new Error('URL raw.githubusercontent.com invalide');
        }
      } else if (url.includes('github.com')) {
        // Format: https://github.com/username/repo/blob/branch/path/to/file
        const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.*)/);
        if (match) {
          owner = match[1];
          repo = match[2];
          branch = match[3];
          filePath = match[4] || 'project.json';
        } else {
          throw new Error('URL github.com invalide');
        }
      } else {
        throw new Error('URL GitHub non reconnue. Utilisez une URL github.com ou raw.githubusercontent.com');
      }
    }

    if (!owner || !repo || !branch || !filePath) {
      throw new Error('Impossible de parser l\'URL GitHub. Vérifiez le format.');
    }

    // Utiliser l'API GitHub pour récupérer le fichier
    // Cela évite les problèmes CORS et fonctionne mieux
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
    
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3.raw',
    };

    // Ajouter le token s'il est fourni (pour les repos privés ou rate limits)
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Fichier ${filePath} non trouvé dans ${owner}/${repo} (branche: ${branch})`);
      } else if (response.status === 403) {
        throw new Error('Accès refusé. Le repo est privé ou le token n\'est pas valide.');
      } else if (response.status === 422) {
        throw new Error('Branche ou fichier invalide');
      } else {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }
    }

    const projectData: ProjectData = await response.json();

    if (!projectData.blocks || !projectData.settings) {
      console.error('Format de fichier JSON invalide. Données reçues:', projectData);
      throw new Error('Format de fichier invalide. Le fichier doit contenir "blocks" et "settings".');
    }

    return projectData;
  } catch (error) {
    console.error('Erreur lors de l\'import depuis GitHub:', error);
    throw error;
  }
}
