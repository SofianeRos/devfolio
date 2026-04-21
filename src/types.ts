// src/types.ts

export type BlockType = 'header' | 'terminal' | 'code-snippet' | 'timeline' | 'stack' | 'text';

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
}

export interface BuilderState {
  blocks: Block[];
  selectedBlockId: string | null;

  addBlock: (type: BlockType) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  selectBlock: (id: string | null) => void;
}
