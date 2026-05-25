import type { LineValue, TrigramIndex, HexagramResult } from '../types';
import { TRIGRAM_NAMES, TRIGRAM_SYMBOLS } from '../data/trigrams';
import guaMap from '../data/GuaMap.json';
import guaList from '../data/GuaList.json';

const POSITION_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

const RULES: Record<number, string> = {
  0: '以本卦卦辞断之',
  1: '以变爻之爻辞断之',
  2: '以两变爻中居上一爻之爻辞断之',
  3: '以本卦卦辞为主，参看之卦卦辞',
  4: '以两不变爻中居下一爻之爻辞断之',
  5: '以唯一不变爻之爻辞断之',
  6: '全变：乾卦用"用九"，坤卦用"用六"，余卦以之卦卦辞断之',
};

export function getTrigramIndex(a: LineValue, b: LineValue, c: LineValue): TrigramIndex {
  const bit = (v: LineValue) => (v > 1 ? 1 : 0);
  return ((bit(c) << 2) | (bit(b) << 1) | bit(a)) as TrigramIndex;
}

export function getChangingLines(lines: readonly LineValue[]): number[] {
  return lines.reduce<number[]>((acc, val, idx) => {
    if (val === 0 || val === 3) {
      acc.push(idx + 1);
    }
    return acc;
  }, []);
}

export function getResult(lines: readonly LineValue[]): HexagramResult | null {
  if (lines.length !== 6) return null;

  const downIndex = getTrigramIndex(lines[0], lines[1], lines[2]);
  const upIndex = getTrigramIndex(lines[3], lines[4], lines[5]);

  const guaNumber = (guaMap as number[][])[upIndex][downIndex];
  const guaName = guaList[guaNumber - 1];

  const upName = TRIGRAM_NAMES[upIndex];
  const downName = TRIGRAM_NAMES[downIndex];

  let fullName: string;
  if (upIndex === downIndex) {
    fullName = `${guaName} (${upName}为${TRIGRAM_SYMBOLS[upIndex]})`;
  } else {
    fullName = `${guaName} (${upName}${downName}${TRIGRAM_SYMBOLS[upIndex]}${TRIGRAM_SYMBOLS[downIndex]})`;
  }

  return {
    guaIndex: guaNumber,
    guaName,
    fullName,
    upTrigram: upName,
    downTrigram: downName,
    changingLines: getChangingLines(lines),
  };
}

function lineLabel(pos: number, val: LineValue): string {
  const prefix = val > 1 ? '九' : '六';
  const name = pos === 0 ? `初${prefix}` : pos === 5 ? `上${prefix}` : `${prefix}${pos + 1}`;
  const mark = val === 0 ? ' \u00D7' : val === 3 ? ' \u25CB' : '';
  return `${name}${mark}`;
}

export function generatePrompt(lines: readonly LineValue[], result: HexagramResult): string {
  const { fullName, upTrigram, downTrigram, changingLines } = result;
  const upSymbol = TRIGRAM_SYMBOLS[TRIGRAM_NAMES.indexOf(upTrigram)];
  const downSymbol = TRIGRAM_SYMBOLS[TRIGRAM_NAMES.indexOf(downTrigram)];

  const lineDetails = lines
    .map((val, i) => `  ${POSITION_NAMES[i]}：${val > 1 ? '阳' : '阴'}${val === 0 ? ' (老阴 \u00D7)' : val === 3 ? ' (老阳 \u25CB)' : ''}`)
    .join('\n');

  const changingLabels = changingLines.length > 0
    ? changingLines.map((n) => `第${n}爻（${lineLabel(n - 1, lines[n - 1])}）`).join('、')
    : '无';

  const rule = RULES[changingLines.length] ?? '';

  return `你是一位精通周易的占卜师，请根据以下信息为我解卦：

卦象：${fullName}
上卦：${upTrigram}（${upSymbol}），下卦：${downTrigram}（${downSymbol}）
变爻：${changingLabels}，共 ${changingLines.length} 个变爻

六爻详情（从初爻到上爻）：
${lineDetails}

断卦规则：${rule}

请从以下方面分析：
1. 本卦卦辞大意
2. 各变爻的爻辞与解读
3. 综合判断
4. 对求卦者的建议`;
}
