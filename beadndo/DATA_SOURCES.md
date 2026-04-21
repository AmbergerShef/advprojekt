# Data Sources

This project uses cleaned local files derived from official public datasets.
The default approach is to include the broadest possible EU-country coverage
for each indicator rather than a small sample. Romania and Hungary are both
included across the project, and an EU benchmark is added where the source
supports it directly.

## Figure 1. Municipal Waste Generation per Capita
- Source: Eurostat, `cei_pc031` / source dataset `env_wasmun`
- URL: https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/cei_pc031
- Local file: `data/municipal_waste_per_capita.csv`
- Note: Uses all EU member states with available 2023 values in kilograms per capita.

## Figure 2. Waste Treatment Pathways
- Source: Eurostat, `env_wasmun`
- URL: https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/env_wasmun
- Local file: `data/waste_treatment_comparison.csv`
- Note: Uses 2023 municipal waste generation plus landfill (`DSP_L_OTH`), energy recovery (`RCV_E`), material recycling (`RCY_M`), and composting/digestion (`RCY_C_D`). Recycling is calculated as `RCY_M + RCY_C_D`, then each treatment pathway is expressed as a share of municipal waste generated. Latvia is excluded because the harmonized 2023 source does not provide the full set of required treatment components for this chart.

## Figure 3. Renewable Energy Share over Time
- Source: Eurostat, `sdg_07_40`
- URL: https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sdg_07_40
- Local file: `data/renewable_energy_share.csv`
- Note: Uses the `REN` balance, which is the overall share of renewable energy in gross final energy consumption, for 2018-2024. Includes all EU member states plus the Eurostat `EU27_2020` aggregate, shown on the site as `EU average`.

## Figure 4. Circular Material Use and Recycling Performance
- Source 1: Eurostat, `cei_srm030`
- URL 1: https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/cei_srm030
- Source 2: Eurostat, `cei_wm011`
- URL 2: https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/cei_wm011
- Local file: `data/circular_vs_recycling.csv`
- Note: Joined the 2023 circular material use rate with the 2023 recycling rate of municipal waste for EU member states. This uses the latest common year with broad comparable coverage across both Eurostat indicators.

## Figure 5. Greenhouse Gas Emissions per Capita
- Source: World Bank, indicator `EN.GHG.ALL.PC.CE.AR5`
- URL: https://api.worldbank.org/v2/country/AUT;BEL;BGR;HRV;CYP;CZE;DNK;EST;FIN;FRA;DEU;GRC;HUN;IRL;ITA;LVA;LTU;LUX;MLT;NLD;POL;PRT;ROU;SVK;SVN;ESP;SWE/indicator/EN.GHG.ALL.PC.CE.AR5?format=json
- Local file: `data/ghg_per_capita.csv`
- Note: Uses the latest available common year with broad EU coverage, which is currently 2024, for total greenhouse gas emissions excluding LULUCF per capita. This was used instead of CO2-only per capita because it is available through a straightforward official API with recent data.

## Figure 6. Waste-to-Energy Related Interactive Chart
- Source: Eurostat, `env_wasmun`
- URL: https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/env_wasmun
- Local file: `data/energy_recovery_over_time.csv`
- Note: Uses `RCV_E` (energy recovery from municipal waste) in kilograms per capita for 2018-2023. Includes all EU member states plus the Eurostat `EU27_2020` aggregate, shown on the site as `EU average`. This is the closest consistent official proxy used here for a waste-to-energy comparison. It replaces the earlier placeholder capacity chart because a harmonized official EU-wide plant-capacity dataset was not found as quickly or as cleanly.

## Regeneration
- Helper script: `scripts/update_data.py`
- Purpose: Re-download the public data and rebuild the cleaned CSV files used by the website.
