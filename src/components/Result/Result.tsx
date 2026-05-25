import { useState, useCallback } from 'react';
import type { LineValue, HexagramResult } from '../../types';
import { generatePrompt } from '../../utils/divination';
import styles from './Result.module.css';

interface ResultProps {
  result: HexagramResult;
  lines: readonly LineValue[];
}

export default function Result({ result, lines }: ResultProps) {
  const { fullName, guaIndex, changingLines } = result;
  const [copied, setCopied] = useState(false);

  const prompt = generatePrompt(lines, result);

  const changingStr = changingLines.length > 0
    ? changingLines.map((n) => `第${n}爻`).join('、')
    : '静卦无变爻';

  const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(`周易第${guaIndex}卦 ${fullName}`)}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = prompt;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [prompt]);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        第{guaIndex}卦 {fullName}
      </h3>
      <p className={styles.info}>
        <span className={styles.label}>变爻：</span>{changingStr}
      </p>

      <div className={styles.promptSection}>
        <div className={styles.promptHeader}>
          <span className={styles.promptLabel}>AI 解卦 Prompt</span>
          <button className={styles.copyBtn} onClick={handleCopy}>
            {copied ? '\u2713 已复制' : '复制 Prompt'}
          </button>
        </div>
        <pre className={styles.promptText}>{prompt}</pre>
      </div>

      <div style={{ textAlign: 'center' }}>
        <a
          className={styles.link}
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          百度搜索卦辞
        </a>
      </div>
    </div>
  );
}
