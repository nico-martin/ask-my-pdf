import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './Navigation.module.css';
import { Button, IconName, Modal } from '@theme';
import useSettingsContext from '@store/settings/useSettingsContext.ts';
import useLlm from '@store/llm/useLlm.ts';

const Navigation: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [aboutModal, setAboutModal] = React.useState<boolean>(false);
  const [legalModal, setLegalModal] = React.useState<boolean>(false);
  const { setShowModal } = useSettingsContext();
  const { model } = useLlm();
  return (
    <nav className={cn(className, styles.root)}>
      <span className={styles.title}>Ask my PDF</span>
      <button className={styles.about} onClick={() => setAboutModal(true)}>
        About
      </button>
      <button className={styles.legal} onClick={() => setLegalModal(true)}>
        Legal
      </button>
      <a
        className={styles.github}
        href="https://github.com/nico-martin/ask-my-pdf"
        target="_blank"
      >
        GitHub
      </a>
      <Button
        className={styles.settings}
        icon={IconName.COG_OUTLINE}
        //href="https://github.com/nico-martin/ask-my-pdf"
        //target="_blank"
        onClick={() => setShowModal(true)}
      >
        Settings
      </Button>
      {aboutModal && (
        <Modal close={() => setAboutModal(false)} title="About">
          <p>
            <b>
              Ask my PDF is a tool that uses Retrieval Augmented Generation
              (RAG) and Artificial Intelligence to interact with a PDF directly
              in the browser.
            </b>
          </p>
          <p>There are three main pillars this tool is based on:</p>
          <h3>1. Read the PDF</h3>
          <p>
            <b>Ask my PDF</b> uses{' '}
            <a href="https://www.npmjs.com/package/pdfjs-dist" target="_blank">
              PDF.js
            </a>{' '}
            to process a PDF locally and split the content up into separate
            paragraphs and sentences.
          </p>
          <h3>2. Vector Search</h3>
          <p>
            Individual paragraphs and then sentences are extracted from the
            document and will be mapped to a multi-dimensional dense vector
            space using{' '}
            <a
              href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2"
              target="_blank"
            >
              all-MiniLM-L6-v2
            </a>{' '}
            with{' '}
            <a href="https://github.com/xenova/transformers.js" target="_blank">
              TransformersJS
            </a>
            . Other models can be selected in the settings. Those entries are
            then stored in an in-memory{' '}
            <a
              href="https://gist.github.com/nico-martin/64f2ae35ed9a0f890ef50c8d119a6222"
              target="_blank"
            >
              VectorDB
            </a>{' '}
            directly in the browser.
          </p>
          <p>
            As soon as a query is submitted, it is also vectorized and the
            cosine similarity search is used to find the most similar text
            sections, together with the lines surrounding them, so as not to
            lose the context.
          </p>
          <h3>3. LLM answer generation</h3>
          <p>
            The text sections found this way together with the query and a few
            instructions are then used as the input prompt to the{' '}
            <a href={model.cardLink} target="_blank">
              {model.title}
            </a>{' '}
            LLM, compiled to WebAssembly and WebGPU using{' '}
            <a href="https://llm.mlc.ai/" target="_blank">
              MLC LLM
            </a>
            , which will then generate a response.
          </p>
          <h2>Credits</h2>
          <p>
            <b>Ask my PDF</b> is a project by{' '}
            <a href="https://nico.dev/" target="_blank">
              Nico Martin
            </a>
            .
          </p>
          <h3>Dependencies</h3>
          <p>
            <a
              href="https://github.com/nico-martin/ask-my-pdf/blob/main/package.json"
              target="_blank"
            >
              https://github.com/nico-martin/ask-my-pdf/blob/main/package.json
            </a>
          </p>

          <h3>Open Source</h3>
          <p>
            <b>Ask my PDF</b> is publicly available on GitHub and is licensed
            under an{' '}
            <a
              href="https://github.com/nico-martin/ask-my-pdf/blob/main/LICENSE"
              target="_blank"
            >
              open source license
            </a>
            . Just like most of my projects.
          </p>
          <p>
            <a href="https://github.com/nico-martin/ask-my-pdf" target="_blank">
              https://github.com/nico-martin/ask-my-pdf
            </a>
          </p>
        </Modal>
      )}
      {legalModal && (
        <Modal close={() => setLegalModal(false)} title="Legal">
          <p>Responsible for the content of this website:</p>
          <p>
            Nico Martin
            <br />
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
