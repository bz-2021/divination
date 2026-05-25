import type { LineValue } from '../../types';
import styles from './Hexagram.module.css';

interface HexagramProps {
  lines: readonly LineValue[];
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

export default function Hexagram({ lines }: HexagramProps) {
  return (
    <div className={styles.diagram}>
      {[0, 1, 2, 3, 4, 5].map((pos) => (
        <div key={pos} className={styles.lineRow}>
          {pos < lines.length ? (
            <>
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
