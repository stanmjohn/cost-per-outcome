// Writes the brief as markdown. All arithmetic lives in model.mjs. This file
// formats, and wherever a number has a known limit it prints the limit beside
// the number. It carries no date, so the same file and seed give the same
// brief byte for byte.

const KIND_NAMES = {
  "cost": "Cost",
  "cost avoided": "Cost avoided",
  "with program": "Result with the program",
  "without program": "Result without the program",
  "added by program": "Result added by the program",
  "still holding": "Share still holding the result",
  "count check": "Count check",
};

/** Dollars at three significant figures. Infinity prints as words. */
export function money(n) {
  if (n === Infinity) return "no finite answer";
  if (n == null || Number.isNaN(n)) return "not computable";
  if (n < 10) return "$" + n.toFixed(2);
  if (n < 1000) return "$" + Math.round(n).toLocaleString("en-US");
  const mag = Math.pow(10, Math.floor(Math.log10(n)) - 2);
  return "$" + (Math.round(n / mag) * mag).toLocaleString("en-US");
}

/** Shares print as percents, everything else with commas. */
function plain(v) {
  if (Math.abs(v) <= 1.5) return (Math.round(v * 1000) / 10).toLocaleString("en-US") + "%";
  return (Math.round(v * 100) / 100).toLocaleString("en-US");
}

function pct(share) {
  const p = share * 100;
  if (p > 0 && p < 1) return "under 1 percent";
  return Math.round(p) + " percent";
}

function sourceCell(b) {
  if (b.benchmarkEntry) {
    const over = b.overridden.length ? ` The file overrides its ${b.overridden.join(" and ")}.` : "";
    return `Benchmark \`${b.benchmarkEntry.id}\` from \`benchmarks/workforce.json\`.${over}`;
  }
  return b.url ? `[${b.source}](${b.url})` : b.source;
}

