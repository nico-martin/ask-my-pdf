export interface PdfJSTextItem {
  str: string;
  transform: number[];
  x1: number;
  width: number;
  y1: number;
  height: number;
}

export interface PdfItem {
  str: string;
  width: number;
  height: number;
  transform: Array<number>;
  position: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };
  pageNumber: number;
}

export interface PdfLine {
  items: Array<PdfItem>;
  pageNumber: number;
  lineOnPageNumber: number;
  lineNumber: number;
}

export interface PdfSentence {
  str: string;
  paragraphIndex: number;
  index: number;
}

export interface PdfParagraph {
  lines: Array<PdfLine>;
  sentences: Array<PdfSentence>;
}
