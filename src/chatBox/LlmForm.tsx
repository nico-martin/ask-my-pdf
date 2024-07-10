import React from 'react';
import styles from './LlmForm.module.css';
import { Button, IconName, Message, MESSAGE_TYPE, Modal } from '@theme';
import { nl2br } from '@utils/functions.ts';
import useRagContext from '@store/ragContext/useRagContext.ts';
import cn from '@utils/classnames.ts';
import Benchmarks from './Benchmarks.tsx';

const LlmForm: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { processQuery, prompt } = useRagContext();
  const [busy, setBusy] = React.useState<boolean>(false);
  const [promptModal, setPromptModal] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const query = (
          document.querySelector('textarea[name="search"]') as HTMLInputElement
        ).value;
        if (!query) {
          setBusy(false);
          return;
        }
        try {
          await processQuery(query);
        } catch (error) {
          setError(
            error.toString().includes('Exceed max window length')
              ? 'The generated Prompt is too long. Please adjust the settings and try again.'
              : 'Your prompt could not be processed: ' + error.toString()
          );
        }

        setBusy(false);
      }}
      className={cn(styles.root, className)}
    >
      <label>
        <span>What do you want to know?</span>
        <textarea id="search" name="search" className={styles.search} />
      </label>
      <Button
        icon={IconName.CREATION}
        loading={busy}
        classNameIconWrapper={styles.buttonIconWrapper}
      >
        Let's go
      </Button>
      {error && (
        <Message type={MESSAGE_TYPE.ERROR} className={styles.error}>
          {error}
        </Message>
      )}
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
