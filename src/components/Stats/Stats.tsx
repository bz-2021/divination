import { useMemo } from 'react';
import type { HistoryEntry } from '../../utils/history';
import styles from './Stats.module.css';

interface StatsProps {
  entries: HistoryEntry[];
}

export default function Stats({ entries }: StatsProps) {
  const stats = useMemo(() => {
    if (entries.length === 0) return null;

    const freq: Record<string, number> = {};
    const changingCounts: number[] = [0, 0, 0, 0, 0, 0, 0];
    let mostCommonGua = '';
    let maxCount = 0;

    for (const entry of entries) {
      const key = `${entry.result.guaIndex} ${entry.result.guaName}`;
      freq[key] = (freq[key] ?? 0) + 1;
      if (freq[key] > maxCount) {
        maxCount = freq[key];
        mostCommonGua = key;
      }
      const cl = entry.result.changingLines.length;
      changingCounts[cl]++;
    }

    const top = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const typeCount = changingCounts.filter((c) => c > 0).length;

    return { top, mostCommonGua, maxCount, typeCount };
  }, [entries]);

  if (!stats) {
    return (
      <div className={styles.container}>
        <h3 className={styles.heading}>起卦统计</h3>
        <p className={styles.empty}>暂无数据，先摇几次卦吧</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>起卦统计</h3>

      <div className={styles.cards}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎲</div>
          <div className={styles.statValue}>{entries.length}</div>
          <div className={styles.statLabel}>总起卦次数</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏆</div>
          <div className={styles.statValue}>{stats.maxCount}</div>
          <div className={styles.statLabel}>最常出现</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>↗</div>
          <div className={styles.statValue}>{stats.typeCount}</div>
          <div className={styles.statLabel}>变爻类型数</div>
        </div>
      </div>

      <div className={styles.barChart}>
        {stats.top.map(([name, count]) => (
          <div key={name} className={styles.barRow}>
            <span className={styles.barLabel}>第{name}</span>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${(count / stats.maxCount) * 100}%` }}
              />
            </div>
            <span className={styles.barCount}>{count}次</span>
          </div>
        ))}
      </div>
    </div>
  );
}
