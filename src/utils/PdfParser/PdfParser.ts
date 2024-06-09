import * as pdfjsLib from 'pdfjs-dist';
import { PdfItem, PdfJSTextItem, PdfLine, PdfParagraph } from './types.ts';
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

class PdfParser {
  pdf: File;
  constructor(pdf: File) {
    this.pdf = pdf;
  }

  parsePdf = async () => {
    const doc = await pdfjsLib.getDocument(await this.pdf.arrayBuffer())
      .promise;
    const metadata = await doc.getMetadata();

    const items = await this.getItems(doc);
    const lines = this.getLines(items);
    return { paragraphs: this.getParagraphs(lines), metadata };
  };

  private getItems = async (
    doc: pdfjsLib.PDFDocumentProxy
  ): Promise<Array<PdfItem>> => {
    const stringsToIgnore = [''];

    const items: Array<PdfItem> = [];
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
      const page = await doc.getPage(pageNumber);
      const textContent = await page.getTextContent();

      for (const item of textContent.items) {
        const textItem = item as unknown as PdfJSTextItem;
        if (
          stringsToIgnore.includes(textItem.str) ||
          textItem.str.length <= 1
        ) {
          continue;
        }
        const position = {
          x1: textItem.transform[4],
          x2: textItem.x1 + textItem.width,
          y1: textItem.transform[5],
          y2: textItem.y1 + textItem.height,
        };
        items.push({
          ...textItem,
          position,
          pageNumber,
        });
      }
    }

    return items;
  };

  private getLines = (items: Array<PdfItem>): Array<PdfLine> => {
    let activeY: number = null;

    let lineOnPageNumber = 0;
    let lineNumber = 0;
    return items.reduce((acc: Array<PdfLine>, item, index) => {
      const y = item.position.y1;
      if (item.pageNumber !== items[index - 1]?.pageNumber) {
        lineOnPageNumber = 0;
      }

      if (y !== activeY) {
        activeY = y;
        acc.push({
          items: [item],
          pageNumber: item.pageNumber,
          lineOnPageNumber,
          lineNumber: lineNumber++,
        });
      } else {
        acc[acc.length - 1].items.push(item);
      }
      return acc;
    }, []);
  };

  private getParagraphs = (lines: Array<PdfLine>): Array<PdfParagraph> => {
    const groupedLines = lines.reduce(
      (acc: Array<Array<PdfLine>>, line, index) => {
        const prevLine = lines[index - 1];
        const positionY = line.items[0].position.y1;
        const prevPositionY = prevLine?.items[0].position.y1 || 0;
        const height = line.items[0].height;
        const prevHeight = prevLine?.items[0].height || 0;

        const distanceToPrevLine = prevPositionY - positionY;
        if (height === prevHeight && distanceToPrevLine < height * 1.6) {
          acc[acc.length - 1].push(line);
        } else {
          acc.push([line]);
        }
        return acc;
      },
      []
    );

    return groupedLines.map((lines, i) => {
      const concat = (items: Array<PdfItem>) =>
        items.map((item) => item.str).join(' ');

      const string = lines.reduce(
        (acc, line) =>
          acc.endsWith('-')
            ? acc.slice(0, -1) + concat(line.items)
            : acc + ' ' + concat(line.items),
        ''
      );

      const sentences = string
        .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
        .split('|')
        .map((str: string) => str.trim())
        .filter(Boolean);

      return {
        lines,
        sentences: sentences.map((str, index) => ({
          str,
          paragraphIndex: i,
          index,
        })),
      };
    });
  };
}

export default PdfParser;
