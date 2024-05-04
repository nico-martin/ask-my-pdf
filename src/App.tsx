import React from "react";
import ReactDOM from "react-dom/client";
import PdfParser from "./pdfParser/PdfParser.tsx";

const root = document.getElementById("app");

const App: React.FC = () => {
  return (
    <div>
      {/*<VectorSearch />*/}
      <PdfParser />
    </div>
  );
};

root && ReactDOM.createRoot(root).render(<App />);
