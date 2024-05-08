import React from 'react';
import ReactDOM from 'react-dom/client';
import PdfParser from './pdfParser/PdfParser.tsx';
import ChatBox from './chatBox/ChatBox.tsx';
import LlmContextProvider from './store/llm/LlmContextProvider.tsx';
import Navigation from './page/Navigation.tsx';
import styles from './App.module.css';
import RagContextProvider from '@store/ragContext/RagContextProvider.tsx';

const root = document.getElementById('app');

const App: React.FC = () => (
  <div className={styles.root}>
    <Navigation className={styles.navigation} />
    <div className={styles.content}>
      <PdfParser className={styles.pdf} />
      <ChatBox className={styles.chat} />
    </div>
  </div>
);

root &&
  ReactDOM.createRoot(root).render(
    <LlmContextProvider>
      <RagContextProvider>
        <App />
      </RagContextProvider>
    </LlmContextProvider>
  );
