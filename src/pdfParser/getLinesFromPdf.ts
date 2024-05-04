import * as pdfjsLib from "pdfjs-dist";
import { Line, PdfTextItem } from "./types.ts";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();
// Setting worker path to worker bundle.

const getLinesFromPdf = async (file: File): Promise<Array<Line>> => {
  const doc = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;

  const lines: Array<Line> = [];
  let line = 0;
  let lastY = 0;
  let lineOnPage = 0;

  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
    const page = await doc.getPage(pageNumber);
    const textContent = await page.getTextContent();
    lineOnPage = 0;
    for (const item of textContent.items) {
      const textItem = item as unknown as PdfTextItem;
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

      if (!lines[line]) {
        lines[line] = {
          entries: [],
          str: "",
          metadata: { pageNumber, lineNumber: lineOnPage },
        };
      }

      lines[line].entries.push({
        str: textItem.str,
        position,
      });
    }
  }

  return lines.map((line) => ({
    ...line,
    str: line.entries.map((e) => e.str).join(""),
  }));
};

export default getLinesFromPdf;
