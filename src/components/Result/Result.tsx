import { useState, useCallback } from 'react';
import type { LineValue, HexagramResult } from '../../types';
import { generatePrompt, getTransformedResult, getTransformedLines } from '../../utils/divination';
import { generateShareImage } from '../../utils/shareImage';
import Hexagram from '../Hexagram/Hexagram';
import styles from './Result.module.css';

interface ResultProps {
  result: HexagramResult;
  lines: readonly LineValue[];
  question: string;
  onQuestionChange: (q: string) => void;
}

export default function Result({ result, lines, question, onQuestionChange }: ResultProps) {
  const { fullName, guaIndex, changingLines } = result;
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const prompt = generatePrompt(lines, result, question);
  const trans = getTransformedResult(lines);
  const transLines = trans ? getTransformedLines(lines) : null;

  const changingStr = changingLines.length > 0
    ? changingLines.map((n) => `第${n}爻`).join('、')
    : '静卦无变爻';

  const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(`周易第${guaIndex}卦 ${fullName}`)}`;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [prompt]);

  const handleShare = useCallback(async () => {
    setSharing(true);
    const dataUrl = generateShareImage(lines, result.guaName, result.fullName, changingLines);
    const a = document.createElement('a');
    a.download = `${result.guaName}.png`;
    a.href = dataUrl;
    a.click();
    setSharing(false);
  }, [lines, result, changingLines]);

  const shareUrl = `${location.origin}${location.pathname}?lines=${lines.join('')}`;

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        第{guaIndex}卦 {fullName}
      </h3>

      {trans && (
        <div className={styles.dualHexagrams}>
          <div className={styles.guaBox}>
            <span className={styles.guaLabel}>本卦</span>
            <Hexagram lines={lines} compact />
          </div>
          <span className={styles.arrowSep}>&#8594;</span>
          <div className={styles.guaBox}>
            <span className={styles.guaLabel}>之卦</span>
            <Hexagram lines={transLines!} compact />
          </div>
        </div>
      )}
      {!trans && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <Hexagram lines={lines} />
        </div>
      )}

      <p className={styles.info}>
        <span className={styles.label}>变爻：</span>{changingStr}
      </p>

      <div className={styles.questionArea}>
        <textarea
          className={styles.questionInput}
          placeholder="输入你想占问的事情（选填）..."
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          rows={2}
        />
      </div>

      <div className={styles.promptSection}>
        <div className={styles.promptHeader}>
          <span className={styles.promptLabel}>AI 解卦 Prompt</span>
          <div className={styles.promptBtns}>
            <button className={styles.copyBtn} onClick={handleShare}>
              {sharing ? '生成中...' : '保存图片'}
            </button>
            <button className={styles.copyBtn} onClick={handleCopyLink}>
              {copied ? '\u2713 已复制' : '分享链接'}
            </button>
            <button className={styles.copyBtn} onClick={handleCopy}>
              复制 Prompt
            </button>
          </div>
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
