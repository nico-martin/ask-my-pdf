import React from 'react';
import ReactDOM from 'react-dom/client';
import PdfParser from './pdfParser/PdfParser.tsx';
import ChatBox from './chatBox/ChatBox.tsx';
import { Line } from './pdfParser/types.ts';
import LlmContextProvider from './store/llm/LlmContextProvider.tsx';

const root = document.getElementById('app');

const App: React.FC = () => {
  const [pdfLoading, setPdfLoading] = React.useState<boolean>(false);
  const [pdfLines, setPdfLines] = React.useState<Array<Line>>([]);

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <PdfParser
        loading={pdfLoading}
        setLoading={setPdfLoading}
        setLines={setPdfLines}
        lines={pdfLines}
      />
      <ChatBox lines={pdfLines} />
    </div>
  );
};

root &&
  ReactDOM.createRoot(root).render(
    <LlmContextProvider>
      <App />
    </LlmContextProvider>
  );
