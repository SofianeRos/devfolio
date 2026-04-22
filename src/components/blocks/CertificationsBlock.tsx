import { Award } from 'lucide-react';

interface Certification {
  title: string;
  issuer: string;
  date: string;
  id: string;
}

interface CertificationsBlockProps {
  block?: {
    content?: { certifications?: Certification[] };
    styles?: { [key: string]: string };
    animation?: string;
  };
}

export default function CertificationsBlock({ block }: CertificationsBlockProps) {
  const certifications = block?.content?.certifications || [
    { id: '1', title: 'React Advanced', issuer: 'Udemy', date: '2024' },
    { id: '2', title: 'TypeScript Mastery', issuer: 'Coursera', date: '2024' },
  ];

  const accentColor = block?.styles?.accentColor || '#6366f1';
  const bgColor = block?.styles?.backgroundColor || '#1e293b';
  const textColor = block?.styles?.textColor || '#ffffff';

  return (
    <div className="w-full space-y-6 p-6 rounded-lg" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="flex items-center gap-3 pb-4 border-b-2" style={{ borderColor: `${accentColor}30` }}>
        <Award size={28} style={{ color: accentColor }} />
        <h2 className="text-2xl font-bold">Certifications & Diplômes</h2>
      </div>

      <div className="space-y-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="relative pl-8">
            {/* Timeline line */}
            <div
              className="absolute left-0 top-2 bottom-0 w-1 rounded-full"
              style={{ backgroundColor: `${accentColor}40` }}
            />
            
            {/* Timeline dot */}
            <div
              className="absolute -left-2 top-2 w-5 h-5 rounded-full border-2"
              style={{ borderColor: accentColor, backgroundColor: bgColor }}
            />

            {/* Badge content */}
            <div
              className="p-4 rounded-lg border-l-4 backdrop-blur-sm"
              style={{
                borderColor: accentColor,
                backgroundColor: `${accentColor}10`,
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{cert.title}</h3>
                  <p className="text-sm opacity-75">{cert.issuer}</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: `${accentColor}30`, color: accentColor }}>
                  {cert.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
