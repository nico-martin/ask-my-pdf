import React from 'react';
import ReactDOM from 'react-dom/client';
import PdfParser from './pdfParser/PdfParser.tsx';
import ChatBox from './chatBox/ChatBox.tsx';
import { Line } from './pdfParser/types.ts';
import LlmContextProvider from './store/llm/LlmContextProvider.tsx';
import Navigation from './page/Navigation.tsx';
import styles from './App.module.css';

const root = document.getElementById('app');

const App: React.FC = () => {
  const [pdfLoading, setPdfLoading] = React.useState<boolean>(false);
  const [pdfLines, setPdfLines] = React.useState<Array<Line>>([]);

  return (
    <div className={styles.root}>
      <Navigation className={styles.navigation} />
      <div className={styles.content}>
        <PdfParser
          loading={pdfLoading}
          setLoading={setPdfLoading}
          setLines={setPdfLines}
          lines={pdfLines}
          className={styles.pdf}
        />
        <ChatBox lines={pdfLines} className={styles.chat} />
      </div>
    </div>
  );
};

root &&
  ReactDOM.createRoot(root).render(
    <LlmContextProvider>
      <App />
    </LlmContextProvider>
  );
