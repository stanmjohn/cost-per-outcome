// Reads a program file. The format is plain text meant to be written by hand,
// emailed, and compared side by side with last quarter's version.
//
//   program: Example Training        header lines, key then colon then value
//   [cost] Staff and rent            a block opens with its kind and a label
//   low: 4,000                       numbers may carry $ , and %
//   likely: 5,000
//   high: 6,500
//   source: FY2025 budget, line 12
//
// Every error names the line it came from.

export const BLOCK_KINDS = [
  "cost",
  "cost avoided",
  "with program",
  "without program",
  "added by program",
  "still holding",
  "count check",
];

const HEADER_KEYS = [
  "program", "place", "years", "outcome", "outcome size", "dollars",
  "measured at", "counted by", "made up",
];

const BLOCK_KEYS = [
  "low", "likely", "high", "benchmark", "source", "url", "note", "range", "counted in budget",
];

/** "$4,000" -> 4000, "12%" -> 0.12, "-2.1%" -> -0.021 */
export function number(text, line) {
  const raw = String(text).trim();
  const isPct = raw.endsWith("%");
  const n = Number(raw.replace(/[$,%\s]/g, ""));
  if (raw === "" || Number.isNaN(n)) throw new Error(`Line ${line}: "${raw}" is not a number.`);
  return isPct ? n / 100 : n;
}

export function parseProgram(text) {
  const header = {};
  const blocks = [];
  let current = null;
  const lines = text.replace(/\r\n/g, "\n").split("\n");

  lines.forEach((rawLine, idx) => {
    const lineNo = idx + 1;
    const line = rawLine.trim();
    if (line === "" || line.startsWith("#")) return;

    const open = line.match(/^\[([^\]]+)\]\s*(.*)$/);
    if (open) {
      const kind = open[1].trim().toLowerCase();
      if (!BLOCK_KINDS.includes(kind)) {
        throw new Error(`Line ${lineNo}: "[${open[1]}]" is not a block this tool knows. Use one of: ${BLOCK_KINDS.join(", ")}.`);
      }
      if (!open[2]) throw new Error(`Line ${lineNo}: the [${kind}] block needs a label after the bracket.`);
      current = { kind, label: open[2].trim(), line: lineNo, countedInBudget: true };
      blocks.push(current);
      return;
    }

    const colon = line.indexOf(":");
    if (colon === -1) throw new Error(`Line ${lineNo}: expected "key: value", got "${line}".`);
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (!current) {
      if (!HEADER_KEYS.includes(key)) throw new Error(`Line ${lineNo}: "${key}" is not a header this tool knows. Use one of: ${HEADER_KEYS.join(", ")}.`);
      header[key] = value;
      return;
    }
    if (!BLOCK_KEYS.includes(key)) throw new Error(`Line ${lineNo}: "${key}" is not a field this tool knows. Use one of: ${BLOCK_KEYS.join(", ")}.`);
    if (key === "low" || key === "likely" || key === "high") current[key] = number(value, lineNo);
    else if (key === "counted in budget") current.countedInBudget = !/^no$/i.test(value);
    else current[key] = value;
  });

  validate(header, blocks);
  return {
    header: {
      ...header,
      outcomeSize: header["outcome size"] ? number(header["outcome size"], 0) : 1,
      madeUp: /^yes$/i.test(header["made up"] ?? ""),
    },
    blocks,
  };
}

function validate(header, blocks) {
  for (const key of ["program", "outcome"]) {
    if (!header[key]) throw new Error(`The file needs a "${key}:" line at the top.`);
  }
  const count = (kind) => blocks.filter((b) => b.kind === kind).length;
  if (count("cost") === 0) throw new Error(`The file needs at least one [cost] block.`);
  const direct = count("added by program");
  if (direct > 1) throw new Error(`Only one [added by program] block is allowed.`);
  if (direct === 0) {
    if (count("with program") !== 1 || count("without program") !== 1) {
      throw new Error(`The file needs one [with program] block and one [without program] block, or one [added by program] block from a study with a comparison group. A result with no comparison is the bare number this tool exists to stop.`);
    }
  } else if (count("without program") > 0) {
    throw new Error(`Use [added by program] or [without program], not both. They answer the same question.`);
  }
  for (const kind of ["with program", "still holding", "count check"]) {
    if (count(kind) > 1) throw new Error(`Only one [${kind}] block is allowed.`);
  }
  for (const b of blocks) {
    if (b.benchmark) continue;
    for (const f of ["low", "likely", "high"]) {
      if (b[f] == null) throw new Error(`Line ${b.line}: the [${b.kind}] block "${b.label}" needs low, likely, and high, or a benchmark. One value alone is a point estimate with no range.`);
    }
    if (!(b.low <= b.likely && b.likely <= b.high)) {
      throw new Error(`Line ${b.line}: in "${b.label}", low, likely, and high must run in that order.`);
    }
    if (!b.source) throw new Error(`Line ${b.line}: "${b.label}" has no source. Every assumption carries one, even if the source is "our own estimate".`);
  }
}
