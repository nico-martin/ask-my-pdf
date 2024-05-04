export type Line = {
  entries: Entry[];
  str: string;
  metadata: { pageNumber: number; lineNumber: number };
};

export type Entry = {
  str: string;
  position: { x1: number; x2: number; y1: number; y2: number };
};

export interface PdfTextItem {
  str: string;
  transform: number[];
  x1: number;
  width: number;
  y1: number;
  height: number;
}
