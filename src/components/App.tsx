import { useState, useCallback, useRef, useEffect } from 'react';
import type { LineValue } from '../types';
import { getResult } from '../utils/divination';
import { getHistory, addHistory, removeHistory, updateNote, updateVerified } from '../utils/history';
import { playTossSound } from '../utils/sounds';
import type { HistoryEntry } from '../utils/history';
import Coin from './Coin/Coin';
import Hexagram from './Hexagram/Hexagram';
import Result from './Result/Result';
import Guide from './Guide/Guide';
import ManualInput from './ManualInput/ManualInput';
import History from './History/History';
import GuaBrowser from './GuaBrowser/GuaBrowser';
import Stats from './Stats/Stats';
import styles from './App.module.css';

const ANIMATION_DURATION = 2500;
const BASE_SPINS = 8;
const TABS = [
  { key: 'divination', icon: '🪙', label: '起卦' },
  { key: 'stats', icon: '📊', label: '统计' },
  { key: 'history', icon: '📋', label: '历史' },
  { key: 'gua', icon: '📖', label: '六十四卦' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

function getTargetAngles(prevAngles: number[], bits: number[]): number[] {
  return bits.map((b, i) => {
    const current = prevAngles[i] ?? 0;
    const halfTurns = Math.round(current / 180);
    const isHead = halfTurns % 2 === 0;

    let extra = 0;
    if (b === 1 && !isHead) extra = 1;
    if (b === 0 && isHead) extra = 1;

    return current + (BASE_SPINS * 2 + extra) * 180;
  });
}

function parseShareUrl(): LineValue[] | null {
  try {
    const raw = new URLSearchParams(location.search).get('lines');
    if (!raw || raw.length !== 6) return null;
    const vals = raw.split('').map(Number);
    if (vals.some((v) => v < 0 || v > 3)) return null;
    return vals as LineValue[];
  } catch {
    return null;
  }
}

export default function App() {
  const sharedLines = parseShareUrl();
  const [tab, setTab] = useState<TabKey>('divination');
  const [mode, setMode] = useState<'coin' | 'manual'>('coin');
  const [phase, setPhase] = useState<'idle' | 'flipping' | 'result'>(sharedLines ? 'result' : 'idle');
  const [lines, setLines] = useState<LineValue[]>(sharedLines ?? []);
  const [result, setResultState] = useState<ReturnType<typeof getResult>>(() => sharedLines ? getResult(sharedLines) : null);
  const [coinAngles, setCoinAngles] = useState([0, 0, 0]);
  const [question, setQuestion] = useState('');
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>(() => getHistory());
  const [manualLines, setManualLines] = useState<LineValue[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const finalize = useCallback((newLines: LineValue[]) => {
    setLines(newLines);
    const res = getResult(newLines)!;
    setResultState(res);
    setPhase('result');
    setHistoryEntries(addHistory(res, newLines));
  }, []);

  const handleShake = useCallback(() => {
    if (phase !== 'idle' || lines.length >= 6) return;
    setPhase('flipping');

    playTossSound();

    const bits = [
      Math.random() < 0.5 ? 1 : 0,
      Math.random() < 0.5 ? 1 : 0,
      Math.random() < 0.5 ? 1 : 0,
    ];
    const line = (bits[0] + bits[1] + bits[2]) as LineValue;

    timerRef.current = setTimeout(() => {
      const newLines = [...lines, line];
      setLines(newLines);
      if (newLines.length >= 6) {
        finalize(newLines);
      } else {
        setPhase('idle');
      }
      timerRef.current = null;
    }, ANIMATION_DURATION);

    setCoinAngles((prev) => getTargetAngles(prev, bits));
  }, [phase, lines, finalize]);

  const handleReset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPhase('idle');
    setLines([]);
    setResultState(null);
    setCoinAngles([0, 0, 0]);
    setManualLines([]);
  }, []);

  const handleManualChange = useCallback((pos: number, val: LineValue) => {
    setManualLines((prev) => {
      const next = [...prev];
      next[pos] = val;
      return next;
    });
  }, []);

  const handleManualConfirm = useCallback(() => {
    if (manualLines.length !== 6 || manualLines.some((v) => v === undefined)) return;
    setMode('coin');
    finalize(manualLines);
  }, [manualLines, finalize]);

  const handleHistoryDelete = useCallback((id: number) => {
    setHistoryEntries(removeHistory(id));
  }, []);

  const handleHistoryUpdateNote = useCallback((id: number, note: string) => {
    setHistoryEntries(updateNote(id, note));
  }, []);

  const handleUpdateVerified = useCallback((id: number, verified: boolean | null) => {
    setHistoryEntries(updateVerified(id, verified));
  }, []);

  const handleHistoryView = useCallback((entry: HistoryEntry) => {
    handleReset();
    setLines([...entry.lines]);
    setResultState(entry.result);
    setPhase('result');
    setTab('divination');
  }, [handleReset]);

  const isFlipping = phase === 'flipping';
  const showResult = phase === 'result' && result !== null;

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>周易算卦</h1>
        <p className={styles.subtitle}>三枚铜钱 · 六爻成卦</p>
      </header>

      <main className={styles.main}>
        {tab === 'divination' && (
          <>
            {mode === 'coin' && !showResult && (
              <div style={{ marginBottom: '0.75rem', textAlign: 'center' }}>
                <button
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => { handleReset(); setMode('manual'); }}
                  style={{ padding: '0.35rem 1.3rem', fontSize: '0.85rem' }}
                >
                  切换手动排卦
                </button>
              </div>
            )}

            {mode === 'manual' && !showResult && (
              <div className={styles.boardContainer}>
                <ManualInput
                  lines={manualLines}
                  onChange={handleManualChange}
                  onConfirm={handleManualConfirm}
                />
                <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                  <button
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => { handleReset(); setMode('coin'); }}
                    style={{ padding: '0.35rem 1.3rem', fontSize: '0.85rem' }}
                  >
                    返回摇卦模式
                  </button>
                </div>
              </div>
            )}

            {mode === 'coin' && (
              <div className={styles.boardContainer}>
                <p className={`${styles.progress} ${isFlipping ? styles.flipHint : ''}`}>
                  {isFlipping
                    ? '铜钱翻转中...'
                    : lines.length > 0
                      ? `第 ${lines.length} / 6 爻`
                      : '\u00A0'}
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
            )}

            {!showResult && mode === 'coin' && (
              <div className={styles.btnRow}>
                <button
                  className={`${styles.btn} ${styles.btnShake}`}
                  disabled={isFlipping || lines.length >= 6}
                  onClick={handleShake}
                  type="button"
                >
                  {lines.length === 0 ? '开始摇卦' : `摇第${lines.length + 1}爻`}
                </button>
                {lines.length > 0 && (
                  <button
                    className={`${styles.btn} ${styles.btnReset}`}
                    disabled={isFlipping}
                    onClick={handleReset}
                    type="button"
                  >
                    重新起卦
                  </button>
                )}
              </div>
            )}

            {showResult && (
              <>
                <div className={styles.btnRow}>
                  <button
                    className={`${styles.btn} ${styles.btnReset}`}
                    onClick={handleReset}
                    type="button"
                  >
                    重新起卦
                  </button>
                </div>
                <div className={styles.resultArea}>
                  <Result
                    result={result!}
                    lines={lines}
                    question={question}
                    onQuestionChange={setQuestion}
                  />
                </div>
              </>
            )}

            <Guide />
          </>
        )}

        {tab === 'stats' && (
          <div style={{ width: '100%', padding: '1rem 0' }}>
            <Stats entries={historyEntries} />
          </div>
        )}

        {tab === 'history' && (
          <div style={{ width: '100%', padding: '0.5rem 0' }}>
            <History
              entries={historyEntries}
              onDelete={handleHistoryDelete}
              onView={handleHistoryView}
              onUpdateNote={handleHistoryUpdateNote}
              onUpdateVerified={handleUpdateVerified}
            />
          </div>
        )}

        {tab === 'gua' && (
          <div style={{ width: '100%', padding: '0.5rem 0' }}>
            <GuaBrowser />
          </div>
        )}
      </main>

      <nav className={styles.tabBar}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`${styles.tabBtn} ${tab === t.key ? styles.tabBtnActive : ''}`}
            onClick={() => setTab(t.key)}
          >
            <span className={styles.tabIcon}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      <footer className={styles.footer}>
        周易六爻 · 金钱卦法
      </footer>
    </div>
  );
}
