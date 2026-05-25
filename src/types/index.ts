export type LineValue = 0 | 1 | 2 | 3;

export type TrigramIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type TrigramName = '坤' | '震' | '坎' | '兑' | '艮' | '离' | '巽' | '乾';

export interface HexagramResult {
  readonly guaIndex: number;
  readonly guaName: string;
  readonly fullName: string;
  readonly upTrigram: TrigramName;
  readonly downTrigram: TrigramName;
  readonly changingLines: readonly number[];
}

export type AnimationPhase = 'idle' | 'flipping' | 'result';
