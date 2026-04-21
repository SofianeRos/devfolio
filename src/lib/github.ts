// src/lib/github.ts

export interface DeployResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Permet d'encoder en Base64 proprement, même avec des caractères spéciaux (UTF-8)
function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function deployToGithub(
  token: string,
  repoName: string,
  files: { path: string; content: string }[]
): Promise<DeployResult> {
  try {
    const headers = {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };

    // 1. Obtenir les infos de l'utilisateur
    const userRes = await fetch('https://api.github.com/user', { headers });
    if (!userRes.ok) throw new Error('Token GitHub invalide ou expiré.');
    const user = await userRes.json();
    const owner = user.login;

    // 2. Créer le dépôt sur GitHub
    const createRepoRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: repoName,
        description: 'Portfolio statique généré automatiquement par DevFolio Builder ✨',
        auto_init: true, // Crée automatiquement le premier commit et la branche par défaut
        homepage: `https://${owner}.github.io/${repoName}/`,
      }),
    });

    if (!createRepoRes.ok) {
      const errData = await createRepoRes.json();
      if (errData.errors?.[0]?.message === 'name already exists on this account') {
        throw new Error(`Le dépôt "${repoName}" existe déjà sur votre compte GitHub. Choisissez un autre nom !`);
      }
      throw new Error('Erreur lors de la création du dépôt GitHub.');
    }

    // Petite pause pour s'assurer que GitHub a bien initialisé le dépôt en arrière-plan
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // 3. Uploader chaque fichier (HTML, CSS, JS) dans le dépôt
    for (const file of files) {
      await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${file.path}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: `Deploy: Ajout de ${file.path} 🚀`,
          content: utf8ToBase64(file.content),
        }),
      });
    }

    // 4. Activer GitHub Pages sur le dépôt
    await fetch(`https://api.github.com/repos/${owner}/${repoName}/pages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ source: { branch: 'main', path: '/' } }),
    });

    return { success: true, url: `https://${owner}.github.io/${repoName}/` };
  } catch (error: any) {
    return { success: false, error: error.message || 'Une erreur inconnue est survenue.' };
  }
}