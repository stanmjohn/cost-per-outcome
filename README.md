# Cost-per-Outcome Workbench

What does one result from a workforce program really cost, how sure is that number, and which single assumption moves it most?

## Who it is for

It is for funders, program leads, and board members who have seen a figure like "$5,000 per person placed" in a slide deck and want to know how soft it is and where. That figure is an illustration, not any real program's number.

A plain text file describing the program goes in. A one-page brief comes out. The brief gives the cost of one result with a range around it, a ranked list of the assumptions that move it, and a source beside every assumption.

Every example program in this repo is made up, and each brief says so at the top. The benchmarks the tool leans on are real and come from published studies and federal data.

## Example

One made-up training program, Ferncastle Skills Year, is counted two ways. The costs are the same in both briefs. Only the result being counted changes.

Two terms help in reading them. A **comparison group** is a set of similar people who did not get the program, so it shows what happens anyway. The tool works the numbers 20,000 times, each time with different values inside each range. Each pass is a **run**. The **middle run** is the median, and **the middle 80 percent of runs** leaves out the cheapest tenth and the costliest tenth.

**Counted in jobs**, from [the jobs brief](examples/made-up-training-jobs.md).

<!-- excerpt examples/made-up-training-jobs.md -->
One added person employed five years later costs about **$1,140,000** in the middle run. Eight runs in ten come in above **$424,000**. **The high end has no finite answer**, because in 22 percent of 20,000 runs the program added nothing beyond what happens without it.

Budget cost divided by the gross result gives **$23,400** for one added person employed five years later. That figure credits the program with everything that happened to its participants, including what happens with no program at all. It has no range and no comparison. It is printed here once, only to be set beside the read above.
<!-- /excerpt -->

**Counted in earnings**, from [the earnings brief](examples/made-up-training-earnings.md).

<!-- excerpt examples/made-up-training-earnings.md -->
$1,000 of added earnings over five years costs about **$772** in the middle run. The middle 80 percent of 20,000 runs fall between **$638** and **$973**.

| Rank | Assumption | At its low | At its high |
|---|---|---|---|
| 1 | Earnings added per person over five years (14,000 to 30,000) | $1,210 | $567 |
| 2 | Program cost per person offered a seat (16,200 to 19,800) | $691 | $855 |
| 3 | Other training the comparison group used (3,400 to 4,600) | $800 | $745 |
| 4 | Other training the program group used (2,500 to 3,500) | $750 | $795 |
<!-- /excerpt -->

The bare number in the jobs brief is what a slide deck would print. It counts everyone who found work, including the people who would have found work with no program. Set against the comparison group, the same program added almost no jobs, so each added job costs over a million dollars. Counted in earnings, the same program shows a clear gain, and the brief can put a range on what each $1,000 of it cost. The ranking table shows that the size of the earnings gain moves the answer far more than the program's own cost does. That is where the next research dollar goes.

A third made-up program, [Riverbend Tech Training](examples/made-up-local-program.md), leans on the real benchmarks and shows what a brief says when a program cannot show it added anything. It prints no estimate at all.

## How it works

**The arithmetic.** Cost per participant is divided by the result the program added per participant. The added result is what the program group reached minus what the comparison group reached with no program. Costs outside the program's own budget are added in. Costs the comparison group ran up elsewhere are taken off.

**The range.** Every uncertain input takes three values, a low, a likely, and a high, and a source. The tool draws each input 20,000 times from a triangle-shaped spread that never goes below the low or above the high and lands most often near the likely value. A run where the program added nothing has no finite cost. Those runs are kept as the most expensive, never dropped, and the brief reports their share. When half the runs or more add nothing, the brief prints no estimate. The random draws always start from the same fixed number, so the same file gives the same brief on any machine.

**The ranking.** Each assumption is swung from its low to its high with the rest held at likely. The assumptions are ranked by how far that moves the answer. This is the headline of the brief, not a footnote.

**What a brief carries.**

- **The read.** The cost of one result in the middle run and across the middle 80 percent of runs, or a plain refusal when most runs show the program added nothing.
- **The bare number.** Budget cost over the gross result, printed once and labeled, so the reader sees what a slide deck would have said.
- **What moves the answer most.** The ranking.
- **The four questions.** What happens without the program. Where the cost line falls, and how much sits outside the program's own budget. How long the result has to last. How good the count is. When the file leaves one blank, the brief says so and says which way the blank flatters the program.
- **Every assumption with its source.** That includes which ranges a study printed and which ones the file's author set.
- **The benchmarks it used**, named inline with the published points behind them.

## Data sources

Every example program is made up. The two benchmarks are real. They live in [benchmarks/workforce.json](benchmarks/workforce.json) and as a readable page at [benchmarks/workforce.md](benchmarks/workforce.md).

- **The share of a comparison group employed with no program.** It comes from four lottery studies, which pick by lottery who gets a program seat so that the two groups start out alike. Between 74 and 81 percent of people who applied and lost the lottery were working a year or more later. A program that counts everyone it placed is claiming most of them.
- **Public training dollars per person trained** in the Adult program of the federal Workforce Innovation and Opportunity Act, or WIOA, by state. A program file uses it when its participants also draw on public training vouchers.

