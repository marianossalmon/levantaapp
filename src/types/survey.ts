export interface Point {
  x: number;
  y: number;
}

export interface Node extends Point {
  id: string;
}

export interface Segment {
  id: string;
  startNodeId: string;
  endNodeId: string;
  lengthCm: number | null;
  isReference: boolean;
}

export type SpecialElementType = 'column' | 'door' | 'window' | 'bar' | 'step' | 'text' | 'users';

export interface SpecialElement {
  id: string;
  type: SpecialElementType;
  position: Point;
  rotation: number;
  width?: number;
  height?: number;
  text?: string;
}

export interface MediaItem {
  id: string;
  type: 'photo' | 'video' | 'audio';
  url: string; 
  label: string;
  timestamp: number;
}

export interface Survey {
  id: string;
  clientName: string;
  spaceType: string;
  date: number;
  nodes: Node[];
  segments: Segment[];
  elements: SpecialElement[];
  media: MediaItem[];
  scalePixelRatio: number | null; 
  updatedAt: number;
}
