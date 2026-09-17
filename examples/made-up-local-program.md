# Cost per outcome: Riverbend Tech Training (made up)

> **This program is made up.** It exists to show how the tool reads a typical local program file. The benchmarks it leans on are real and sourced below.

One outcome is one added person employed a year after the program · A mid-sized US county · One class year

## The read

**No estimate.** In 62 percent of 20,000 runs the program added nothing beyond what happens without it, so the cost of one added person employed a year after the program has no finite answer. Printing a dollar figure here would be the confident bare number this tool exists to stop.

What can change this read: a lower figure for what happens without the program, backed by a local source, or an outcome the program is more likely to move, such as earnings.

## The bare number, and why it is not the answer

Budget cost divided by the gross result gives **$7,320** for one added person employed a year after the program. That figure credits the program with everything that happened to its participants, including what happens with no program at all. It has no range and no comparison. It is printed here once, only to be set beside the read above.

## What moves the answer most

At the likely values the program adds nothing, so no assumption can be ranked in dollars. Whether it adds anything at all turns on "Share of everyone enrolled who was employed at twelve months", "Share who find work with no program", "How far to trust a survey that reached 60 percent". Nothing on the cost side changes that.

## The four questions

**What happens without the program.** The file sets the result without the program at 79.6% likely, 73.7% to 81.1%, against 82% with it.

**Where the cost line falls.** Cost per participant is $8,900 at the likely values, in current dollars. $2,900 of that, 33 percent of the full cost, sits outside the program's own budget.

**How long the result has to last.** Measured at: Twelve months after the last class. The file gives no share still holding the result, so the tool took it as 100 percent. If results fade, the true cost is higher.

**How good the count is.** Counted by: A phone survey that reached 60 percent of the people who finished. The file marks the count down to 95% of its face value.

## Every assumption, with its source

| Kind | Assumption | Low | Likely | High | Source | Note |
|---|---|---|---|---|---|---|
| Cost | Staff, rent, and supplies per person enrolled | 5,400 | 6,000 | 6,600 | Program budget (made up) |  |
| Cost, outside the budget | Classroom space donated by a church | 300 | 500 | 800 | The program's own guess at market rent (made up) |  |
| Cost, outside the budget | Training vouchers the workforce board paid for the same people | 1,006 | 2,400 | 5,158 | Benchmark `wioa-adult-training-cost` from `benchmarks/workforce.json`. |  |
| Result with the program | Share of everyone enrolled who was employed at twelve months | 72% | 82% | 90% | Program follow-up survey (made up) | The program reports 85 percent, counted among the finishers it reached. This line restates that across everyone who enrolled. |
| Result without the program | Share who find work with no program | 73.7% | 79.6% | 81.1% | Benchmark `comparison-group-employment` from `benchmarks/workforce.json`. |  |
| Count check | How far to trust a survey that reached 60 percent | 88% | 95% | 100% | Judgment of the file's author (made up) | People with jobs answer follow-up surveys more often than people without. |

## Benchmarks this brief used

A benchmark is a default, never a fact. Any of these can be overridden in the program file.

**Public training dollars per person trained, WIOA Adult program**, used for "Training vouchers the workforce board paid for the same people". Likely is the national average. Low is the sixth-lowest state and high is the sixth-highest, so that one unusual state does not set the range. The full table runs from $208 in Florida to $8,878 in Kansas.

What it does not cover. Administration, partner program funds, Pell grants, employer costs, and participant time. Federal WIOA Adult dollars only. Nominal dollars for program year 2023, not adjusted for inflation. It says nothing about results.

- $2,400. National average expenditure per training participant, printed as about $2,400. United States. Program year 2023. [Congressional Research Service, R48542, May 2025](https://www.everycrsreport.com/reports/R48542.html)
- $1,010. The sixth-lowest of 52 states and territories. Colorado. Program year 2023. [Congressional Research Service, R48542, Table A-1](https://www.everycrsreport.com/reports/R48542.html)
- $5,160. The sixth-highest of 52 states and territories. Rhode Island. Program year 2023. [Congressional Research Service, R48542, Table A-1](https://www.everycrsreport.com/reports/R48542.html)
- $3,140. One state, shown as a worked example of the spread. Pennsylvania. Program year 2023. [Congressional Research Service, R48542, Table A-1](https://www.everycrsreport.com/reports/R48542.html)
- $2,470. National cost per participant served, training services, one year later. United States. Program year 2024. [US Department of Labor, WIOA National Performance Summary, Adult program, page 1](https://www.dol.gov/sites/dolgov/files/ETA/Performance/pdfs/PY2024/Annual%20Web%20Contents/PY2024_Annual_Summary_Report.pdf)

**Share of a comparison group employed with no program**, used for "Share who find work with no program". Low and high are the lowest and highest of the four points below. Likely is the midpoint of the middle two.

What it does not cover. Placement at program exit, which no study below measures. Each study counted employment a different way, and each entry says how. Every study screened its applicants before the lottery, so these are motivated job seekers, not the general public. Self-employment and informal work are mostly missed.

- 81.1%. Comparison group members who were employed at the six-year survey. The report prints 18.9 percent not employed, and this is the remainder. Eight Year Up offices in nine US cities. Enrolled 2013 to 2014, surveyed about six years later. [Fein and Dastrup, Benefits that Last, OPRE Report 2022-77, Exhibit 2-3](https://acf.gov/sites/default/files/documents/opre/year%20up%20long-term%20impact%20report_apr2022.pdf)
- 80.2%. Comparison group members who worked at any time in 2018. New York City, Tulsa, and northeast Ohio. Enrolled 2011 to 2013, measured in 2018. [Schaberg and Greenberg, Long-Term Effects of a Sectoral Advancement Strategy, MDRC 2020, Table ES.3](https://www.mdrc.org/sites/default/files/WorkAdvance_5-Year_Report_ES_Final.pdf)
- 79%. Comparison group members employed at any time in months 13 to 24. Boston, the Bronx, and Milwaukee. Surveyed 24 to 30 months after enrollment, report dated 2010. [Maguire and others, Tuning In to Local Labor Markets, Public/Private Ventures 2010, Table 3](https://www.explorevr.org/sites/explorevr.org/files/files/Tuning%20In%20to%20Local%20Labor%20Markets.pdf)
- 73.7%. Comparison group members employed at any time in the eleventh year. San Antonio, Texas. Enrolled 2006 to 2008, measured eleven years later. [Roder and Elliott, Eleven Year Gains, Economic Mobility Corporation 2021, Figure 4](https://economicmobilitycorp.org/wp-content/uploads/2021/09/Mobility_Eleven-Year-Gains.pdf)

## How the range was made

Each assumption above was drawn 20,000 times from a triangle-shaped spread that never goes below its low or above its high and lands most often near its likely value. Each run computes cost per participant divided by the result the program added per participant. The middle run is the median. The range is the 10th to the 90th percentile. The seed is 20260917, so the same file gives the same brief on any machine.

## What this brief refuses to do

It never prints a cost per outcome without a range. It never compares this program to another one, because two programs rarely count the same outcome the same way. It never projects past the years the evidence covers. It never uses a benchmark without naming it and its source.
