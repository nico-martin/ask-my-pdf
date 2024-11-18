import React from 'react';
import styles from './DownloadLlm.module.css';
import { Button, IconName } from '@theme';
import { formatBytes } from '@utils/functions.ts';
import cn from '@utils/classnames.ts';
import useLlm from '@store/llm/useLlm.ts';

const DownloadLlm: React.FC<{ className?: string; onFinish: () => void }> = ({
  className = '',
  onFinish,
}) => {
  const { initialize, model } = useLlm();

  const [downloadLLMRunning, setDownloadLLMRunning] =
    React.useState<boolean>(false);
  const [downloadLLMProgress, setDownloadLLMProgress] =
    React.useState<number>(0);

  return (
    <div className={cn(className, styles.root)}>
      <Button
        loading={downloadLLMRunning}
        icon={IconName.CREATION}
        onClick={async () => {
          setDownloadLLMRunning(true);
          await initialize((str) => {
            setDownloadLLMProgress(str.progress);
          });
          setDownloadLLMRunning(false);
          onFinish();
        }}
        contentWidth={330}
        classNameIconWrapper={styles.buttonIconWrapper}
      >
        download {model.title} (
        {downloadLLMRunning
          ? `${Math.round(downloadLLMProgress * 100)}%`
          : formatBytes(model.size)}
        )
      </Button>
      <p className={styles.modelDescription}>{model.about}</p>
    </div>
  );
};

export default DownloadLlm;
