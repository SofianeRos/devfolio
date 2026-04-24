// src/lib/outputGenerator.ts
import type { Block } from '../types.ts';
import { getThemeById } from './themes.ts';

const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// --- HTML Block Renderers ---

function renderHeader(block: Block): string {
  const { name = "Your Name", role = "Your Role", email = "your@email.com", github = "github.com/you" } = block.content;
  return `
    <header class="header-block">
      <div class="header-info">
        <h1 class="header-name">${escapeHtml(name)}</h1>
        <p class="header-role">${escapeHtml(role)}</p>
      </div>
      <div class="header-contact">
        <a href="mailto:${escapeHtml(email)}" class="contact-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <span>${escapeHtml(email)}</span>
        </a>
        <a href="https://${escapeHtml(github)}" target="_blank" rel="noopener noreferrer" class="contact-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
          <span>${escapeHtml(github)}</span>
        </a>
      </div>
    </header>
  `;
}

function renderText(block: Block): string {
    const { text = "Some text content." } = block.content;
    return `<div class="text-block"><p>${escapeHtml(text).replace(/\n/g, '<br>')}</p></div>`;
}

function renderTerminal(block: Block): string {
    const { lines = [] } = block.content as { lines: { label: string, value: string }[] };
    const linesHtml = lines.map(line => `
        <div class="line">
            <span class="prompt"><span class="prompt-arrow">➜</span> <span class="prompt-path">~</span> <span class="prompt-label">${escapeHtml(line.label)}</span></span>
            <span class="prompt-value" data-value="${escapeHtml(line.value)}"></span>
        </div>
    `).join('');
    return `
        <div class="terminal-block">
            <div class="terminal-header">
                <div class="dots"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></div>
                <div class="title">bash — 80x24</div>
            </div>
            <div class="terminal-body">${linesHtml}<div class="cursor"></div></div>
        </div>
    `;
}

function renderStack(block: Block): string {
  const { skills = [] } = block.content as { skills: { name: string, level: number }[] };
  const skillsHtml = skills.map(skill => `
    <div class="skill">
      <div class="skill-info">
        <span class="skill-name">${escapeHtml(skill.name)}</span>
        <span class="skill-level">${skill.level}%</span>
      </div>
      <div class="skill-bar-bg">
        <div class="skill-bar-fg" style="width: 0%;" data-target-width="${skill.level}%"></div>
      </div>
    </div>
  `).join('');
  return `<div class="stack-block">${skillsHtml}</div>`;
}

function renderTimeline(block: Block): string {
  const { title = '', events = [] } = block.content as { title?: string; events: { year: string, title: string, company: string }[] };
  const eventsHtml = events.map(event => `
    <div class="timeline-event">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="timeline-year">${escapeHtml(event.year)}</div>
        <h3 class="timeline-title">${escapeHtml(event.title)}</h3>
        <p class="timeline-company">${escapeHtml(event.company)}</p>
      </div>
    </div>
  `).join('<div class="timeline-line"></div>');
  const titleHtml = title ? `<h2 class="timeline-header">${escapeHtml(title)}</h2>` : '';
  return `<div class="timeline-block">${titleHtml}${eventsHtml}</div>`;
}

function renderCodeSnippet(block: Block): string {
  const { code = '', language = 'javascript', title = 'Code Snippet' } = block.content;
  return `
    <div class="code-snippet-block">
      <div class="code-header">
        <span>${escapeHtml(title)}</span>
        <span class="language">${escapeHtml(language)}</span>
      </div>
      <pre><code class="language-${escapeHtml(language)}">${escapeHtml(code)}</code></pre>
    </div>
  `;
}

function renderCertifications(block: Block): string {
  const { certifications = [] } = block.content as { certifications: { name: string, issuer: string, date: string }[] };
  const certsHtml = certifications.map(cert => `
    <div class="certification-item">
      <h3 class="cert-name">${escapeHtml(cert.name)}</h3>
      <p class="cert-issuer">${escapeHtml(cert.issuer)}</p>
      <p class="cert-date">${escapeHtml(cert.date)}</p>
    </div>
  `).join('');
  return `<div class="certifications-block"><h2>Certifications</h2>${certsHtml}</div>`;
}

