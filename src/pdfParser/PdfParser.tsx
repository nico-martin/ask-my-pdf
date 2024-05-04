import React from "react";
import getLinesFromPdf from "./getLinesFromPdf.ts";
import { Line } from "./types.ts";
import VectorDB from "../vectorDB/VectorDB.ts";

const db = new VectorDB<{ pageNumber: number; lineNumber: number }>();

const PdfParser: React.FC = () => {
  const [lines, setLines] = React.useState<Array<Line>>([]);
  return (
    <div>
      <input
        type="file"
        onChange={async (e) => {
          const lines = await getLinesFromPdf(e.target.files[0]);
          db.clear();
          for (const line of lines) {
            if (line) {
              await db.addEntry(line.str, line.metadata);
            }
          } /*
          await Promise.all(
            lines.map((line) => db.addEntry(line.str, line.metadata)),
          );*/
          console.log(db.entries);
          setLines(lines);
        }}
      />
      <input id="search" name="search" />
      <button
        onClick={async () => {
          const query = (
            document.querySelector('input[name="search"]') as HTMLInputElement
          ).value;
          const results = await db.search(query);
          console.log(results);
        }}
      >
        search
      </button>
      {lines.length > 0 && (
        <React.Fragment>
          <h2>Content of the file</h2>
          {lines.map((line, i) => (
            <p key={i} style={{ margin: 0 }}>
              <span style={{ opacity: 0.5 }}>
                {line.metadata.pageNumber}/{line.metadata.lineNumber}
              </span>
              {line.str}
            </p>
          ))}
        </React.Fragment>
      )}
    </div>
  );
};

export default PdfParser;
