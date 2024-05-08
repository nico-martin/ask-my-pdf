import * as pdfjsLib from 'pdfjs-dist';
import { Line, PdfTextItem } from './types.ts';
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();
// Setting worker path to worker bundle.

const getLinesFromPdf = async (
  file: File
): Promise<{ title: string; lines: Array<Line> }> => {
  const doc = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
  const metadata = await doc.getMetadata();
  const lines: Array<Line> = [];
  let line = 0;
  let lastY = 0;
  let lineOnPage = 0;

  const stringsToIgnore = ['', '●'];

  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
    const page = await doc.getPage(pageNumber);
    const textContent = await page.getTextContent();
    lineOnPage = 0;
    for (const item of textContent.items) {
      const textItem = item as unknown as PdfTextItem;
      if (stringsToIgnore.includes(textItem.str) || textItem.str.length <= 1) {
        continue;
      }
      const position = {
        x1: textItem.transform[4],
        x2: textItem.x1 + textItem.width,
        y1: textItem.transform[5],
        y2: textItem.y1 + textItem.height,
      };
      if (lastY != position.y1) {
        lineOnPage++;
        line++;
        lastY = position.y1;
      }
      const lineIndex = line - 1;

      if (!lines[lineIndex]) {
        lines[lineIndex] = {
          entries: [],
          str: '',
          metadata: {
            pageNumber,
            lineNumber: lineOnPage,
            allLinesNumber: line,
          },
        };
      }

      lines[lineIndex].entries.push({
        str: textItem.str,
        position,
      });
    }
  }

  return {
    // @ts-ignore
    title: metadata.info.Title || file.name,
    lines: lines.map((line) => ({
      ...line,
      str: line.entries.map((e) => e.str).join(''),
    })),
  };
};

export default getLinesFromPdf;
