import { Mail, Globe, Plus, Trash2 } from 'lucide-react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { v4 as uuidv4 } from 'uuid';

interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'website';
  url: string;
  label: string;
  id: string;
}

interface SocialLinksBlockProps {
  block?: {
    id?: string;
    content?: { socialLinks?: SocialLink[] };
    styles?: { [key: string]: string };
    animation?: string;
  };
  isEditing?: boolean;
}

// SVG Icons pour les réseaux sociaux
const SocialIcons = {
  github: (color: string) => (
    <svg fill={color} viewBox="0 0 24 24" width="28" height="28">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  linkedin: (color: string) => (
    <svg fill={color} viewBox="0 0 24 24" width="28" height="28">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.435-.103.25-.129.599-.129.949v5.421h-3.554s.05-8.789 0-9.707h3.554v1.375c.425-.654 1.185-1.586 2.882-1.586 2.105 0 3.685 1.375 3.685 4.331v5.587zM5.337 8.855c-1.144 0-1.915-.761-1.915-1.712 0-.951.77-1.71 1.954-1.71 1.184 0 1.915.759 1.915 1.71 0 .951-.771 1.712-1.954 1.712zm1.6 11.597H3.73V9.557h3.207v10.895zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  ),
  twitter: (color: string) => (
    <svg fill={color} viewBox="0 0 24 24" width="28" height="28">
      <path d="M23.953 4.57a10 10 0 002.856-10.01 10.02 10.02 0 01-2.863.813 4.897 4.897 0 002.145-2.7c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a14.041 14.041 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  ),
};

// Fonction pour formater les URLs selon la plateforme
const formatUrl = (platform: string, url: string): string => {
  const trimmedUrl = url.trim();

  if (platform === 'github') {
    // Si c'est juste un username, ajouter le préfixe
    if (!trimmedUrl.startsWith('http')) {
      return `https://github.com/${trimmedUrl}`;
    }
    // Si l'URL contient github.com, s'assurer qu'elle est valide
    if (trimmedUrl.includes('github.com')) {
      return trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;
    }
    // Par défaut pour GitHub
    return trimmedUrl.startsWith('http') ? trimmedUrl : `https://github.com/${trimmedUrl}`;
  }

  if (platform === 'email') {
    // Si c'est une adresse email valide et pas déjà un mailto:
    if (trimmedUrl.includes('@') && !trimmedUrl.startsWith('mailto:')) {
      return `mailto:${trimmedUrl}`;
    }
    // Si c'est déjà un mailto:, retourner tel quel
    if (trimmedUrl.startsWith('mailto:')) {
      return trimmedUrl;
    }
    return `mailto:${trimmedUrl}`;
  }

  if (platform === 'linkedin' && !trimmedUrl.startsWith('http')) {
    return `https://linkedin.com/in/${trimmedUrl}`;
  }

  if (platform === 'twitter' && !trimmedUrl.startsWith('http')) {
    return `https://twitter.com/${trimmedUrl}`;
  }

  // Pour les autres ou URLs valides
  return trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;
};

export default function SocialLinksBlock({ block, isEditing }: SocialLinksBlockProps) {
  const updateBlock = useBuilderStore((state) => state.updateBlock);
  
  const socialLinks = block?.content?.socialLinks || [
    { id: '1', platform: 'github' as const, url: 'https://github.com', label: 'GitHub' },
    { id: '2', platform: 'linkedin' as const, url: 'https://linkedin.com', label: 'LinkedIn' },
    { id: '3', platform: 'email' as const, url: 'mailto:contact@example.com', label: 'Email' },
  ];

  const accentColor = block?.styles?.accentColor || '#6366f1';
  const bgColor = block?.styles?.backgroundColor || '#1e293b';
  const textColor = block?.styles?.textColor || '#ffffff';

  const handleUpdateLink = (index: number, field: keyof SocialLink, value: string) => {
    if (!block?.id) return;
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateBlock(block.id, { content: { socialLinks: newLinks } });
  };

  const handleDeleteLink = (index: number) => {
    if (!block?.id) return;
    const newLinks = socialLinks.filter((_: SocialLink, i: number) => i !== index);
    updateBlock(block.id, { content: { socialLinks: newLinks } });
  };

  const handleAddLink = () => {
    if (!block?.id) return;
    const newLink: SocialLink = {
      id: uuidv4(),
      platform: 'website' as const,
      url: 'https://exemple.com',
      label: 'Nouveau lien',
    };
    updateBlock(block.id, { content: { socialLinks: [...socialLinks, newLink] } });
  };

  const renderIcon = (platform: string, color: string) => {
    switch (platform) {
      case 'github':
        return SocialIcons.github(color);
      case 'linkedin':
        return SocialIcons.linkedin(color);
      case 'twitter':
        return SocialIcons.twitter(color);
      case 'email':
        return <Mail size={28} color={color} />;
      case 'website':
        return <Globe size={28} color={color} />;
      default:
        return <Globe size={28} color={color} />;
    }
  };

  if (isEditing) {
    return (
      <div className="w-full p-6 rounded-lg" style={{ backgroundColor: bgColor }}>
        <h2 className="text-2xl font-bold mb-6 text-slate-200">Réseaux Sociaux</h2>

        <div className="space-y-3">
          {socialLinks.map((link, index) => (
            <div key={link.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">Lien {index + 1}</span>
                <button
                  onClick={() => handleDeleteLink(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  title="Supprimer ce lien"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Plateforme</label>
                <select
                  value={link.platform}
                  onChange={(e) => handleUpdateLink(index, 'platform', e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-700 text-slate-200 rounded border border-slate-600 text-sm"
                >
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                  <option value="email">Email</option>
                  <option value="website">Site Web</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Label</label>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleUpdateLink(index, 'label', e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-700 text-slate-200 rounded border border-slate-600 text-sm"
                  placeholder="Ex: Mon GitHub"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">URL/Pseudo</label>
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleUpdateLink(index, 'url', e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-700 text-slate-200 rounded border border-slate-600 text-sm"
                  placeholder={
                    link.platform === 'github' ? 'username ou https://github.com/username' :
                    link.platform === 'email' ? 'contact@gmail.com' :
                    link.platform === 'linkedin' ? 'username ou https://linkedin.com/in/username' :
                    link.platform === 'twitter' ? '@username ou https://twitter.com/username' :
                    'https://exemple.com'
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddLink}
          className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Ajouter un lien
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-6 rounded-lg text-center" style={{ backgroundColor: bgColor, color: textColor }}>
      <h2 className="text-2xl font-bold mb-6">Suivez-moi</h2>

      <div className="flex flex-wrap gap-4 justify-center items-center">
        {socialLinks.map((link) => {
          const formattedUrl = formatUrl(link.platform, link.url);

          return (
            <a
              key={link.id}
              href={formattedUrl}
              target={link.platform === 'email' ? undefined : '_blank'}
              rel={link.platform === 'email' ? undefined : 'noopener noreferrer'}
              className="group p-4 rounded-lg border-2 transition-all hover:shadow-lg"
              style={{
                borderColor: accentColor,
                backgroundColor: `${accentColor}10`,
              }}
              title={link.label}
            >
              <div className="group-hover:scale-110 transition-transform">
                {renderIcon(link.platform, accentColor)}
              </div>
              <p className="text-xs mt-2 font-semibold opacity-75">{link.label}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