Each benchmark carries its source, year, place, how it was measured, and what it does not cover. The brief names every benchmark it used. Any program file can override any of them. A benchmark is a default, never a fact.

The published sources behind the benchmarks.

- Fein and Dastrup, [Benefits that Last](https://acf.gov/sites/default/files/documents/opre/year%20up%20long-term%20impact%20report_apr2022.pdf), long-term impact and cost-benefit findings for Year Up, OPRE Report 2022-77, Abt Associates for the US Department of Health and Human Services, 2022. Public domain.
- Roder and Elliott, [Eleven Year Gains](https://economicmobilitycorp.org/wp-content/uploads/2021/09/Mobility_Eleven-Year-Gains.pdf), Economic Mobility Corporation, 2021.
- Schaberg and Greenberg, [Long-Term Effects of a Sectoral Advancement Strategy](https://www.mdrc.org/sites/default/files/WorkAdvance_5-Year_Report_ES_Final.pdf), MDRC, 2020.
- Maguire and others, [Tuning In to Local Labor Markets](https://www.explorevr.org/sites/explorevr.org/files/files/Tuning%20In%20to%20Local%20Labor%20Markets.pdf), Public/Private Ventures, 2010.
- Congressional Research Service, [State Service Data for the Adult Activities Program Under WIOA](https://www.everycrsreport.com/reports/R48542.html), R48542, 2025.
- US Department of Labor, [WIOA National Performance Summary](https://www.dol.gov/sites/dolgov/files/ETA/Performance/pdfs/PY2024/Annual%20Web%20Contents/PY2024_Annual_Summary_Report.pdf), program year 2024.

## Limits

It never prints a cost per outcome without a range. It never compares two programs, because two programs rarely count the same outcome the same way. Given two program files at once, it stops and says so. It never projects past the years the evidence covers. It never uses a benchmark without naming it. A program file with no comparison of any kind is refused, because a result with no comparison is the bare number this tool exists to stop.

This tool does not discount later dollars. A dollar earned in year five counts the same as a dollar spent today. Each range is a triangle drawn between a low, a likely, and a high, not a statistical confidence interval, even where a study's interval set the low and the high. The comparison-group benchmark comes from studies that screened applicants before the lottery, so it describes motivated job seekers, not the general public. Ranges that a file's author set are judgment, and the brief labels them as such.

Three things are not built yet. Comparison across programs waits on an honest way to say when two outcome definitions match. Outcome rates by state could come from the federal WIOA public use files. More benchmarks can come as published lottery studies supply them.

## Run it yourself

It needs Node 20 or newer. There is nothing to install, and no key or account.

```
node bin/cost-per-outcome.mjs examples/made-up-training-earnings.txt            # writes examples/made-up-training-earnings.md
node bin/cost-per-outcome.mjs examples/made-up-training-earnings.txt --stdout   # prints it instead
node bin/cost-per-outcome.mjs benchmarks                                        # prints the benchmark file as a page
```

To read your own program, copy an example file, change the lines, and run it. The format is a few header lines and then blocks.

```
program: Riverbend Tech Training (made up)
outcome: one added person employed a year after the program
made up: yes
real data: A real file would use the program's own budget and follow-up survey.

[cost] Staff, rent, and supplies per person enrolled
low: 5,400
likely: 6,000
high: 6,600
source: Program budget (made up)

[with program] Share of everyone enrolled who was employed at twelve months
low: 72%
likely: 82%
high: 90%
source: Program follow-up survey (made up)

[without program] Share who find work with no program
benchmark: comparison-group-employment
```

Every uncertain input takes a low, a likely, a high, and a source. A block can name a benchmark instead of giving values. The full set of blocks is `[cost]`, `[cost avoided]`, `[with program]`, `[without program]`, `[added by program]` for a study with a comparison group, `[still holding]`, and `[count check]`. A made-up program carries `made up: yes` and a `real data:` line saying what real data would replace it, and the brief prints both under a PLACEHOLDER banner.

To check it yourself, clone the repo, run the tool on any file in `examples/`, and compare the brief that comes back with the committed one. They match byte for byte.

## How this was built

Built with AI coding assistants. Stan John set the design and the rules in AGENTS.md, which any AI coding tool must follow when it changes this repo. A test rebuilds every committed brief and checks that it matches the file exactly.

## Related tools

[Funder X-Ray](https://github.com/stanmjohn/funder-xray) turns a foundation's public IRS 990 filings into a one-page giving summary.

[Impact Chain](https://github.com/stanmjohn/impact-chain) tracks a program from community reach to household gain, and shows where people leave and which step falls furthest short of its benchmark.

## Tests

```
npm test
```

The math runs on synthetic files with hand-checkable answers. The brief tests pin the sentences that must never disappear. The benchmark test refuses any entry missing a source. One test rebuilds every example brief and compares it to the committed file byte for byte. Another checks that every example is a made-up program, and another checks that the excerpts in this README match the briefs they quote.

## License

MIT. Built by [Stan John](https://www.linkedin.com/in/stanmjohn).
