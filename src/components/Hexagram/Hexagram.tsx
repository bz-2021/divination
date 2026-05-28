import type { LineValue } from '../../types';
import { lineLabel } from '../../utils/divination';
import styles from './Hexagram.module.css';

interface HexagramProps {
  lines: readonly LineValue[];
  compact?: boolean;
}

const INDICATORS: Record<number, string> = {
  0: '\u00D7',
  1: '',
  2: '',
  3: '\u25CB',
};

function Bar({ value }: { value: LineValue }) {
  return value <= 1 ? (
    <>
      <div className={`${styles.bar} ${styles.yin} ${styles.yinLeft}`} />
      <div className={`${styles.bar} ${styles.yin} ${styles.yinRight}`} />
    </>
  ) : (
    <div className={`${styles.bar} ${styles.yang}`} />
  );
}

export default function Hexagram({ lines, compact }: HexagramProps) {
  return (
    <div className={`${styles.diagram} ${compact ? styles.compact : ''}`}>
      {[0, 1, 2, 3, 4, 5].map((pos) => (
        <div key={pos} className={styles.lineRow}>
          {pos < lines.length ? (
            <>
              <span className={styles.label}>{lineLabel(pos, lines[pos], false)}</span>
              <div className={styles.barContainer}>
                <Bar value={lines[pos]} />
              </div>
              <span className={styles.indicator}>{INDICATORS[lines[pos]]}</span>
            </>
          ) : (
            <div className={styles.barContainer} />
          )}
        </div>
      ))}
    </div>
  );
}
