// src/lib/exportZip.ts
import JSZip from 'jszip';

export async function downloadZip(htmlBody: string, css: string, js: string, fontUrl: string, filename = 'mon-portfolio.zip') {
  const zip = new JSZip();

  const fullHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mon Portfolio DevFolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="${fontUrl}" rel="stylesheet" />
  <link rel="stylesheet" href="main.css">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
</head>
<body>
  <main>
${htmlBody}
  </main>
  <script src="app.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
</body>
</html>`;

  // Ajout des fichiers à l'archive
  zip.file('index.html', fullHtml);
  zip.file('main.css', css);
  zip.file('app.js', js);

  // Génération asynchrone et téléchargement
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Nettoyage de la mémoire
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}