import React from 'react';
import styles from './ChatBox.module.css';
import { Button, IconName } from '@theme';
import { formatBytes } from '@utils/functions.ts';
import Gemma2B from '@store/llm/webllm/models/Gemma2B.ts';
import cn from '@utils/classnames.ts';
import useLlm from '@store/llm/useLlm.ts';

const DownloadLlm: React.FC<{ className?: string; onFinish: () => void }> = ({
  className = '',
  onFinish,
}) => {
  const { initialize } = useLlm();

  const [downloadLLMRunning, setDownloadLLMRunning] =
    React.useState<boolean>(false);
  const [downloadLLMProgress, setDownloadLLMProgress] =
    React.useState<number>(0);

  return (
    <div className={cn(className)}>
      <Button
        icon={IconName.CREATION}
        onClick={async () => {
          setDownloadLLMRunning(true);
          await initialize((str) => {
            setDownloadLLMProgress(str.progress);
          });
          setDownloadLLMRunning(false);
          onFinish();
        }}
        contentWidth={292}
        classNameIconWrapper={styles.buttonIconWrapper}
      >
        download Gemma 2b (
        {downloadLLMRunning
          ? `${Math.round(downloadLLMProgress * 100)}%`
          : formatBytes(Gemma2B.size)}
        )
      </Button>
      <p className={styles.modelDescription}>{Gemma2B.about}</p>
    </div>
  );
};

export default DownloadLlm;
