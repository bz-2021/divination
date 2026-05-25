import styles from './Guide.module.css';

const RULES = [
  { count: '0变爻（静卦）', desc: '以本卦卦辞断之' },
  { count: '1变爻', desc: '以变爻之爻辞断之' },
  { count: '2变爻', desc: '以两变爻中居上一爻之爻辞断之' },
  { count: '3变爻', desc: '以本卦卦辞为主，参之卦卦辞' },
  { count: '4变爻', desc: '以两不变爻中居下一爻之爻辞断之' },
  { count: '5变爻', desc: '以唯一不变爻之爻辞断之' },
  { count: '6变爻（全变）', desc: '乾卦用“用九”，坤卦用“用六”，余卦以之卦卦辞断之' },
];

export default function Guide() {
  return (
    <div className={styles.guide}>
      <h3 className={styles.title}>断卦指南</h3>
      <ul className={styles.list}>
        {RULES.map((rule) => (
          <li key={rule.count} className={styles.item}>
            <span className={styles.count}>{rule.count} </span>
            <span>{rule.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
