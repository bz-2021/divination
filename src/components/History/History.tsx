import { useState } from 'react';
import type { LineValue } from '../../types';
import type { HistoryEntry } from '../../utils/history';
import { lineLabel, getTransformedResult } from '../../utils/divination';
import styles from './History.module.css';

interface HistoryProps {
  entries: HistoryEntry[];
  onDelete: (id: number) => void;
  onView: (entry: HistoryEntry) => void;
  onUpdateNote: (id: number, note: string) => void;
  onUpdateVerified: (id: number, verified: boolean | null) => void;
}

const INDICATORS: Record<number, string> = { 0: '\u00D7', 1: '', 2: '', 3: '\u25CB' };

function MiniHex({ lines }: { lines: readonly LineValue[] }) {
  return (
    <div className={styles.miniHex}>
      {[...lines].map((val, i) => (
        <div
          key={i}
          className={`${styles.miniLine} ${val > 1 ? styles.miniYang : styles.miniYin}`}
        />
      ))}
    </div>
  );
}

function DetailHex({ lines }: { lines: readonly LineValue[] }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column-reverse', gap: 2,
      width: 180, margin: '0 auto',
    }}>
      {[...lines].map((val, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 4, height: 16,
        }}>
          <span style={{
            width: 36, textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-muted)',
          }}>
            {lineLabel(i, val, false)}
          </span>
          <div style={{ flex: 1, height: 12, position: 'relative' }}>
            {val <= 1 ? (
              <>
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: '40%', background: 'var(--yin)', borderRadius: 2,
                }} />
                <div style={{
                  position: 'absolute', right: 0, top: 0, height: '100%',
                  width: '40%', background: 'var(--yin)', borderRadius: 2,
                }} />
              </>
            ) : (
              <div style={{
                height: '100%', background: 'var(--accent)', borderRadius: 2,
              }} />
            )}
          </div>
          <span style={{
            width: 16, fontSize: '0.8rem', textAlign: 'center',
            color: val === 0 || val === 3 ? 'var(--accent)' : 'transparent',
            fontWeight: 'bold',
          }}>
            {INDICATORS[val] || '\u00A0'}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function History({ entries, onDelete, onView, onUpdateNote, onUpdateVerified }: HistoryProps) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const count = entries.length;

  const toggleDetail = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleDelete = () => {
    if (deleteTarget == null) return;
    onDelete(deleteTarget);
    setDeleteTarget(null);
    setOpenId(null);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>
        历史记录 <span className={styles.count}>({count})</span>
      </h3>
      {count === 0 ? (
        <p className={styles.empty}>暂无记录</p>
      ) : (
        <ul className={styles.list}>
          {[...entries].reverse().map((entry) => {
            const trans = getTransformedResult(entry.lines);
            const isOpen = openId === entry.id;

            return (
              <li key={entry.id}>
                <div className={styles.card}>
                  <div className={styles.cardRow}>
                    <div onClick={() => toggleDetail(entry.id)}>
                      <MiniHex lines={entry.lines} />
                    </div>
                    <div className={styles.cardBody} onClick={() => toggleDetail(entry.id)}>
                      <span className={styles.date}>{entry.date}</span>
                      <span className={styles.name}>
                        第{entry.result.guaIndex}卦 {entry.result.guaName}
                      </span>
                      <div className={styles.meta}>
                        {entry.result.changingLines.length > 0 && (
                          <span className={styles.changing}>
                            变: {entry.result.changingLines.join(',')}
                          </span>
                        )}
                        {entry.verified === true && (
                          <span className={`${styles.badge} ${styles.badgeYes}`}>已应验</span>
                        )}
                        {entry.verified === false && (
                          <span className={`${styles.badge} ${styles.badgeNo}`}>未应验</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => onView(entry)}
                      >
                        查看
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => setDeleteTarget(entry.id)}
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className={styles.detailBody}>
                      <div className={styles.detailRow}>
                        <div className={styles.verifyGroup}>
                          <button
                            className={`${styles.verifyBtn} ${entry.verified === true ? styles.verifyActive : ''}`}
                            onClick={() => onUpdateVerified(entry.id, entry.verified === true ? null : true)}
                          >
                            {entry.verified === true ? '✓ 已应验' : '标记应验'}
                          </button>
                          <button
                            className={`${styles.verifyBtn} ${entry.verified === false ? styles.verifyFail : ''}`}
                            onClick={() => onUpdateVerified(entry.id, entry.verified === false ? null : false)}
                          >
                            {entry.verified === false ? '✗ 未应验' : '标记未应验'}
                          </button>
                        </div>
                      </div>

                      <div className={styles.detailHex}>
                        <DetailHex lines={entry.lines} />
                      </div>

                      {trans && (
                        <p style={{
                          textAlign: 'center', fontSize: '0.8rem',
                          color: 'var(--text-muted)', margin: '0 0 0.4rem',
                        }}>
                          → 之卦：{trans.fullName}
                        </p>
                      )}

                      {editingNoteId === entry.id ? (
                        <textarea
                          className={styles.noteInput}
                          value={entry.note}
                          onChange={(e) => onUpdateNote(entry.id, e.target.value)}
                          onBlur={() => setEditingNoteId(null)}
                          placeholder="添加备注..."
                          rows={2}
                          autoFocus
                        />
                      ) : (
                        <p
                          className={styles.noteText}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setEditingNoteId(entry.id)}
                        >
                          {entry.note || '点击添加备注...'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {deleteTarget != null && (
        <div className={styles.overlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <p className={styles.dialogText}>确定要删除这条记录吗？此操作不可撤销。</p>
            <div className={styles.dialogBtns}>
              <button className={`${styles.dialogBtn} ${styles.dialogCancel}`} onClick={() => setDeleteTarget(null)}>
                取消
              </button>
              <button className={`${styles.dialogBtn} ${styles.dialogConfirm}`} onClick={handleDelete}>
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
