import { useState, useCallback, useRef } from 'react';
import type { LineValue } from '../types';
import { getResult } from '../utils/divination';
import Coin from './Coin/Coin';
import Hexagram from './Hexagram/Hexagram';
import Result from './Result/Result';
import Guide from './Guide/Guide';
import styles from './App.module.css';

const ANIMATION_DURATION = 2600;
const BASE_SPINS = 8;

function getTargetAngles(prevAngles: number[], results: number[]): number[] {
  return results.map((r, i) => {
    const base = (prevAngles[i] ?? 0) + BASE_SPINS * 360;
    return r === 0 ? base : base + 180;
  });
}

export default function App() {
  const [phase, setPhase] = useState<'idle' | 'flipping' | 'result'>('idle');
  const [lines, setLines] = useState<LineValue[]>([]);
  const [result, setResultState] = useState<ReturnType<typeof getResult>>(null);
  const [coinAngles, setCoinAngles] = useState([0, 0, 0]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleShake = useCallback(() => {
    if (phase !== 'idle' || lines.length >= 6) return;
    setPhase('flipping');

    const results = [
      Math.random() < 0.5 ? 0 : 1,
      Math.random() < 0.5 ? 0 : 1,
      Math.random() < 0.5 ? 0 : 1,
    ];
    const line = (results[0] + results[1] + results[2]) as LineValue;

    timerRef.current = setTimeout(() => {
      const newLines = [...lines, line];
      setLines(newLines);
      if (newLines.length >= 6) {
        setResultState(getResult(newLines));
        setPhase('result');
      } else {
        setPhase('idle');
      }
      timerRef.current = null;
    }, ANIMATION_DURATION);

    setCoinAngles((prev) => getTargetAngles(prev, results));
  }, [phase, lines]);

  const handleReset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPhase('idle');
    setLines([]);
    setResultState(null);
    setCoinAngles([0, 0, 0]);
  }, []);

  const isFlipping = phase === 'flipping';
  const showResult = phase === 'result' && result !== null;

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>周易算卦</h1>
        <p className={styles.subtitle}>三枚铜钱 · 六爻成卦</p>
      </header>

      <main className={styles.main}>
        <div className={styles.boardContainer}>
          <p className={styles.progress}>
            {lines.length > 0 ? `第 ${lines.length} / 6 爻` : '\u00A0'}
          </p>

          <div className={styles.coins}>
            {coinAngles.map((angle, i) => (
              <Coin key={i} targetAngle={angle} />
            ))}
          </div>

          <div className={styles.hexagramArea}>
            <Hexagram lines={lines} />
          </div>
        </div>

        <div className={styles.btnRow}>
          {!showResult && (
            <button
              className={`${styles.btn} ${styles.btnShake}`}
              disabled={isFlipping || lines.length >= 6}
              onClick={handleShake}
            >
              {lines.length === 0 ? '开始摇卦' : `摇第${lines.length + 1}爻`}
            </button>
          )}
          {lines.length > 0 && (
            <button className={`${styles.btn} ${styles.btnReset}`} onClick={handleReset}>
              重新起卦
            </button>
          )}
        </div>

        {showResult && (
          <div className={styles.resultArea}>
            <Result result={result!} lines={lines} />
          </div>
        )}

        <Guide />
      </main>

      <footer className={styles.footer}>
        周易六爻 · 金钱卦法
      </footer>
    </div>
  );
}
