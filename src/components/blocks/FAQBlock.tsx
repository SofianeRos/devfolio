import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQBlockProps {
  block?: {
    content?: { faqItems?: FAQItem[] };
    styles?: { [key: string]: string };
    animation?: string;
  };
}

export default function FAQBlock({ block }: FAQBlockProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const faqItems = block?.content?.faqItems || [
    { id: '1', question: 'Qu\'est-ce que tu fais?', answer: 'Je suis développeur full-stack spécialisé en React et TypeScript.' },
    { id: '2', question: 'Combien d\'années d\'expérience?', answer: 'J\'ai 5+ ans d\'expérience en développement web.' },
  ];

  const accentColor = block?.styles?.accentColor || '#6366f1';
  const bgColor = block?.styles?.backgroundColor || '#1e293b';
  const textColor = block?.styles?.textColor || '#ffffff';

  return (
    <div className="w-full space-y-4 p-6 rounded-lg" style={{ backgroundColor: bgColor, color: textColor }}>
      <h2 className="text-2xl font-bold mb-6">Questions Fréquentes</h2>

      <div className="space-y-3">
        {faqItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            className="w-full text-left p-4 rounded-lg border-2 transition-all hover:border-opacity-100"
            style={{
              borderColor: openId === item.id ? accentColor : `${accentColor}30`,
              backgroundColor: openId === item.id ? `${accentColor}15` : `${accentColor}05`,
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{item.question}</h3>
              <ChevronDown
                size={20}
                style={{ color: accentColor }}
                className={`transition-transform ${openId === item.id ? 'rotate-180' : ''}`}
              />
            </div>

            {openId === item.id && (
              <div className="mt-3 pt-3 border-t-2" style={{ borderColor: `${accentColor}30` }}>
                <p className="text-sm leading-relaxed opacity-90">{item.answer}</p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
