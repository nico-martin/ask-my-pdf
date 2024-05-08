import React from 'react';
import styles from './LlmForm.module.css';
import { Button, IconName, Modal } from '@theme';
import { nl2br } from '@utils/functions.ts';
import useRagContext from '@store/ragContext/useRagContext.ts';
import cn from '@utils/classnames.ts';
import Benchmarks from './Benchmarks.tsx';

const LlmForm: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { processQuery, prompt } = useRagContext();
  const [busy, setBusy] = React.useState<boolean>(false);
  const [promptModal, setPromptModal] = React.useState<boolean>(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const query = (
          document.querySelector('textarea[name="search"]') as HTMLInputElement
        ).value;
        if (!query) {
          setBusy(false);
          return;
        }
        await processQuery(query);
        setBusy(false);
      }}
      className={cn(styles.root, className)}
    >
      <label>
        <span>What do you want to know?</span>
        <textarea id="search" name="search" className={styles.search}>
          Can I build a Scraper that crawls all posts?
        </textarea>
      </label>
      <Button
        icon={IconName.CREATION}
        loading={busy}
        classNameIconWrapper={styles.buttonIconWrapper}
      >
        Let's go
      </Button>
      {!busy && Boolean(prompt) && (
        <button
          className={styles.showPromptButton}
          onClick={() => setPromptModal(true)}
          type="button"
        >
          ?
        </button>
      )}
      {promptModal && (
        <Modal close={() => setPromptModal(false)} title="Prompt">
          <p dangerouslySetInnerHTML={{ __html: nl2br(prompt) }} />
          <Benchmarks className={styles.benchmarks} />
        </Modal>
      )}
    </form>
  );
};

export default LlmForm;
