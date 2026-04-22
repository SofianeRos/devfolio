import { Play } from 'lucide-react';

interface Media {
  id: string;
  type: 'youtube' | 'vimeo' | 'mp4';
  url: string;
  title: string;
  thumbnail?: string;
}

interface MediaBlockProps {
  block?: {
    content?: { mediaList?: Media[] };
    styles?: { [key: string]: string };
    animation?: string;
  };
}

function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : '';
}

function extractVimeoId(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : '';
}

export default function MediaBlock({ block }: MediaBlockProps) {
  const mediaList = block?.content?.mediaList || [
    { id: '1', type: 'youtube' as const, url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', title: 'Mon Projet 1' },
  ];

  const accentColor = block?.styles?.accentColor || '#6366f1';
  const bgColor = block?.styles?.backgroundColor || '#1e293b';
  const textColor = block?.styles?.textColor || '#ffffff';

  return (
    <div className="w-full space-y-6 p-6 rounded-lg" style={{ backgroundColor: bgColor, color: textColor }}>
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Play size={28} style={{ color: accentColor }} />
        Vidéos & Média
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mediaList.map((media) => {
          let embedUrl = '';
          if (media.type === 'youtube') {
            embedUrl = `https://www.youtube.com/embed/${extractYouTubeId(media.url)}`;
          } else if (media.type === 'vimeo') {
            embedUrl = `https://player.vimeo.com/video/${extractVimeoId(media.url)}`;
          }

          return (
            <div key={media.id} className="space-y-2">
              <p className="text-sm font-semibold" style={{ color: accentColor }}>
                {media.title}
              </p>
              {(media.type === 'youtube' || media.type === 'vimeo') && embedUrl ? (
                <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden border-2" style={{ borderColor: `${accentColor}40` }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={embedUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  className="w-full rounded-lg border-2"
                  style={{ borderColor: `${accentColor}40` }}
                  controls
                >
                  <source src={media.url} type="video/mp4" />
                  Votre navigateur ne supporte pas la vidéo.
                </video>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
