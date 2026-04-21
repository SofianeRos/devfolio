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
  const { events = [] } = block.content as { events: { year: string, title: string, company: string }[] };
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
  return `<div class="timeline-block">${eventsHtml}</div>`;
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

function renderBlockToHtml(block: Block): string {
    let contentHtml = '';
    switch (block.type) {
        case 'header': contentHtml = renderHeader(block); break;
        case 'text': contentHtml = renderText(block); break;
        case 'terminal': contentHtml = renderTerminal(block); break;
        case 'stack': contentHtml = renderStack(block); break;
        case 'timeline': contentHtml = renderTimeline(block); break;
        case 'code-snippet': contentHtml = renderCodeSnippet(block); break;
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
      .timeline-event { display: flex; gap: 1rem; position: relative; }
      .timeline-marker { width: 12px; height: 12px; border-radius: 99px; border: 3px solid var(--bg-color, #1e293b); background-color: var(--accent-color, #6366f1); margin-top: 0.35rem; z-index: 1; outline: 2px solid var(--accent-color, #6366f1); flex-shrink: 0; }
      .timeline-line { position: absolute; left: 5px; top: 1.5rem; bottom: -2rem; width: 2px; background-color: var(--accent-color, #6366f1); opacity: 0.3; }
      .timeline-event:last-child .timeline-line { display: none; }
      .timeline-year { font-weight: bold; font-size: 0.875rem; color: var(--accent-color, #6366f1); margin-bottom: 0.25rem; display: inline-block; padding: 0.15rem 0.5rem; background: rgba(255,255,255,0.05); border-radius: 0.25rem; }
      .timeline-title { font-size: 1.125rem; font-weight: bold; margin: 0.5rem 0 0.25rem; }
      .timeline-company { opacity: 0.7; }
      
      .code-snippet-block { border-radius: 0.5rem; overflow: hidden; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); width: 100%; }
      .code-header { background: rgba(0,0,0,0.5); padding: 0.5rem 1rem; display: flex; justify-content: space-between; font-family: monospace; font-size: 0.75rem; color: #888; }
      pre { margin: 0 !important; padding: 1.5rem !important; background: transparent !important; overflow-x: auto; font-size: 0.875rem; }
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