export function report(program, result) {
  const { header, blocks } = program;
  const outcome = header.outcome;
  const lines = [];
  const push = (...xs) => lines.push(...xs);

  push(`# Cost per outcome: ${header.program}`, "");
  if (header.madeUp) {
    push(`> **This program is made up.** It exists to show how the tool reads a typical local program file. The benchmarks it leans on are real and sourced below.`, "");
  }
  const facts = [
    `One outcome is ${outcome}`,
    header.place,
    header.years,
  ].filter(Boolean);
  push(facts.join(" · "), "");

  // The read
  push(`## The read`, "");
  const top = result.ranking[0];
  if (result.state === "refused") {
    push(`**No estimate.** In ${pct(result.noAnswerShare)} of ${result.draws.toLocaleString("en-US")} runs the program added nothing beyond what happens without it, so the cost of ${outcome} has no finite answer. Printing a dollar figure here would be the confident bare number this tool exists to stop.`);
    push("", `What can change this read: a lower figure for what happens without the program, backed by a local source, or an outcome the program is more likely to move, such as earnings.`);
  } else if (result.state === "open-ended") {
    push(`${cap(outcome)} costs about **${money(result.p50)}** in the middle run. Eight runs in ten come in above **${money(result.p10)}**. **The high end has no finite answer**, because in ${pct(result.noAnswerShare)} of ${result.draws.toLocaleString("en-US")} runs the program added nothing beyond what happens without it.`);
  } else {
    push(`${cap(outcome)} costs about **${money(result.p50)}** in the middle run. The middle 80 percent of ${result.draws.toLocaleString("en-US")} runs fall between **${money(result.p10)}** and **${money(result.p90)}**.`);
    if (result.noAnswerShare > 0) {
      push("", `In ${pct(result.noAnswerShare)} of runs the program added nothing and the cost has no finite answer. Those runs are counted as the most expensive, not dropped.`);
    }
  }
  if (top && result.atLikely !== Infinity) {
    push("", `The assumption that moves the answer most is **${top.block.label.toLowerCase()}**. That is where the next research dollar goes.`);
  }
  push("");

  // The bare number
  push(`## The bare number, and why it is not the answer`, "");
  if (result.bare == null) {
    push(`The file gives no gross result with the program, so the tool cannot print the bare number for contrast.`);
  } else {
    push(`Budget cost divided by the gross result gives **${money(result.bare)}** for ${outcome}. That figure credits the program with everything that happened to its participants, including what happens with no program at all. It has no range and no comparison. It is printed here once, only to be set beside the read above.`);
  }
  push("");

  // Ranking
  push(`## What moves the answer most`, "");
  if (result.ranking.length === 0) {
    push(`No input in this file has a range, so nothing can be ranked.`);
  } else if (result.atLikely === Infinity) {
    const decide = inputsThatDecide(blocks);
    push(`At the likely values the program adds nothing, so no assumption can be ranked in dollars. Whether it adds anything at all turns on ${decide.join(", ")}. Nothing on the cost side changes that.`);
  } else {
    push(`Each row holds every other assumption at its likely value and moves one assumption from its low to its high.`, "");
    push(`| Rank | Assumption | At its low | At its high |`);
    push(`|---|---|---|---|`);
    result.ranking.forEach((r, i) => {
      push(`| ${i + 1} | ${r.block.label} (${plain(r.block.low)} to ${plain(r.block.high)}) | ${money(r.atLow)} | ${money(r.atHigh)} |`);
    });
  }
  push("");

  // The four questions
  const of = (kind) => blocks.filter((b) => b.kind === kind);
  const direct = of("added by program")[0];
  const hold = of("still holding")[0];
  const check = of("count check")[0];
  const c = result.costs;
  push(`## The four questions`, "");
  push(`**What happens without the program.** ${
    direct
      ? `The file takes the added result straight from a study with a comparison group: ${plain(direct.likely)} likely, ${plain(direct.low)} to ${plain(direct.high)}.`
      : `The file sets the result without the program at ${plain(of("without program")[0].likely)} likely, ${plain(of("without program")[0].low)} to ${plain(of("without program")[0].high)}, against ${plain(of("with program")[0].likely)} with it.`
  }`, "");
  const gross = c.inBudget + c.outside;
  push(`**Where the cost line falls.** Cost per participant is ${money(c.net)} at the likely values${header.dollars ? `, in ${lowerFirst(header.dollars)}` : ""}. ${
    c.outside > 0
      ? `${money(c.outside)} of that, ${pct(c.outside / gross)} of the full cost, sits outside the program's own budget.`
      : `Every cost line in the file sits inside the program's own budget.`
  }${c.avoided > 0 ? ` The file subtracts ${money(c.avoided)} in costs the comparison group ran up elsewhere.` : ""}`, "");
  push(`**How long the result has to last.** ${header["measured at"] ? `Measured at: ${header["measured at"]}.` : `The file does not say when the result was measured.`} ${
    hold
      ? `The file expects ${plain(hold.likely)} of results to still hold at the end of the period.`
      : `The file gives no share still holding the result, so the tool took it as 100 percent. If results fade, the true cost is higher.`
  }`, "");
  push(`**How good the count is.** ${header["counted by"] ? `Counted by: ${header["counted by"]}.` : `The file does not say how the result was counted.`} ${
    check
      ? `The file marks the count down to ${plain(check.likely)} of its face value.`
      : `The file gives no count check, so the tool took the count at face value.`
  }`, "");

  // Assumptions
  push(`## Every assumption, with its source`, "");
  push(`| Kind | Assumption | Low | Likely | High | Source | Note |`);
  push(`|---|---|---|---|---|---|---|`);
  for (const b of blocks) {
    const kind = KIND_NAMES[b.kind] + (b.kind === "cost" && !b.countedInBudget ? ", outside the budget" : "");
    const usedOnlyForBare = direct && b.kind === "with program" ? " Used only for the bare number." : "";
    const note = [b.range ? `Range: ${b.range}` : "", b.note ?? "", usedOnlyForBare.trim()].filter(Boolean).join(" ");
    push(`| ${kind} | ${b.label} | ${plain(b.low)} | ${plain(b.likely)} | ${plain(b.high)} | ${sourceCell(b)} | ${note} |`);
  }
  push("");

  // Benchmarks used, never silently
  const used = blocks.filter((b) => b.benchmarkEntry);
  if (used.length) {
    push(`## Benchmarks this brief used`, "");
    push(`A benchmark is a default, never a fact. Any of these can be overridden in the program file.`, "");
    for (const b of used) {
      const e = b.benchmarkEntry;
      push(`**${e.label}**, used for "${b.label}". ${e.how_set}`, "");
      push(`What it does not cover. ${e.does_not_cover}`, "");
      for (const p of e.points) {
        push(`- ${e.unit.startsWith("dollars") ? money(p.value) : plain(p.value)}. ${p.what} ${p.place}. ${p.year}. [${p.source}](${p.url})`);
      }
      push("");
    }
  }

  // Method
  push(`## How the range was made`, "");
  push(`Each assumption above was drawn ${result.draws.toLocaleString("en-US")} times from a triangle-shaped spread that never goes below its low or above its high and lands most often near its likely value. Each run computes cost per participant divided by the result the program added per participant. The middle run is the median. The range is the 10th to the 90th percentile. The seed is ${result.seed}, so the same file gives the same brief on any machine.`, "");

  // Refusals
  push(`## What this brief refuses to do`, "");
  push(`It never prints a cost per outcome without a range. It never compares this program to another one, because two programs rarely count the same outcome the same way. It never projects past the years the evidence covers. It never uses a benchmark without naming it and its source.`, "");

  return lines.join("\n");
}

function inputsThatDecide(blocks) {
  return blocks
    .filter((b) => ["with program", "without program", "added by program", "still holding", "count check"].includes(b.kind) && b.high > b.low)
    .map((b) => `"${b.label}"`);
}

function lowerFirst(s) {
  return /^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
