// src/types.ts

export type BlockType = 'header' | 'terminal' | 'code-snippet' | 'timeline' | 'stack' | 'text' | 'certifications' | 'social-links' | 'media' | 'faq' | 'soft-skills' | 'hard-skills';

export interface BlockStyles {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  borderRadius?: string;
  [key: string]: string | undefined;
}

export interface Block {
  id: string;
  type: BlockType;
  content: any;
  styles: BlockStyles;
  theme?: string; // Nouveau : référence au thème appliqué
  animation?: string; // Nuevo : animation CSS appliquée au bloc
}

export interface GlobalSettings {
  fontFamily: string;
  backgroundColor: string;
}

export interface BuilderState {
  blocks: Block[];
  selectedBlockId: string | null;
  settings: GlobalSettings;

  addBlock: (type: BlockType, index?: number) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  updateBlockContent: (id: string, content: any) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  selectBlock: (id: string | null) => void;
  setBlocks: (blocks: Block[]) => void; // Pour charger des templates
  updateSettings: (settings: Partial<GlobalSettings>) => void;
}

// Définition des thèmes disponibles
export interface Theme {
  id: string;
  name: string;
  description: string;
  category: BlockType;
  colors: {
    bg: string;
    text: string;
    accent: string;
    secondary?: string;
  };
  animation?: string;
  borderStyle?: string;
  borderRadius?: string;
  shadow?: string;
  customClass?: string;
  rawCss?: string; // CSS pur injecté à l'export statique
}