function renderSocialLinks(block: Block): string {
  const { socialLinks = [] } = block.content as { socialLinks: { platform: string, url: string, label: string }[] };
  
  // Fonction pour formater les URLs
  const formatUrl = (platform: string, url: string): string => {
    const trimmedUrl = url.trim();
    
    if (platform === 'github') {
      if (!trimmedUrl.startsWith('http')) {
        return `https://github.com/${trimmedUrl}`;
      }
      return trimmedUrl;
    }
    
    if (platform === 'email') {
      if (trimmedUrl.includes('@') && !trimmedUrl.startsWith('mailto:')) {
        return `mailto:${trimmedUrl}`;
      }
      return trimmedUrl.startsWith('mailto:') ? trimmedUrl : `mailto:${trimmedUrl}`;
    }
    
    if (platform === 'linkedin' && !trimmedUrl.startsWith('http')) {
      return `https://linkedin.com/in/${trimmedUrl}`;
    }
    
    if (platform === 'twitter' && !trimmedUrl.startsWith('http')) {
      return `https://twitter.com/${trimmedUrl}`;
    }
    
    return trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;
  };
  
  // SVGs pour les icônes
  const getSocialIcon = (platform: string, color: string): string => {
    switch (platform) {
      case 'github':
        return `<svg fill="${color}" viewBox="0 0 24 24" width="28" height="28"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
      case 'linkedin':
        return `<svg fill="${color}" viewBox="0 0 24 24" width="28" height="28"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.435-.103.25-.129.599-.129.949v5.421h-3.554s.05-8.789 0-9.707h3.554v1.375c.425-.654 1.185-1.586 2.882-1.586 2.105 0 3.685 1.375 3.685 4.331v5.587zM5.337 8.855c-1.144 0-1.915-.761-1.915-1.712 0-.951.77-1.71 1.954-1.71 1.184 0 1.915.759 1.915 1.71 0 .951-.771 1.712-1.954 1.712zm1.6 11.597H3.73V9.557h3.207v10.895zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>`;
      case 'twitter':
        return `<svg fill="${color}" viewBox="0 0 24 24" width="28" height="28"><path d="M23.953 4.57a10 10 0 002.856-10.01 10.02 10.02 0 01-2.863.813 4.897 4.897 0 002.145-2.7c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a14.041 14.041 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>`;
      case 'email':
        return `<svg fill="${color}" viewBox="0 0 24 24" width="28" height="28"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;
      case 'website':
        return `<svg fill="${color}" viewBox="0 0 24 24" width="28" height="28"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>`;
      default:
        return `<svg fill="${color}" viewBox="0 0 24 24" width="28" height="28"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>`;
    }
  };
  
  const accentColor = block.styles?.accentColor || '#6366f1';
  const linksHtml = socialLinks.map(link => {
    const formattedUrl = formatUrl(link.platform, link.url);
    const targetAttr = link.platform === 'email' ? '' : 'target="_blank" rel="noopener noreferrer"';
    return `
    <a href="${escapeHtml(formattedUrl)}" ${targetAttr} class="social-link" title="${escapeHtml(link.label)}">
      <div class="social-icon">
        ${getSocialIcon(link.platform, accentColor)}
      </div>
      <p class="social-label">${escapeHtml(link.label)}</p>
    </a>
  `;
  }).join('');
  return `<div class="social-links-block"><h2>Suivez-moi</h2><div class="social-links">${linksHtml}</div></div>`;
}

function renderMedia(block: Block): string {
  const { mediaList = [] } = block.content as { mediaList: { type: string, url: string, title: string }[] };
  const mediaHtml = mediaList.map(media => {
    let embedHtml = '';
    if (media.type === 'youtube') {
      const youtubeId = media.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1] || '';
      embedHtml = `<iframe src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allowfullscreen></iframe>`;
    } else if (media.type === 'vimeo') {
      const vimeoId = media.url.match(/vimeo\.com\/(\d+)/)?.[1] || '';
      embedHtml = `<iframe src="https://player.vimeo.com/video/${vimeoId}" frameborder="0" allowfullscreen></iframe>`;
    } else {
      embedHtml = `<video controls><source src="${escapeHtml(media.url)}" type="video/mp4"></video>`;
    }
    return `<div class="media-item"><h3>${escapeHtml(media.title)}</h3>${embedHtml}</div>`;
  }).join('');
  return `<div class="media-block">${mediaHtml}</div>`;
}

function renderFAQ(block: Block): string {
  const { faqItems = [] } = block.content as { faqItems: { question: string, answer: string }[] };
  const faqHtml = faqItems.map((item) => `
    <details class="faq-item">
      <summary class="faq-question">${escapeHtml(item.question)}</summary>
      <p class="faq-answer">${escapeHtml(item.answer)}</p>
    </details>
  `).join('');
  return `<div class="faq-block"><h2>Questions Fréquentes</h2>${faqHtml}</div>`;
}

function renderBlockToHtml(block: Block): string {
    let contentHtml = '';
    switch (block.type) {
        case 'header': contentHtml = renderHeader(block); break;
        case 'text': contentHtml = renderText(block); break;
        case 'terminal': contentHtml = renderTerminal(block); break;
        case 'stack': contentHtml = renderStack(block); break;
        case 'timeline': contentHtml = renderTimeline(block); break;
        case 'code-snippet': contentHtml = renderCodeSnippet(block); break;
        case 'certifications': contentHtml = renderCertifications(block); break;
        case 'social-links': contentHtml = renderSocialLinks(block); break;
        case 'media': contentHtml = renderMedia(block); break;
        case 'faq': contentHtml = renderFAQ(block); break;
        default: contentHtml = `<p>Unsupported block type: ${block.type}</p>`;
    }

    const theme = getThemeById(block.theme || '');
    const customClass = theme?.customClass || 'p-8 bg-slate-800 border border-slate-700 rounded-2xl';
    
    const customStyles = [];
    if (block.styles?.accentColor) customStyles.push(`--accent-color: ${block.styles.accentColor}`);
    if (block.styles?.backgroundColor) customStyles.push(`background-color: ${block.styles.backgroundColor} !important`);
    if (block.styles?.textColor) customStyles.push(`color: ${block.styles.textColor} !important`);
    if (block.styles?.borderRadius) customStyles.push(`border-radius: ${block.styles.borderRadius} !important`);
    if (block.styles?.padding) customStyles.push(`padding: ${block.styles.padding} !important`);
    const styleAttr = customStyles.length > 0 ? ` style="${customStyles.join('; ')}"` : '';

    return `
        <section class="block-wrapper ${customClass}" data-block-id="${block.id}" data-animation-name="${block.animation || ''}"${styleAttr}>
            ${contentHtml}
        </section>
    `;
}

// --- CSS & JS Generators ---

function generateCss(blocks: Block[]): string {
    const keyframes = `
      @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slide-in-right { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes slide-in-left { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 10px var(--accent-color-trans); } 50% { box-shadow: 0 0 20px var(--accent-color); } }
      @keyframes neon-pulse { 0%, 100% { box-shadow: 0 0 10px var(--accent-color-trans), inset 0 0 10px var(--accent-color-trans); } 50% { box-shadow: 0 0 25px var(--accent-color), inset 0 0 15px var(--accent-color); } }
      @keyframes matrix-glow { 0%, 100% { text-shadow: 0 0 10px #0f0; box-shadow: 0 0 10px #0f06; } 50% { text-shadow: 0 0 20px #3f3, 0 0 30px #3f3; box-shadow: 0 0 20px #0f0c; } }
      @keyframes aurora-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      @keyframes lava-flow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      @keyframes wave-flow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
      @keyframes sunset-glow { 0%, 100% { background-position: 0% 50%; box-shadow: 0 0 20px rgba(249, 115, 22, 0.4); } 50% { background-position: 100% 50%; box-shadow: 0 0 40px rgba(249, 115, 22, 0.8); } }
      @keyframes forest-glow { 0%, 100% { background-position: 0% 50%; box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); } 50% { background-position: 100% 50%; box-shadow: 0 0 40px rgba(34, 197, 94, 0.7); } }
      @keyframes neon-border { 0%, 100% { border-color: rgba(0, 255, 255, 0.6); box-shadow: 0 0 10px rgba(0, 255, 255, 0.3); } 50% { border-color: rgba(0, 255, 255, 1); box-shadow: 0 0 20px rgba(0, 255, 255, 0.8), inset 0 0 10px rgba(0, 255, 255, 0.2); } }
      @keyframes glow-effect { 0%, 100% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.3); } 50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.8); } }
      @keyframes blink-cursor { 50% { opacity: 0; } }
    `;

    const animationClasses = `
      .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
      .animate-fade-in-down { animation: fade-in-down 0.6s ease-out forwards; }
      .animate-slide-in-right { animation: slide-in-right 0.5s ease-out forwards; }
      .animate-slide-in-left { animation: slide-in-left 0.5s ease-out forwards; }
      .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      .animate-neon-pulse, .animate-neon { animation: neon-pulse 2s ease-in-out infinite; }
      .animate-matrix-glow, .animate-matrix { animation: matrix-glow 2s ease-in-out infinite; }
      .animate-aurora-shift, .animate-aurora { background-size: 200% 200%; animation: aurora-shift 6s ease infinite; }
      .animate-lava-flow, .animate-lava { background-size: 200% 200%; animation: lava-flow 5s ease infinite; }
      .animate-wave-flow, .animate-ocean { animation: wave-flow 3s ease-in-out infinite; }
      .animate-sunset-glow, .animate-sunset { background-size: 200% 200%; animation: sunset-glow 5s ease infinite; }
      .animate-forest-glow, .animate-forest { background-size: 200% 200%; animation: forest-glow 5s ease infinite; }
      .animate-neon-border { animation: neon-border 2s ease-in-out infinite; }
      .glow-cyan { animation: glow-effect 2s ease-in-out infinite; }
      .glow-green { animation: glow-effect 2s ease-in-out infinite; filter: hue-rotate(90deg); }
    `;

    let themeCss = '';
    blocks.forEach(block => {
        const theme = getThemeById(block.theme || '');
        if (theme) {
            themeCss += `
              [data-block-id="${block.id}"] {
                --bg-color: ${theme.colors.bg === 'gradient' ? 'linear-gradient(to right, #4f46e5, #ec4899)' : theme.colors.bg};
                --text-color: ${theme.colors.text};
                --accent-color: ${theme.colors.accent};
                --accent-color-trans: ${theme.colors.accent}66;
                --secondary-color: ${theme.colors.secondary || theme.colors.accent};
                color: var(--text-color);
                ${theme.rawCss || ''}
              }
              [data-block-id="${block.id}"] .header-role, [data-block-id="${block.id}"] .contact-link:hover { color: var(--accent-color); }
              [data-block-id="${block.id}"] .skill-bar-fg { background-color: var(--accent-color); }
              [data-block-id="${block.id}"] .timeline-marker { background-color: var(--accent-color); }
              [data-block-id="${block.id}"] .timeline-line { background-color: var(--secondary-color); opacity: 0.3; }
              [data-block-id="${block.id}"] .terminal-block { background: var(--bg-color); color: var(--text-color); }
              [data-block-id="${block.id}"] .terminal-block .prompt-arrow { color: var(--secondary-color); }
              [data-block-id="${block.id}"] .terminal-block .prompt-path { color: var(--accent-color); }
            `;
        }
    });

    const baseCss = `
      :root { --bg-main: var(--user-bg, #0f172a); }
      body { background-color: var(--bg-main); color: #e2e8f0; font-family: var(--user-font, sans-serif); margin: 0; line-height: 1.5; }
      main { max-width: 896px; margin: 0 auto; padding: 3rem 1rem; display: flex; flex-direction: column; gap: 1.5rem; }
      .block-wrapper { opacity: 0; transform: translateY(10px); transition: opacity 0.5s 0.1s ease-out, transform 0.5s 0.1s ease-out; position: relative; }
      .block-wrapper.is-visible { opacity: 1; transform: none; }
      a { color: inherit; text-decoration: none; }
      
      .header-block { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; width: 100%; }
      .header-name { font-size: 2.25rem; font-weight: bold; margin: 0; line-height: 1.2; }
      .header-role { font-family: monospace; font-size: 1.125rem; margin: 0.5rem 0 0; color: var(--accent-color, #6366f1); }
      .header-contact { display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-end; }
      .contact-link { display: flex; align-items: center; gap: 0.5rem; transition: opacity 0.2s; font-size: 0.875rem; }
      .contact-link:hover { opacity: 0.8; }
      
      .text-block p { font-size: 1.125rem; line-height: 1.75; margin: 0; }
      
      .terminal-block { border-radius: 0.5rem; overflow: hidden; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); font-family: monospace; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
      .terminal-header { background: rgba(0,0,0,0.5); padding: 0.5rem 1rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: #888; }
      .dots { display: flex; gap: 0.4rem; }
      .dot { width: 12px; height: 12px; border-radius: 99px; } .dot.red { background: #ff5f56; } .dot.yellow { background: #ffbd2e; } .dot.green { background: #27c93f; }
      .terminal-body { padding: 1.5rem; font-size: 0.875rem; }
      .terminal-body .line { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: flex-start; margin-bottom: 0.5rem; }
      .terminal-body .prompt { display: flex; gap: 0.5rem; flex-shrink: 0; }
      .terminal-body .prompt-arrow { color: var(--secondary-color, #27c93f); }
      .terminal-body .prompt-path { color: var(--accent-color, #6366f1); }
      .terminal-body .prompt-value { white-space: pre-wrap; word-break: break-all; }
      .cursor { display: inline-block; width: 0.6em; height: 1.2em; background: var(--accent-color, #6366f1); animation: blink-cursor 1s step-end infinite; vertical-align: middle; margin-left: 0.25rem; }
      
      .stack-block { display: flex; flex-direction: column; gap: 1.25rem; width: 100%; }
      .skill { display: flex; flex-direction: column; gap: 0.5rem; }
      .skill-info { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: 600; }
      .skill-bar-bg { width: 100%; height: 0.5rem; background-color: rgba(150,150,150,0.2); border-radius: 99px; overflow: hidden; }
      .skill-bar-fg { height: 100%; border-radius: 99px; background-color: var(--accent-color, #6366f1); transition: width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
      
      .timeline-block { position: relative; display: flex; flex-direction: column; gap: 2rem; width: 100%; }
      .timeline-header { font-size: 1.875rem; font-weight: bold; margin-bottom: 1rem; }
      .timeline-event { display: flex; gap: 1rem; position: relative; }
      .timeline-marker { width: 12px; height: 12px; border-radius: 99px; border: 3px solid var(--bg-color, #1e293b); background-color: var(--accent-color, #6366f1); margin-top: 0.35rem; z-index: 1; outline: 2px solid var(--accent-color, #6366f1); flex-shrink: 0; }
      .timeline-line { position: absolute; left: 5px; top: 1.5rem; bottom: -2rem; width: 2px; background-color: var(--accent-color, #6366f1); opacity: 0.3; }
      .timeline-event:last-child .timeline-line { display: none; }
      .timeline-year { font-weight: bold; font-size: 0.875rem; color: var(--accent-color, #6366f1); margin-bottom: 0.25rem; display: inline-block; padding: 0.15rem 0.5rem; background: rgba(255,255,255,0.05); border-radius: 0.25rem; }
      .timeline-title { font-size: 1.125rem; font-weight: bold; margin: 0.5rem 0 0.25rem; }
      .timeline-company { opacity: 0.7; }
      
      .code-snippet-block { border-radius: 0.5rem; overflow: hidden; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); width: 100%; }
      .code-header { background: rgba(0,0,0,0.5); padding: 0.5rem 1rem; display: flex; justify-content: space-between; font-family: monospace; font-size: 0.75rem; color: #888; }
      pre { margin: 0 !important; padding: 1.5rem !important; background: transparent !important; font-size: 0.875rem; white-space: pre-wrap !important; word-wrap: break-word !important; overflow-wrap: break-word !important; overflow-x: hidden !important; }
      code { white-space: pre-wrap !important; word-wrap: break-word !important; overflow-wrap: break-word !important; }
      
      .social-links-block { width: 100%; padding: 1.5rem; border-radius: 0.5rem; text-align: center; }
      .social-links-block h2 { font-size: 1.5rem; font-weight: bold; margin-bottom: 1.5rem; }
      .social-links { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; align-items: center; }
      .social-link { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1rem; border: 2px solid var(--accent-color, #6366f1); border-radius: 0.5rem; background-color: rgba(99, 102, 241, 0.05); text-decoration: none; color: inherit; transition: all 0.3s ease; }
      .social-link:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); }
      .social-icon { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; }
      .social-icon svg { width: 100%; height: 100%; }
      .social-label { font-size: 0.75rem; font-weight: 600; opacity: 0.75; margin: 0; }
    `;

    return baseCss + keyframes + animationClasses + themeCss;
}

function generateJs(): string {
    return `
      const initScripts = () => {
        const animatedElements = document.querySelectorAll('[data-animation-name]');
        if (window.IntersectionObserver) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const anim = entry.target.getAttribute('data-animation-name');
                if (anim && anim !== 'none') {
                  entry.target.classList.add('animate-' + anim);
                }
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.1 });
          animatedElements.forEach(el => observer.observe(el));
        } else {
          animatedElements.forEach(el => el.classList.add('is-visible'));
        }

        // Animation des barres de progression (Stack)
        const stackObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
            setTimeout(() => {
              const bars = entry.target.querySelectorAll('.skill-bar-fg');
              bars.forEach(bar => {
                bar.style.width = bar.getAttribute('data-target-width') || '0%';
              });
            }, 100);
              stackObserver.unobserve(entry.target);
            }
          });
      }, { threshold: 0 });
        document.querySelectorAll('.stack-block').forEach(el => stackObserver.observe(el));

        // Effet machine à écrire (Terminal)
        document.querySelectorAll('.terminal-body').forEach(terminal => {
          const lines = terminal.querySelectorAll('.line');
          let lineIndex = 0;
          const typeLine = () => {
            if (lineIndex >= lines.length) {
              const cursor = terminal.querySelector('.cursor');
              if (cursor) cursor.style.display = 'inline-block';
              return;
            }
            const line = lines[lineIndex];
            const valueEl = line.querySelector('.prompt-value');
            if (!valueEl) { lineIndex++; typeLine(); return; }
            const text = valueEl.getAttribute('data-value') || '';
            let charIndex = 0;
            valueEl.textContent = '';
            const typeChar = () => {
              if (charIndex < text.length) {
                valueEl.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 15);
              } else {
                lineIndex++;
                setTimeout(typeLine, 150);
              }
            };
            typeChar();
          };
          typeLine();
        });
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScripts);
      } else {
        initScripts(); // Exécution immédiate si l'iframe est déjà chargé
      }
    `;
}

export function generateStaticSite(blocks: Block[], settings: any): { htmlBody: string; css: string; js: string } {
    const htmlBody = blocks.map(renderBlockToHtml).join('\n');
    
    // Injection des variables globales configurées par l'utilisateur
    const settingsCss = `
      :root {
        --user-bg: ${settings.backgroundColor};
        --user-font: ${settings.fontFamily};
      }
    `;
    
    const css = settingsCss + generateCss(blocks);
    const js = generateJs();
    return { htmlBody, css, js };
}