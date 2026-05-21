export type LineStatus = "equal" | "added" | "removed" | "modified";

export interface DiffLine {
  content: string;
  status: LineStatus;
  /** For modified lines, the ranges of changed characters [start, end][] */
  changes?: [number, number][];
}

/**
 * Compute line-level diff between two code strings.
 * Returns aligned arrays for both sides with padding for insertions/deletions.
 */
export function computeLineDiff(
  a: string,
  b: string
): { left: DiffLine[]; right: DiffLine[] } {
  const aLines = a.trim().split("\n");
  const bLines = b.trim().split("\n");

  const lcs = computeLCS(aLines, bLines);

  const left: DiffLine[] = [];
  const right: DiffLine[] = [];

  let ai = 0;
  let bi = 0;
  let li = 0;

  while (ai < aLines.length || bi < bLines.length) {
    if (li < lcs.length && ai < aLines.length && aLines[ai] === lcs[li] &&
        bi < bLines.length && bLines[bi] === lcs[li]) {
      // Both match the LCS — equal line
      left.push({ content: aLines[ai], status: "equal" });
      right.push({ content: bLines[bi], status: "equal" });
      ai++;
      bi++;
      li++;
    } else if (li < lcs.length && ai < aLines.length && aLines[ai] !== lcs[li] &&
               bi < bLines.length && bLines[bi] !== lcs[li]) {
      // Both differ from LCS — modified line (try to pair them)
      const leftLine = aLines[ai];
      const rightLine = bLines[bi];
      const wordChanges = computeWordChanges(leftLine, rightLine);
      left.push({
        content: leftLine,
        status: "modified",
        changes: wordChanges.left,
      });
      right.push({
        content: rightLine,
        status: "modified",
        changes: wordChanges.right,
      });
      ai++;
      bi++;
    } else if (ai < aLines.length && (li >= lcs.length || aLines[ai] !== lcs[li])) {
      // Left has extra line — removed
      left.push({ content: aLines[ai], status: "removed" });
      right.push({ content: "", status: "equal" }); // padding
      ai++;
    } else if (bi < bLines.length && (li >= lcs.length || bLines[bi] !== lcs[li])) {
      // Right has extra line — added
      left.push({ content: "", status: "equal" }); // padding
      right.push({ content: bLines[bi], status: "added" });
      bi++;
    } else {
      break; // safety
    }
  }

  return { left, right };
}

/**
 * Compute word-level change ranges within two lines.
 */
function computeWordChanges(
  a: string,
  b: string
): { left: [number, number][]; right: [number, number][] } {
  // Find common prefix
  let prefixLen = 0;
  while (prefixLen < a.length && prefixLen < b.length && a[prefixLen] === b[prefixLen]) {
    prefixLen++;
  }

  // Find common suffix (but don't overlap with prefix)
  let suffixLen = 0;
  while (
    suffixLen < a.length - prefixLen &&
    suffixLen < b.length - prefixLen &&
    a[a.length - 1 - suffixLen] === b[b.length - 1 - suffixLen]
  ) {
    suffixLen++;
  }

  const leftStart = prefixLen;
  const leftEnd = a.length - suffixLen;
  const rightStart = prefixLen;
  const rightEnd = b.length - suffixLen;

  return {
    left: leftEnd > leftStart ? [[leftStart, leftEnd]] : [],
    right: rightEnd > rightStart ? [[rightStart, rightEnd]] : [],
  };
}

/**
 * Standard LCS on string arrays.
 */
function computeLCS(a: string[], b: string[]): string[] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack
  const result: string[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return result;
}

/**
 * Compute a three-way aligned diff:
 * original → conflicting (what changed on their branch)
 * conflicting → aiResolution (what the AI changed)
 * Also aligns original → aiResolution for the third column context.
 */
export function computeThreeWayDiff(
  original: string,
  conflicting: string,
  aiResolution: string
): {
  original: DiffLine[];
  conflicting: DiffLine[];
  aiResolution: DiffLine[];
} {
  // For original: mark lines that are different in the conflict
  const origLines = original.trim().split("\n");
  const conflictLines = conflicting.trim().split("\n");
  const aiLines = aiResolution.trim().split("\n");

  // Simple per-line comparison for highlighting
  const origResult: DiffLine[] = origLines.map((line, i) => {
    const inConflict = conflictLines[i];
    if (inConflict === undefined || inConflict !== line) {
      return { content: line, status: "removed" as LineStatus };
    }
    return { content: line, status: "equal" as LineStatus };
  });

  const conflictResult: DiffLine[] = conflictLines.map((line, i) => {
    const inOrig = origLines[i];
    if (inOrig === undefined || inOrig !== line) {
      // This line was changed/added in the conflict
      const changes = inOrig !== undefined ? computeWordChanges(inOrig, line) : undefined;
      return {
        content: line,
        status: "modified" as LineStatus,
        changes: changes?.right,
      };
    }
    return { content: line, status: "equal" as LineStatus };
  });

  const aiResult: DiffLine[] = aiLines.map((line, i) => {
    const inConflict = conflictLines[i];
    if (inConflict === undefined || inConflict !== line) {
      // This line was changed/added by AI vs conflict
      const changes = inConflict !== undefined ? computeWordChanges(inConflict, line) : undefined;
      return {
        content: line,
        status: "added" as LineStatus,
        changes: changes?.right,
      };
    }
    // Also check if it differs from original (AI kept the conflict's version)
    const inOrig = origLines[i];
    if (inOrig === undefined || inOrig !== line) {
      return { content: line, status: "modified" as LineStatus };
    }
    return { content: line, status: "equal" as LineStatus };
  });

  return {
    original: origResult,
    conflicting: conflictResult,
    aiResolution: aiResult,
  };
}
