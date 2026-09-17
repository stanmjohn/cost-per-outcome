# Cost-per-Outcome Workbench

What does one outcome from a workforce program cost, how sure is that number, and which single assumption moves it most?

For a funder, a program lead, or a board member who has seen "$5,000 per person placed" in a deck and wants to know how soft that number is and where. A plain text file describing the program goes in. A one-page brief comes out, with a range around the number, a ranked list of what moves it, and a source beside every assumption.

Done looks like this: clone the repo, run one command on a file in `examples/`, and get the committed brief back exactly.

## The turn the tool exists to make

Year Up is one of the best-studied workforce programs in the country, a lottery study with seven years of wage records. Ask it two questions and the tool gives two very different answers.

- [Year Up, counted in jobs](examples/year-up-jobs.md). Seven years out, 73.8 percent of the program group was working. So was 72.8 percent of the comparison group. One added job costs about $2.3 million in the middle run, and in a quarter of runs the program added no jobs at all.
- [Year Up, counted in earnings](examples/year-up-earnings.md). The same people earned $38,152 more over seven years. Every $1,000 of that cost about $606, with the middle 80 percent of runs between $540 and $685.

Same program, same costs, same study. Asked the wrong question, the strongest program in the field looks like a failure. The tool makes that turn visible from a text file.

The other two examples are [Project QUEST](examples/project-quest-earnings.md), an eleven-year lottery study in San Antonio, and a [made-up local program](examples/made-up-local-program.md) that leans on the benchmarks and shows what the tool does when a program cannot show it added anything.

## Use

Requires Node 20 or newer. No install, no key, no account.

```
node bin/cost-per-outcome.mjs examples/year-up-earnings.txt            # writes examples/year-up-earnings.md
node bin/cost-per-outcome.mjs examples/year-up-earnings.txt --stdout   # prints it instead
node bin/cost-per-outcome.mjs benchmarks                               # prints the benchmark file as a page
```

To read your own program, copy an example file, change the lines, and run it. The format is a few header lines and then blocks:

```
program: Riverbend Tech Training
outcome: one added person employed a year after the program

[cost] Staff, rent, and supplies per person enrolled
low: 5,400
likely: 6,000
high: 6,600
source: FY2025 budget

[with program] Share of everyone enrolled who was employed at twelve months
low: 72%
likely: 82%
high: 90%
source: Program follow-up survey

[without program] Share who find work with no program
benchmark: comparison-group-employment
```

Every uncertain input takes three values, a low, a likely, and a high, and a source. A block can name a benchmark instead of giving values. The full set of blocks is `[cost]`, `[cost avoided]`, `[with program]`, `[without program]`, `[added by program]` for a study with a comparison group, `[still holding]`, and `[count check]`. A file with no comparison of any kind is refused, because a result with no comparison is the bare number this tool exists to stop.

## What a brief carries

**The read.** Cost per outcome in the middle run and the middle 80 percent of runs, or a plain refusal when most runs show the program added nothing.

**The bare number.** Budget cost over the gross result, printed once and labeled, so the reader sees what the deck would have said.

**What moves the answer most.** Each assumption swung from its low to its high with the rest held at likely, ranked by how far the answer moves. This is the headline, not a footnote. It says where the next research dollar goes.

**The four questions.** What happens without the program. Where the cost line falls, and how much sits outside the program's own budget. How long the result has to last. How good the count is. When the file leaves one blank, the brief says so and says which way the blank flatters the program.

**Every assumption with its source.** Including which ranges a study printed and which ones the file's author set.

## Benchmarks

Two ship in version one, in [benchmarks/workforce.json](benchmarks/workforce.json) and as a readable page at [benchmarks/workforce.md](benchmarks/workforce.md).

- The share of a comparison group employed with no program, from four lottery studies. Between 74 and 81 percent of people who applied to a program and lost the lottery were working a year or more later. A program that counts everyone it placed as an outcome is claiming most of that.
- Public training dollars per person trained in the federal WIOA Adult program, by state, for a program whose participants also draw on public vouchers.

Four rules hold the benchmarks in check. They live in their own file, apart from the code. Each carries source, year, place, how it was measured, and what it does not cover. The brief names every benchmark it used, inline, with its points. Any program file can override any of them. A benchmark is a default, never a fact.

## How the range is made

Each assumption is drawn 20,000 times from a triangle-shaped spread that never goes below its low or above its high and lands most often near its likely value. Each run divides cost per participant by the result the program added per participant. A run where the program added nothing has no finite cost. Those runs are kept as the most expensive, never dropped, and their share is reported. The seed is fixed, so the same file gives the same brief on any machine. Year Up's own federal cost-benefit analysis used the same method, 50,000 draws over its inputs.

## What it refuses to do

It never prints a cost per outcome without a range. It never compares two programs, because two programs rarely count the same outcome the same way, and that is a judgment no tool settles. It never projects past the years the evidence covers. It never uses a benchmark silently.

## Sources behind the examples and benchmarks

All public, all linked from the files that use them.

- Fein and Dastrup, Benefits that Last, long-term impact and cost-benefit findings for Year Up, OPRE Report 2022-77, Abt Associates for the US Department of Health and Human Services. Public domain.
- Roder and Elliott, Eleven Year Gains, Economic Mobility Corporation, 2021.
- Schaberg and Greenberg, Long-Term Effects of a Sectoral Advancement Strategy, MDRC, 2020.
- Maguire and others, Tuning In to Local Labor Markets, Public/Private Ventures, 2010.
- Congressional Research Service, State Service Data for the Adult Activities Program Under WIOA, R48542, 2025.
- US Department of Labor, WIOA National Performance Summary, program year 2024.

## Roadmap

Comparison across programs, once there is an honest way to say when two outcome definitions match. Outcome rates by state and service type from the WIOA public use files. More benchmarks as published lottery studies supply them.

## Tests

```
npm test
```

Thirty-eight tests. The math runs on synthetic files with hand-checkable answers, the brief tests pin the sentences that must never disappear, the benchmark test refuses any entry missing a source, and one test rebuilds every example brief and compares it to the committed file byte for byte.

## License

MIT. Built by [Stan John](https://www.linkedin.com/in/stanmjohn).
