// Nippon Numbers — the data behind the site.
// Every figure below is a real published statistic. Each series carries its
// publisher and year, and the Sources page lists them all in one place.
// Figures are rounded for display; exact values are the published ones.

export const META = {
  siteName: "Nippon Numbers",
  country: "Japan",
  tagline: "Japan in statistics, 1970–2024",
  updated: "26 November 2026",
  note: "All figures are published official statistics. See Sources for the publisher and year of every number.",
};

// Headline indicators shown on the home page.
export const KPI = [
  { id: "population", label: "Total population", value: "124.09m", detail: "1 Oct 2024, down 0.6m on 2023", source: "Statistics Bureau of Japan, Population Estimates 2024" },
  { id: "median-age", label: "Median age", value: "49.1 yrs", detail: "Among the highest in the world", source: "United Nations, World Population Prospects 2024" },
  { id: "tfr", label: "Total fertility rate", value: "1.15", detail: "Children per woman, 2024 — a record low", source: "Ministry of Health, Labour and Welfare, Vital Statistics 2024" },
  { id: "elderly", label: "Aged 65 and over", value: "29.2%", detail: "36.25 million people, 1 Oct 2024", source: "Statistics Bureau of Japan, Population Estimates 2024" },
  { id: "gdp", label: "Nominal GDP", value: "$4.03tn", detail: "4th largest economy, 2024", source: "IMF, World Economic Outlook, Oct 2025" },
  { id: "jobs", label: "Unemployment rate", value: "2.5%", detail: "Annual average, 2024", source: "Statistics Bureau of Japan, Labour Force Survey 2024" },
];

// Total population, millions. Census years 1970–2020, estimate for 2024.
// Source: Statistics Bureau of Japan, Population Census & Population Estimates.
export const POP_TREND = [
  { year: 1970, total: 104.67 },
  { year: 1975, total: 111.94 },
  { year: 1980, total: 117.06 },
  { year: 1985, total: 121.05 },
  { year: 1990, total: 123.61 },
  { year: 1995, total: 125.57 },
  { year: 2000, total: 126.93 },
  { year: 2005, total: 127.77 },
  { year: 2008, total: 128.08 },
  { year: 2010, total: 128.06 },
  { year: 2015, total: 127.09 },
  { year: 2020, total: 126.15 },
  { year: 2024, total: 124.09 },
];

// Population peak, for the story on the home page.
export const POP_PEAK = { year: 2008, total: 128.08, source: "Statistics Bureau of Japan, Population Estimates" };

// Age structure, millions, 1 October. Source: Statistics Bureau of Japan,
// Population Census 1990 and Population Estimates 2024.
export const AGE_STRUCTURE = {
  1990: [
    { group: "0–14", value: 22.49, share: 18.2 },
    { group: "15–64", value: 86.14, share: 69.7 },
    { group: "65+", value: 14.89, share: 12.0 },
  ],
  2024: [
    { group: "0–14", value: 14.02, share: 11.3 },
    { group: "15–64", value: 73.73, share: 59.4 },
    { group: "65+", value: 36.25, share: 29.2 },
  ],
};

// Population by 5-year age band, millions, 1 Oct 2024, rounded to the
// nearest 0.1m. Source: Statistics Bureau of Japan, Population Estimates 2024.
// The 70–74 bulge is the first baby-boom generation (born 1947–49);
// the 45–49 bulge is the second baby boom (born 1971–74).
export const PYRAMID_2024 = [
  { band: "0–4", value: 3.9 },
  { band: "5–9", value: 4.8 },
  { band: "10–14", value: 5.3 },
  { band: "15–19", value: 5.6 },
  { band: "20–24", value: 6.4 },
  { band: "25–29", value: 6.7 },
  { band: "30–34", value: 7.0 },
  { band: "35–39", value: 7.3 },
  { band: "40–44", value: 7.8 },
  { band: "45–49", value: 8.8 },
  { band: "50–54", value: 8.6 },
  { band: "55–59", value: 7.6 },
  { band: "60–64", value: 7.4 },
  { band: "65–69", value: 7.6 },
  { band: "70–74", value: 9.3 },
  { band: "75–79", value: 7.6 },
  { band: "80–84", value: 5.7 },
  { band: "85–89", value: 3.7 },
  { band: "90+", value: 2.6 },
];

// Largest prefectures by population, millions, 1 Oct 2024.
// Source: Statistics Bureau of Japan, Population Estimates 2024.
export const PREFECTURES = [
  { name: "Tokyo", value: 14.18 },
  { name: "Kanagawa", value: 9.24 },
  { name: "Osaka", value: 8.81 },
  { name: "Aichi", value: 7.49 },
  { name: "Saitama", value: 7.34 },
  { name: "Chiba", value: 6.28 },
  { name: "Hyogo", value: 5.38 },
  { name: "Hokkaido", value: 5.09 },
];

// Share of the population aged 65 and over, percent. Source: Statistics
// Bureau of Japan, Population Census & Population Estimates.
export const ELDERLY_SHARE = [
  { year: 1970, value: 7.1 },
  { year: 1980, value: 9.1 },
  { year: 1990, value: 12.0 },
  { year: 2000, value: 17.4 },
  { year: 2010, value: 23.0 },
  { year: 2020, value: 28.6 },
  { year: 2024, value: 29.2 },
];

// Share of the population aged 0–14, percent. Same source.
export const CHILD_SHARE = [
  { year: 1970, value: 23.9 },
  { year: 1980, value: 23.5 },
  { year: 1990, value: 18.2 },
  { year: 2000, value: 14.6 },
  { year: 2010, value: 13.1 },
  { year: 2020, value: 11.9 },
  { year: 2024, value: 11.3 },
];

