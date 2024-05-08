import React from 'react';
import styles from './ChatBox.module.css';
import { Button, IconName, Modal } from '@theme';
import { nl2br } from '@utils/functions.ts';
import useRagContext from '@store/ragContext/useRagContext.ts';

const LlmForm: React.FC = () => {
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
        console.log('query', query);

        await processQuery(query);
        console.log('query processed', query);
        setBusy(false);
      }}
      className={styles.promptForm}
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
        </Modal>
      )}
    </form>
  );
};

export default LlmForm;
