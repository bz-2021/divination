import type { LineValue } from '../../types';
import styles from './ManualInput.module.css';

const POS_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
const OPTIONS: { val: LineValue; label: string }[] = [
  { val: 0, label: '老阴 ×' },
  { val: 1, label: '少阳' },
  { val: 2, label: '少阴' },
  { val: 3, label: '老阳 ○' },
];

interface ManualInputProps {
  lines: LineValue[];
  onChange: (pos: number, val: LineValue) => void;
  onConfirm: () => void;
}

export default function ManualInput({ lines, onChange, onConfirm }: ManualInputProps) {
  const allSet = lines.length === 6 && lines.every((v) => v !== undefined);

  return (
    <div className={styles.container}>
      {[0, 1, 2, 3, 4, 5].map((pos) => (
        <div key={pos} className={styles.row}>
          <span className={styles.pos}>{POS_NAMES[pos]}</span>
          <div className={styles.options}>
            {OPTIONS.map((opt) => (
              <button
                key={opt.val}
                className={`${styles.opt} ${lines[pos] === opt.val ? styles.optActive : ''}`}
                onClick={() => onChange(pos, opt.val)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        className={styles.confirmBtn}
        disabled={!allSet}
        onClick={onConfirm}
      >
        确认卦象
      </button>
    </div>
  );
}