// Live births and deaths, thousands. Source: MHLW, Vital Statistics.
export const BIRTHS_DEATHS = [
  { year: 2010, births: 1071, deaths: 1197 },
  { year: 2015, births: 1006, deaths: 1290 },
  { year: 2020, births: 841, deaths: 1373 },
  { year: 2021, births: 812, deaths: 1440 },
  { year: 2022, births: 771, deaths: 1569 },
  { year: 2023, births: 727, deaths: 1576 },
  { year: 2024, births: 721, deaths: 1605 },
];

// Total fertility rate, children per woman. Source: MHLW, Vital Statistics.
export const TFR = [
  { year: 2010, value: 1.39 },
  { year: 2015, value: 1.45 },
  { year: 2020, value: 1.33 },
  { year: 2021, value: 1.30 },
  { year: 2022, value: 1.26 },
  { year: 2023, value: 1.20 },
  { year: 2024, value: 1.15 },
];

// Life expectancy at birth, years. Source: MHLW, Abridged Life Tables 2023.
export const LIFE_EXPECTANCY = {
  year: 2023,
  men: 81.09,
  women: 87.14,
  source: "Ministry of Health, Labour and Welfare, Abridged Life Tables 2023",
};

// Marriages in 2024, first year below 500,000. Source: MHLW, Vital Statistics 2024.
export const MARRIAGES_2024 = { value: 499999, note: "First year below 500,000 since records began" };

// Labour market, annual averages. Source: Statistics Bureau of Japan,
// Labour Force Survey. Unemployment rate in percent.
export const LABOUR = {
  year: 2024,
  labourForce: 69.38, // millions
  employed: 67.64, // millions
  unemployed: 1.74, // millions
  unemploymentRate: 2.5, // percent
  unemploymentSeries: [
    { year: 2019, value: 2.4 },
    { year: 2020, value: 2.8 },
    { year: 2021, value: 2.8 },
    { year: 2022, value: 2.6 },
    { year: 2023, value: 2.6 },
    { year: 2024, value: 2.5 },
  ],
};

// Foreign workers and residents. Sources: MHLW (foreign workers, Oct 2024);
// Immigration Services Agency (foreign residents, end-2024).
export const MIGRATION = [
  { label: "Foreign workers", value: "2.30m", detail: "Oct 2024, a record high, +12.4% on the year", source: "Ministry of Health, Labour and Welfare, 2024" },
  { label: "Foreign residents", value: "3.77m", detail: "End of 2024, a record high", source: "Immigration Services Agency, 2024" },
  { label: "Job openings per applicant", value: "1.25", detail: "Annual average ratio, 2024", source: "Ministry of Health, Labour and Welfare, 2024" },
];

// Economy. Sources: Cabinet Office (national accounts), IMF WEO (GDP in
// dollars, debt), Statistics Bureau (CPI), Ministry of Finance (trade).
export const ECONOMY = {
  gdpNominalYen: 609.3, // trillion yen, calendar 2024
  gdpNominalUsd: 4.03, // trillion dollars, IMF 2024
  gdpPerCapitaUsd: 32.5, // thousand dollars, IMF 2024
  gdpRank: 4,
  realGrowth: [
    { year: 2019, value: -0.4 },
    { year: 2020, value: -4.1 },
    { year: 2021, value: 2.7 },
    { year: 2022, value: 0.9 },
    { year: 2023, value: 1.5 },
    { year: 2024, value: -0.1 },
  ],
  cpi2024: 2.7, // percent, all items, annual average
  govDebt: 251, // percent of GDP, general government gross debt, IMF 2024
  exports2024: 107.1, // trillion yen, MOF customs 2024
  imports2024: 112.4, // trillion yen, MOF customs 2024
};

// Geography. Source: Geospatial Information Authority of Japan.
export const GEOGRAPHY = {
  landAreaKm2: 377975,
  populationDensity: 328, // people per km2, 2024
  capital: "Tokyo",
  prefectures: 47,
};

// Every dataset the site uses, for the Sources page.
export const SOURCES = [
  { dataset: "Population Estimates (1 Oct 2024)", publisher: "Statistics Bureau of Japan", year: "2024", usedFor: "Total population, age structure, prefectures" },
  { dataset: "Population Census", publisher: "Statistics Bureau of Japan", year: "1970–2020", usedFor: "Long-run population trend" },
  { dataset: "Vital Statistics", publisher: "Ministry of Health, Labour and Welfare", year: "2010–2024", usedFor: "Births, deaths, fertility, marriages" },
  { dataset: "Abridged Life Tables", publisher: "Ministry of Health, Labour and Welfare", year: "2023", usedFor: "Life expectancy" },
  { dataset: "Labour Force Survey", publisher: "Statistics Bureau of Japan", year: "2019–2024", usedFor: "Labour force, employment, unemployment" },
  { dataset: "Employment of foreign nationals", publisher: "Ministry of Health, Labour and Welfare", year: "2024", usedFor: "Foreign workers" },
  { dataset: "Foreign residents statistics", publisher: "Immigration Services Agency", year: "2024", usedFor: "Foreign residents" },
  { dataset: "National Accounts (SNA)", publisher: "Cabinet Office", year: "2019–2024", usedFor: "GDP, real growth" },
  { dataset: "World Economic Outlook", publisher: "International Monetary Fund", year: "Oct 2025", usedFor: "GDP in dollars, government debt" },
  { dataset: "Consumer Price Index", publisher: "Statistics Bureau of Japan", year: "2024", usedFor: "Inflation" },
  { dataset: "Trade Statistics of Japan", publisher: "Ministry of Finance", year: "2024", usedFor: "Exports and imports" },
  { dataset: "World Population Prospects", publisher: "United Nations", year: "2024", usedFor: "Median age" },
];
