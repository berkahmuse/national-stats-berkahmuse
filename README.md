[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/berkahmuse/national-stats-berkahmuse/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/berkahmuse/national-stats-berkahmuse/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

# Nippon Numbers — Japan in statistics

A national statistics site about Japan, built for the [make.fun bounty “Make the best national statistics site”](https://make.fun/bounty/best-national-statistics-site-20261126-0539).

Japan's population peaked at 128.08 million in 2008 and has fallen every year since; one in three residents is now over 65. Nippon Numbers gathers the country's official figures — population, births, work and the economy — in one place, each with its source and year.

## What it covers

- **Overview** — key indicators and fifty years of population, with a switchable chart (total population, share 65+, share 0–14) and a year-range selector.
- **Population & ageing** — the 2024 age pyramid, 1990 vs 2024 age structure, and a sortable table of the largest prefectures.
- **Births, deaths & fertility** — births vs deaths since 2010, the fertility slide to 1.15, and life expectancy.
- **Work & jobs** — labour force, unemployment 2019–2024, foreign workers and residents.
- **Economy & prices** — GDP, real growth, inflation, government debt and trade.
- **Sources & methods** — every dataset with its publisher and year, filterable.

## Run it

Static files under `app/` — no build step, no network requests. Serve them any way you like:

```sh
node serve.ts   # http://localhost:8082
```

Then open the site in a desktop browser or on a phone. Charts are hand-rolled canvas (no library); all data lives in `app/data.js`.

## Hand in

`main.ts` (Node 22) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Data

All figures are published official statistics: Statistics Bureau of Japan, Ministry of Health, Labour and Welfare, Cabinet Office, Immigration Services Agency, Ministry of Finance, IMF and the United Nations. See the Sources page in the site for the publisher and year of every number.

## License

MIT — see [LICENSE](LICENSE).
