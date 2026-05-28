import { useState, useMemo } from 'react';
import guaList from '../../data/GuaList.json';
import styles from './GuaBrowser.module.css';

export default function GuaBrowser() {
  const [search, setSearch] = useState('');

  const items = useMemo(() => {
    return (guaList as string[]).map((name, i) => ({ index: i, name }));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.trim();
    return items.filter(
      (item) =>
        item.name.includes(q) ||
        String(item.index + 1) === q,
    );
  }, [items, search]);

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>六十四卦</h3>
      <input
        className={styles.search}
        placeholder="搜索卦名或序号..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filtered.length === 0 ? (
        <p className={styles.noResult}>无匹配结果</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((item) => (
            <a
              key={item.index}
              className={styles.item}
              href={`https://www.baidu.com/s?wd=${encodeURIComponent(`周易第${item.index + 1}卦 ${item.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong style={{ color: 'var(--accent)' }}>{item.index + 1}</strong> {item.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
