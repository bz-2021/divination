import type { TrigramIndex, TrigramName } from '../types';

export const TRIGRAM_NAMES: readonly TrigramName[] = [
  '坤', '震', '坎', '兑', '艮', '离', '巽', '乾',
] as const;

export const TRIGRAM_SYMBOLS: readonly string[] = [
  '地', '雷', '水', '泽', '山', '火', '风', '天',
] as const;

export const TRIGRAM_MAP: Record<TrigramName, TrigramIndex> = {
  坤: 0,
  震: 1,
  坎: 2,
  兑: 3,
  艮: 4,
  离: 5,
  巽: 6,
  乾: 7,
};
