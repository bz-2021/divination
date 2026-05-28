import type { LineValue, HexagramResult } from '../types';

export interface HistoryEntry {
  id: number;
  date: string;
  result: HexagramResult;
  lines: readonly LineValue[];
  note: string;
  verified: boolean | null;
}

const KEY = 'divination_history';

function load(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    const entries = raw ? JSON.parse(raw) : [];
    return entries.map((e: HistoryEntry) => ({
      ...e,
      verified: e.verified ?? null,
    }));
  } catch {
    return [];
  }
}

function save(entries: HistoryEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries.slice(-50)));
}

export function getHistory(): HistoryEntry[] {
  return load();
}

export function addHistory(result: HexagramResult, lines: readonly LineValue[]): HistoryEntry[] {
  const entries = load();
  const entry: HistoryEntry = {
    id: Date.now(),
    date: new Date().toLocaleString('zh-CN'),
    result,
    lines,
    note: '',
    verified: null,
  };
  entries.push(entry);
  save(entries);
  return entries;
}

export function removeHistory(id: number): HistoryEntry[] {
  const entries = load().filter((e) => e.id !== id);
  save(entries);
  return entries;
}

export function updateNote(id: number, note: string): HistoryEntry[] {
  const entries = load().map((e) => (e.id === id ? { ...e, note } : e));
  save(entries);
  return entries;
}

export function updateVerified(id: number, verified: boolean | null): HistoryEntry[] {
  const entries = load().map((e) => (e.id === id ? { ...e, verified } : e));
  save(entries);
  return entries;
}
