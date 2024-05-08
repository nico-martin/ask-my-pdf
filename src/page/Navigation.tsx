import React from 'react';
import cn from '@utils/classnames.tsx';
import styles from './Navigation.module.css';
import { Button, IconName, Modal } from '@theme';

const Navigation: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [aboutModal, setAboutModal] = React.useState<boolean>(false);
  const [legalModal, setLegalModal] = React.useState<boolean>(false);
  return (
    <nav className={cn(className, styles.root)}>
      <span className={styles.title}>Ask my PDF</span>
      <button className={styles.about} onClick={() => setAboutModal(true)}>
        About
      </button>
      <button className={styles.legal} onClick={() => setLegalModal(true)}>
        Legal
      </button>
      <Button
        className={styles.github}
        icon={IconName.GITHUB}
        href="https://github.com/nico-martin/ask-my-pdf"
        target="_blank"
      >
        It's Open Source!
      </Button>
      {aboutModal && (
        <Modal close={() => setAboutModal(false)} title="About">
          <p>
            <b>Ask my PDF</b> is a tool that uses Retrieval Augmented Generation
            (RAG) to interact with a PDF.
          </p>
        </Modal>
      )}
      {legalModal && (
        <Modal close={() => setLegalModal(false)} title="Legal">
          <p>Responsible for the content of this website:</p>
          <p>
            Nico Martin
            <br />
            Marquard-Wocher Strasse 11
            <br />
            3600 Thun
          </p>
          <p>
            <a href="https://nico.dev" target="_blank">
              https://nico.dev
            </a>
            <br />
            <a href="mailto:mail@nico.dev">mail@nico.dev</a>
          </p>
          <h2>Disclaimer</h2>
          <p>
            The texts and contents of this site were created with great care.
            Nevertheless, I cannot give any guarantee with regard to the
            correctness, accuracy, up-to-dateness, reliability and completeness
            of the information.
          </p>
          <h2>Privacy</h2>
          <p>This web app does not collect any personal data.</p>
        </Modal>
      )}
    </nav>
  );
};

export default Navigation;
